import { site } from './site';
import { MAX_DEVICES } from './pricing';

/**
 * StreamPlay4K against what a shopper commonly meets elsewhere.
 *
 * ── THE RULE THIS FILE FOLLOWS ────────────────────────────────────────────
 * Only facts about US that we publish and can be held to, and only
 * CHECKABLE claims about the market — never invented figures attributed to a
 * named rival.
 *
 * There are no competitor prices here, and no competitor names. We cannot
 * verify another provider's price, it changes without notice, and quoting one
 * we have not checked is both unfair and legally risky. What the right-hand
 * column describes is the pattern a shopper repeatedly runs into, phrased as
 * the general observation it is — never as a statement about any one company.
 *
 * Every value in the "us" column is derived from data/site.ts and
 * data/pricing.ts, so it cannot drift away from what the rest of the site
 * says. If the device cap or the refund window changes, this table changes
 * with it.
 */

export interface ComparisonRow {
  /** What is being compared. */
  label: string;
  /** Our answer. Short enough to read at a glance. */
  ours: string;
  /** What a shopper commonly meets. Deliberately hedged, because it is a
      general observation about a market, not a measurement of one company. */
  common: string;
  /** One line of substantiation, shown under the label. */
  note?: string;
}

export const comparisonRows: ComparisonRow[] = [
  {
    label: 'Devices on one plan',
    ours: `Up to ${MAX_DEVICES}`,
    common: 'Often one or two, with more sold separately',
    note: 'Chosen when you order, and the price is shown before you pay.',
  },
  {
    label: 'How long activation takes',
    ours: site.activationWindow,
    common: 'Anything from minutes to the next working day',
    note: 'Measured from payment confirmation, not from when you order.',
  },
  {
    label: 'Money-back window',
    ours: `${site.refundDays} days`,
    common: 'Frequently none, or store credit only',
    note: 'Written out in full in our Refund Policy, conditions included.',
  },
  {
    label: 'Support hours',
    ours: '24/7',
    common: 'Business hours, often one time zone',
    note: 'On WhatsApp, where a person answers rather than a ticket queue.',
  },
  {
    label: 'Contract',
    ours: 'None — one-time payment',
    common: 'Auto-renewing, cancel before the date to avoid the next charge',
    note: 'Nothing is stored to charge again. Your term ends when it ends.',
  },
  {
    label: 'Free trial',
    ours: 'Yes, arranged on WhatsApp',
    common: 'Sometimes, often card details first',
    note: 'No card, no form. Message us and we set one up.',
  },
  {
    label: 'Published business address',
    ours: 'Yes',
    common: 'Frequently absent',
    note: site.address,
  },
];

/**
 * Shown under the table. Says what the right-hand column is and is not, so a
 * reader is not left to assume we have surveyed anybody.
 */
export const comparisonDisclaimer =
  'The right-hand column describes what shoppers commonly encounter across this market. It is not a statement about any particular provider, and we have not audited anyone else. Providers differ — check the terms of whichever one you are considering, including ours.';
