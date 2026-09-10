import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaign, campaignCta, isLive, remaining, remainingLabel } from '../data/campaign';
import { track } from '../lib/analytics';

/**
 * The seasonal offer banner, above the navbar.
 *
 * Renders nothing at all unless data/campaign.ts holds a live campaign, so the
 * common case costs one boolean and no markup.
 *
 * THE COUNTDOWN IS REAL. It counts to one fixed instant that every visitor
 * shares — see the note in data/campaign.ts for why it is not the usual
 * per-visitor timer. Because it is real, it can reach zero: when it does the
 * banner removes itself on the next tick rather than rolling over.
 *
 * Server-rendered pages get the banner but not the digits — the pre-render
 * runs at build time, and a countdown baked into static HTML would show
 * whatever was true when the site was built until JavaScript replaced it. The
 * digits appear on the first tick after mount; until then the readable
 * "3 days, 4 hours left" carries the same information.
 */
export default function CampaignBanner() {
  const [now, setNow] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!campaign) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    try { setDismissed(sessionStorage.getItem('sp-campaign') === campaign?.id); } catch { /* private mode */ }
  }, []);

  // Bound to a local before the guard: narrowing a module-level import does
  // not survive into the closures below, and the callbacks need it non-null.
  const c = campaign;

  // now === null on the server and on the very first client render, where we
  // have no clock yet; the build-time check is the honest fallback.
  if (!isLive(c, now ?? undefined) || dismissed) return null;

  const left = remaining(c.endsAt, now ?? undefined);
  const label = remainingLabel(left);
  const ticking = now !== null;

  const close = () => {
    setDismissed(true);
    try { sessionStorage.setItem('sp-campaign', c.id); } catch { /* private mode */ }
  };

  return (
    <div className="campaign-bar relative z-[61] px-4 py-2.5 text-center sm:px-6">
      <div className="mx-auto flex max-w-shell flex-wrap items-center justify-center gap-x-3 gap-y-1.5 pr-8 sm:pr-10">
        <p className="font-display text-[13px] font-bold text-white sm:text-[13.5px]">
          {c.headline}
        </p>

        {c.code && (
          <span className="nums rounded-md bg-white/20 px-2 py-[3px] text-[11.5px] font-bold tracking-[.08em] text-white">
            {c.code}
          </span>
        )}

        {/* The digits are decorative to a screen reader: read out they are
            noise, and aria-live on them would announce every second. The
            readable label beside them is the exposed version, always present
            and always hidden visually, so exactly one of the two is announced. */}
        <span className="nums text-[12.5px] text-white/85" aria-hidden="true">
          {ticking
            ? `${left.days}d ${String(left.hours).padStart(2, '0')}h ${String(left.minutes).padStart(2, '0')}m ${String(left.seconds).padStart(2, '0')}s left`
            : label}
        </span>
        <span className="sr-only">{label}</span>

        <Link
          to={campaignCta.to}
          onClick={() => track('view_pricing', { from: 'campaign-banner', campaign: c.id })}
          className="text-[12.5px] font-bold text-white underline underline-offset-[3px] hover:text-white/80"
        >
          {campaignCta.label}
        </Link>
      </div>

      {c.detail && (
        <p className="mx-auto mt-1 max-w-[560px] text-[11.5px] text-white/75">{c.detail}</p>
      )}

      <button
        type="button"
        onClick={close}
        aria-label="Dismiss offer"
        className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-white/70 transition-colors hover:bg-white/15 hover:text-white sm:right-4"
      >
        <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 4l8 8M12 4l-8 8" />
        </svg>
      </button>
    </div>
  );
}
