import { wallSnippets } from '../data/trustpilot';
import { reviews } from '../data/reviews';

/**
 * Blurred wall of review snippets, sitting behind the reviews section.
 *
 * Purely atmospheric and hidden from screen readers — the cards in front carry
 * the real content. Built as drifting columns for the same reason as the poster
 * wall: a still backdrop behind moving foreground reads as a printed sheet.
 */

const COLUMNS = 5;
const VISIBLE_SM = 2;
const VISIBLE_MD = 3;
const DURATIONS = [64, 78, 58, 84, 70];

/** Longer lines mixed in so the wall does not read as one uniform texture. */
const POOL = [
  ...wallSnippets,
  ...reviews.map((r) => r.body.slice(0, 96) + '…'),
];

export default function ReviewWall() {
  const per = 6;
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from({ length: per }, (_, r) => POOL[(c * per + r) % POOL.length]),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 select-none overflow-hidden"
      style={{ filter: 'blur(2.5px)', opacity: 0.75 }}
    >
      <div className="absolute left-1/2 top-1/2 flex h-[190%] w-[118%] -translate-x-1/2 -translate-y-1/2 gap-3">
        {columns.map((col, c) => (
          <div
            key={c}
            className={`h-full min-w-0 flex-1 overflow-hidden ${
              c >= VISIBLE_MD ? 'hidden lg:block' : c >= VISIBLE_SM ? 'hidden sm:block' : ''
            }`}
          >
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
                col.map((text, r) => (
                  <div
                    key={`${pass}-${r}`}
                    className="rounded-xl border border-white/[.07] bg-white/[.035] px-4 py-4"
                  >
                    <div className="text-[11px] tracking-[.2em]" style={{ color: '#00B67A' }}>★★★★★</div>
                    <p className="mt-2 text-[12.5px] leading-snug text-ink-3">“{text}”</p>
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
