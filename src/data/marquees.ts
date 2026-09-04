/**
 * Marquee content — the network wall and the poster rails.
 *
 * NETWORK LOGOS: rendered as styled wordmark chips, not artwork. Do NOT scrape
 * broadcaster logos from competitor sites. When licensed marks are available
 * (network press/brand kits, the provider's own logo pack, or a CC0 set), swap
 * the chip contents for mono/white SVGs and confirm redistribution rights first.
 */

export const networksRowA = [
  'ESPN', 'CBS', 'NBC', 'ABC', 'FOX', 'TNT', 'USA', 'HBO', 'AMC', 'FX',
  'CNN', 'MSNBC', 'CNBC', 'DISCOVERY', 'NAT GEO', 'HISTORY', 'BRAVO', 'SYFY', 'TBS', 'PARAMOUNT',
];

export const networksRowB = [
  'NFL NETWORK', 'NBA TV', 'MLB NETWORK', 'FOX SPORTS', 'NBC SPORTS', 'CBS SPORTS', 'TSN', 'SPORTSNET',
  'SKY SPORTS', 'BEIN SPORTS', 'MBC', 'AL JAZEERA', 'BBC', 'ITV', 'CANAL+', 'ZDF', 'RAI', 'STAR SPORTS',
  'NICKELODEON', 'CARTOON NETWORK',
];

/** Poster rails on the on-demand section. Replace with real artwork at 2x (320x480). */
export const postersA = Array.from({ length: 10 }, (_, i) => `poster ${String(i + 1).padStart(2, '0')}`);
export const postersB = Array.from({ length: 10 }, (_, i) => `poster ${String(i + 11).padStart(2, '0')}`);

/** Six "why switch" cards. */
export const whySwitch = [
  { title: 'Anti-freeze on game day', body: 'Servers sized for the Sunday spike, so the picture holds when everyone in the country is watching the same kickoff.' },
  { title: 'Activated in minutes', body: 'No engineer, no install window, no box in the post. Your login is emailed the moment the payment clears.' },
  { title: 'One login, every screen', body: 'Install it on the TV, the tablet, the phone and the laptop. Pick how many play at once; install on as many as you like.' },
  { title: 'A guide that is actually right', body: 'A full seven-day EPG that matches what is really on, with catch-up so a late finish does not mean a missed game.' },
  { title: 'International, not an add-on', body: 'Arabic, Spanish, French, German, Italian and South Asian networks sit in the same subscription at no extra cost.' },
  { title: 'Humans on chat, 24/7', body: 'Live chat staffed around the clock by people who know the devices. Median first reply is under two minutes.' },
];

/**
 * Four device cards on the coverage section.
 *
 * `image` points at src/assets/devices/<file>. Supply the product photos as
 * transparent PNGs — run them through `python3 scripts/strip-bg.py` first to
 * knock out the white studio backdrop, otherwise they sit in a white box on
 * the dark page. Cards fall back to a labelled placeholder until then.
 */
export interface DeviceTile {
  name: string;
  note: string;
  /** Filename in src/assets/devices, or undefined to show the placeholder. */
  image?: string;
  /** Heading above the compatibility row. */
  brandLabel: string;
  brands: string[];
}

export const deviceTiles: DeviceTile[] = [
  {
    name: 'Smart TV',
    note: 'Samsung, LG, Philips and Android TV. Straight from the app store.',
    image: 'smart-tv.png',
    brandLabel: 'Compatible brands',
    brands: ['Samsung', 'LG', 'Philips', 'Android TV'],
  },
  {
    name: 'Phone',
    note: 'iOS and Android — watch where you want, when you want.',
    image: 'phone.png',
    brandLabel: 'Compatible brands',
    brands: ['Apple', 'Samsung', 'Google', 'Xiaomi'],
  },
  {
    name: 'Tablet',
    note: 'iPad, Samsung Galaxy Tab and Lenovo. Full screen, every app.',
    image: 'tablet.png',
    brandLabel: 'Compatible brands',
    brands: ['iPad', 'Samsung', 'Lenovo', 'Surface'],
  },
  {
    name: 'Computer',
    note: 'Windows, macOS and Linux — straight in the browser. No app needed.',
    image: 'laptop.png',
    brandLabel: 'Compatible systems',
    brands: ['Windows', 'macOS', 'Linux', 'ChromeOS'],
  },
];

export const coverageChecklist = [
  'Install on all your devices, one to four streams at a time',
  'Firestick, Android TV, smart TV, Apple TV, phone and computer',
  'Catch-up and a full seven-day guide on every device',
  'Set up in minutes — your login arrives by email',
];
