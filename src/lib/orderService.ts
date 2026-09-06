import { quote, money } from '../data/pricing';

/**
 * Order submission seam (spec §15).
 *
 * No payment is taken here. The customer submits an order request; invoice and
 * payment instructions follow by email and WhatsApp.
 *
 * The production endpoint (POST /api/order) does not exist yet. Rather than
 * fake a success, this module reports plainly which mode it ran in, and the UI
 * says so in development. The internal notification address stays server-side —
 * it is deliberately absent from this file and from anything the browser ships.
 */

export interface OrderPayload {
  planId: string;
  termMonths: number;
  /** Cents, for the server to check its own recalculation against. */
  basePrice: number;
  deviceCount: number;
  total: number;
  phone: string;
  email: string;
  sourcePage: string;
  timestamp: string;
  campaign: CampaignMeta;
}

export interface CampaignMeta {
  campaignId?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export type OrderResult =
  | { ok: true; orderId: string; mock: boolean }
  | { ok: false; error: string };

/** Reads campaign context from the URL. All fields optional (spec §24). */
export function readCampaign(search = window.location.search): CampaignMeta {
  const p = new URLSearchParams(search);
  const pick = (k: string) => p.get(k)?.slice(0, 120) || undefined;
  return {
    campaignId: pick('campaignId'),
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
    utm_content: pick('utm_content'),
    utm_term: pick('utm_term'),
  };
}

export function buildPayload(
  termId: string,
  devices: number,
  phone: string,
  email: string,
): OrderPayload {
  const q = quote(termId, devices);
  return {
    planId: q.term.id,
    termMonths: q.term.months,
    basePrice: q.baseCents,
    deviceCount: q.devices,
    total: q.totalCents,
    phone: phone.trim(),
    email: email.trim().toLowerCase(),
    sourcePage: window.location.pathname,
    timestamp: new Date().toISOString(),
    campaign: readCampaign(),
  };
}

const ENDPOINT = import.meta.env.VITE_ORDER_ENDPOINT ?? '/api/order';

/** True while no real endpoint is configured — the UI surfaces this. */
export const IS_MOCK = !import.meta.env.VITE_ORDER_ENDPOINT;

export async function submitOrder(payload: OrderPayload): Promise<OrderResult> {
  // Development / preview: acknowledge locally and say so. Never presented as
  // a real submission (spec §15).
  if (IS_MOCK) {
    await new Promise((r) => setTimeout(r, 600));
    // eslint-disable-next-line no-console
    console.info('[order:mock] no VITE_ORDER_ENDPOINT set — payload not sent', {
      ...payload,
      total: money(payload.total),
    });
    return { ok: true, orderId: `DEV-${Date.now().toString(36).toUpperCase()}`, mock: true };
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `Server responded ${res.status}` };
    const data = (await res.json()) as { orderId?: string };
    return { ok: true, orderId: data.orderId ?? '', mock: false };
  } catch {
    return { ok: false, error: 'Could not reach the server. Please try again.' };
  }
}

/**
 * Order detail handed to /thank-you.
 *
 * Kept in sessionStorage rather than the URL so a customer's phone and email do
 * not end up in browser history, referrer headers or server logs (spec §18).
 */
const KEY = 'sp4k:last-order';

export interface OrderSummary {
  orderId: string;
  planLabel: string;
  devices: number;
  phone: string;
  email: string;
  total: string;
  mock: boolean;
}

export function stashOrder(s: OrderSummary): void {
  try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch { /* private mode */ }
}

export function readOrder(): OrderSummary | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OrderSummary) : null;
  } catch {
    return null;
  }
}
