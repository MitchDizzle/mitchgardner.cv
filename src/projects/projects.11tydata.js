// Every project entry uses the project layout at /projects/<slug>/.
// `draft: true` builds no page and keeps it out of every list and the sitemap,
// so an entry can wait in the repo until it's cleared to go public.
module.exports = {
  layout: "layouts/project.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `projects/${data.page.fileSlug}/index.html`),
    eleventyExcludeFromCollections: (data) => Boolean(data.draft),
  },
};
