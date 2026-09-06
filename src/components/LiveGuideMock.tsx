import { guide, timeSlots, NOW_AT_SLOT } from '../data/epg';
import { site } from '../data/site';

const logoFiles = import.meta.glob('../assets/logos/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function logoFor(slug: string): string | undefined {
  const key = Object.keys(logoFiles).find((k) => k.endsWith(`/${slug}.svg`));
  return key ? logoFiles[key] : undefined;
}

/**
 * The live TV guide shown inside the hero's browser frame.
 *
 * Rendered rather than shipped as a screenshot: it stays sharp on any display,
 * weighs nothing next to a 1880px image, and reuses the real channel logos, so
 * it cannot drift out of date with the rest of the site. Listings are
 * illustrative — see src/data/epg.ts.
 *
 * Decorative as a whole, so it is hidden from screen readers; the hero copy
 * already says what the product is.
 */
export default function LiveGuideMock() {
  const SLOT = 'minmax(0, 1fr)';

  return (
    <div aria-hidden="true" className="select-none bg-[#080B16] text-left">
      {/* App chrome */}
      <div className="flex items-center gap-3 border-b border-white/[.07] px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[.14em] text-accent">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-accent" />
          Live TV
        </span>
        <div className="ml-1 hidden flex-1 rounded-md border border-white/[.08] bg-white/[.03] px-3 py-1 text-[11px] text-ink-5 sm:block">
          Search {site.channels} channels…
        </div>
        <span className="ml-auto hidden text-[11px] text-ink-4 sm:block">Today · 20:45</span>
      </div>

      {/* Time header */}
      <div
        className="grid items-center border-b border-white/[.07] px-3 py-2"
        style={{ gridTemplateColumns: `110px repeat(${timeSlots.length}, ${SLOT})` }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[.14em] text-ink-5">Channel</span>
        {timeSlots.map((t) => (
          <span key={t} className="text-[10.5px] text-ink-4">{t}</span>
        ))}
      </div>

      {/* Rows */}
      <div className="relative">
        {/* Now line, sitting above the rows */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 z-10 w-px bg-accent"
          style={{ left: `calc(110px + 12px + (100% - 110px - 24px) * ${NOW_AT_SLOT / timeSlots.length})` }}
        >
          <span className="absolute -left-1 -top-0.5 h-2 w-2 rounded-full bg-accent" />
        </div>

        {guide.map((row) => {
          const logo = logoFor(row.logo);
          return (
            <div
              key={row.channel}
              className="grid items-center gap-1 border-b border-white/[.05] px-3 py-1.5 last:border-b-0"
              style={{ gridTemplateColumns: `110px repeat(${timeSlots.length}, ${SLOT})` }}
            >
              {/* Channel */}
              <div className="flex items-center gap-2 pr-2">
                {logo ? (
                  <span className="grid h-6 w-9 flex-none place-items-center rounded bg-[#F2F4F8] p-[3px]">
                    <img src={logo} alt="" className="max-h-full max-w-full object-contain" />
                  </span>
                ) : (
                  <span className="grid h-6 w-9 flex-none place-items-center rounded border border-white/10 text-[8px] text-ink-4">
                    {row.channel.slice(0, 3).toUpperCase()}
                  </span>
                )}
                <span className="truncate text-[11px] font-semibold text-ink-2">{row.channel}</span>
              </div>

              {/* Programme blocks */}
              {row.programmes.map((p, i) => (
                <div
                  key={i}
                  style={{ gridColumn: `span ${p.span}` }}
                  className={`truncate rounded-md px-2.5 py-[7px] text-[11px] ${
                    p.live
                      ? 'bg-accent/[.16] font-semibold text-ink ring-1 ring-inset ring-accent/40'
                      : 'bg-white/[.04] text-ink-3'
                  }`}
                >
                  {p.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
