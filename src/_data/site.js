/**
 * Core site identity. Everything that depends on "where this site lives"
 * reads from here — never hardcode the domain in a template.
 */
const ENV = process.env.ELEVENTY_ENV || "development";

export default {
  name: "StreamPlay4K",
  shortName: "StreamPlay4K",
  /** Production origin, no trailing slash. Used for canonicals, OG, sitemap. */
  url: "https://streamplay4k.com",
  lang: "en",
  locale: "en_US",
  /** One-line positioning statement. Not marketing copy — a factual default. */
  tagline: "Everything you love. One place.",
  env: ENV,
  isProduction: ENV === "production",
  /** Cache-buster appended to CSS/JS in the <head>. */
  assetVersion: String(Date.now()).slice(-8),
  buildTime: new Date().toISOString(),
  year: new Date().getUTCFullYear()
};
