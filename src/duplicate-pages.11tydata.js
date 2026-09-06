/**
 * Field mapping for duplicate / campaign pages.
 *
 * Maps one record from _data/duplicatePages.js onto the standard page data
 * fields, so the rest of the site (SEO resolution, canonicals, sitemap,
 * layouts) treats a duplicate exactly like any other page.
 *
 * Inheritance is handled downstream in _data/eleventyComputed.js: an empty
 * optional field falls back to the source template's defaults, then to the
 * global SEO defaults. An empty canonicalUrl becomes self-referencing.
 */
const slugify = (value = "") =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default {
  eleventyComputed: {
    /** Drafts are not written at all in production. */
    permalink: (data) => `/${slugify(data.duplicate.slug)}/index.html`,

    eleventyExcludeFromCollections: (data) => data.duplicate.status === "draft",

    title: (data) => data.duplicate.pageName || "",
    sourceTemplate: (data) => data.duplicate.sourceTemplate || "landing",
    status: (data) => data.duplicate.status || "draft",

    seoTitle: (data) => data.duplicate.seoTitle || "",
    metaDescription: (data) => data.duplicate.metaDescription || "",
    heroHeadline: (data) => data.duplicate.heroHeadline || "",
    heroSubtext: (data) => data.duplicate.heroSubtext || "",
    canonicalUrl: (data) => data.duplicate.canonicalUrl || "",
    ogImage: (data) => data.duplicate.ogImage || "",
    robots: (data) => data.duplicate.robots || "",

    /** Reporting metadata only — never rendered. */
    campaign: (data) => data.duplicate.campaign || null
  }
};
