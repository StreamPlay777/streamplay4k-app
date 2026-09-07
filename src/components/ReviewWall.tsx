import { moreReviews, featuredReviews, trustpilot } from '../data/reviews';

/**
 * Subdued wall of real reviews behind the section.
 *
 * Every card is a real reviewer. The text is a paraphrase of what they said,
 * not a quote, because we hold their sentiment rather than their exact words —
 * so nothing appears in quote marks and no reviewer is invented to fill space.
 *
 * Where more cards are wanted than there are real reviewers, the same people
 * repeat down the columns rather than new identities being made up.
 *
 * Decorative, so hidden from screen readers; the cards in front carry the real
 * content. Hidden entirely on phones, where it costs readability and paint
 * time for no gain.
 */

const COLUMNS = 4;
const PER_COLUMN = 6;
const DURATIONS = [76, 92, 68, 100];

const POOL = [
  ...moreReviews.map((r) => ({ name: r.name, date: r.date, text: r.summary })),
  ...featuredReviews.map((r) => ({ name: r.name, date: r.date, text: r.quote })),
];

export default function ReviewWall() {
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from({ length: PER_COLUMN }, (_, r) => POOL[(c * PER_COLUMN + r) % POOL.length]),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden select-none overflow-hidden sm:block"
      style={{ filter: 'blur(2.5px)', opacity: 0.7 }}
    >
      <div className="absolute left-1/2 top-1/2 flex h-[190%] w-[116%] -translate-x-1/2 -translate-y-1/2 gap-3">
        {columns.map((col, c) => (
          <div key={c} className={`h-full min-w-0 flex-1 overflow-hidden ${c >= 3 ? 'hidden lg:block' : ''}`}>
            <div
              className="marquee-track flex flex-col gap-3"
              style={{
                animationName: c % 2 === 0 ? 'marquee-up' : 'marquee-down',
                animationDuration: `${DURATIONS[c % DURATIONS.length]}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            >
              {[0, 1].map((pass) =>
                col.map((r, i) => (
                  <div
                    key={`${pass}-${i}`}
                    className="rounded-xl border border-white/[.07] bg-white/[.035] px-4 py-4"
                  >
                    <div className="text-[11px] tracking-[.2em]" style={{ color: trustpilot.green }}>
                      ★★★★★
                    </div>
                    <p className="mt-2 text-[12.5px] leading-snug text-ink-3">{r.text}</p>
                    <p className="mt-2 text-[11px] text-ink-5">{r.name} · {r.date}</p>
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
