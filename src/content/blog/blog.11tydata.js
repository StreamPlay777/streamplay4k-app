/**
 * Defaults for every blog article. Front matter overrides any of these.
 *
 * Supported front matter (the contract the future admin writes against):
 *   title, slug, description, date, updated, author, category, tags,
 *   featuredImage, featuredImageAlt, canonical, draft
 */
export default {
  layout: "layouts/post.njk",
  author: "StreamPlay4K",
  draft: false,
  ogType: "article",

  eleventyComputed: {
    /** Slug wins over filename so an admin can rename without moving files. */
    permalink: (data) =>
      `/blog/${(data.slug || data.page.fileSlug)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")}/index.html`,

    /** `canonical` in front matter maps onto the global canonicalUrl field. */
    canonicalUrl: (data) => data.canonical || "",

    /** Featured image doubles as the share image unless one is set. */
    ogImage: (data) => data.ogImage || data.featuredImage || "",

    schemaArticle: (data) => {
      if (!data.title) return null;
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.description || "",
        datePublished: data.date ? new Date(data.date).toISOString() : "",
        dateModified: new Date(data.updated || data.date || Date.now()).toISOString(),
        author: { "@type": "Organization", name: data.author },
        publisher: {
          "@type": "Organization",
          name: data.site.name,
          logo: {
            "@type": "ImageObject",
            url: data.site.url + data.seoDefaults.organization.logo
          }
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": data.site.url + data.page.url
        },
        ...(data.featuredImage ? { image: [data.site.url + data.featuredImage] } : {}),
        ...(data.articleSection || data.category ? { articleSection: data.category } : {})
      };
    }
  }
};
