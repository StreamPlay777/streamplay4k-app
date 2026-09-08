import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { routes } from '../data/site';
import {
  loadCatalogue, peekCatalogue, queryCatalogue, GROUP_LABELS,
  type Catalogue, type Group,
} from '../data/catalogue';
import { channelStats, channelPreview } from '../data/channelStats';
import { channelInitials } from '../data/channels';
import { logoFor } from '../data/logos';
import { track } from '../lib/analytics';

const GROUPS: Group[] = ['sports', 'movies', 'news', 'entertainment', 'kids', 'uhd'];
const PAGE = 300;

/**
 * The full channel catalogue — 46,758 rows, searchable.
 *
 * LOADING
 * The catalogue is fetched on mount rather than bundled, so the page shell,
 * its heading and its real counts are on screen immediately and the 310 KB
 * arrives behind them. Counts come from channelStats, which is bundled, so the
 * page never shows a zero it later corrects.
 *
 * FILTERING
 * Every keystroke re-runs one pass over 46,758 rows, which measures at about
 * 8ms — fast enough that debouncing would only add latency. The rows already
 * carry a lowercased haystack and precomputed group flags from the build step;
 * without those this would be far too slow to do synchronously.
 *
 * LOGOS
 * Deliberately none from the feed. Every logo URL in the panel export points at
 * a third-party host, three quarters over plain http (which a browser blocks on
 * an https page anyway), and hotlinking them would have every visitor's browser
 * announce itself to those hosts. Where we have a bundled mark for a network we
 * use it; otherwise initials. See scripts/build-channels.mjs.
 */
