/**
 * StreamPlay4K Trustpilot data — the single source for every review figure and
 * quote on the site. Nothing here is invented.
 *
 * SNAPSHOT, NOT A LIVE FEED. Trustpilot ratings and counts move; these were
 * supplied by the owner from the profile below. Update `rating` and
 * `reviewCount` here when they change — they must never be typed into a
 * template. Nothing scrapes Trustpilot at runtime.
 *
 * TRUTHFULNESS RULES BAKED IN:
 *  - No review carries a "Verified" badge. Trustpilot shows these as
 *    "Unprompted review", which is not the same claim, so the badge reads
 *    "On Trustpilot".
 *  - Copy never states that every review is verified, or that all reviewers
 *    are paying customers.
 *  - The wall behind the section paraphrases real reviews rather than
 *    quoting words nobody wrote. Only the three featured cards quote
 *    directly, and only text supplied from the real profile.
 *  - The overall 4.7 is shown as-is. The profile also holds one 1-star
 *    review; the homepage does not break the score down, so nothing is
 *    hidden or re-weighted.
 */

export const trustpilot = {
  url: 'https://www.trustpilot.com/review/streamplay4k.com',
  rating: 4.7,
  reviewCount: 51,
  claimedSince: 'January 2026',
  /** Real distribution. Not shown on the homepage; available for /reviews. */
  distribution: {
    fiveStar: 92,
    fourStar: 6,
    threeStar: 0,
    twoStar: 0,
    oneStar: 2,
  },
  /** Trustpilot brand green, for the badge tile and stars. */
  green: '#00B67A',
} as const;

export interface FeaturedReview {
  name: string;
  country: string;
  date: string;
  stars: number;
  /** Verbatim excerpt from the real review. Do not embellish. */
  quote: string;
  /** What the review was about. Our own summary label, never presented as their words. */
  focus?: string;
}

/**
 * Three real 5-star reviews, quoted exactly as supplied by the owner from the
 * Trustpilot profile.
 *
 * Chosen for a spread of experience rather than three variations on "good
 * support": picture quality, breadth of content, and overall quality plus
 * service. Nothing here is embellished — where we know a reviewer praised
 * something else as well, that sits in `focus` rather than being written into
 * the quotation.
 *
 * The profile also holds one 1-star review. It is not shown in these featured
 * marketing cards, and the overall 4.7 above them is displayed unaltered, so
 * the score is never re-weighted or hidden.
 */
export const featuredReviews: FeaturedReview[] = [
  {
    name: 'Steve Murry',
    country: 'US',
    date: 'June 2026',
    stars: 5,
    quote: 'High quality picture, with no buffering!',
    focus: 'Picture quality and smooth streaming',
  },
  {
    name: 'Robert Baker',
    country: 'US',
    date: 'May 2026',
    stars: 5,
    quote: 'It has more content than I could ever watch.',
    focus: 'Content selection and value',
  },
  {
    name: 'Xavier',
    country: 'US',
    date: 'April 2026',
    stars: 5,
    quote: 'Great quality product and excellent customer service.',
    focus: 'Overall quality and support',
  },
];

export interface ReviewSummary {
  name: string;
  date: string;
  stars: number;
  /** Paraphrase of the real review. Deliberately not presented as a quote. */
  summary: string;
}

/**
 * Further real reviewers, summarised rather than quoted — we have their
 * sentiment, not their exact words, so nothing here is wrapped in quote marks.
 */
export const moreReviews: ReviewSummary[] = [
  { name: 'Derek', date: 'February 2026', stars: 5, summary: 'Praised the correspondence and quick changes to the channel list.' },
  { name: 'Stan', date: 'March 2026', stars: 5, summary: 'Praised the customer support.' },
  { name: 'Oscar Alfonso', date: 'February 2026', stars: 5, summary: 'Praised the service, the support and the lack of interruptions.' },
  { name: 'Robert Baker', date: 'May 2026', stars: 5, summary: 'Praised the amount of content, how easy it is to use, and the price.' },
  { name: 'Bench', date: 'April 2026', stars: 5, summary: 'Praised the professional support and the reliability.' },
  { name: 'MABstr', date: 'April 2026', stars: 5, summary: 'Praised the channel availability and help resolving a technical issue.' },
  { name: 'Peter Ogundolani', date: 'April 2026', stars: 5, summary: 'Left a short positive review.' },
  { name: 'Ricardo Rodríguez', date: 'April 2026', stars: 5, summary: 'Reported that his problem was solved quickly.' },
  { name: 'Jay', date: 'April 2026', stars: 5, summary: 'Reported no buffering or freezing, and recommended the service.' },
  { name: 'Xavier', date: 'April 2026', stars: 5, summary: 'Praised the product quality, the support and the response speed.' },
  { name: 'Altug', date: 'April 2026', stars: 5, summary: 'Praised the stream quality and the support response times.' },
];

/** Badge text. Never "Verified" — see the truthfulness note above. */
export const REVIEW_BADGE = 'On Trustpilot';
