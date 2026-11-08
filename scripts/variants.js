/*
 * The resume versions to build, shared by .eleventy.js and scripts/resume-pdf.js:
 * the `variants` in src/_data/resume.json, plus one "tailored" version for a
 * single job posting from tailor.json (gitignored), in private builds only.
 *
 * tailor.json keeps the base version's bullets (its `id` decides which bullets
 * print) and replaces only the title, summary, skills order, and file name.
 * See tailor.example.json.
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function loadVariants({ includeTailored = false } = {}) {
  const resume = readJson(path.join(root, "src", "_data", "resume.json"));
  const variants = resume.variants.map((v) => ({ ...v }));
  const tailorFile = path.join(root, "tailor.json");
  if (includeTailored && fs.existsSync(tailorFile)) {
    const t = readJson(tailorFile);
    const base = variants.find((v) => v.id === t.base) || variants[0];
    variants.push({
      ...base,
      slug: "tailored",
      label: "Tailored",
      file: t.file || `${base.file}_Tailored`,
      title: t.title || base.title,
      summary: t.summary || base.summary,
      skills: Array.isArray(t.skills) && t.skills.length ? t.skills : base.skills,
      tailored: true,
    });
  }
  return variants;
}

module.exports = { loadVariants, root };
