# Brand assets

Drop the supplied StreamPlay4K files here, then fill in the matching paths in
`src/_data/brand.js`. Nothing else needs to change — the header, footer, head
and schema all read from that one file.

| File                                | Used for                                   |
| ----------------------------------- | ------------------------------------------ |
| `streamplay4k-logo-white.svg`       | Dark navbar, footer, all dark surfaces     |
| `streamplay4k-logo-dark.svg`        | Light surfaces where required              |
| `streamplay4k-icon.svg`             | Small brand elements, loading states       |
| `streamplay4k-icon.png` (512×512)   | `Organization` schema logo                 |

Root-level icons (favicon, apple-touch icon, manifest) live in
`src/assets/root/` and are copied to the site root at build time. The current
`favicon.svg` there is a neutral placeholder — replace it with the real
StreamPlay icon export. Do not redraw the logo.
