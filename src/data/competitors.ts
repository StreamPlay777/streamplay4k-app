import { TERMS, quote } from './pricing';

/**
 * The cost-comparison basket — the stack a US household typically pays for.
 *
 * ⚠️ PUBLISHED LIST PRICES, AND THEY MOVE. These are the advertised US monthly
 * prices for each service at the date below. Streaming prices change several
 * times a year, and a comparison that drifts out of date stops being a fair
 * one — update `AS_OF` and the figures together, and keep the disclaimer
 * visible wherever this renders.
 *
 * Each entry carries the brand's own colour and its short mark, which is how
 * the reference presents them: a coloured tile with initials, not the
 * companies' actual logo artwork. That keeps it recognisable without
 * reproducing trade marks we have no licence to redistribute.
 */

export const AS_OF = 'September 2026';

export interface BasketItem {
  mark: string;
  name: string;
  /** Advertised monthly price in cents. */
  cents: number;
  bg: string;
  fg?: string;
}

export const basket: BasketItem[] = [
  { mark: 'YT',  name: 'YouTube TV Base Plan', cents: 8299, bg: '#FF0000' },
  { mark: 'NFL', name: 'NFL Sunday Ticket',    cents: 4000, bg: '#013369' },
  { mark: 'N',   name: 'Netflix Standard',     cents: 1999, bg: '#E50914' },
  { mark: 'MAX', name: 'HBO Max Standard',     cents: 1849, bg: '#0A5CD8' },
  { mark: 'D+',  name: 'Disney+ Premium',      cents: 1899, bg: '#0C204D' },
  { mark: 'P',   name: 'Peacock Premium',      cents: 1299, bg: '#6C2BD9' },
];

/** Every figure below is derived — nothing is typed in twice. */
export const basketMonthlyCents = basket.reduce((n, i) => n + i.cents, 0);
export const basketYearlyCents = basketMonthlyCents * 12;
export const paymentsPerYear = basket.length * 12 - 4; // annual passes bill once

/** Our best-value term, used as the thing being compared against. */
export const bestTerm = TERMS.reduce(
  (best, t) => (t.baseCents / t.months < best.baseCents / best.months ? t : best),
  TERMS[0],
);

const ourQuote = quote(bestTerm.id, 1);
export const ourYearlyCents = Math.round((ourQuote.totalCents / bestTerm.months) * 12);
export const ourMonthlyCents = Math.round(ourQuote.totalCents / bestTerm.months);

export const savedMonthlyCents = basketMonthlyCents - ourMonthlyCents;
export const savedYearlyCents = basketYearlyCents - ourYearlyCents;

export const receiptMeta = {
  customer: 'CUST 8842',
  card: '•••• 4471',
  barcodeRef: '4011 2026 8842 9',
};

export const smallPrint =
  `Based on published US list prices for these services, ${AS_OF}. ` +
  `Compared against a Streamplay4k ${bestTerm.label.toLowerCase()} plan at one device. ` +
  `Prices change — figures are illustrative.`;
