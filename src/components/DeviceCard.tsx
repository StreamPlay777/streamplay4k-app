import { useState } from 'react';
import type { DeviceTile } from '../data/marquees';

// Vite resolves every device photo at build time; missing files simply stay
// undefined and the card falls back to its placeholder.
const images = import.meta.glob('../assets/devices/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function resolve(file?: string): string | undefined {
  if (!file) return undefined;
  const key = Object.keys(images).find((k) => k.endsWith('/' + file));
  return key ? images[key] : undefined;
}

export default function DeviceCard({ tile }: { tile: DeviceTile }) {
  const src = resolve(tile.image);
  const [failed, setFailed] = useState(false);
  const showArt = src && !failed;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.02]">
      {/* Device photo, lifted off the dark card by a soft glow.
          The image is sized by object-contain inside a fixed-height box rather
          than by max-height, so the portrait phone shot cannot outgrow the
          card the way an auto-sized grid item would. */}
      <div className="relative h-[210px] px-6 pt-7">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(255,255,255,.07), transparent 70%)',
          }}
        />
        {showArt ? (
          <img
            src={src}
            alt={`${tile.name} running Streamplay4k`}
            loading="lazy"
            onError={() => setFailed(true)}
            className="relative h-full w-full object-contain object-bottom
                       drop-shadow-[0_18px_36px_rgba(0,0,0,.55)]"
          />
        ) : (
          <div className="placeholder-stripes relative grid h-full w-full place-items-center rounded-xl">
            <span className="nums text-[11px] text-ink-5">[ {tile.name.toLowerCase()} photo ]</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-6 pb-5 pt-5">
        <h3 className="font-display text-[17px] font-bold text-ink">{tile.name}</h3>
        <p className="mt-2 flex-1 text-[14px] leading-relaxed text-ink-3">{tile.note}</p>

        {/* Compatibility row — pinned to the card foot so all four line up */}
        <div className="mt-5 border-t border-white/[.08] pt-4">
          <div className="text-[10px] font-bold uppercase tracking-[.16em] text-ink-5">
            {tile.brandLabel}
          </div>
          <div className="mt-2.5 flex min-h-[38px] flex-wrap content-start gap-x-3 gap-y-1.5">
            {tile.brands.map((b) => (
              <span key={b} className="font-display text-[12px] font-semibold text-ink-4">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
