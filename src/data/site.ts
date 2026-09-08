/**
 * Single source of truth for brand facts, headline figures and contact details.
 *
 * Every public-facing company fact lives here. Nothing else in the codebase may
 * hard-code a channel count, an activation window, a refund period, a phone
 * number or an email address — if you find one, it is a bug.
 *
 * Values below are the client-approved set from the final content brief. The
 * previous placeholders (60,000+ / 180,000+ channels, a 3–6 minute setup time
 * and the +1 305 555 0148 fiction-reserved number) have been removed.
 *
 * Device limits are NOT duplicated here: MAX_DEVICES lives in data/pricing.ts
 * next to the pricing engine that enforces it. Import it from there.
 */

export const site = {
  name: 'StreamPlay4K',
  legalName: 'StreamPlay4K',
  /** Absolute origin, no trailing slash. Used to build canonical and OG URLs. */
  url: 'https://streamplay4k.com',
  year: 2026,

  /* ── Catalogue ─────────────────────────────────────────────────────────── */
  channels: '120,000+',
  vod: '120,000+',

  /* ── Contact ───────────────────────────────────────────────────────────── */
  email: 'support@streamplay4k.com',
  /** Human-readable, for display. */
  whatsapp: '+33 6 75 73 41 32',
  /** Digits only, for wa.me links. */
  whatsappE164: '33675734132',
  whatsappUrl: 'https://wa.me/33675734132',

  /** Postal address, client-supplied. One line and a structured form, so the
      footer can print it inline and the legal pages can lay it out. */
  address: '1520 Bedford Ave, Brooklyn, NY 11216, USA',
  addressParts: {
    street: '1520 Bedford Ave',
    city: 'Brooklyn',
    region: 'NY',
    postalCode: '11216',
    country: 'USA',
    countryCode: 'US',
  },

  /* ── Service promises ──────────────────────────────────────────────────── */
  /** Short form, for inline use: "within {activationWindow}". */
  activationWindow: '5–15 minutes',
  /** The full approved sentence fragment. Never shorten this to "instantly". */
  activation: 'usually within 5–15 minutes after payment confirmation',
  refundDays: 7,
  /** Title-case, for badges and trust rows. */
  refundLabel: '7-Day Money-Back Guarantee',

  /* ── Setup ─────────────────────────────────────────────────────────────── */
  /** TODO(client): confirm before launch — carried over from the handoff. */
  downloaderCode: '481200',

  description:
    'StreamPlay4K brings live TV, sports, movies and series together across your favorite devices, with HD and 4K quality where available.',

  disclaimer:
    'StreamPlay4K is a reseller of IPTV subscription services. All content is supplied by third-party providers; users are responsible for compliance with applicable law.',
} as const;

/* ── Support presence ──────────────────────────────────────────────────────
 *
 * Drives the live dot on the WhatsApp pill. It exists so that "Support is
 * online" is a fact the site can check rather than a decoration.
 *
 * Support is genuinely staffed around the clock, so today the answer is always
 * yes. If that ever stops being true, set `alwaysOn` to false and fill in
 * `hours` — the indicator then follows the clock and says "Leave a message"
 * outside them, with no other change needed. Do not leave `alwaysOn` true for
 * a service that has closed: an indicator that is wrong once is worse than no
 * indicator at all, because it is the one thing on the page claiming to be
 * live information.
 */
export const support = {
  alwaysOn: true,
  /** How the coverage is described in copy. */
  label: '24/7',
  /** Only consulted when alwaysOn is false. Whole hours, UTC, [open, close). */
  hours: null as null | { openUtc: number; closeUtc: number },
} as const;

/** Whether support is available right now. */
export function supportOnline(now: Date = new Date()): boolean {
  if (support.alwaysOn) return true;
  if (!support.hours) return false;
  const h = now.getUTCHours();
  const { openUtc, closeUtc } = support.hours;
  // A window that wraps past midnight, e.g. 22:00 to 06:00.
  return openUtc <= closeUtc ? h >= openUtc && h < closeUtc : h >= openUtc || h < closeUtc;
}

/* ── Free trial ────────────────────────────────────────────────────────────
 *
 * The trial is arranged by hand over WhatsApp — there is no self-serve trial
 * to sign up for, so every "free trial" control opens a chat with the message
 * already written. Before this, all four of them pointed at the contact page,
 * which is a page about how to get in touch rather than a way to get a trial.
 *
 * `from` is carried in the analytics event, not in the message: a visitor
 * should not be made to send a string containing tracking data they did not
 * write. The text is what a person would reasonably type themselves.
 */
const TRIAL_MESSAGE = `Hi ${site.name}, I'm interested and I'd like to try the free trial.`;

export const trialUrl = `${site.whatsappUrl}?text=${encodeURIComponent(TRIAL_MESSAGE)}`;

/** A chat opened from somewhere other than the trial buttons. */
export function whatsappUrlWith(message: string): string {
  return `${site.whatsappUrl}?text=${encodeURIComponent(message)}`;
}

