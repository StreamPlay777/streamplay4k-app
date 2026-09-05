import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { countries, getChannels, categoryCounts, channelInitials, type Category } from '../data/channels';
import { logoFor } from '../data/logos';

/**
 * Channel guide.
 *
 * Richer than the original handoff spec: the category chips with counts, the
 * country filter, the adult toggle and the "showing N of M" meta line are all
 * carried over from the live Primo guide, which handles the same catalogue.
 */
export default function Channels() {
  const [countryId, setCountryId] = useState(countries[0].id);
  const [category, setCategory] = useState<Category | null>(null);
  const [query, setQuery] = useState('');
  const [countryQuery, setCountryQuery] = useState('');
  const [adult, setAdult] = useState(false);

  const country = countries.find((c) => c.id === countryId)!;
  const results = useMemo(() => getChannels(countryId, category, query), [countryId, category, query]);
  const chipCounts = useMemo(() => categoryCounts(country), [country]);

  const visibleCountries = countries.filter((c) =>
    c.name.toLowerCase().includes(countryQuery.trim().toLowerCase()),
  );

  const stats = [
    { value: site.channels, label: 'Live channels' },
    { value: String(site.countries), label: 'Countries & regions' },
    { value: site.uhdChannels, label: 'In 4K & 8K' },
  ];

  return (
    <>
      {/* Header */}
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="label-accent">Channel guide</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Every channel.
            <br />
            <span className="text-accent">Every country.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            The US, the UK, Europe, the Arab world and South Asia — in HD, 4K and 8K.
            Search the whole line-up by name, or browse by where you are from.
          </p>
        </div>
      </section>

      {/* Stat cards */}
      <section className="px-7 pb-10">
        <div className="mx-auto grid max-w-shell gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.label} className="card px-6 py-7">
              <div className="font-display text-[36px] font-extrabold leading-none text-ink">{s.value}</div>
              <div className="mt-2.5 text-[14px] text-ink-3">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Browser shell */}
      <section className="px-7 pb-[110px]">
        <div className="mx-auto max-w-shell overflow-hidden rounded-[18px] border border-white/[.09] bg-surface">
          {/* Top bar */}
          <div className="flex items-center gap-3.5 border-b border-white/[.09] px-[22px] py-5">
            <span className="h-2 w-2 flex-none animate-pulse-dot rounded-full bg-accent" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search any channel — sport, news, films, local…"
              aria-label="Search channels"
              className="field !py-2.5"
            />
          </div>

          <div className="grid lg:grid-cols-[260px_1fr]">
            {/* Country rail */}
            <aside className="border-b border-white/[.09] p-4 lg:border-b-0 lg:border-r">
              <input
                value={countryQuery}
                onChange={(e) => setCountryQuery(e.target.value)}
                placeholder="Filter countries…"
                aria-label="Filter countries"
                className="field mb-3 !py-2 !text-[13.5px]"
              />
              <div className="flex max-h-[420px] flex-col gap-0.5 overflow-y-auto">
                {visibleCountries.map((c) => {
                  const on = c.id === countryId;
                  return (
                    <button
                      key={c.id}
                      onClick={() => { setCountryId(c.id); setCategory(null); }}
                      className={`flex items-center gap-2.5 rounded-[9px] px-3.5 py-2.5 text-left transition-colors ${
                        on ? 'bg-accent text-white' : 'hover:bg-white/[.04]'
                      }`}
                    >
                      <span className="flex-none text-[15px]">{c.flag}</span>
                      <span className={`flex-1 text-[14.5px] font-semibold ${on ? 'text-white' : 'text-ink-2'}`}>
                        {c.name}
                      </span>
                      <span className={`nums text-[11.5px] ${on ? 'text-white/80' : 'text-ink-4'}`}>
                        {c.count.toLocaleString('en-US')}
                      </span>
                    </button>
                  );
                })}
                {visibleCountries.length === 0 && (
                  <p className="px-2 py-4 text-[13px] text-ink-4">No country matches “{countryQuery}”.</p>
                )}
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2.5 border-t border-white/[.08] pt-4">
                <span
                  className={`relative h-[18px] w-8 flex-none rounded-full transition-colors ${
                    adult ? 'bg-accent' : 'bg-white/[.12]'
                  }`}
                >
                  <span
                    className={`absolute top-[2px] h-3.5 w-3.5 rounded-full bg-white transition-all ${
                      adult ? 'left-[16px]' : 'left-[2px]'
                    }`}
                  />
                </span>
                <input
                  type="checkbox"
                  checked={adult}
                  onChange={(e) => setAdult(e.target.checked)}
                  className="sr-only"
                />
                <span className="text-[13.5px] text-ink-3">Show adult channels</span>
              </label>
            </aside>

            {/* Results */}
            <div className="px-5 pb-6 pt-[18px]">
              {/* Category chips */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setCategory(null)}
                  className={`btn-sm ${
                    category === null ? 'bg-accent text-white' : 'border border-white/[.12] bg-white/[.02] text-ink-2'
                  }`}
                >
                  All categories
                  <span className={`nums text-[11px] ${category === null ? 'text-white/75' : 'text-ink-4'}`}>
                    {country.count.toLocaleString('en-US')}
                  </span>
                </button>
                {chipCounts.map(({ category: cat, count }) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`btn-sm ${
                      category === cat ? 'bg-accent text-white' : 'border border-white/[.12] bg-white/[.02] text-ink-2'
                    }`}
                  >
                    {cat}
                    <span className={`nums text-[11px] ${category === cat ? 'text-white/75' : 'text-ink-4'}`}>
                      {count.toLocaleString('en-US')}
                    </span>
                  </button>
                ))}
              </div>

              {/* Meta line */}
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[14px] text-ink-3">
                  Showing <strong className="font-semibold text-ink">{results.length}</strong> of{' '}
                  <strong className="font-semibold text-ink">{country.count.toLocaleString('en-US')}</strong>{' '}
                  channels in {country.name}
                </p>
                <span className="font-display text-[11px] font-bold uppercase tracking-[.16em] text-accent">
                  Live now
                </span>
              </div>

              {/* Channel grid */}
              <div className="mt-4 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((ch) => (
                  <div
                    key={ch.name}
                    className="rounded-[11px] border border-white/[.07] bg-white/[.02] px-[15px] py-3.5
                               transition-colors hover:border-accent/40 hover:bg-accent/[.05]"
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Feed logo first, then a bundled network mark, then
                          initials. Marks sit on a light chip for the same
                          reason as the wall — most are dark artwork. */}
                      {(() => {
                        const mark = ch.logo ?? logoFor(ch.name);
                        return mark ? (
                          <span className="grid h-8 w-8 flex-none place-items-center overflow-hidden rounded-md bg-[#F2F4F8] p-1">
                            <img src={mark} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                          </span>
                        ) : (
                          <span className="grid h-8 w-8 flex-none place-items-center rounded-md border border-white/[.09] bg-white/[.04] text-[10.5px] font-bold text-ink-3">
                            {channelInitials(ch.name)}
                          </span>
                        );
                      })()}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-display text-[14.5px] font-bold text-ink">{ch.name}</span>
                        <span className="mt-0.5 block text-[11.5px] uppercase tracking-[.08em] text-ink-4">
                          {ch.category}
                        </span>
                      </span>
                      {ch.uhd && (
                        <span className="flex-none rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 nums text-[9px] text-accent-bright">
                          4K
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {results.length === 0 && (
                <p className="py-12 text-center text-[15px] text-ink-4">
                  Nothing matches that search in {country.name}. Try another country or clear the filter.
                </p>
              )}

              {/* Foot */}
              <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-white/[.08] pt-5">
                <p className="max-w-[520px] text-[14px] text-ink-3">
                  Missing a channel? Search first, then ask us — if it exists, we can usually add it.
                </p>
                <Link to="/contact" className="btn-outline !py-2.5 !text-[14px]">Ask us</Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-shell nums text-[10.5px] text-ink-6">
          Showing a browsable sample of the {site.channels} line-up across {site.countries} countries and regions.
        </p>
      </section>
    </>
  );
}
