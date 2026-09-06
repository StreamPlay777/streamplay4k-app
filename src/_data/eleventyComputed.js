/**
 * METADATA INHERITANCE
 *
 * Every page gets a resolved `seo` object and `breadcrumbs` trail without
 * repeating metadata logic in templates. Resolution order for each field:
 *
 *   page front matter -> source template defaults -> global seo defaults
 *
 * Canonical URLs are self-referencing unless a page sets `canonicalUrl`.
 */

const TITLE_CASE_EXCEPTIONS = {
  faq: "FAQs",
  dmca: "DMCA",
  blog: "Blog"
};

const titleCase = (segment) =>
  TITLE_CASE_EXCEPTIONS[segment] ||
  segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** First non-empty string in the list, or "". */
const firstOf = (...values) => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const absolute = (path, origin) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin.replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
};

/** Defaults declared by the page's source template, if it has one. */
const templateDefaults = (data) => {
  const key = data.sourceTemplate;
  if (!key || !data.templates || !data.templates[key]) return {};
  return data.templates[key].defaults || {};
};

export default {
  seo: (data) => {
    const site = data.site;
    const defaults = data.seoDefaults || {};
    const inherited = templateDefaults(data);

    const isDraft = data.draft === true || data.status === "draft";

    const bareTitle = firstOf(data.seoTitle, inherited.seoTitle, data.title, site.name);
    const templated = defaults.titleTemplate
      ? defaults.titleTemplate.replace("%s", bareTitle)
      : bareTitle;

    /* Keep the brand suffix only while it fits the target title length. */
    const isHome = data.page && data.page.url === "/";
    const title =
      isHome || data.titleSuffix === false
        ? bareTitle
        : templated.length <= (defaults.maxTitleLength || 60)
          ? templated
          : bareTitle;

    const rawDescription = firstOf(
      data.metaDescription,
      inherited.metaDescription,
      data.description,
      defaults.defaultDescription
    );

    /* Clamp once, centrally, so <meta>, OG and Twitter always agree. */
    const maxDescription = defaults.maxDescriptionLength || 160;
    const description =
      rawDescription.length <= maxDescription
        ? rawDescription
        : `${rawDescription.slice(0, rawDescription.lastIndexOf(" ", maxDescription - 1)).trim()}…`;

    const url = (data.page && data.page.url) || "/";
    const canonical = firstOf(data.canonicalUrl, absolute(url, site.url));

    const robots = isDraft
      ? "noindex,nofollow"
      : firstOf(data.robots, defaults.defaultRobots, "index,follow");

    const image = firstOf(data.ogImage, inherited.ogImage, defaults.defaultOgImage);

    return {
      title,
      bareTitle,
      description,
      canonical,
      robots,
      image: absolute(image, site.url),
      imageAlt: firstOf(data.ogImageAlt, bareTitle),
      type: firstOf(data.ogType, defaults.ogType, "website"),
      twitterCard: firstOf(defaults.twitterCard, "summary_large_image"),
      locale: site.locale,
      isDraft
    };
  },

  /**
   * Breadcrumb trail derived from the URL. A page can override the visible
   * label with `breadcrumbLabel`, or replace the whole trail with
   * `breadcrumbs: [{ label, url }]` in front matter.
   */
  breadcrumbs: (data) => {
    if (Array.isArray(data.breadcrumbs)) return data.breadcrumbs;

    const url = (data.page && data.page.url) || "/";
    if (url === "/") return [];

    const segments = url.split("/").filter(Boolean);
    const trail = [{ label: "Home", url: "/" }];

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      const path = `/${segments.slice(0, index + 1).join("/")}/`;
      trail.push({
        label: isLast
          ? firstOf(data.breadcrumbLabel, data.title, titleCase(segment))
          : titleCase(segment),
        url: path,
        current: isLast
      });
    });

    return trail;
  }
};
