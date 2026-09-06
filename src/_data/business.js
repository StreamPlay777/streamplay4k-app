/**
 * LOCKED business information — the single source of truth.
 * Do not duplicate these values in templates or import contradictory
 * figures from the previous website.
 */
export default {
  legalName: "StreamPlay4K",
  supportEmail: "support@streamplay4k.com",
  /** Internal-only inbox for new-order notifications. Never rendered publicly. */
  orderNotificationEmail: "hamzabrahim0852@gmail.com",

  phone: {
    /** Display format. */
    display: "+33 6 75 73 41 32",
    /** E.164, used for tel: and wa.me links. */
    e164: "+33675734132",
    whatsappNumber: "33675734132",
    whatsappUrl: "https://wa.me/33675734132"
  },

  reviews: {
    trustpilotUrl: "https://www.trustpilot.com/review/streamplay4k.com"
  },

  /** Service promises. Used by copy, FAQ and schema — keep consistent. */
  guarantees: {
    freeTrial: true,
    moneyBackDays: 7,
    activationTimeMin: 5,
    activationTimeMax: 15,
    activationTimeLabel: "5–15 minutes"
  },

  /**
   * Catalog marketing figures. These are the ONLY approved numbers.
   * `label` is what templates render.
   */
  catalog: {
    liveChannels: { value: 120000, label: "120,000+ Live Channels" },
    vod: { value: 120000, label: "120,000+ Movies & Series" }
  },

  /**
   * Invoice payment methods. Payment is NOT collected on the website —
   * an invoice is sent after the order request is submitted.
   */
  paymentMethods: [
    { id: "visa", label: "Visa" },
    { id: "mastercard", label: "Mastercard" },
    { id: "apple-pay", label: "Apple Pay" },
    { id: "google-pay", label: "Google Pay" },
    { id: "link", label: "Link" },
    { id: "paypal", label: "PayPal" }
  ],

  /** Populate as real profiles exist; empty entries are not rendered. */
  social: {
    facebook: "",
    instagram: "",
    x: "",
    youtube: "",
    tiktok: ""
  }
};
