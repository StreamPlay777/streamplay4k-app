/**
 * Centralised navigation. The header/footer components render from this —
 * the final header design lands in a later prompt, the data does not change.
 */
export default {
  primary: [
    { label: "Home", url: "/" },
    { label: "Pricing", url: "/pricing/" },
    { label: "Channels", url: "/channels/" },
    {
      label: "Setup Guide",
      url: "/setup-guide/",
      /** Deep links into the single interactive setup page (hash-driven). */
      children: [
        { label: "Firestick", url: "/setup-guide/#firestick" },
        { label: "Smart TV", url: "/setup-guide/#smart-tv" },
        { label: "Android TV", url: "/setup-guide/#android-tv" },
        { label: "Apple TV", url: "/setup-guide/#apple-tv" },
        { label: "Mobile", url: "/setup-guide/#mobile" },
        { label: "Computer", url: "/setup-guide/#computer" }
      ]
    },
    { label: "Reviews", url: "/reviews/" },
    { label: "Blog", url: "/blog/" },
    { label: "FAQs", url: "/faq/" },
    { label: "Contact", url: "/contact/" }
  ],

  /** Visually separated from the nav list. */
  ctas: {
    primary: { label: "View Plans", url: "/pricing/", variant: "primary" },
    secondary: { label: "Start Free Trial", url: "/free-trial/", variant: "secondary" }
  },

  footer: [
    {
      heading: "Service",
      links: [
        { label: "Pricing", url: "/pricing/" },
        { label: "Channels", url: "/channels/" },
        { label: "Free Trial", url: "/free-trial/" },
        { label: "Setup Guide", url: "/setup-guide/" }
      ]
    },
    {
      heading: "Company",
      links: [
        { label: "About", url: "/about/" },
        { label: "Reviews", url: "/reviews/" },
        { label: "Blog", url: "/blog/" },
        { label: "Contact", url: "/contact/" }
      ]
    },
    {
      heading: "Support",
      links: [
        { label: "FAQs", url: "/faq/" },
        { label: "Setup Guide", url: "/setup-guide/" }
      ]
    }
  ],

  legal: [
    { label: "Privacy Policy", url: "/privacy-policy/" },
    { label: "Terms", url: "/terms/" },
    { label: "Refund Policy", url: "/refund-policy/" },
    { label: "Cookie Policy", url: "/cookie-policy/" },
    { label: "DMCA", url: "/dmca/" }
  ]
};
