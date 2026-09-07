import { site } from './site';
import { MAX_DEVICES } from './pricing';

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

/**
 * Six benefit cards (brief §11).
 *
 * Unprovable performance claims were removed in the final content pass:
 * "anti-freeze on game day", "servers sized for the Sunday spike", "median
 * first reply under two minutes", guaranteed no-buffering, and "one login,
 * every screen" (which contradicted the selected-device model).
 */
export const whySwitch = [
  { title: 'Ready in Minutes', body: `Usually activated within ${site.activationWindow} after payment confirmation.` },
  { title: 'One Simple Subscription', body: 'Live TV, movies and series without juggling multiple entertainment subscriptions.' },
  { title: 'Made for Your Devices', body: 'Works across popular Smart TVs, streaming devices, phones, tablets and computers.' },
  { title: 'TV Guide Included', body: 'EPG support makes it easier to see what\u2019s on now and what\u2019s coming next.' },
  { title: 'Entertainment Worldwide', body: 'Explore international entertainment across countries, categories and languages.' },
  { title: 'Support When You Need It', body: 'Get help with setup and troubleshooting, 24/7.' },
];

/**
 * Four device cards on the coverage section.
 *
 * `image` points at src/assets/devices/<file> — transparent WebP, produced by
 * running the studio photo through `python3 scripts/strip-bg.py` (knocks out
 * the white backdrop) and saving as WebP for the alpha at a fraction of PNG
 * weight. Cards fall back to a labelled placeholder if a file is missing.
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
    image: 'smart-tv.webp',
    brandLabel: 'Compatible brands',
    brands: ['Samsung', 'LG', 'Philips', 'Android TV'],
  },
  {
    name: 'Phone',
    note: 'iOS and Android — watch where you want, when you want.',
    image: 'phone.webp',
    brandLabel: 'Compatible brands',
    brands: ['Apple', 'Samsung', 'Google', 'Xiaomi'],
  },
  {
    name: 'Tablet',
    note: 'iPad, Samsung Galaxy Tab and Lenovo. Full screen, every app.',
    image: 'tablet.webp',
    brandLabel: 'Compatible brands',
    brands: ['iPad', 'Samsung', 'Lenovo', 'Surface'],
  },
  {
    name: 'Computer',
    note: 'Windows, macOS and Linux — straight in the browser. No app needed.',
    image: 'laptop.webp',
    brandLabel: 'Compatible systems',
    brands: ['Windows', 'macOS', 'Linux', 'ChromeOS'],
  },
];

export const coverageChecklist = [
  `Choose up to ${MAX_DEVICES} devices with your plan`,
  'Firestick, Android TV, smart TV, Apple TV, phone and computer',
  'EPG / TV guide support on compatible players',
  `Login details arrive by email and WhatsApp, ${site.activation}`,
];
