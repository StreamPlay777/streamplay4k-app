import { showcase, STREAM_NOTE } from '../data/showcase';

const files = import.meta.glob('../assets/posters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function posterFor(slug: string): string | undefined {
  const key = Object.keys(files).find((k) => k.endsWith(`/${slug}.webp`));
  return key ? files[key] : undefined;
}

/**
 * Auto-scrolling rails of labelled poster cards.
 *
 * Unlike the wall behind it, these are content rather than decoration: each
 * card names the title and says "4K · Subtitles", which is the point of the
 * section. So they carry real alt text and are not hidden from readers.
 *
 * Split across two rails moving opposite ways, so the whole catalogue passes
 * by rather than the same handful looping. Each rail renders its cards twice
 * and travels exactly -50%, which is what makes the loop seamless.
 */
export default function ShowcaseRow() {
  const half = Math.ceil(showcase.length / 2);
  const rails = [
    { items: showcase.slice(0, half), direction: 'marquee-l', duration: 72 },
    { items: showcase.slice(half), direction: 'marquee-r', duration: 84 },
  ];

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {rails.map((rail, r) => (
        <div key={r} className="mask-rail overflow-hidden">
          <ul
            className="marquee-track flex w-max gap-3 sm:gap-4"
            style={{
              animationName: rail.direction,
              animationDuration: `${rail.duration}s`,
              animationTimingFunction: 'linear',
              animationIterationCount: 'infinite',
            }}
          >
            {[0, 1].map((pass) =>
              rail.items.map((t) => {
                const src = posterFor(t.slug);
                return (
                  <li
                    key={`${pass}-${t.slug}`}
                    className="relative w-[132px] flex-none overflow-hidden rounded-xl border
                               border-white/10 shadow-[0_14px_36px_rgba(0,0,0,.55)]
                               sm:w-[152px] lg:w-[168px]"
                    aria-hidden={pass === 1}
                  >
                    {src ? (
                      <img
                        src={src}
                        alt={pass === 0 ? `${t.name} — ${t.genre}` : ''}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-[2/3] w-full object-cover"
                      />
                    ) : (
                      <div className="placeholder-stripes aspect-[2/3] w-full" />
                    )}

                    {/* Scrim keeps the label readable over any artwork */}
                    <div
                      className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5 pt-9"
                      style={{ background: 'linear-gradient(180deg, transparent, rgba(4,6,11,.94))' }}
                    >
                      <span className="inline-block rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                        {t.genre}
                      </span>
                      <p className="mt-1.5 truncate font-display text-[13px] font-bold text-white">
                        {t.name}
                      </p>
                      <p className="text-[10.5px] text-white/70">{STREAM_NOTE}</p>
                    </div>
                  </li>
                );
              }),
            )}
          </ul>
        </div>
      ))}
    </div>
  );
}