/** Stat strip under the hero. */
export const heroStats = [
  { value: site.channels, label: 'Live channels' },
  { value: site.vod, label: 'Movies & series' },
  { value: '24/7', label: 'Customer support' },
  { value: 'Up to 4K', label: 'Picture quality' },
] as const;

/* ── Routes ──────────────────────────────────────────────────────────────── */

/**
 * Canonical paths, with the trailing slash the pre-render step emits.
 * Import these instead of typing route strings, so a route rename is one edit.
 */
export const routes = {
  home: '/',
  pricing: '/pricing/',
  channels: '/channels/',
  setup: '/setup-guide/',
  reviews: '/reviews/',
  blog: '/blog/',
  about: '/about/',
  contact: '/contact/',
  faq: '/faq/',
  thankYou: '/thank-you/',
  terms: '/terms/',
  privacy: '/privacy-policy/',
  refund: '/refund-policy/',
  cookies: '/cookie-policy/',
  dmca: '/dmca/',
} as const;

/** Footer columns (brief §19). Every legal link resolves to a real page. */
export const footerLinks = {
  Product: [
    { label: 'Pricing', to: routes.pricing },
    { label: 'Channels', to: routes.channels },
    { label: 'Free trial', to: trialUrl, external: true, event: 'start_free_trial' },
    { label: 'Reviews', to: routes.reviews },
  ],
  Setup: [
    { label: 'Firestick', to: `${routes.setup}#firestick` },
    { label: 'Smart TV', to: `${routes.setup}#smart-tv` },
    { label: 'Android TV', to: `${routes.setup}#android-tv` },
    { label: 'Apple TV', to: `${routes.setup}#apple-tv` },
    { label: 'Mobile', to: `${routes.setup}#mobile` },
    { label: 'Computer', to: `${routes.setup}#computer` },
  ],
  Support: [
    { label: 'Setup guide', to: routes.setup },
    { label: 'FAQ', to: routes.faq },
    { label: 'Contact', to: routes.contact },
    { label: 'WhatsApp', to: site.whatsappUrl, external: true, event: 'whatsapp_click' },
    { label: site.email, to: `mailto:${site.email}`, external: true },
  ],
  Legal: [
    { label: 'Terms of Service', to: routes.terms },
    { label: 'Privacy Policy', to: routes.privacy },
    { label: 'Refund Policy', to: routes.refund },
    { label: 'Cookie Policy', to: routes.cookies },
    { label: 'DMCA / Copyright', to: routes.dmca },
  ],
} as const;

export interface NavLink {
  label: string;
  to: string;
  /** Opens the setup dropdown rather than navigating on click. */
  dropdown?: boolean;
}

/**
 * Desktop navigation. Six links, then the VIEW PLANS CTA.
 *
 * Home is listed explicitly as well as being the logo link: with six items the
 * bar reads as a full navigation rather than a logo plus a few pages, and a
 * visitor deep in the site should not have to know the logo is clickable.
 */
export const navLinks: NavLink[] = [
  { label: 'Home', to: routes.home },
  { label: 'Pricing', to: routes.pricing },
  { label: 'Channels', to: routes.channels },
  { label: 'Setup', to: routes.setup, dropdown: true },
  { label: 'Reviews', to: routes.reviews },
  { label: 'Blog', to: routes.blog },
];

/** Mobile drawer carries the fuller set the desktop bar deliberately omits. */
export const mobileNavLinks: NavLink[] = [
  { label: 'Home', to: routes.home },
  { label: 'Pricing', to: routes.pricing },
  { label: 'Channels', to: routes.channels },
  { label: 'Setup', to: routes.setup },
  { label: 'Reviews', to: routes.reviews },
  { label: 'Blog', to: routes.blog },
  { label: 'FAQ', to: routes.faq },
  { label: 'Contact', to: routes.contact },
];

/**
 * Setup dropdown rows. `hash` selects the device section on /setup-guide/,
 * and matches the ids in data/setup.ts.
 *
 * `icon` names a lucide glyph, resolved in Navbar.tsx. It replaces the old
 * two-letter codes (FT / AT / TV / AP / MB / PC), which needed decoding before
 * they meant anything.
 */
export type SetupIcon = 'cast' | 'monitor-play' | 'tv' | 'airplay' | 'smartphone' | 'laptop';

export const setupMenu: {
  hash: string; icon: SetupIcon; name: string; note: string;
}[] = [
  { hash: 'firestick',  icon: 'cast',         name: 'Firestick',      note: 'Amazon Fire TV — under 5 min' },
  { hash: 'android-tv', icon: 'monitor-play', name: 'Android TV',     note: 'Google TV, Shield, Android boxes' },
  { hash: 'smart-tv',   icon: 'tv',           name: 'Smart TV',       note: 'Samsung, LG and other smart TVs' },
  { hash: 'apple-tv',   icon: 'airplay',      name: 'Apple TV',       note: 'Apple TV 4K and HD' },
  { hash: 'mobile',     icon: 'smartphone',   name: 'Phone & tablet', note: 'iPhone, iPad and Android' },
  { hash: 'computer',   icon: 'laptop',       name: 'Computer',       note: 'Windows PC and Mac' },
];
