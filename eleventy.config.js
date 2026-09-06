import { bundle } from "lightningcss";
import markdownItAnchor from "markdown-it-anchor";

const IS_PROD = process.env.ELEVENTY_ENV === "production";

/** Encode a browser version for Lightning CSS targets: (major << 16) | (minor << 8). */
const v = (major, minor = 0) => (major << 16) | (minor << 8);

/** Browser support floor for compiled CSS. Update here, nowhere else. */
const CSS_TARGETS = {
  chrome: v(107),
  edge: v(107),
  firefox: v(104),
  safari: v(15, 4),
  ios_saf: v(15, 4),
  android: v(107),
  samsung: v(19)
};

export default function (eleventyConfig) {
  /* ---------------------------------------------------------------------
   * Passthrough assets
   * ------------------------------------------------------------------ */
  /* Developer notes sit next to the assets they describe; they are not
     part of the site. */
  const ASSETS_ONLY = { filter: ["**/*", "!**/*.md"] };

  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });
  eleventyConfig.addPassthroughCopy({ "src/assets/img": "assets/img" }, ASSETS_ONLY);
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" }, ASSETS_ONLY);
  eleventyConfig.addPassthroughCopy({ "src/assets/root": "/" });

  /* Asset folder docs are notes for developers, not pages. */
  eleventyConfig.ignores.add("src/assets/**/*.md");

  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  /* ---------------------------------------------------------------------
   * CSS pipeline — Lightning CSS bundles @import partials into one file.
   * Only `main.css` emits output; every other .css file is treated as a
   * partial (compile returns undefined => no output written).
   * ------------------------------------------------------------------ */
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (_inputContent, inputPath) {
      if (!inputPath.endsWith("/assets/css/main.css")) return;

      return async () => {
        const { code } = bundle({
          filename: inputPath,
          minify: IS_PROD,
          targets: CSS_TARGETS
        });
        return code.toString();
      };
    }
  });

  /* ---------------------------------------------------------------------
   * Drafts — visible while developing, never built for production.
   * ------------------------------------------------------------------ */
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft === true && IS_PROD) return false;
  });

  /* ---------------------------------------------------------------------
   * Markdown — heading anchors so articles support deep links and a TOC.
   * ------------------------------------------------------------------ */
  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ html: true, breaks: false, linkify: true });
    md.use(markdownItAnchor, {
      level: [2, 3],
      permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true }),
      slugify: (s) => eleventyConfig.getFilter("slugify")(s)
    });
  });

  /* ---------------------------------------------------------------------
   * Filters
   * ------------------------------------------------------------------ */
  eleventyConfig.addFilter("isoDate", (value) =>
    value ? new Date(value).toISOString() : ""
  );

  eleventyConfig.addFilter("dateOnly", (value) =>
    value ? new Date(value).toISOString().slice(0, 10) : ""
  );

  eleventyConfig.addFilter("readableDate", (value, locale = "en-US") =>
    value
      ? new Intl.DateTimeFormat(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
          timeZone: "UTC"
        }).format(new Date(value))
      : ""
  );

  /** Join a site origin and a path into an absolute URL, exactly one slash. */
  eleventyConfig.addFilter("absoluteUrl", (path = "/", origin = "") =>
    `${String(origin).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`
  );

  /** Normalise any admin-supplied string into a lowercase hyphenated slug. */
  eleventyConfig.addFilter("normalizeSlug", (value = "") =>
    String(value)
      .trim()
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  /** Trim to a target length on a word boundary (SEO title/description caps). */
  eleventyConfig.addFilter("clampText", (value = "", max = 160) => {
    const text = String(value).trim();
    if (text.length <= max) return text;
    return `${text.slice(0, text.lastIndexOf(" ", max - 1)).trim()}…`;
  });

  eleventyConfig.addFilter("jsonld", (value) =>
    JSON.stringify(value, null, IS_PROD ? 0 : 2).replace(/</g, "\\u003C")
  );

  /** Minutes to read, from rendered article HTML. */
  eleventyConfig.addFilter("readingTime", (html = "") => {
    const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  });

  /**
   * Build a table of contents from rendered HTML headings.
   * Returns [{ level, id, text }] — templates decide whether to show it.
   */
  eleventyConfig.addFilter("tableOfContents", (html = "", levels = [2, 3]) => {
    const entries = [];
    const re = /<h([2-4])[^>]*\sid="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
    let match;
    while ((match = re.exec(String(html)))) {
      const level = Number(match[1]);
      if (!levels.includes(level)) continue;
      const text = match[3].replace(/<[^>]+>/g, "").trim();
      if (text) entries.push({ level, id: match[2], text });
    }
    return entries;
  });

  /* ---------------------------------------------------------------------
   * Collections
   * ------------------------------------------------------------------ */
  eleventyConfig.addCollection("blog", (api) =>
    api
      .getFilteredByGlob("src/content/blog/**/*.md")
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("blogCategories", (api) => {
    const map = new Map();
    for (const post of api.getFilteredByGlob("src/content/blog/**/*.md")) {
      const category = post.data.category;
      if (!category) continue;
      map.set(category, (map.get(category) || 0) + 1);
    }
    return [...map].map(([name, count]) => ({ name, count })).sort((a, b) => a.name.localeCompare(b.name));
  });

  /** Everything eligible for the XML sitemap: indexable, non-draft, real URL. */
  eleventyConfig.addCollection("sitemap", (api) =>
    api.getAll().filter((item) => {
      if (!item.url || item.url === false) return false;
      if (item.data.draft === true) return false;
      if (item.data.status === "draft") return false;
      if (item.data.excludeFromSitemap === true) return false;
      if (String(item.data.robots || "").includes("noindex")) return false;
      return item.url.endsWith("/") || item.url.endsWith(".html");
    })
  );

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    templateFormats: ["njk", "md", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    pathPrefix: "/"
  };
}
