#!/usr/bin/env node
/*
 * Checks src/_data/resume.json, and tailor.json if there is one, so a typo stops
 * the build instead of quietly dropping a bullet or a skills line:
 *   - every `for` is a list of real version ids ("platfrom" would leave that
 *     bullet out of the platform resume with no warning)
 *   - every version's `skills`, and tailor.json's, name real skill groups
 *   - version ids and PDF file names are unique, and every version has a file name
 *   - tailor.json's `base` is a real version
 *
 * .eleventy.js runs it before every build (npm start, build, and pdf).
 * On its own: node scripts/check-resume.js
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");

function snippet(node) {
  return typeof node.text === "string" ? ` ("${node.text.slice(0, 50)}${node.text.length > 50 ? "..." : ""}")` : "";
}

function checkResume({
  resumeFile = path.join(root, "src", "_data", "resume.json"),
  tailorFile = path.join(root, "tailor.json"),
} = {}) {
  const errors = [];
  const resume = JSON.parse(fs.readFileSync(resumeFile, "utf8"));
  const variants = Array.isArray(resume.variants) ? resume.variants : [];
  const skillGroups = new Set(Object.keys(resume.skills || {}));
  const ids = new Set();
  const files = new Set();

  if (!variants.length) errors.push("resume.json has no `variants`.");
  for (const v of variants) {
    if (!v.id) errors.push("A version in `variants` has no `id`.");
    else if (ids.has(v.id)) errors.push(`Version id "${v.id}" is used twice.`);
    ids.add(v.id);
    if (!v.file) errors.push(`Version "${v.id}" has no \`file\` (the PDF's name).`);
    else if (files.has(v.file)) errors.push(`PDF name "${v.file}" is used by two versions.`);
    files.add(v.file);
    for (const key of v.skills || []) {
      if (!skillGroups.has(key)) errors.push(`Version "${v.id}" lists skills group "${key}", which isn't in \`skills\`.`);
    }
  }

  const known = [...ids].join(", ");
  (function walk(node, where) {
    if (Array.isArray(node)) return node.forEach((item, i) => walk(item, `${where}[${i}]`));
    if (!node || typeof node !== "object") return;
    if (Object.prototype.hasOwnProperty.call(node, "for")) {
      if (!Array.isArray(node.for)) {
        errors.push(`${where}: \`for\` must be a list of version ids ([] keeps it in the bank)${snippet(node)}.`);
      } else {
        for (const id of node.for) {
          if (!ids.has(id)) errors.push(`${where}: \`for\` names "${id}", which isn't a version (${known})${snippet(node)}.`);
        }
      }
    }
    for (const [key, value] of Object.entries(node)) {
      if (where === "" && key === "variants") continue;
      walk(value, where ? `${where}.${key}` : key);
    }
  })(resume, "");

  if (fs.existsSync(tailorFile)) {
    const tailor = JSON.parse(fs.readFileSync(tailorFile, "utf8"));
    if (tailor.base && !ids.has(tailor.base)) errors.push(`tailor.json: \`base\` is "${tailor.base}", which isn't a version (${known}).`);
    for (const key of Array.isArray(tailor.skills) ? tailor.skills : []) {
      if (!skillGroups.has(key)) errors.push(`tailor.json lists skills group "${key}", which isn't in resume.json's \`skills\`.`);
    }
  }

  return errors;
}

if (require.main === module) {
  const errors = checkResume();
  if (errors.length) {
    console.error(`resume.json has ${errors.length} problem${errors.length === 1 ? "" : "s"}:\n- ${errors.join("\n- ")}`);
    process.exit(1);
  }
  console.log("resume.json: OK");
}

module.exports = { checkResume };
