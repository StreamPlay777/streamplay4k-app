/**
 * Permanent redirects from old URLs to their new equivalents.
 *
 * Left intentionally EMPTY: existing indexed URLs will be inventoried and
 * mapped before launch. Adding an entry here regenerates both
 * dist/.htaccess (Apache/Hostinger) and dist/_redirects (Netlify/Cloudflare).
 *
 * Shape: { from: "/old-path/", to: "/new-path/", status: 301 }
 * `from` and `to` must be root-relative paths, or `to` may be absolute.
 */
export default [];
