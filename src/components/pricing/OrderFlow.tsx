import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { money, type Quote } from '../../data/pricing';
import { track } from '../../lib/analytics';
import { buildPayload, submitOrder, stashOrder, IS_MOCK } from '../../lib/orderService';
import { isValidPhone, phoneError, emailError } from './validation';
import Check from './Check';

/**
 * Two-step order request. No payment is taken here — the customer asks for an
 * invoice, which arrives by email and WhatsApp (spec §11-§14).
 */
export default function OrderFlow({ q, onCancel }: { q: Quote; onCancel: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<number>();

  // Focus the panel heading when it opens, rather than yanking to a field
  // (spec §22).
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  /**
   * Auto-advance once the number looks complete. Deliberately does NOT move
   * focus — the customer may still be typing; it only reveals step 2. The
   * Continue button remains for keyboard users and anyone this misses.
   */
  useEffect(() => {
    window.clearTimeout(advanceTimer.current);
    if (step === 1 && isValidPhone(phone)) {
      advanceTimer.current = window.setTimeout(() => {
        track('phone_validated', { term: q.term.id, devices: q.devices });
        setStep(2);
      }, 650);
    }
    return () => window.clearTimeout(advanceTimer.current);
  }, [phone, step, q.term.id, q.devices]);

  const goStep2 = () => {
    const err = phoneError(phone);
    setPhoneErr(err);
    if (err) return;
    window.clearTimeout(advanceTimer.current);
    track('phone_validated', { term: q.term.id, devices: q.devices });
    setStep(2);
    window.setTimeout(() => emailRef.current?.focus(), 60);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const pErr = phoneError(phone);
    const eErr = emailError(email);
    setPhoneErr(pErr);
    setEmailErr(eErr);
    if (pErr) { setStep(1); return; }
    if (eErr) return;

    setBusy(true);
    setFailure(null);
    track('submit_order', {
      term: q.term.id, devices: q.devices, total: q.totalCents / 100,
    });

    const res = await submitOrder(buildPayload(q.term.id, q.devices, phone, email));
    setBusy(false);

    if (!res.ok) { setFailure(res.error); return; }

    track('order_submit_success', { term: q.term.id, devices: q.devices });
    stashOrder({
      orderId: res.orderId,
      planLabel: q.term.label,
      devices: q.devices,
      phone: phone.trim(),
      email: email.trim(),
      total: money(q.totalCents),
      mock: res.mock,
    });
    navigate('/thank-you');
  };

  return (
    <form onSubmit={submit} noValidate className="rounded-2xl border border-white/[.1] bg-white/[.03] p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[.16em] text-accent-bright">
            Step {step} of 2
          </p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 font-display text-[22px] font-extrabold text-ink outline-none sm:text-[24px]"
          >
            {step === 1 ? 'Where should we contact you?' : 'Where should we send your order details?'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="-mr-2 shrink-0 rounded-lg px-3 py-2.5 text-[13px] text-ink-4 underline-offset-2 hover:text-ink hover:underline"
        >
          Cancel
        </button>
      </div>

      {/* Step 1 — phone. Stays mounted so the value survives going back. */}
      <div className="mt-6">
        <label htmlFor="order-phone" className="block text-[13.5px] font-semibold text-ink-2">
          Phone / WhatsApp number
        </label>
        <div className="relative mt-2">
          <input
            id="order-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => { setPhone(e.target.value); setPhoneErr(null); }}
            aria-invalid={!!phoneErr}
            aria-describedby={phoneErr ? 'order-phone-err' : 'order-phone-hint'}
            placeholder="+1 305 555 0148"
            className={`field min-h-[48px] pr-10 ${phoneErr ? '!border-accent' : ''}`}
          />
          {isValidPhone(phone) && !phoneErr && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">
              <Check />
            </span>
          )}
        </div>
        {phoneErr ? (
          <p id="order-phone-err" role="alert" className="mt-2 flex items-center gap-1.5 text-[13px] text-accent">
            <span aria-hidden="true">✕</span> {phoneErr}
          </p>
        ) : (
          <p id="order-phone-hint" className="mt-2 text-[12.5px] text-ink-4">
            Include your country code. Any country is fine.
          </p>
        )}

        {step === 1 && (
          <button type="button" onClick={goStep2} className="btn-accent mt-5 w-full sm:w-auto">
            Continue
          </button>
        )}
      </div>

      {/* Step 2 — email */}
      {step === 2 && (
        <div className="mt-6 border-t border-white/[.09] pt-6">
          <label htmlFor="order-email" className="block text-[13.5px] font-semibold text-ink-2">
            Email address
          </label>
          <input
            id="order-email"
            ref={emailRef}
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
            aria-invalid={!!emailErr}
            aria-describedby={emailErr ? 'order-email-err' : undefined}
            placeholder="you@email.com"
            className={`field mt-2 min-h-[48px] ${emailErr ? '!border-accent' : ''}`}
          />
          {emailErr && (
            <p id="order-email-err" role="alert" className="mt-2 flex items-center gap-1.5 text-[13px] text-accent">
              <span aria-hidden="true">✕</span> {emailErr}
            </p>
          )}

          {/* Compact summary (spec §13) */}
          <dl className="mt-6 space-y-2 rounded-xl border border-white/[.08] bg-white/[.02] p-4 text-[14px]">
            {[
              ['Plan', q.term.label],
              ['Devices', `${q.devices} ${q.devices === 1 ? 'device' : 'devices'}`],
              ['Phone', phone.trim() || '—'],
              ['Email', email.trim() || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="text-ink-4">{k}</dt>
                <dd className="truncate text-right text-ink-2">{v}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4 border-t border-white/[.09] pt-2.5">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="nums font-display text-[17px] font-extrabold text-ink">{money(q.totalCents)}</dd>
            </div>
          </dl>

          {failure && (
            <p role="alert" className="mt-4 rounded-lg border border-accent/40 bg-accent/[.08] px-4 py-3 text-[13.5px] text-ink-2">
              {failure}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-accent mt-5 w-full disabled:opacity-60">
            {busy ? 'Sending…' : 'Place order'}
          </button>

          <p className="mt-3 text-center text-[13px] leading-relaxed text-ink-3">
            <strong className="font-semibold text-ink">No payment is taken now.</strong>{' '}
            We'll send your invoice and payment instructions shortly by email and WhatsApp.
          </p>

          {IS_MOCK && (
            <p className="mt-3 rounded-lg border border-white/[.1] bg-white/[.03] px-3 py-2 text-center text-[12px] text-ink-4">
              Development mode — no order endpoint configured, so nothing is sent.
            </p>
          )}
        </div>
      )}
    </form>
  );
}
