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
    { label: 'Free trial', to: routes.contact },
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
    { label: 'WhatsApp', to: site.whatsappUrl, external: true },
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
 * Desktop navigation (brief §15). Five links, then the VIEW PLANS CTA.
 * The logo is the Home link, so there is no separate "Home" item here.
 */
export const navLinks: NavLink[] = [
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
 */
export const setupMenu = [
  { code: 'FT', hash: 'firestick',  name: 'Firestick',       note: 'Amazon Fire TV — under 5 min' },
  { code: 'AT', hash: 'android-tv', name: 'Android TV',      note: 'Google TV, Shield, Android boxes' },
  { code: 'TV', hash: 'smart-tv',   name: 'Smart TV',        note: 'Samsung, LG and other smart TVs' },
  { code: 'AP', hash: 'apple-tv',   name: 'Apple TV',        note: 'Apple TV 4K and HD' },
  { code: 'MB', hash: 'mobile',     name: 'Phone & tablet',  note: 'iPhone, iPad and Android' },
  { code: 'PC', hash: 'computer',   name: 'Computer',        note: 'Windows PC and Mac' },
] as const;
