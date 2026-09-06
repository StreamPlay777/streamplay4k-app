# Hero imagery

The homepage hero expects ONE licensed image. Until it is supplied the hero
renders a premium dark atmospheric fallback — no third-party image is
requested, hotlinked or scraped.

| File                   | Notes                                              |
| ---------------------- | -------------------------------------------------- |
| `streamplay-hero.webp` | 1920×1080 or wider, cinematic, dark. Loses detail below the bottom curve, so keep the subject in the upper two thirds. |

To activate it, set `background.image` in `src/_data/hero.js` to
`/assets/img/hero/streamplay-hero.webp`. Nothing else needs to change — the
overlay, vignette, focal position and dimensions are already wired.

The image is decorative: it carries an empty `alt` and is hidden from
assistive technology. All hero text stays readable over it via the scrim and
vignette layers, so pick for mood rather than legibility.

Do not use movie posters, network artwork or any image without a licence.
