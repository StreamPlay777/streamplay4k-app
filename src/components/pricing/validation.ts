/**
 * Field validation for the order flow.
 *
 * Frontend validation is UX only — the backend must validate independently
 * (spec §25). These rules stay deliberately permissive: rejecting a legitimate
 * international number costs a real order, and customers are not assumed to be
 * US-based (spec §12).
 */

/** Digits only, ignoring the usual punctuation and an optional leading +. */
export function phoneDigits(raw: string): string {
  return raw.replace(/[^\d]/g, '');
}

/**
 * E.164 allows up to 15 digits; the shortest national numbers in use run to
 * about 7. Anything in that band is accepted rather than pattern-matched
 * against a country, so +33, +44, +1, +212 and the rest all pass.
 */
export function isValidPhone(raw: string): boolean {
  const d = phoneDigits(raw);
  return d.length >= 7 && d.length <= 15;
}

export function phoneError(raw: string): string | null {
  if (!raw.trim()) return 'Please enter a phone number so we can reach you.';
  const d = phoneDigits(raw);
  if (d.length < 7) return 'That looks too short — please include the full number.';
  if (d.length > 15) return 'That looks too long — please check the number.';
  return null;
}

/** Pragmatic shape check; the backend verifies deliverability. */
export function isValidEmail(raw: string): boolean {
  const v = raw.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;
}

export function emailError(raw: string): string | null {
  if (!raw.trim()) return 'Please enter an email address.';
  if (!isValidEmail(raw)) return 'Please check the email address — it looks incomplete.';
  return null;
}
