/**
 * SEO defaults. Per-page front matter overrides any of these; empty page
 * values fall back here through src/_data/eleventyComputed.js.
 */
export default {
  titleTemplate: "%s | StreamPlay4K",
  /** Target caps enforced centrally in _data/eleventyComputed.js. */
  maxTitleLength: 60,
  maxDescriptionLength: 160,
  defaultDescription:
    "StreamPlay4K delivers live TV, movies and series in 4K on every device you own.",
  defaultRobots: "index,follow",
  /** Drop a 1200x630 image at this path. Referenced by every page by default. */
  defaultOgImage: "/assets/img/og/streamplay4k-default.jpg",
  ogType: "website",
  twitterCard: "summary_large_image",
  twitterSite: "",

  /** Organization schema fields. Logo path must resolve once assets land. */
  organization: {
    type: "Organization",
    logo: "/assets/img/brand/streamplay4k-icon.png",
    foundingDate: "",
    sameAs: []
  }
};
