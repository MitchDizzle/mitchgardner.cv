#!/usr/bin/env node
// Keeps project entries that live on both sites the same: this repo
// (mitchgardner.cv) and mtch.tech. The two sites still build and deploy on
// their own; this only copies files between the two working copies. Nothing
// is committed: commit and push each repo yourself.
//
// An entry is shared when its front matter has `shared: true`. Drafts
// (`draft: true`) are never copied, so an entry can wait here until it's ready.
// The entry's images folder (src/assets/img/projects/<slug>/) goes with it.
//
//   npm run sync               what differs, and which side changed last
//   npm run sync -- --to-mtch  copy shared entries from here to mtch.tech
//   npm run sync -- --from-mtch  copy shared entries from mtch.tech to here
//   add a slug to do one entry: npm run sync -- --to-mtch the-cafe
//
// mtch.tech is looked for next to this repo; set MTCH_TECH_PATH if it's elsewhere.

const fs = require("node:fs");
const path = require("node:path");

const here = path.resolve(__dirname, "..");
const there = path.resolve(process.env.MTCH_TECH_PATH || path.join(here, "..", "mtch.tech"));
const sites = { cv: { name: "mitchgardner.cv", root: here }, mtch: { name: "mtch.tech", root: there } };

const args = process.argv.slice(2);
const direction = args.includes("--to-mtch") ? "to-mtch" : args.includes("--from-mtch") ? "from-mtch" : null;
const only = args.filter((a) => !a.startsWith("--"));

if (!fs.existsSync(path.join(there, "src", "projects"))) {
  console.error(`mtch.tech not found at ${there}. Set MTCH_TECH_PATH.`);
  process.exit(1);
}

const projectsDir = (site) => path.join(site.root, "src", "projects");
const imagesDir = (site, slug) => path.join(site.root, "src", "assets", "img", "projects", slug);
const normalize = (text) => text.replace(/\r\n/g, "\n");

function frontMatter(text) {
  const m = normalize(text).match(/^---\n([\s\S]*?)\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) data[kv[1]] = kv[2].trim();
  }
  return data;
}

function readEntry(site, slug) {
  const file = path.join(projectsDir(site), `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const text = fs.readFileSync(file, "utf8");
  const fm = frontMatter(text);
  return { file, text, shared: fm.shared === "true", draft: fm.draft === "true", mtime: fs.statSync(file).mtime };
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) =>
    d.isDirectory() ? listFiles(path.join(dir, d.name)).map((f) => path.join(d.name, f)) : [d.name]
  );
}

function imagesDiffer(slug) {
  const a = imagesDir(sites.cv, slug);
  const b = imagesDir(sites.mtch, slug);
  const names = new Set([...listFiles(a), ...listFiles(b)]);
  for (const name of names) {
    const fa = path.join(a, name);
    const fb = path.join(b, name);
    if (!fs.existsSync(fa) || !fs.existsSync(fb)) return true;
    if (!fs.readFileSync(fa).equals(fs.readFileSync(fb))) return true;
  }
  return false;
}

function copyEntry(slug, from, to) {
  const src = path.join(projectsDir(from), `${slug}.md`);
  fs.copyFileSync(src, path.join(projectsDir(to), `${slug}.md`));
  const imgFrom = imagesDir(from, slug);
  const imgTo = imagesDir(to, slug);
  for (const name of listFiles(imgFrom)) {
    fs.mkdirSync(path.dirname(path.join(imgTo, name)), { recursive: true });
    fs.copyFileSync(path.join(imgFrom, name), path.join(imgTo, name));
  }
}

const slugs = new Set(
  [sites.cv, sites.mtch].flatMap((site) =>
    fs.readdirSync(projectsDir(site)).filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3))
  )
);

let differs = 0;
for (const slug of [...slugs].sort()) {
  if (only.length && !only.includes(slug)) continue;
  const cv = readEntry(sites.cv, slug);
  const mtch = readEntry(sites.mtch, slug);
  if (!(cv && cv.shared) && !(mtch && mtch.shared)) continue;
  if ((cv && cv.draft) || (mtch && mtch.draft)) {
    console.log(`  draft     ${slug} (not copied until draft is removed)`);
    continue;
  }

  const sameText = cv && mtch && normalize(cv.text) === normalize(mtch.text);
  const sameImages = !imagesDiffer(slug);
  if (sameText && sameImages) {
    console.log(`  same      ${slug}`);
    continue;
  }

  differs++;
  const state = !mtch ? "only on mitchgardner.cv" : !cv ? "only on mtch.tech" :
    !sameText ? `text differs, newer on ${cv.mtime > mtch.mtime ? "mitchgardner.cv" : "mtch.tech"}` : "images differ";

  if (direction === "to-mtch" && cv) {
    copyEntry(slug, sites.cv, sites.mtch);
    console.log(`  copied    ${slug} -> mtch.tech (${state})`);
  } else if (direction === "from-mtch" && mtch) {
    copyEntry(slug, sites.mtch, sites.cv);
    console.log(`  copied    ${slug} <- mtch.tech (${state})`);
  } else {
    console.log(`  DIFFERENT ${slug}: ${state}`);
  }
}

if (!direction && differs) {
  console.log("\nCopy with --to-mtch or --from-mtch (add a slug to do just one). Check `git diff` in both repos after.");
}