export default function ChannelBrowser() {
  const [cat, setCat] = useState<Catalogue | null>(peekCatalogue);
  const [failed, setFailed] = useState(false);
  const [text, setText] = useState('');
  const [group, setGroup] = useState<Group | null>(null);
  const [region, setRegion] = useState<string | null>('US');
  const [regionQuery, setRegionQuery] = useState('');
  const [adult, setAdult] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (peekCatalogue()) return;
    const ac = new AbortController();
    loadCatalogue(ac.signal).then(setCat).catch((e) => {
      if (e?.name !== 'AbortError') setFailed(true);
    });
    return () => ac.abort();
  }, []);

  const result = useMemo(
    () => (cat ? queryCatalogue(cat, { text, group, region, includeAdult: adult, limit: PAGE }) : null),
    [cat, text, group, region, adult],
  );

  /**
   * What to show before the catalogue lands.
   *
   * The bundled preview, but only while nothing has been typed or filtered —
   * showing a stale US list to someone who has just clicked "Sports" would be
   * answering a different question than the one they asked. Once any control
   * is touched before the fetch returns, the spinner is the honest answer.
   */
  const untouched = !text.trim() && !group && region === 'US' && !adult;
  const rows = result
    ? result.channels
    : untouched
      ? channelPreview.map(([name, category]) => ({
          name, category, region: 'US', regionName: 'United States', flag: '🇺🇸', flags: 0, hay: '',
        }))
      : null;

  // One event per settled search, not per keystroke.
  useEffect(() => {
    if (!text.trim()) return;
    const id = window.setTimeout(() => track('channel_search', { q: text.trim().slice(0, 40), results: result?.matched ?? 0 }), 900);
    return () => window.clearTimeout(id);
  }, [text, result?.matched]);

  const regions = useMemo(() => {
    const all = cat?.regions ?? channelStats.topRegions.map(([code, name, flag, count]) => ({ code, name, flag, count }));
    const q = regionQuery.trim().toLowerCase();
    return q ? all.filter((r) => r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q)) : all;
  }, [cat, regionQuery]);

  const activeRegion = cat?.regions.find((r) => r.code === region);
  const total = channelStats.total;

  return (
    <div className="mx-auto max-w-shell overflow-hidden rounded-[18px] border border-line bg-surface">
      {/* Search */}
      <div className="flex items-center gap-3.5 border-b border-line px-[22px] py-5">
        <span className="h-2 w-2 flex-none animate-pulse-dot rounded-full bg-accent" aria-hidden="true" />
        <div className="relative flex-1">
          <input
            ref={searchRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Search all ${total.toLocaleString('en-US')} channels — sport, news, films, local…`}
            aria-label="Search channels"
            className="field !py-2.5 !pr-10"
          />
          {text && (
            <button
              type="button"
              onClick={() => { setText(''); searchRef.current?.focus(); }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-ink-4 transition-colors hover:bg-raise-2 hover:text-ink"
            >
              <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 4l8 8M12 4l-8 8" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr]">
        {/* Region rail */}
        <aside className="border-b border-line p-4 lg:border-b-0 lg:border-r">
          <input
            value={regionQuery}
            onChange={(e) => setRegionQuery(e.target.value)}
            placeholder="Filter countries…"
            aria-label="Filter countries"
            className="field mb-3 !py-2 !text-[13.5px]"
          />
          <div className="flex max-h-[420px] flex-col gap-0.5 overflow-y-auto">
            <button
              onClick={() => setRegion(null)}
              className={`flex items-center gap-2.5 rounded-[9px] px-3.5 py-2.5 text-left transition-colors ${
                region === null ? 'bg-accent text-white' : 'hover:bg-raise-2'
              }`}
            >
              <span className="flex-none text-[15px]" aria-hidden="true">🌐</span>
              <span className={`flex-1 text-[14.5px] font-semibold ${region === null ? 'text-white' : 'text-ink-2'}`}>
                Everywhere
              </span>
              <span className={`nums text-[11.5px] ${region === null ? 'text-white/80' : 'text-ink-4'}`}>
                {total.toLocaleString('en-US')}
              </span>
            </button>
            {regions.map((r) => {
              const on = r.code === region;
              return (
                <button
                  key={r.code}
                  onClick={() => setRegion(r.code)}
                  className={`flex items-center gap-2.5 rounded-[9px] px-3.5 py-2.5 text-left transition-colors ${
                    on ? 'bg-accent text-white' : 'hover:bg-raise-2'
                  }`}
                >
                  <span className="flex-none text-[15px]" aria-hidden="true">{r.flag}</span>
                  <span className={`flex-1 truncate text-[14.5px] font-semibold ${on ? 'text-white' : 'text-ink-2'}`}>
                    {r.name}
                  </span>
                  <span className={`nums text-[11.5px] ${on ? 'text-white/80' : 'text-ink-4'}`}>
                    {r.count.toLocaleString('en-US')}
                  </span>
                </button>
              );
            })}
            {regions.length === 0 && (
              <p className="px-2 py-4 text-[13px] text-ink-4">No country matches “{regionQuery}”.</p>
            )}
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2.5 border-t border-line pt-4">
            <span className={`relative h-[18px] w-8 flex-none rounded-full transition-colors ${adult ? 'bg-accent' : 'bg-raise-3'}`}>
              <span className={`absolute top-[2px] h-3.5 w-3.5 rounded-full bg-white transition-all ${adult ? 'left-[16px]' : 'left-[2px]'}`} />
            </span>
            <input type="checkbox" checked={adult} onChange={(e) => setAdult(e.target.checked)} className="sr-only" />
            <span className="text-[13.5px] text-ink-3">Show adult channels</span>
          </label>
        </aside>

        {/* Results */}
        <div className="px-5 pb-6 pt-[18px]">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setGroup(null)}
              className={`btn-sm ${group === null ? 'bg-accent text-white' : 'border border-line-2 bg-raise text-ink-2'}`}
            >
              All categories
            </button>
            {GROUPS.map((g) => (
              <button
                key={g}
                onClick={() => setGroup(g === group ? null : g)}
                className={`btn-sm ${group === g ? 'bg-accent text-white' : 'border border-line-2 bg-raise text-ink-2'}`}
              >
                {GROUP_LABELS[g]}
                <span className={`nums text-[11px] ${group === g ? 'text-white/75' : 'text-ink-4'}`}>
                  {channelStats.groups[g].toLocaleString('en-US')}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[14px] text-ink-3" aria-live="polite">
              {result || rows ? (
                <>
                  Showing{' '}
                  <strong className="font-semibold text-ink">
                    {(result ? result.channels.length : rows!.length).toLocaleString('en-US')}
                  </strong>{' '}
                  of{' '}
                  <strong className="font-semibold text-ink">
                    {(result ? result.matched : channelStats.topRegions.find((r) => r[0] === 'US')?.[3] ?? channelStats.total).toLocaleString('en-US')}
                  </strong>
                  {result ? (activeRegion ? ` in ${activeRegion.name}` : ' channels') : ' in United States'}
                </>
              ) : failed ? (
                'The channel list could not be loaded.'
              ) : (
                'Loading the channel list…'
              )}
            </p>
            <span className="font-display text-[11px] font-bold uppercase tracking-[.16em] text-accent-ink">Live now</span>
          </div>

          {/* Grid */}
          {rows ? (
            <>
              <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {rows.map((ch, i) => {
                  const mark = logoFor(ch.name);
                  return (
                    <li
                      key={`${ch.name}-${i}`}
                      className="rounded-[11px] border border-line bg-raise px-[15px] py-3.5 transition-colors hover:border-accent/40 hover:bg-accent/[.05]"
                    >
                      <div className="flex items-start gap-2.5">
                        {mark ? (
                          <span className="logo-plate grid h-8 w-8 flex-none place-items-center overflow-hidden rounded-md p-1">
                            <img src={mark} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                          </span>
                        ) : (
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-md border border-line bg-raise-2 text-[10.5px] font-bold text-ink-3">
                            {channelInitials(ch.name)}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-display text-[14.5px] font-bold text-ink">{ch.name}</span>
                          <span className="mt-0.5 block truncate text-[11.5px] uppercase tracking-[.08em] text-ink-4">
                            {ch.flag} {ch.category}
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {rows.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-[15px] text-ink-4">Nothing matches that search.</p>
                  <button
                    type="button"
                    onClick={() => { setText(''); setGroup(null); setRegion(null); }}
                    className="mt-3 text-[14px] font-semibold text-accent-ink underline underline-offset-4"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 text-center">
              {failed ? (
                <p className="text-[15px] text-ink-4">
                  We could not load the channel list just now. Refresh the page, or{' '}
                  <Link to={routes.contact} className="text-accent-ink underline underline-offset-4">ask us</Link>{' '}
                  and we will send it over.
                </p>
              ) : (
                <span
                  className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-line-3 border-t-accent motion-reduce:animate-none"
                  role="status"
                  aria-label="Loading channels"
                />
              )}
            </div>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <p className="max-w-[520px] text-[14px] text-ink-3">
              Missing a channel? Search first, then ask us — if it exists, we can usually add it.
            </p>
            <Link to={routes.contact} className="btn-outline !py-2.5 !text-[14px]">Ask us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
