/**
 * Section 05 — locked pricing data and the single calculation utility.
 *
 * Everything price-related reads from here. Do not re-derive a total anywhere
 * else: `quote()` is the one implementation, and the future backend must run
 * the same rule server-side rather than trusting any total the browser sends.
 *
 * Prices are held in integer cents. Doing the arithmetic in cents avoids the
 * float error that makes 59.985 land on 59.98 instead of 59.99, and makes the
 * half-up rounding on the extra-device amount exact.
 */

export interface Term {
  id: string;
  months: number;
  label: string;
  /** Base price in cents, for one device. */
  baseCents: number;
}

/** LOCKED — see spec §4 and §26. Do not edit without explicit approval. */
export const TERMS: Term[] = [
  { id: '3m', months: 3, label: '3 Months', baseCents: 3999 },
  { id: '6m', months: 6, label: '6 Months', baseCents: 6999 },
  { id: '12m', months: 12, label: '12 Months', baseCents: 9999 },
];

/** LOCKED — one device is included; each extra adds 50% of the base price. */
export const EXTRA_DEVICE_RATE = 0.5;
export const MAX_DEVICES = 5;
export const MIN_DEVICES = 1;
export const DEFAULT_TERM_ID = '12m';   // strongest value (spec §6)
export const DEFAULT_DEVICES = 1;

export interface Quote {
  term: Term;
  devices: number;
  baseCents: number;
  extraDevicesCents: number;
  totalCents: number;
  /** Total divided across the term, for the "≈ $x/mo" line. */
  perMonthCents: number;
}

/**
 * The single pricing calculation.
 *   total = base + (base × 0.5 × (devices − 1))
 * Rounded half-up to the nearest cent on the extra-device amount only.
 */
export function quote(termId: string, devices: number): Quote {
  const term = TERMS.find((t) => t.id === termId) ?? TERMS[0];
  const n = Math.min(MAX_DEVICES, Math.max(MIN_DEVICES, Math.round(devices)));

  const extraDevicesCents = Math.round(term.baseCents * EXTRA_DEVICE_RATE * (n - 1));
  const totalCents = term.baseCents + extraDevicesCents;

  return {
    term,
    devices: n,
    baseCents: term.baseCents,
    extraDevicesCents,
    totalCents,
    perMonthCents: Math.round(totalCents / term.months),
  };
}

/** Standard two-decimal currency formatting. */
export function money(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** Savings against the shortest term, only where it is factually positive. */
export function savingsPerMonth(term: Term): number {
  const shortest = TERMS[0];
  const baseline = shortest.baseCents / shortest.months;
  const thisRate = term.baseCents / term.months;
  return Math.max(0, Math.round(baseline - thisRate));
}

/**
 * Feature list for the "Included with every plan" panel (spec §9).
 *
 * NOTE — the two catalogue figures below come from spec §9, which states
 * 120,000+ for both. They disagree with src/data/site.ts (60,000+ channels /
 * 180,000+ titles) used by the hero and stat bar, and spec §26 forbids
 * changing catalogue figures. Flagged for a decision; whichever is correct
 * should end up in one place, not two.
 */
export const PLAN_FEATURES = [
  '120,000+ Live Channels',
  '120,000+ Movies & Series',
  'HD / FHD / 4K where available',
  'Sports, news, kids & international content',
  'Multi-device compatibility',
  'EPG / TV guide',
  'Fast activation',
  '24/7 support',
  '7-Day Money-Back Guarantee',
];

/** Trust points shown beside the order CTA (spec §10). */
export const TRUST_POINTS = [
  'Usually activated within 5–15 minutes',
  '7-Day Money-Back Guarantee',
  'Support available 24/7',
];

/**
 * Ways the invoice can be paid. No payment is taken on this site, so this list
 * is always labelled as invoice options — never as on-page checkout (§10).
 */
export const INVOICE_PAYMENT_METHODS = [
  'Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Link', 'PayPal',
];
