/**
 * DUPLICATE / CAMPAIGN PAGES
 *
 * Records added here are published by src/duplicate-pages.njk at their own
 * slug, reusing an existing source template without copying template code.
 * A future central admin ("Admin -> Duplicate Pages") writes this file — the
 * shape below is the contract it has to satisfy.
 *
 * Record shape
 * ------------
 *   pageName        string   Internal admin label. Required.
 *   slug            string   URL path, normalised to lowercase-hyphenated.
 *   sourceTemplate  string   Key from _data/templates.js.
 *   status          string   "draft" | "published". Drafts never build in
 *                            production and never enter the sitemap.
 *   seoTitle        string?  <= 60 chars. Empty -> inherited from template.
 *   metaDescription string?  <= 160 chars. Empty -> inherited.
 *   heroHeadline    string?  Empty -> inherited.
 *   heroSubtext     string?  Empty -> inherited.
 *   canonicalUrl    string?  Empty -> self-referencing site.url + /slug/.
 *   ogImage         string?  Empty -> inherited, then seo.defaultOgImage.
 *   robots          string?  "index,follow" | "noindex,follow". Default index.
 *   campaign        object?  { source, medium, name } for reporting only.
 *
 * Example (do NOT ship until an admin or a prompt asks for it):
 *   {
 *     pageName: "USA Campaign 2026",
 *     slug: "iptv-usa-2026",
 *     sourceTemplate: "homepage",
 *     status: "published"
 *   }
 *   -> https://streamplay4k.com/iptv-usa-2026/ with a self-referencing canonical.
 */
export default [];
