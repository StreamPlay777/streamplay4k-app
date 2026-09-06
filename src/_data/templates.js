/**
 * SOURCE TEMPLATE REGISTRY
 *
 * A "source template" is a reusable page body that can be rendered at more
 * than one URL — once by its canonical page, and again by any number of
 * duplicate / campaign pages (see _data/duplicatePages.js).
 *
 * `body` is the include rendered inside the page layout. Because both the
 * canonical page and its duplicates include the same file, template code is
 * never copied.
 *
 * `defaults` are the values a duplicate inherits when it leaves the matching
 * field empty (heroHeadline, heroSubtext, seoTitle, metaDescription, ogImage).
 *
 * `hasHero` marks a template whose body opens with a full-bleed hero, so the
 * layout knows not to reserve space for the fixed header above it.
 */
export default {
  homepage: {
    key: "homepage",
    label: "Homepage",
    body: "templates/homepage.njk",
    canonicalPath: "/",
    hasHero: true,
    defaults: {
      seoTitle: "",
      metaDescription: "",
      heroHeadline: "",
      heroSubtext: "",
      ogImage: ""
    }
  },
  pricing: {
    key: "pricing",
    label: "Pricing",
    body: "templates/pricing.njk",
    canonicalPath: "/pricing/",
    defaults: {
      seoTitle: "",
      metaDescription: "",
      heroHeadline: "",
      heroSubtext: "",
      ogImage: ""
    }
  },
  "free-trial": {
    key: "free-trial",
    label: "Free Trial",
    body: "templates/free-trial.njk",
    canonicalPath: "/free-trial/",
    defaults: {
      seoTitle: "",
      metaDescription: "",
      heroHeadline: "",
      heroSubtext: "",
      ogImage: ""
    }
  },
  landing: {
    key: "landing",
    label: "Custom Landing Page",
    body: "templates/landing.njk",
    canonicalPath: "",
    defaults: {
      seoTitle: "",
      metaDescription: "",
      heroHeadline: "",
      heroSubtext: "",
      ogImage: ""
    }
  }
};
