/**
 * Brand asset registry.
 *
 * Real logo files have not been supplied yet. Leave a value empty and the
 * templates fall back to a plain text wordmark — drop the file in at the
 * path below and it is picked up everywhere at once. Do not redraw or
 * substitute the logo.
 */
export default {
  logo: {
    /** Primary logo for dark surfaces (navbar, footer). */
    white: "",       /* -> /assets/img/brand/streamplay4k-logo-white.svg */
    /** For light surfaces where a dark wordmark is required. */
    dark: "",        /* -> /assets/img/brand/streamplay4k-logo-dark.svg */
    /** Standalone icon: favicon, small brand elements, loading states. */
    icon: "",        /* -> /assets/img/brand/streamplay4k-icon.svg */
    /** Intrinsic size of the wordmark, used to reserve space (no CLS). */
    width: 168,
    height: 32,
    alt: "StreamPlay4K"
  },
  favicon: {
    svg: "/favicon.svg",
    png: "/favicon-96.png",
    /* Empty until the real 180x180 PNG is exported into assets/root/. */
    appleTouch: "",
    manifest: "/site.webmanifest"
  },
  themeColor: "#090a0c"
};
