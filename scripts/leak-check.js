#!/usr/bin/env node
/*
 * Scans the public build for things that must never reach the public site.
 * `npm run build` runs it last, so a hit fails the build and the deploy never starts.
 *   - any phone number, plus private.json's own number when that file exists
 *   - Gmail addresses (the public address is the contact@ forward)
 *   - the text of bullets marked "private" in resume.json (the cafe's own numbers)
 *   - local paths (E:\...) and the private job-search folder's name
 * The public PDF is printed from _site/resume/index.html, so checking the HTML covers it.
 *
 * Hits are reported by file and kind only, never the matched text: the deploy
 * log of a public repo is public too.
 *
 *   node scripts/leak-check.js [folder]     (default: _site)
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const TEXT_FILES = /\.(html?|xml|txt|css|js|mjs|json|webmanifest|svg|md)$|(^|[\\/])\.htaccess$/i;

function readJsonIfThere(file) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : null;
}

// Page text as a reader sees it: entities decoded, whitespace collapsed.
function plain(text) {
  return text
    .replace(/&nbsp;|&#160;/g, " ")
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");
}

function rules() {
  const list = [
    { kind: "phone number", re: /(?<![\d.])(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?![\d.])/ },
    { kind: "Gmail address", re: /[A-Za-z0-9._%+-]+@gmail\.com/i },
    { kind: "local file path", re: /\b[A-Z]:\\(?:[A-Za-z0-9_.-]+\\)*[A-Za-z0-9_.-]/ },
    { kind: "private folder name", re: /CareerWork/ },
  ];

  const priv = readJsonIfThere(path.join(root, "private.json"));
  const digits = String((priv && priv.phone) || "").replace(/\D/g, "").slice(-10);
  if (digits.length === 10 && !/^0+$/.test(digits)) {
    list.push({ kind: "the phone number in private.json", re: new RegExp(`${digits.slice(0, 3)}\\D{0,3}${digits.slice(3, 6)}\\D{0,3}${digits.slice(6)}`) });
  }

  const resume = readJsonIfThere(path.join(root, "src", "_data", "resume.json"));
  let n = 0;
  (function walk(node) {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== "object") return;
    if (node.private === true && typeof node.text === "string") {
      n += 1;
      list.push({ kind: `private bullet #${n} from resume.json`, text: plain(node.text).trim() });
    }
    Object.values(node).forEach(walk);
  })(resume);

  return list;
}

function* files(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* files(full);
    else if (TEXT_FILES.test(entry.name)) yield full;
  }
}

function leakCheck(dir) {
  const hits = [];
  const checks = rules();
  for (const file of files(dir)) {
    const text = plain(fs.readFileSync(file, "utf8"));
    for (const c of checks) {
      if (c.re ? c.re.test(text) : text.includes(c.text)) hits.push({ file: path.relative(root, file), kind: c.kind });
    }
  }
  return hits;
}

if (require.main === module) {
  const dir = path.resolve(root, process.argv[2] || "_site");
  if (!fs.existsSync(dir)) {
    console.error(`Leak check: ${path.relative(root, dir)} doesn't exist. Run the build first.`);
    process.exit(1);
  }
  const hits = leakCheck(dir);
  if (hits.length) {
    console.error(`LEAK: ${hits.length} problem${hits.length === 1 ? "" : "s"} in ${path.relative(root, dir) || "."}/ (matched text not shown):`);
    for (const h of hits) console.error(`- ${h.file}: ${h.kind}`);
    console.error("Nothing was deployed. Fix the source (resume.json, a template, or a project page) and build again.");
    process.exit(1);
  }
  console.log(`Leak check: ${path.relative(root, dir)}/ is clean.`);
}

module.exports = { leakCheck };
