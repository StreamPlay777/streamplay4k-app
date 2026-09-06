/**
 * Single integration point for tag management and conversion tracking.
 * Leave IDs empty and nothing is injected — no tracking script is written
 * anywhere else in the codebase.
 */
export default {
  /** GTM container, e.g. "GTM-XXXXXXX". Preferred over hardcoding GA4. */
  gtmId: "",
  /** Only used if gtmId is empty and GA4 must load directly, e.g. "G-XXXXXXX". */
  ga4Id: "",
  /** Google Ads conversion account, e.g. "AW-XXXXXXXXX". */
  googleAdsId: "",

  /**
   * Conversion labels per event. Populate when the Ads account is wired up.
   * IMPORTANT: submit_order is a LEAD, not a purchase — payment happens
   * later, off-site, via invoice. Never map it to a purchase conversion.
   */
  conversionLabels: {
    submit_order: "",
    free_trial_click: ""
  },

  /** The event vocabulary the front-end is allowed to emit. */
  events: [
    "view_pricing",
    "select_plan",
    "begin_order",
    "phone_validated",
    "submit_order",
    "free_trial_click",
    "whatsapp_click"
  ],

  /** dataLayer variable name; matches assets/js/analytics.js. */
  dataLayerName: "dataLayer"
};
