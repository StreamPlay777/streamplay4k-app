import { featuredReviews, REVIEW_BADGE, type FeaturedReview } from '../data/reviews';
import Stars from './Stars';

/**
 * The three real featured reviews.
 *
 * Desktop: raised white cards, the outer two tilted, centre straight.
 * Mobile: a scroll-snap carousel — three tilted desktop cards squeezed onto a
 * phone is unreadable, and a carousel scrolls inside itself without ever
 * pushing the page sideways.
 *
 * Badge reads "On Trustpilot", not "Verified": Trustpilot lists these as
 * unprompted reviews, which is a different claim, and we have no verification
 * data to stand behind the stronger word.
 */

const TILT = ['lg:-rotate-[4deg]', 'lg:rotate-[1deg]', 'lg:rotate-[4deg]'];
const LIFT = ['lg:translate-y-4', 'lg:-translate-y-3', 'lg:translate-y-5'];

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

function Card({ r, i }: { r: FeaturedReview; i: number }) {
  return (
    <article
      className={`w-[86vw] max-w-[340px] flex-none snap-center rounded-2xl bg-white p-5
                  text-[#14161C] shadow-[0_28px_70px_rgba(0,0,0,.6)] sm:w-[340px] sm:p-6
                  lg:w-auto lg:flex-1 ${TILT[i]} ${LIFT[i]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <Stars value={r.stars} />
        <span className="text-[10.5px] font-bold uppercase tracking-[.1em] text-[#6E6A61]">
          Trustpilot
        </span>
      </div>

      <blockquote className="mt-4 font-display text-[16px] font-bold leading-snug sm:text-[17.5px]">
        “{r.quote}”
      </blockquote>

      <div className="mt-5 flex items-center gap-3 border-t border-black/10 pt-4">
        <span
          className="grid h-9 w-9 flex-none place-items-center rounded-md bg-accent-gradient-diag text-[12px] font-bold text-white"
          aria-hidden="true"
        >
          {initials(r.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-display text-[14px] font-bold">{r.name}</span>
          <span className="block font-mono text-[11px] text-[#6E6A61]">
            {r.country} · {r.date}
          </span>
        </span>
        <span
          className="flex-none whitespace-nowrap rounded px-2 py-1 text-[9.5px] font-bold uppercase tracking-wide"
          style={{ background: 'rgba(0,182,122,.12)', color: '#04795A' }}
        >
          {REVIEW_BADGE}
        </span>
      </div>
    </article>
  );
}

export default function TrustCards() {
  return (
    <>
      {/* Phone / tablet: swipeable, scrolls inside itself */}
      <ul
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:hidden"
        style={{ scrollbarWidth: 'none' }}
      >
        {featuredReviews.map((r, i) => (
          <li key={r.name} className="flex">
            <Card r={r} i={i} />
          </li>
        ))}
      </ul>
      <p className="mt-1 text-center text-[12px] text-ink-5 lg:hidden" aria-hidden="true">
        Swipe for more →
      </p>

      {/* Desktop: three raised cards */}
      <ul className="hidden items-center justify-center gap-5 lg:flex">
        {featuredReviews.map((r, i) => (
          <li key={r.name} className="flex max-w-[340px] flex-1">
            <Card r={r} i={i} />
          </li>
        ))}
      </ul>
    </>
  );
}
