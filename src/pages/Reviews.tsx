import { Link } from 'react-router-dom';
import {
  trustpilot, featuredReviews, moreReviews, REVIEW_BADGE,
} from '../data/reviews';
import Stars from '../components/Stars';
import TrustpilotBadge from '../components/TrustpilotBadge';

/**
 * /reviews — the same real Trustpilot data as the homepage section.
 *
 * This page DOES show the rating breakdown, including the single 1-star
 * review. The homepage does not break the score down at all; neither page
 * re-weights it or hides it.
 */
export default function Reviews() {
  const dist = [
    { stars: 5, percent: trustpilot.distribution.fiveStar },
    { stars: 4, percent: trustpilot.distribution.fourStar },
    { stars: 3, percent: trustpilot.distribution.threeStar },
    { stars: 2, percent: trustpilot.distribution.twoStar },
    { stars: 1, percent: trustpilot.distribution.oneStar },
  ];

  return (
    <>
      <section className="px-5 pb-[46px] pt-[74px] sm:px-7">
        <div className="mx-auto max-w-shell">
          <div className="label-accent">Customer reviews</div>
          <h1
            className="mt-4 font-display font-extrabold leading-none text-ink"
            style={{ fontSize: 'clamp(34px, 6.5vw, 66px)' }}
          >
            Our customers
            <br />
            <span className="text-accent">say it best.</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-ink-3 sm:text-[18px]">
            See what customers are saying about their experience with Streamplay4k on Trustpilot.
            Our profile has been claimed since {trustpilot.claimedSince}.
          </p>
          <div className="mt-7">
            <TrustpilotBadge />
          </div>
        </div>
      </section>

      {/* Score + real distribution */}
      <section className="px-5 pb-14 sm:px-7">
        <div className="mx-auto grid max-w-shell gap-5 lg:grid-cols-[300px_1fr]">
          <div className="card grid place-items-center px-6 py-9 text-center">
            <div>
              <div className="font-display text-[64px] font-extrabold leading-none text-ink sm:text-[76px]">
                {trustpilot.rating}
              </div>
              <div className="mt-3 flex justify-center"><Stars /></div>
              <div className="mt-3 text-[14px] text-ink-3">{trustpilot.reviewCount} reviews on Trustpilot</div>
            </div>
          </div>

          <div className="card px-5 py-7 sm:px-7 sm:py-8">
            <div className="flex flex-col gap-3.5">
              {dist.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 sm:gap-4">
                  <span className="w-[44px] flex-none text-[13px] text-ink-3">{row.stars} star</span>
                  <div className="h-[9px] min-w-0 flex-1 overflow-hidden rounded-[5px] bg-white/[.07]">
                    <div className="h-full rounded-[5px] bg-accent" style={{ width: `${row.percent}%` }} />
                  </div>
                  <span className="nums w-11 flex-none text-right text-[12px] text-ink-3">{row.percent}%</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[12.5px] text-ink-5">
              Distribution as published on our Trustpilot profile.
            </p>
          </div>
        </div>
      </section>

      {/* Featured — quoted directly */}
      <section className="px-5 pb-12 sm:px-7">
        <div className="mx-auto max-w-shell">
          <h2 className="font-display text-[22px] font-extrabold text-ink">Recent reviews</h2>
          <ul className="mt-5 grid gap-4 md:grid-cols-3">
            {featuredReviews.map((r) => (
              <li key={r.name} className="card flex flex-col px-6 pb-6 pt-[26px]">
                <Stars value={r.stars} />
                <blockquote className="mt-3.5 flex-1 text-[15.5px] leading-relaxed text-ink-2">
                  “{r.quote}”
                </blockquote>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[.08] pt-4">
                  <span className="text-[12.5px] text-ink-4">{r.name} · {r.country} · {r.date}</span>
                  <span className="flex-none whitespace-nowrap rounded px-2 py-1 text-[9.5px] font-bold uppercase tracking-wide"
                        style={{ background: 'rgba(0,182,122,.14)', color: '#3FD9A8' }}>
                    {REVIEW_BADGE}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Summarised — deliberately not in quote marks */}
      <section className="px-5 pb-[100px] sm:px-7">
        <div className="mx-auto max-w-shell">
          <h2 className="font-display text-[22px] font-extrabold text-ink">More from Trustpilot</h2>
          <p className="mt-2 max-w-[620px] text-[14px] text-ink-4">
            Summaries of further reviews on our profile. Read them in full on Trustpilot.
          </p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {moreReviews.map((r) => (
              <li key={r.name} className="card px-5 py-5">
                <Stars value={r.stars} size={13} />
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink-2">{r.summary}</p>
                <p className="mt-3 text-[12.5px] text-ink-4">{r.name} · {r.date}</p>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link to="/pricing" className="btn-accent w-full sm:w-auto">View plans →</Link>
            <a
              href={trustpilot.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Read all Streamplay4k reviews on Trustpilot. Opens in a new tab."
              className="btn-outline w-full sm:w-auto"
            >
              Read all reviews
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
