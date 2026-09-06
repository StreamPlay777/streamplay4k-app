/**
 * Analytics events for the pricing/order flow (spec §20).
 *
 * There is no analytics provider wired into this project yet, so this is a thin
 * seam: it pushes to window.dataLayer when a tag manager is present and is a
 * no-op otherwise. Point `track` at the real provider when one is chosen —
 * nothing else needs to change.
 *
 * Deliberately absent: `purchase`. No payment is taken on this site, so
 * emitting a purchase event would corrupt revenue reporting (§20).
 */

export type OrderEvent =
  | 'select_plan'
  | 'select_devices'
  | 'begin_order'
  | 'phone_validated'
  | 'submit_order'
  | 'order_submit_success';

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function track(event: OrderEvent, payload: Record<string, unknown> = {}): void {
  try {
    window.dataLayer?.push({ event, ...payload });
  } catch {
    // Analytics must never break the order flow.
  }
}
