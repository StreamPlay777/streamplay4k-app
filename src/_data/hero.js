/**
 * Homepage hero content.
 *
 * The hero section reads everything from here, so a duplicate or campaign
 * page reusing `sourceTemplate: "homepage"` renders the same hero. Per-page
 * `heroHeadline` / `heroSubtext` overrides still win — see
 * _includes/sections/hero.njk.
 *
 * Figures come from _data/business.js; none are restated here.
 */
import business from "./business.js";

export default {
  eyebrow: "Premium entertainment. Simplified.",

  /**
   * Two-part headline: `lead` stays white, `accent` carries the red→orange
   * treatment. A page-level `heroHeadline` override replaces both with a
   * single plain line.
   */
  headline: {
    lead: "Everything You Love.",
    accent: "One Simple Place."
  },

  subtext:
    "Live TV, sports, movies and series in HD and 4K — available across your favorite devices.",

  /**
   * Cinematic background. Leave `image` empty and the hero renders its
   * atmospheric dark fallback — no third-party image is ever requested.
   * Drop the licensed file in and set the path; see assets/img/hero/README.md.
   */
  background: {
    image: "",              /* -> /assets/img/hero/streamplay-hero.webp */
    width: 1920,
    height: 1080,
    /** object-position for the focal point of the supplied image. */
    focal: "50% 40%"
  },

  /** Four floating stat cards. `icon` maps to components/hero-icon.njk. */
  stats: [
    {
      id: "channels",
      icon: "broadcast",
      value: business.catalog.liveChannels.display,
      label: business.catalog.liveChannels.noun
    },
    {
      id: "vod",
      icon: "film",
      value: business.catalog.vod.display,
      label: business.catalog.vod.noun
    },
    {
      id: "support",
      icon: "support",
      value: business.support.availability,
      label: "Support"
    },
    {
      id: "quality",
      icon: "quality",
      value: business.quality.label,
      label: "Quality"
    }
  ]
};
