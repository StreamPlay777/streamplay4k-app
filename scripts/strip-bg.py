#!/usr/bin/env python3
"""
Strip the flat white backdrop from product photos so devices sit cleanly on the
dark page.

Usage:
    python3 scripts/strip-bg.py raw/*.png

Writes <name>.png (RGBA, transparent backdrop, cropped to the device) into
src/assets/devices/.

Approach: flood-fill inward from the four edges, taking every pixel within
`TOLERANCE` of white as backdrop. Flood fill rather than a global colour key so
white *inside* the photo — a bright screen, a laptop bezel highlight — is kept.
"""
import sys
from collections import deque
from pathlib import Path

from PIL import Image

OUT_DIR = Path("src/assets/devices")
TOLERANCE = 26      # per-channel distance from pure white counted as backdrop
FEATHER = 1         # px of edge softening, keeps the cutout from looking cut out


def is_bg(px, tol=TOLERANCE):
    r, g, b = px[:3]
    return r >= 255 - tol and g >= 255 - tol and b >= 255 - tol


def strip(path: Path) -> None:
    img = Image.open(path).convert("RGBA")
    w, h = img.size
    px = img.load()

    # Flood fill from every edge pixel that is already backdrop-coloured.
    seen = bytearray(w * h)
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if not seen[y * w + x] and is_bg(px[x, y]):
                seen[y * w + x] = 1
                q.append((x, y))
    for y in range(h):
        for x in (0, w - 1):
            if not seen[y * w + x] and is_bg(px[x, y]):
                seen[y * w + x] = 1
                q.append((x, y))

    while q:
        x, y = q.popleft()
        px[x, y] = (255, 255, 255, 0)
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and is_bg(px[nx, ny]):
                seen[ny * w + nx] = 1
                q.append((nx, ny))

    # Soften the cut edge so it does not read as a hard sticker outline.
    if FEATHER:
        alpha = img.getchannel("A")
        from PIL import ImageFilter
        img.putalpha(alpha.filter(ImageFilter.GaussianBlur(FEATHER)))

    img = img.crop(img.getbbox() or (0, 0, w, h))

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    out = OUT_DIR / (path.stem + ".png")
    img.save(out, "PNG", optimize=True)
    print(f"  {path.name:28} -> {out}  {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    files = [Path(a) for a in sys.argv[1:]]
    if not files:
        sys.exit("usage: python3 scripts/strip-bg.py <image>...")
    print("Stripping backgrounds:")
    for f in files:
        strip(f)
