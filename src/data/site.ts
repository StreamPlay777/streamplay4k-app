/**
 * Single source of truth for brand facts, headline figures and contact details.
 *
 * PLACEHOLDERS — every figure below is from the design handoff and is pending the
 * client's real numbers. Country channel counts and the 73-region / 8,308-in-4K
 * figures are carried over from the live Primo line-up. Swap these and the whole
 * site updates; nothing else hard-codes a number.
 */

export const site = {
  name: 'Streamplay4k',
  legalName: 'Streamplay4k',
  year: 2026,

  // Headline figures
  channels: '60,000+',
  vod: '180,000+',
  countries: 73,
  uhdChannels: '8,308',
  catchUpHours: 24,
  rating: 4.8,
  reviewCount: '2,412',

  // Support
  email: 'support@streamplay4k.com',
  whatsapp: '+1 305 555 0148',
  downloaderCode: '481200',
  setupTime: '3–6 minutes',

  description:
    'Premium IPTV for the United States. Live TV, sport, films, series and on-demand entertainment in HD and 4K.',

  disclaimer:
    'Streamplay4k is a reseller of IPTV subscription services. All content is supplied by third-party providers; users are responsible for compliance with applicable law.',
} as const;

/** Stat bar under the hero — solid accent, four equal columns. */
export const heroStats = [
  { value: site.channels, label: 'Live channels' },
  { value: site.vod, label: 'Movies & series' },
  { value: '24/7', label: 'Live support' },
  { value: 'HD · 4K', label: 'Quality' },
] as const;

export const paymentMethods = ['VISA', 'MASTERCARD', 'AMEX', 'PAYPAL', 'APPLE PAY', 'GOOGLE PAY'] as const;
export const footerPayments = ['VISA', 'MC', 'AMEX', 'PAYPAL'] as const;

export const footerLinks = {
  Product: [
    { label: 'Pricing', to: '/pricing' },
    { label: 'Setup guide', to: '/setup' },
    { label: 'Channel list', to: '/channels' },
    { label: 'Reviews', to: '/reviews' },
    { label: 'Contact', to: '/contact' },
  ],
  Support: [
    { label: 'FAQs', to: '/#faq' },
    { label: 'Live chat', to: '/contact' },
    { label: 'Service status', to: '/contact' },
    { label: 'Refund policy', to: '/contact' },
    { label: 'Contact', to: '/contact' },
  ],
  Legal: [
    { label: 'Terms of service', to: '/contact' },
    { label: 'Privacy policy', to: '/contact' },
    { label: 'Cookie policy', to: '/contact' },
    { label: 'DMCA', to: '/contact' },
  ],
} as const;

/** Nav — the six pages, with Setup guide opening a dropdown instead of navigating. */
export interface NavLink {
  label: string;
  to: string;
  /** Opens the setup dropdown rather than navigating on click. */
  dropdown?: boolean;
}

export const navLinks: NavLink[] = [
  { label: 'Home', to: '/' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'Setup guide', to: '/setup', dropdown: true },
  { label: 'Channel list', to: '/channels' },
  { label: 'Reviews', to: '/reviews' },
  { label: 'Contact', to: '/contact' },
];

/** Rows of the Setup guide nav dropdown. */
export const setupMenu = [
  { code: 'FT', name: 'Firestick', note: 'Amazon Fire TV — under 5 min' },
  { code: 'AT', name: 'Android TV', note: 'Google TV, Shield, Android boxes' },
  { code: 'TV', name: 'Smart TV', note: 'Samsung, LG and other smart TVs' },
  { code: 'AP', name: 'Apple TV', note: 'Apple TV 4K and HD' },
  { code: 'MB', name: 'Phone & tablet', note: 'iPhone, iPad and Android' },
  { code: 'PC', name: 'Computer', note: 'Windows PC and Mac' },
] as const;
