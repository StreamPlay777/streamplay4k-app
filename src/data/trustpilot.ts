/**
 * Trustpilot profile details and review content.
 *
 * ⚠️ PLACEHOLDER DATA — REPLACE BEFORE LAUNCH
 *
 * `rating` and `reviewCount` below are carried over from the design handoff.
 * They are NOT read from Trustpilot, and publishing a score that does not match
 * the live profile is both misleading and a breach of Trustpilot's terms.
 *
 * The reviews in src/data/reviews.ts are likewise written copy, not real
 * customer reviews. For that reason the wording here says the profile is on
 * Trustpilot — it does NOT claim each quote is a verified Trustpilot review,
 * which would be a false statement while the content is invented.
 *
 * To make this real: pull the score and reviews from the Trustpilot Business
 * API (or paste the genuine ones in), and only then switch the copy to claim
 * verification.
 */

export const trustpilot = {
  profileUrl: 'https://www.trustpilot.com/review/streamplay4k.com',
  /** PLACEHOLDER — must match the live profile. */
  rating: 4.8,
  /** PLACEHOLDER — must match the live profile. */
  reviewCount: 2412,
  /** Trustpilot brand green, for the badge tile and stars. */
  green: '#00B67A',
} as const;

/**
 * Short lines used only in the blurred wall behind the section. They are never
 * read at full size, so they carry atmosphere rather than claims.
 */
export const wallSnippets = [
  'Quick and easy.', 'Love it. Thanks.', 'The price was good.',
  'It actually works and no issues.', 'All working well, easy setup.',
  'Instant reply, sorted in minutes.', 'Great service. Prompt responses.',
  'Fast response for trial. Easy set up.', 'Excellent channel selection.',
  'No buffering on the football at all.', 'Set up on my Firestick in minutes.',
  'Picture quality is genuinely 4K.', 'Support answered at 2am.',
  'Replaced four subscriptions with one.', 'The guide is actually accurate.',
  'Works on every screen in the house.', 'Cancelled cable, no regrets.',
  'Kids channels all there for my two.', 'Arabic and US channels together.',
  'Signed up for a month, still here.', 'Best value I have found.',
  'Sorted my Smart TV over chat.', 'Sport in 4K, no drop-outs.',
  'Login arrived within minutes.', 'Painless from start to finish.',
  'Everything I was promised.', 'Second year with them now.',
  'Straightforward and it just works.',
];
