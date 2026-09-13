import Poster from './Poster';
import { useBestTitles } from '../hooks/useBestTitles';
import { TMDB_ATTRIBUTION } from '../lib/tmdb';

/**
 * Two rails of current US titles: highest rated, and most watched.
 *
 * WHY THIS SITS ABOVE THE CURATED ROW RATHER THAN REPLACING IT. The curated
 * row is a fixed set of recognisable films with artwork shipped in the bundle;
 * it loads with the page and never fails. These rails are live, so they can be
 * empty, slow or stale depending on a third party. Keeping both means the
 * section still says "we have the films you know" when TMDB is having a bad
 * day, and says "and this month's releases" when it isn't.
 *
 * NO MARQUEE HERE, deliberately. The curated row below already drifts, and the
 * homepage carries fifty animated tracks as it is — another two would cost
 * Speed Index for nothing. These scroll by hand, which is also what someone
 * actually wants when they are reading titles rather than absorbing an
 * impression.
 *
 * ABSENT FROM THE PRE-RENDERED HTML, by design: effects do not run during
 * renderToString, so a crawler sees the curated row only. That is correct —
 * baking October's chart into a build would serve October's chart in March,
 * and these posters are decoration rather than content a crawler needs.
 */
export default function FreshRails() {
  const { best, popular, live } = useBestTitles();

  // Nothing live to show — no key, TMDB unreachable, or an empty result. The
  // curated row below stands alone, which is exactly how the page looks today.
  // Rendering a placeholder here would put twenty grey boxes on the homepage
  // in the most common failure case, which is worse than not rendering at all.
  if (!live) return null;

  const rails = [
    {
      key: 'best',
      label: 'Top rated this year',
      note: 'Highest-rated US releases of the last two years',
      items: best,
    },
    {
      key: 'popular',
      label: 'Most watched right now',
      note: 'What US audiences are watching this week',
      items: popular,
    },
  // One of the two can come back empty while the other succeeds.
  ].filter((r) => r.items.length > 0);

  return (
    <div className="flex flex-col gap-7">
      {rails.map((rail) => (
        <section key={rail.key} aria-labelledby={`rail-${rail.key}`}>
          <div className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3
              id={`rail-${rail.key}`}
              className="font-display text-[15px] font-bold uppercase tracking-[.1em] text-ink"
            >
              {rail.label}
            </h3>
            <p className="text-[12.5px] text-ink-4">{rail.note}</p>
          </div>

          {/* tabIndex so the rail is reachable by keyboard — an overflow
              container with a hidden scrollbar otherwise is not.
              NO role="group": that overrides the <ul>'s implicit list role and
              orphans every <li> inside it. The aria-label names the region
              without replacing its semantics. */}
          <ul
            className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-3 sm:mx-0 sm:px-0"
            style={{ scrollbarWidth: 'none' }}
            tabIndex={0}
            aria-label={rail.label}
          >
            {rail.items.map((t) => (
              <li key={`${t.name}-${t.year}`} className="flex-none">
                <Poster title={t} width={132} height={198} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* Required by TMDB's terms. Reached only when live data is on screen,
          which is the only time crediting them would be truthful. */}
      <p className="text-[11.5px] leading-relaxed text-ink-5">{TMDB_ATTRIBUTION}</p>
    </div>
  );
}
