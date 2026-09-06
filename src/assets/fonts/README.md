# Fonts

Manrope Variable is the StreamPlay4K typeface, self-hosted (no Google Fonts,
no third-party CDN).

| File                     | Notes                                            |
| ------------------------ | ------------------------------------------------ |
| `manrope-variable.woff2` | Variable weight axis 200–800. One file, all weights. |

Get it from the official source — the Manrope repository
(github.com/sharanda/manrope) or Google Fonts' download, which ships the
variable TTF; convert it to WOFF2 before adding it here. Do not commit a font
from an unknown mirror.

The `@font-face` declaration lives in `src/assets/css/base/fonts.css` and
already points at this path, so no code change is needed once the file lands.
Until then the site falls back to the system stack defined in `tokens.css`.
