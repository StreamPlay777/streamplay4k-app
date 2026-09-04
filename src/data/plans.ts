/**
 * Pricing terms and the shared plan state.
 *
 * PLACEHOLDER PRICES — $19 / $45 / $78 / $108 come from the design handoff.
 * The live Primo sites use a different ladder ($35 for 3 months, $65/year),
 * so these need the client's real StreamPlay4K figures before launch.
 * Changing `total` here updates the home pricing card, home step 01 and the
 * Pricing page together.
 */

export interface Term {
  months: number;
  label: string;
  /** Headline price for the whole term, at one simultaneous screen. */
  total: number;
  note: string;
  popular?: boolean;
}

export const terms: Term[] = [
  { months: 1, label: '1 month', total: 19, note: 'Standard' },
  { months: 3, label: '3 months', total: 45, note: 'Save $12' },
  { months: 6, label: '6 months', total: 78, note: 'Save $36' },
  { months: 12, label: '12 months', total: 108, note: 'Save $120', popular: true },
];

export const screenOptions = [1, 2, 3, 4] as const;

/** Each extra simultaneous screen adds 35% to the term total. */
export const SCREEN_UPLIFT = 0.35;

export function totalFor(term: Term, screens: number): number {
  return Math.round(term.total * (1 + (screens - 1) * SCREEN_UPLIFT));
}

export function perMonth(total: number, months: number): string {
  return (total / months).toFixed(2);
}

/** Struck-through list price — the "50% off" the badge advertises. */
export function listPrice(total: number): number {
  return total * 2;
}

export const DISCOUNT_BADGE = '50% OFF';

/** Twelve lines, shown on the features card beside the plan. */
export const includedFeatures = [
  '60,000+ live channels from 73 countries and regions',
  '180,000+ films and series on demand',
  'Full HD and 4K where the broadcaster provides it',
  'Live sport, news, kids and international TV',
  'Spanish-language networks included as standard',
  'Catch-up and a full seven-day programme guide',
  'Install on every device you own',
  'Anti-freeze US servers built for game day',
  'Works on Firestick, Android TV, Apple TV and smart TVs',
  'Login delivered by email the moment you pay',
  '24/7 live chat with a human',
  'Money-back guarantee, no questions asked',
];
