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

import { site } from './site';

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
 * What every plan includes — client-approved list, used by the order panel.
 *
 * Split into two groups so the panel can give the catalogue figures more weight
 * than the rest, which is how someone actually scans this: the two numbers
 * first, then a checklist.
 *
 * The figures come from data/site.ts. Nothing here restates them.
 *
 * NOTE: "Anti-Freeze Technology" and "Ultra Fast Servers" are supplied by the
 * client as approved product copy. They were removed in an earlier pass as
 * unprovable performance claims and have been reinstated at the client's
 * explicit instruction.
 */
export const PLAN_HIGHLIGHTS = [
  { value: site.channels, label: 'Live TV Channels' },
  { value: site.vod, label: 'Movies & Series' },
] as const;

export const PLAN_FEATURES = [
  'Adult Channels Available',
  'Sports Packages (NFL, NBA, UFC, beIN, Sky Sports)',
  'International Channels',
  '4K + HDR Streaming',
  'Anti-Freeze Technology',
  'Ultra Fast Servers',
  'EPG (TV Guide Included)',
  'Works on Smart TV, Firestick, Android, iOS, PC & more',
  '24/7 Customer Support',
];

/** Trust points shown beside the order CTA (spec §10). */
export const TRUST_POINTS = [
  `Usually activated within ${site.activationWindow}`,
  site.refundLabel,
  'Support available 24/7',
];

/**
 * Ways the invoice can be paid. No payment is taken on this site, so this list
 * is always labelled as invoice options — never as on-page checkout (§10).
 */
export const INVOICE_PAYMENT_METHODS = [
  // Card schemes first, then wallets. Names must match the keys in
  // components/PaymentMarks.tsx — an unknown name renders nothing.
  'Visa', 'Mastercard', 'Apple Pay', 'Google Pay', 'Link', 'PayPal',
] as const;
