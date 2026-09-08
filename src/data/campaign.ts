import { site } from './site';

/**
 * Seasonal offers and the deadline banner.
 *
 * ── HOW TO RUN A PROMOTION ────────────────────────────────────────────────
 * Fill in `campaign` below and deploy. Set it back to `null` to end one.
 * Nothing else in the codebase needs touching, and when it is null the banner,
 * the countdown and every trace of the offer are absent from the markup — not
 * hidden with CSS, not rendered empty.
 *
 * ── WHY THE DEADLINE IS REAL ──────────────────────────────────────────────
 * `endsAt` is one fixed instant, shared by every visitor. It is deliberately
 * NOT "48 hours from when you arrived", which is the usual pattern: that timer
 * restarts for each person, restarts again when they clear their cookies, and
 * never actually expires. People recognise it, and in a category where buyers
 * are already asking themselves whether a site is honest, being caught faking
 * a deadline costs more than the urgency was worth.
 *
 * The consequence is that a real deadline passes. When it does the banner
 * disappears on its own rather than quietly rolling over to a new one — so an
 * expired campaign is invisible, not embarrassing.
 *
 * ── WHAT THIS DOES NOT DO ─────────────────────────────────────────────────
 * It does not change prices. quote() in data/pricing.ts remains the only
 * source of what anything costs. A campaign is an announcement plus a code the
 * customer quotes when they order; honouring it happens in the invoice, not on
 * this page. That keeps the published total and the total on the invoice from
 * ever disagreeing because a banner was left switched on.
 */

export interface Campaign {
  /** Short name, for analytics and for you. Not shown. */
  id: string;
  /** The line people read. Keep it to what the offer actually is. */
  headline: string;
  /** One clause of detail, or omit. */
  detail?: string;
  /** The code to quote when ordering, if there is one. */
  code?: string;
  /** ISO 8601 with an offset, e.g. '2026-12-26T23:59:59-05:00'. One instant,
      the same for everyone. Use the offset for the timezone you run on. */
  endsAt: string;
}

/**
 * The live campaign, or null.
 *
 * TODO(client): supply an offer and a real end date. Left null on purpose —
 * a countdown with no campaign behind it is exactly the thing this file exists
 * to avoid.
 *
 * Example of a filled-in one:
 *
 *   export const campaign: Campaign | null = {
 *     id: 'holiday-2026',
 *     headline: 'Holiday offer — 12 months at the 6-month price',
 *     detail: 'Quote the code when you order and we apply it to your invoice.',
 *     code: 'HOLIDAY26',
 *     endsAt: '2026-12-26T23:59:59-05:00',
 *   };
 */
export const campaign: Campaign | null = null;

/** True while the campaign is running. Re-checked as the countdown ticks. */
export function isLive(c: Campaign | null, now: number = Date.now()): c is Campaign {
  if (!c) return false;
  const ends = Date.parse(c.endsAt);
  return Number.isFinite(ends) && ends > now;
}

export interface Remaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

/** Time left, floored at zero. */
export function remaining(endsAt: string, now: number = Date.now()): Remaining {
  const total = Math.max(0, Date.parse(endsAt) - now);
  const s = Math.floor(total / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    total,
  };
}

/** "3 days, 4 hours left" — for screen readers and the no-JS fallback. */
export function remainingLabel(r: Remaining): string {
  if (r.total <= 0) return 'This offer has ended';
  if (r.days > 0) return `${r.days} ${r.days === 1 ? 'day' : 'days'}, ${r.hours} ${r.hours === 1 ? 'hour' : 'hours'} left`;
  if (r.hours > 0) return `${r.hours} ${r.hours === 1 ? 'hour' : 'hours'}, ${r.minutes} ${r.minutes === 1 ? 'minute' : 'minutes'} left`;
  return `${r.minutes} ${r.minutes === 1 ? 'minute' : 'minutes'} left`;
}

/** Where the banner's button goes. */
export const campaignCta = { label: 'See plans', to: '/pricing/' } as const;

/** Used in the banner's own copy so the brand name is never typed twice. */
export const campaignBrand = site.name;
