const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { loadVariants } = require("./scripts/variants.js");

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/.htaccess": ".htaccess" });
  eleventyConfig.addWatchTarget("src/_includes/css/");
  eleventyConfig.addWatchTarget("src/_includes/js/");

  // The phone number lives in private.json (gitignored) and is read only for
  // `npm run pdf`, which sets RESUME_PRIVATE. The deployed site never has it.
  eleventyConfig.addGlobalData("privateContact", () => {
    if (!process.env.RESUME_PRIVATE) return {};
    const file = path.join(__dirname, "private.json");
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : {};
  });

  // Content hash on asset URLs so a changed stylesheet is never served stale.
  eleventyConfig.addFilter("bust", (url) => {
    const file = path.join(__dirname, "src", url);
    if (!fs.existsSync(file)) return url;
    const hash = crypto.createHash("md5").update(fs.readFileSync(file)).digest("hex").slice(0, 8);
    return `${url}?v=${hash}`;
  });

  // "2022-10" -> "Oct 2022", "2025" -> "2025", empty -> "Present".
  eleventyConfig.addFilter("monthYear", (value) => {
    if (!value) return "Present";
    const m = String(value).match(/^(\d{4})(?:-(\d{2}))?$/);
    if (!m) return String(value);
    return m[2] ? `${MONTHS[Number(m[2]) - 1]} ${m[1]}` : m[1];
  });

  // True only for `npm run pdf`: bullets marked `private` (cafe numbers the
  // owners haven't cleared for the public site) print in the PDFs you send.
  eleventyConfig.addGlobalData("privateBuild", () => Boolean(process.env.RESUME_PRIVATE));

  // The versions src/resume.njk builds: resume.json's, plus tailor.json's in private builds.
  eleventyConfig.addGlobalData("resumeVariants", () => loadVariants({ includeTailored: Boolean(process.env.RESUME_PRIVATE) }));

  // resume.json bullets list the versions they belong to in `for`.
  // No `for` means every version; an empty list keeps a bullet in the bank.
  eleventyConfig.addFilter("forVariant", (items, id, includePrivate = false) =>
    (items || []).filter((item) => (!item.for || item.for.includes(id)) && (!item.private || includePrivate))
  );

  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("htmlDateString", (d) => new Date(d).toISOString().slice(0, 10));

  // Same project format as mtch.tech (src/projects/*.md with the same front
  // matter and shortcodes), so an entry copies between the two sites as is.
  function projectCategory(category, tags = []) {
    if (typeof category === "string" && category.trim()) return category.trim();
    if (tags.includes("gaming") || tags.includes("tf2") || tags.includes("gamemode")) return "Gaming";
    if (tags.includes("web")) return "Web";
    return "Software";
  }
  eleventyConfig.addFilter("projectCategory", projectCategory);
  eleventyConfig.addShortcode("projectGallery", () => '<div data-project-gallery-placeholder></div>');
  eleventyConfig.addShortcode("projectImage", (src, alt, caption = "", size = "full") => {
    if (typeof src !== "string" || !src.startsWith("/assets/") || typeof alt !== "string" || !alt.trim()) {
      throw new Error("projectImage requires an /assets/ image path and descriptive alt text.");
    }
    const escape = (value) =>
      String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
    const modifier = size === "small" ? " project-figure--small" : "";
    return `<figure class="project-figure${modifier}"><img src="${escape(src)}" alt="${escape(alt)}" loading="lazy" decoding="async">${caption ? `<figcaption>${escape(caption)}</figcaption>` : ""}</figure>`;
  });

  // Newest first; `order` in front matter pins an entry higher.
  eleventyConfig.addCollection("projects", (api) =>
    api
      .getFilteredByGlob("src/projects/*.md")
      .filter((item) => !item.data.draft)
      .sort((a, b) => (b.data.order || 0) - (a.data.order || 0) || b.date - a.date)
  );

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
