import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchChannels, sampleSize, type ChannelHit } from '../data/channels';
import { logoFor } from '../data/logos';
import { routes, site } from '../data/site';
import { track } from '../lib/analytics';

/**
 * Two-column channel finder.
 *
 * Replaces the CTA card that used to sit here. That version hid the search
 * behind a button — the visitor had to click through to another page before
 * they could type anything, which is the opposite of what a "channel finder"
 * is for. The input is now the first thing they see.
 *
 * Results come from searchChannels() in data/channels.ts, which indexes the
 * same dataset /channels renders. Nothing here is fabricated: if a network is
 * not in the sample, typing its name returns no match rather than a plausible
 * looking row.
 *
 * Logos are the local SVGs already in the project, matched by slug. Channels
 * without one fall back to their initials, so a row never renders empty.
 */
export default function ChannelFinder() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const listId = useId();

  const results = useMemo(() => searchChannels(query, 6), [query]);
  const open = query.trim().length >= 2;

  useEffect(() => setActive(0), [query]);

  /**
   * Pointer-following sheen, desktop only.
   *
   * Writes two CSS custom properties on pointermove and lets CSS paint the
   * highlight — no React state, so this never re-renders the results list while
   * someone is reading it. Bound to a fine pointer and skipped under reduced
   * motion, so touch devices and motion-sensitive visitors never see it.
   */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || still) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
      el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const onLeave = () => el.style.removeProperty('--mx');
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  const goToChannels = (q: string) => {
    track('channel_search', { query: q.slice(0, 40), results: results.length });
    navigate(routes.channels);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((i) => (i + 1) % results.length); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((i) => (i - 1 + results.length) % results.length); }
    else if (e.key === 'Enter') { e.preventDefault(); goToChannels(query); }
    else if (e.key === 'Escape') { setQuery(''); }
  };

  return (
    <section className="section relative overflow-hidden bg-bg">
      <div className="mx-auto grid max-w-shell items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        {/* ── Left: the pitch ─────────────────────────────────────────── */}
        <div>
          <p className="flex items-center gap-3 font-display text-[11.5px] font-extrabold uppercase tracking-[.18em] sm:text-[12px]">
            <span className="h-px w-7 flex-none bg-accent" aria-hidden="true" />
            <span className="text-grad">Channels for every interest</span>
          </p>

          <h2
            className="mt-5 font-display font-extrabold leading-[1.06] text-ink text-balance"
            style={{ fontSize: 'clamp(29px, 3.9vw, 46px)' }}
          >
            {/* No forced break: at this measure a <br> after "Watch," left the
                first line wrapping anyway, giving three ragged lines. Letting it
                flow keeps the highlight inline, as in the reference. */}
            Everything You Want to Watch,{' '}
            <span className="text-grad">All in One Place</span>
          </h2>

          <p className="mt-5 max-w-[520px] text-[16.5px] leading-relaxed text-ink-3">
            Explore live entertainment across sports, news, movies, international channels and more.
          </p>

          <Link
            to={routes.channels}
            onClick={() => track('channel_search', { from: 'finder-cta' })}
            className="btn-accent group mt-8"
          >
            Explore channels
            <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        {/* ── Right: the finder ───────────────────────────────────────── */}
        <div ref={cardRef} className="finder-card relative rounded-2xl p-6 sm:p-8">
          <p className="label">Channel finder</p>
          <h3 className="mt-3 font-display text-[22px] font-extrabold leading-snug text-ink sm:text-[26px]">
            Find Your Favorite Channel
          </h3>
          <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-3">
            Search by channel name, category or country.
          </p>

          <div className="relative mt-6">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-4" aria-hidden="true">
              <Search size={18} />
            </span>
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-label="Search channels"
              placeholder="Search channels, sports, news…"
              className="finder-input h-[54px] w-full rounded-xl pl-[46px] pr-11 font-display text-[15px]
                         text-ink placeholder:text-ink-5 focus:outline-none
                         [&::-webkit-search-cancel-button]:appearance-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-lg
                           text-ink-4 transition-colors hover:bg-white/[.07] hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Results. aria-live so a screen reader hears the count change. */}
          <div id={listId} role="listbox" aria-label="Channel results" className="mt-3">
            {open && (
              <div className="finder-results">
                {results.length > 0 ? (
                  <ul className="flex flex-col gap-1">
                    {results.map((hit, i) => (
                      <li key={`${hit.countryId}-${hit.name}`}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={i === active}
                          onMouseEnter={() => setActive(i)}
                          onClick={() => goToChannels(query)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left
                                      transition-colors duration-150 ${
                                        i === active ? 'bg-white/[.07]' : 'hover:bg-white/[.05]'
                                      }`}
                        >
                          <ChannelMark hit={hit} />
                          <span className="min-w-0 flex-1 truncate font-display text-[14.5px] font-semibold text-ink">
                            {hit.name}
                          </span>
                          <span className="flex-none whitespace-nowrap text-[12px] text-ink-4">
                            {hit.category} · {hit.flag} {hit.country}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-3 text-[14px] text-ink-4">
                    No match in the browsable sample. The full {site.channels} line-up is much larger —{' '}
                    <Link to={routes.contact} className="text-accent-link hover:underline">ask us</Link>{' '}
                    and we will check it for you.
                  </p>
                )}
              </div>
            )}
          </div>

          <p aria-live="polite" className="sr-only">
            {open ? `${results.length} channel results for ${query}` : ''}
          </p>

          {!open && (
            <p className="mt-3 px-1 text-[12.5px] text-ink-5">
              Browsing a sample of {sampleSize} channels. Start typing to search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Local logo where we have one, initials where we do not. */
function ChannelMark({ hit }: { hit: ChannelHit }) {
  const src = hit.logo || logoFor(hit.name);
  if (src) {
    return (
      <span className="grid h-8 w-11 flex-none place-items-center rounded-md bg-white/95 p-1">
        <img src={src} alt="" loading="lazy" decoding="async" className="max-h-full max-w-full object-contain" />
      </span>
    );
  }
  const initials = hit.name.replace(/[^A-Za-z0-9 ]/g, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 3).toUpperCase();
  return (
    <span className="grid h-8 w-11 flex-none place-items-center rounded-md border border-white/[.1] bg-white/[.05]
                     font-display text-[11px] font-extrabold tracking-wide text-ink-3">
      {initials}
    </span>
  );
}
