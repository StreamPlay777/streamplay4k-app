import { useState } from 'react';
import { posterUrl, type Title } from '../data/vod';

/**
 * Poster card. Renders real artwork when a poster source is configured
 * (see src/data/vod.ts), and falls back to the striped placeholder with the
 * title still legible when it is not — so the rail reads correctly either way.
 */
export default function Poster({ title, width = 160, height = 240 }: {
  title: Title;
  /** Fixed width for marquee rails; omit to fill a grid cell. */
  width?: number;
  height?: number;
}) {
  const src = posterUrl(title);
  const [failed, setFailed] = useState(false);
  const showArt = src && !failed;

  return (
    <div
      className={`group relative flex-none overflow-hidden rounded-[10px] border border-line
                  ${showArt ? '' : 'placeholder-stripes'}`}
      style={{ width: width ?? '100%', height, backgroundColor: '#0E1424' }}
    >
      {showArt && (
        <img
          src={src}
          alt={`${title.name} (${title.year})`}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      )}

      {/* accent-chip, not accent: white on the brand red measures 3.74:1, which
          fails AA at 9px. See the note on --accent-chip in src/index.css. */}
      {title.badge && (
        <span className="absolute right-2 top-2 rounded bg-accent-chip px-1.5 py-0.5 font-display text-[9px] font-extrabold uppercase text-white">
          {title.badge}
        </span>
      )}

      {/* Caption sits over a scrim so it stays readable on real artwork too */}
      <div
        className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5 pt-6"
        style={{ background: 'linear-gradient(180deg, transparent, rgba(4,6,11,.92))' }}
      >
        <div className="truncate font-display text-[12px] font-bold leading-tight text-white">{title.name}</div>
        <div className="mt-0.5 nums text-[9.5px] text-ink-5">
          {title.year} · {title.genre}
        </div>
      </div>
    </div>
  );
}
