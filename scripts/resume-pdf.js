#!/usr/bin/env node
/*
 * Prints the resume pages to PDF with headless Chrome (or Edge).
 *
 *   node scripts/resume-pdf.js
 *     Run after `eleventy` (npm run build does both). Prints _site/resume/
 *     to _site/Mitchell_Gardner_Resume.pdf: the public copy, no phone number.
 *
 *   node scripts/resume-pdf.js --private      (npm run pdf)
 *     Builds a private copy of the site into _pdf/site with the phone number
 *     from private.json and the bullets marked `private`, then prints every
 *     version (plus tailor.json's, if there is one) to _pdf/. These are the
 *     PDFs to send. _pdf/ is gitignored.
 *
 * Every PDF is checked against its page limit (`maxPages` in resume.json,
 * 1 unless set; the federal version allows 2, USAJOBS's limit).
 * Set CHROME_PATH if Chrome or Edge isn't installed in a standard place.
 * The resume pages carry their own CSS inline, so they print straight from disk.
 */
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const zlib = require("node:zlib");
const { execFileSync } = require("node:child_process");
const { pathToFileURL } = require("node:url");
const { loadVariants, root } = require("./variants.js");

const isPrivate = process.argv.includes("--private");

function findBrowser() {
  const pf = process.env.ProgramFiles;
  const pf86 = process.env["ProgramFiles(x86)"];
  const local = process.env.LOCALAPPDATA;
  const candidates = [
    process.env.CHROME_PATH,
    pf && path.join(pf, "Google", "Chrome", "Application", "chrome.exe"),
    pf86 && path.join(pf86, "Google", "Chrome", "Application", "chrome.exe"),
    local && path.join(local, "Google", "Chrome", "Application", "chrome.exe"),
    pf && path.join(pf, "Microsoft", "Edge", "Application", "msedge.exe"),
    pf86 && path.join(pf86, "Microsoft", "Edge", "Application", "msedge.exe"),
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  return candidates.find((p) => p && fs.existsSync(p));
}

function printToPdf(browser, htmlFile, pdfFile) {
  if (!fs.existsSync(htmlFile)) throw new Error(`Missing ${htmlFile}. Did the Eleventy build run?`);
  // A throwaway profile keeps this from fighting a Chrome window that's already open.
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), "resume-pdf-"));
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--user-data-dir=${profile}`,
    "--no-pdf-header-footer", // no URL and date stamped in the margins
    "--virtual-time-budget=10000", // let the web fonts load before printing
    `--print-to-pdf=${pdfFile}`,
    pathToFileURL(htmlFile).href,
  ];
  if (process.env.CI) args.unshift("--no-sandbox"); // CI runners can't set up Chrome's sandbox
  if (/msedge/i.test(browser)) args.unshift("--edge-skip-compat-layer-relaunch");
  try {
    execFileSync(browser, args, { stdio: "ignore", timeout: 120000 });
  } finally {
    try {
      fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
    } catch {
      // Chrome's helper processes can hold the profile for a moment; a leftover temp folder is harmless.
    }
  }
  if (!fs.existsSync(pdfFile)) throw new Error(`No PDF was written for ${htmlFile}`);
}

// Chrome keeps the page tree inside compressed object streams, so inflate
// every stream and read /Count from the /Pages dictionary.
function pageCount(pdfFile) {
  const buf = fs.readFileSync(pdfFile);
  const raw = buf.toString("latin1");
  const texts = [raw];
  const re = /stream\r?\n/g;
  let m;
  while ((m = re.exec(raw))) {
    const start = m.index + m[0].length;
    const end = raw.indexOf("endstream", start);
    if (end < 0) break;
    try {
      texts.push(zlib.inflateSync(buf.subarray(start, end), { finishFlush: zlib.constants.Z_SYNC_FLUSH }).toString("latin1"));
    } catch {
      // not a Flate stream (images, fonts): nothing to read
    }
    re.lastIndex = end;
  }
  let pages = 0;
  for (const t of texts) {
    for (const d of t.matchAll(/<<(?:(?!>>).)*?\/Type\s*\/Pages\b(?:(?!>>).)*?>>/gs)) {
      const c = d[0].match(/\/Count\s+(\d+)/);
      if (c) pages = Math.max(pages, Number(c[1]));
    }
  }
  return pages || null;
}

function pageFor(siteDir, variant) {
  return path.join(siteDir, "resume", ...(variant.slug ? [variant.slug] : []), "index.html");
}

// Prints one version and checks its length. Returns false if it runs long.
function printVariant(browser, siteDir, variant, out) {
  printToPdf(browser, pageFor(siteDir, variant), out);
  const pages = pageCount(out);
  const limit = variant.maxPages || 1;
  const rel = path.relative(root, out);
  if (pages && pages > limit) {
    console.error(`TOO LONG: ${rel} is ${pages} pages; the limit for "${variant.label}" is ${limit}. Move a bullet to the bank (\"for\": []) or shorten one.`);
    return false;
  }
  console.log(`Wrote ${rel} (${pages || "?"} page${pages === 1 ? "" : "s"})`);
  return true;
}

function main() {
  const browser = findBrowser();
  if (!browser) {
    console.error("No Chrome or Edge found. Set CHROME_PATH to the browser's executable.");
    process.exit(1);
  }

  if (!isPrivate) {
    // Public build: the default version only. A long PDF is reported, not fatal, so a deploy isn't blocked.
    const siteDir = path.join(root, "_site");
    const variant = loadVariants()[0];
    printVariant(browser, siteDir, variant, path.join(siteDir, `${variant.file}.pdf`));
    return;
  }

  if (!fs.existsSync(path.join(root, "private.json"))) {
    console.error("private.json is missing. Copy private.example.json to private.json and add your phone number.");
    process.exit(1);
  }
  const outDir = path.join(root, "_pdf");
  const siteDir = path.join(outDir, "site");
  fs.rmSync(outDir, { recursive: true, force: true });
  const eleventy = path.join(root, "node_modules", "@11ty", "eleventy", "cmd.cjs");
  execFileSync(process.execPath, [eleventy, `--output=${siteDir}`, "--quiet"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, RESUME_PRIVATE: "1" },
  });
  let ok = true;
  for (const variant of loadVariants({ includeTailored: true })) {
    ok = printVariant(browser, siteDir, variant, path.join(outDir, `${variant.file}.pdf`)) && ok;
  }
  if (!ok) process.exit(2);
}

main();
