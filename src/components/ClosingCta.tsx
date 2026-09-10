import { Link } from 'react-router-dom';
import { site, routes, trialUrl } from '../data/site';
import PosterWall from './PosterWall';
import { track } from '../lib/analytics';

/**
 * The closing call to action.
 *
 * The old version was a headline over a flat red glow — correct, and completely
 * silent about what is being sold. This puts the catalogue behind the words:
 * the drifting poster wall the site already uses, blurred and dimmed, so the
 * offer is made against the thing you would actually be watching.
 *
 * THE READABILITY PROBLEM, AND HOW IT IS SOLVED
 * Artwork behind display type is where sections like this usually fall apart —
 * a bright poster slides under a headline and the text disappears for two
 * seconds. Three layers keep that from happening, in this order:
 *
 *   1. the wall itself, already blurred and dimmed by the backdrop variant
 *   2. a vertical scrim, opaque at top and bottom so the section fuses into
 *      the pages above and below rather than starting with a hard edge
 *   3. a radial pool of the page's own ground directly behind the copy
 *
 * The result measures the same as the flat version behind every word, whatever
 * poster happens to be passing.
 *
 * `from` names the placement in the analytics event, so the homepage's closing
 * CTA and the pricing page's can be told apart.
 */
export default function ClosingCta({
  from,
  title,
  sub,
}: {
  from: string;
  title?: React.ReactNode;
  sub?: string;
}) {
  return (
    <section className="section-lead relative overflow-hidden bg-bg text-center">
      <PosterWall variant="backdrop" />

      {/* Scrim. Solid at the edges, translucent through the middle, so the wall
          shows without the section ever announcing where it starts. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, var(--scrim-solid) 0%, var(--scrim-heavy) 26%, var(--scrim-heavy) 74%, var(--scrim-solid) 100%)',
        }}
      />
      {/* Warmth low and centred, as before — the brand's own light on the wall. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 820px 420px at 50% 100%, rgba(255,43,32,.20), transparent 72%)' }}
      />

      <div className="relative mx-auto max-w-[760px]">
        {/* The pool that guarantees contrast under the copy itself. */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[130%] w-[125%] -translate-x-1/2 -translate-y-1/2"
          style={{ background: 'radial-gradient(ellipse at center, var(--scrim-solid) 30%, transparent 72%)' }}
          aria-hidden="true"
        />

        <p className="eyebrow">Start watching tonight</p>

        <h2
          className="mt-4 font-display font-extrabold leading-[1.02] text-ink"
          style={{ fontSize: 'clamp(34px, 5.5vw, 60px)' }}
        >
          {title ?? (
            <>
              Ready for a Simpler
              <br />
              <span className="text-grad">Way to Watch?</span>
            </>
          )}
        </h2>

        <p className="mx-auto mt-6 max-w-[540px] text-[18px] leading-relaxed text-ink-3">
          {sub ?? 'One subscription. Your favorite devices. Fast activation and support whenever you need it.'}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to={routes.pricing}
            onClick={() => track('view_pricing', { from })}
            className="btn-accent"
          >
            View plans →
          </Link>
          <a
            href={trialUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track('start_free_trial', { from })}
            className="btn-outline"
          >
            Start free trial
          </a>
        </div>

        <p className="mx-auto mt-7 max-w-[520px] text-[13px] leading-relaxed text-ink-4">
          {site.refundLabel} · Usually ready in {site.activationWindow} · 24/7 support
        </p>
      </div>
    </section>
  );
}
