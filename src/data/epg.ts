/**
 * Sample programme guide for the hero mockup.
 *
 * Illustrative listings, not a live feed — the point is to show what the app
 * looks like in use. Kept as data so a real EPG can be dropped in later
 * without touching the component.
 *
 * `span` is measured in half-hour slots.
 */

export interface Programme {
  title: string;
  span: number;
  live?: boolean;
}

export interface GuideRow {
  channel: string;
  /** Matches a logo slug in src/assets/logos where one exists. */
  logo: string;
  programmes: Programme[];
}

export const timeSlots = ['7:30', '8:00', '8:30', '9:00', '9:30', '10:00'];

/** The red now-line sits this far into the visible window, in slots. */
export const NOW_AT_SLOT = 1.35;

export const guide: GuideRow[] = [
  {
    channel: 'ESPN', logo: 'espn',
    programmes: [
      { title: 'SportsCenter', span: 1 },
      { title: 'NBA: Lakers @ Celtics', span: 3, live: true },
      { title: 'SportsCenter', span: 2 },
    ],
  },
  {
    channel: 'NBC', logo: 'nbc',
    programmes: [
      { title: 'Nightly News', span: 1 },
      { title: 'The Voice', span: 2, live: true },
      { title: 'Law & Order', span: 2 },
      { title: 'Tonight Show', span: 1 },
    ],
  },
  {
    channel: 'HBO', logo: 'hbo',
    programmes: [
      { title: 'Last Week Tonight', span: 1 },
      { title: 'The Last of Us', span: 2, live: true },
      { title: 'Succession', span: 3 },
    ],
  },
  {
    channel: 'CNN', logo: 'cnn',
    programmes: [
      { title: 'The Lead', span: 2 },
      { title: 'Anderson Cooper 360', span: 2, live: true },
      { title: 'CNN NewsNight', span: 2 },
    ],
  },
  {
    channel: 'FOX', logo: 'fox',
    programmes: [
      { title: 'The Simpsons', span: 1 },
      { title: 'NFL Postgame', span: 2, live: true },
      { title: 'Family Guy', span: 1 },
      { title: 'Bob’s Burgers', span: 2 },
    ],
  },
  {
    channel: 'Discovery', logo: 'discovery',
    programmes: [
      { title: 'Gold Rush', span: 2 },
      { title: 'Deadliest Catch', span: 2, live: true },
      { title: 'Expedition Unknown', span: 2 },
    ],
  },
  {
    channel: 'Cartoon Network', logo: 'cartoon-network',
    programmes: [
      { title: 'Teen Titans Go!', span: 1 },
      { title: 'Adventure Time', span: 2, live: true },
      { title: 'Regular Show', span: 3 },
    ],
  },
];
