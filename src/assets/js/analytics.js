/**
 * Analytics façade.
 *
 * The only place the site talks to a tag manager. Components call
 * `track("select_plan", { plan_id: "12-months" })` and never touch
 * window.dataLayer or gtag directly.
 *
 * Nothing here loads a script — GTM/GA4 injection is handled once in
 * _includes/partials/analytics.njk from _data/analytics.js.
 *
 * NOTE: `submit_order` is a LEAD event. Payment is collected off-site by
 * invoice, so it must never be mapped to a purchase conversion.
 */

const DATA_LAYER = "dataLayer";

/** Events the front-end is allowed to emit. Mirrors _data/analytics.js. */
export const ALLOWED_EVENTS = [
  "view_pricing",
  "select_plan",
  "begin_order",
  "phone_validated",
  "submit_order",
  "free_trial_click",
  "whatsapp_click"
];

export function track(event, params = {}) {
  if (!event) return;

  if (!ALLOWED_EVENTS.includes(event)) {
    if (document.documentElement.dataset.env !== "production") {
      console.warn(`[analytics] unknown event "${event}" — add it to _data/analytics.js first.`);
    }
    return;
  }

  window[DATA_LAYER] = window[DATA_LAYER] || [];
  window[DATA_LAYER].push({ event, ...params });
}

/**
 * Wires declarative tracking: any element carrying data-sp-event fires on
 * click, with data-sp-event-* attributes passed through as parameters.
 *
 *   <a href="..." data-sp-event="whatsapp_click" data-sp-event-location="footer">
 */
export function bindDeclarativeEvents(root = document) {
  root.addEventListener("click", (evt) => {
    const el = evt.target.closest("[data-sp-event]");
    if (!el) return;

    const params = {};
    for (const [key, value] of Object.entries(el.dataset)) {
      if (key.startsWith("spEvent") && key !== "spEvent") {
        const name = key.slice(7).replace(/([A-Z])/g, "_$1").toLowerCase().replace(/^_/, "");
        params[name] = value;
      }
    }

    track(el.dataset.spEvent, params);
  });
}
