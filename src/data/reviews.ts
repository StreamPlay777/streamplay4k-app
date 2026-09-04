/**
 * PLACEHOLDER REVIEWS — names, cities and dates are invented and must be replaced
 * with the client's real verified reviews before launch. Publishing fabricated
 * testimonials as genuine is both misleading and, in the US, an FTC problem.
 */

export interface Review {
  title: string;
  body: string;
  name: string;
  location: string;
  date: string;
}

export const reviews: Review[] = [
  {
    title: 'Sunday football finally works',
    body: 'Three seasons of buffering on my old box and I had given up on watching live. Every game this year has run clean in 4K, even at kickoff when everyone is on at once.',
    name: 'Marcus D.', location: 'Columbus, OH', date: 'August 2026',
  },
  {
    title: 'Set up on the Firestick in five minutes',
    body: 'I am not technical at all. The Downloader code was on the site, the steps matched exactly what my TV showed, and I was watching before the coffee went cold.',
    name: 'Rhonda P.', location: 'Tucson, AZ', date: 'July 2026',
  },
  {
    title: 'Replaced four subscriptions',
    body: 'We were paying for cable plus three streaming apps. Cancelled all of them. The kids have their shows, my wife has her series, I have the games — one login.',
    name: 'Tomás R.', location: 'San Antonio, TX', date: 'August 2026',
  },
  {
    title: 'The guide is actually accurate',
    body: 'Every other service I tried had an EPG that was wrong or empty half the time. This one lines up with what is really on, and catch-up goes back a full week.',
    name: 'Angela W.', location: 'Portland, OR', date: 'June 2026',
  },
  {
    title: 'Support answered at 2am',
    body: 'Stream dropped in the middle of a fight night. Opened chat expecting a bot and got a person who had me back up in about four minutes. That is worth the money on its own.',
    name: 'Devin K.', location: 'Newark, NJ', date: 'August 2026',
  },
  {
    title: 'International channels my parents wanted',
    body: 'My folks wanted Arabic news and I wanted US sport. Same subscription covers both, and it works on their tablet and my TV at the same time.',
    name: 'Sami H.', location: 'Dearborn, MI', date: 'July 2026',
  },
  {
    title: 'No contract was the selling point',
    body: 'I signed up for one month fully expecting to cancel. Six months later I am on the annual plan. Nothing has gone wrong long enough for me to complain about.',
    name: 'Bethany L.', location: 'Raleigh, NC', date: 'May 2026',
  },
  {
    title: 'Works on everything in the house',
    body: 'Smart TV in the lounge, Firestick in the bedroom, phone on the train. Installed on all three, and the two-screen option covers what we actually use at once.',
    name: 'Greg M.', location: 'Denver, CO', date: 'August 2026',
  },
  {
    title: 'Picture quality is the real difference',
    body: 'I had cheaper IPTV before and the difference is obvious the moment you put them side by side. Proper 4K on the channels that carry it, and no pixel mush on motion.',
    name: 'Priya N.', location: 'Sunnyvale, CA', date: 'July 2026',
  },
];

/** Rating distribution bars on the Reviews page. */
export const distribution = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 15 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];
