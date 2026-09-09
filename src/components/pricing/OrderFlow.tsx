import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { money, type Quote } from '../../data/pricing';
import { track } from '../../lib/analytics';
import { buildPayload, submitOrder, stashOrder, captureLead } from '../../lib/orderService';
import { isValidPhone, isValidEmail, phoneError, emailError } from './validation';
import { DIAL_CODES, composePhone, dialCodeFor } from '../../data/dialCodes';
import Check from './Check';

/**
 * Order request. No payment is taken here — the customer asks for an invoice,
 * which arrives by email and WhatsApp.
 *
 * PRESENTED AS THREE STEPS, of which this panel owns two. Choosing the plan is
 * step 1 and happens in the column to the left, so this starts at "Step 2 of 3"
 * rather than restarting the count — the old "Step 1 of 2" made the plan
 * selection look like it had not happened.
 *
 * PROGRESSIVE REVEAL. The details step asks one thing at a time: the phone
 * field first; once the number is valid it earns a check and the email field
 * unfolds beneath it; once the email is valid it earns a check and the summary
 * and Continue appear. One decision per moment, nothing asked for before it is
 * needed.
 *
 * Focus moves forward on its own, but only once typing has paused. A number
 * can be valid at 7 digits and still be half-typed (+33 6 75 …), so stealing
 * focus the instant validation passes would cut people off mid-number. The
 * hand-off waits 700ms of quiet; Enter moves immediately.
 *
 * DRAFT LIVES ABOVE THIS COMPONENT. Back to the plan unmounts this panel, so
 * holding the typed details in local state threw them away — someone who went
 * back to add a device had to retype their number and email. The draft is
 * owned by PricingOrder and passed in; nothing else about the flow changes.
 *
 * THE NUMBER IS TWO CONTROLS, one string. The country code is chosen, not
 * typed, so nobody has to know their own prefix and nobody sends us a number
 * we cannot dial. Validation, the payload and the confirm step all read the
 * composed value — the national part alone is never treated as the number.
 *
 * UNCHANGED: validation rules, the submitOrder/buildPayload call, the stashed
 * order shape, the /thank-you redirect, and every analytics event.
 * phone_validated fires once, when the email field is first revealed.
 */
export interface OrderDraft {
  /** ISO code of the chosen calling code, not the code itself: +1 is four countries. */
  dialIso: string;
  /** What was typed in the number field — no country prefix. */
  national: string;
  email: string;
}

export default function OrderFlow({
  q,
  draft,
  onDraftChange,
  onCancel,
}: {
  q: Quote;
  draft: OrderDraft;
  onDraftChange: (next: OrderDraft) => void;
  onCancel: () => void;
}) {
  const navigate = useNavigate();
  /** 'details' = step 2 of 3, 'confirm' = step 3 of 3. */
  const [stage, setStage] = useState<'details' | 'confirm'>('details');
  const { dialIso, national, email } = draft;
  const country = dialCodeFor(dialIso);
  /** The one true number. Everything downstream reads this, never `national`. */
  const phone = composePhone(dialIso, national);
  const setPhoneIso = (v: string) => onDraftChange({ ...draft, dialIso: v });
  const setNational = (v: string) => onDraftChange({ ...draft, national: v });
  const setEmail = (v: string) => onDraftChange({ ...draft, email: v });
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const handoff = useRef<number>();
  const validatedOnce = useRef(false);

  const phoneOk = isValidPhone(phone) && !phoneErr;
  const emailOk = isValidEmail(email) && !emailErr;
  /** Email unfolds once the phone is valid and stays open after that. */
  const [emailShown, setEmailShown] = useState(false);

  // On open, land on the phone field: it is the only thing on screen to do.
  // On the confirm stage, land on the heading so the review is read first.
  useEffect(() => {
    if (stage === 'details') phoneRef.current?.focus();
    else headingRef.current?.focus();
  }, [stage]);

  // Reveal the email field once the number is valid, and fire phone_validated
  // exactly once per order — the same moment the old two-step version did.
  useEffect(() => {
    if (!phoneOk || emailShown) return;
    setEmailShown(true);
    if (!validatedOnce.current) {
      validatedOnce.current = true;
      track('phone_validated', { term: q.term.id, devices: q.devices });
      // Same moment, same reason: they have given us a working number and
      // moved on. If they abandon from here, this is the only trace of them.
      captureLead(q.term.id, q.devices, phone, dialIso);
    }
  }, [phoneOk, emailShown, q.term.id, q.devices, phone, dialIso]);

  // Hand focus to the email field after typing pauses, if the phone is done
  // and the email is still empty. Never while someone is mid-keystroke.
  useEffect(() => {
    window.clearTimeout(handoff.current);
    if (!phoneOk || !emailShown || email) return;
    if (document.activeElement !== phoneRef.current) return;
    handoff.current = window.setTimeout(() => emailRef.current?.focus(), 700);
    return () => window.clearTimeout(handoff.current);
  }, [phone, phoneOk, emailShown, email]);

  const goConfirm = () => {
    const pErr = phoneError(phone);
    const eErr = emailError(email);
    setPhoneErr(pErr);
    setEmailErr(eErr);
    if (pErr || eErr) return;
    setStage('confirm');
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (stage === 'details') { goConfirm(); return; }

    const pErr = phoneError(phone);
    const eErr = emailError(email);
    setPhoneErr(pErr);
    setEmailErr(eErr);
    if (pErr || eErr) { setStage('details'); return; }

    setBusy(true);
    setFailure(null);
    track('submit_order', { term: q.term.id, devices: q.devices, total: q.totalCents / 100 });

    const res = await submitOrder(buildPayload(q.term.id, q.devices, phone, email, dialIso));
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

  const details = stage === 'details';

  return (
    <form onSubmit={submit} noValidate className="panel-swap flex h-full flex-col">
      {/* Step rail — the plan step is behind us, and says so. */}
      <ol className="flex items-center gap-2 text-[10.5px] font-bold uppercase tracking-[.14em]">
        <StepDot n={1} label="Plan" state="done" />
        <Rail />
        <StepDot n={2} label="Details" state={details ? 'current' : 'done'} />
        <Rail />
        <StepDot n={3} label="Confirm" state={details ? 'todo' : 'current'} />
      </ol>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h3
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-[21px] font-extrabold leading-snug text-ink outline-none sm:text-[23px]"
        >
          {details ? 'Where should we send your order details?' : 'Review your order'}
        </h3>
        {/* One word, one direction. "Cancel" read as "throw this away" and
            sat there as quiet grey text; this is a visible control that says
            where it goes — out to the plan, or back to the details. */}
        <button
          type="button"
          onClick={details ? onCancel : () => setStage('details')}
          aria-label={details ? 'Back to plan options' : 'Back to your details'}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line-2 bg-raise-2 px-3 py-2 text-[13px] font-semibold text-ink-2 transition-colors hover:border-line-3 hover:text-ink"
        >
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
            <path d="M9.5 3.5 5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      </div>

      {details ? (
        <div className="mt-5">
          {/* Your order, stated before anything is asked of you.
              It used to appear only once both fields were valid, which meant
              someone typing their phone number had no reminder on screen of
              what they were buying or what it costs — the two facts most
              likely to make them hesitate. It is live: change the term or the
              device count on the left and these figures follow. */}
          <dl className="order-summary mb-6 rounded-xl border border-line-2 bg-raise-2 px-4 py-3.5">
            <div className="flex items-baseline justify-between gap-4">
              <dt className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">Your order</dt>
              <dd className="nums text-[12px] text-ink-4">≈ {money(q.perMonthCents)}/mo</dd>
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <dd className="font-display text-[14.5px] font-bold text-ink">
                {q.term.label} · {q.devices} {q.devices === 1 ? 'device' : 'devices'}
              </dd>
              <dd className="nums font-display text-[22px] font-extrabold leading-none text-ink">
                {money(q.totalCents)}
              </dd>
            </div>
          </dl>

          {/* Says what the two fields are for before either is asked for.
              "Why do you want my phone number?" is the hesitation that stalls
              this step, and one sentence answers it. */}
          <p className="mb-5 text-[13px] leading-relaxed text-ink-3">
            We&apos;ll use these details to send your invoice and activation information.
          </p>

          <label htmlFor="order-phone" className="block text-[13px] font-semibold text-ink-2">
            Phone / WhatsApp
          </label>
          {/* Country code is picked, not typed. The prefix is the part people
              get wrong or leave off, and a wrong prefix is an order we cannot
              deliver to. Stacked below 380px so neither control is squeezed. */}
          <div className="mt-2 flex flex-wrap gap-2 min-[380px]:flex-nowrap">
            <div className="relative w-full min-[380px]:w-[104px] min-[380px]:flex-none">
              <label htmlFor="order-dial" className="sr-only">Country calling code</label>
              <select
                id="order-dial"
                name="dialCode"
                value={dialIso}
                onChange={(e) => { setPhoneIso(e.target.value); setPhoneErr(null); }}
                className="field min-h-[48px] !pr-8"
              >
                {DIAL_CODES.map((c) => (
                  <option key={c.iso} value={c.iso}>{`${c.flag} ${c.dial}`}</option>
                ))}
              </select>
            </div>
            <div className="relative min-w-0 flex-1">
              <input
                ref={phoneRef}
                id="order-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel-national"
                value={national}
                onChange={(e) => { setNational(e.target.value); setPhoneErr(null); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (phoneOk) emailRef.current?.focus();
                    else setPhoneErr(phoneError(phone));
                  }
                }}
                aria-invalid={!!phoneErr}
                aria-describedby={phoneErr ? 'order-phone-err' : 'order-phone-hint'}
                placeholder="Your phone number"
                className={`field min-h-[48px] pr-10 ${phoneErr ? '!border-accent' : ''}`}
              />
              {phoneOk && (
                <span className="field-check absolute right-3 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">
                  <Check />
                </span>
              )}
            </div>
          </div>
          {phoneErr ? (
            <p id="order-phone-err" role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-accent-ink">
              <span aria-hidden="true">✕</span> {phoneErr}
            </p>
          ) : (
            /* The country in words. The closed select shows a flag and a
               number, which on Windows degrades to letters — this line is
               where the choice is unambiguous either way. */
            <p id="order-phone-hint" className="mt-2 text-[12px] text-ink-3">
              {country.name} ({country.dial}) — change it above if you&apos;re elsewhere.
            </p>
          )}

          {emailShown && (
            <div className="field-unfold">
              <label htmlFor="order-email" className="mt-5 block text-[13px] font-semibold text-ink-2">
                Email address
              </label>
              <div className="relative mt-2">
                <input
                  ref={emailRef}
                  id="order-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailErr(null); }}
                  aria-invalid={!!emailErr}
                  aria-describedby={emailErr ? 'order-email-err' : undefined}
                  placeholder="you@email.com"
                  className={`field min-h-[48px] pr-10 ${emailErr ? '!border-accent' : ''}`}
                />
                {emailOk && (
                  <span className="field-check absolute right-3 top-1/2 -translate-y-1/2 text-success" aria-hidden="true">
                    <Check />
                  </span>
                )}
              </div>
              {emailErr && (
                <p id="order-email-err" role="alert" className="mt-2 flex items-center gap-1.5 text-[12.5px] text-accent-ink">
                  <span aria-hidden="true">✕</span> {emailErr}
                </p>
              )}
            </div>
          )}

          {/* Continue still waits for both fields — the summary above already
              carries the figures, so repeating them here would just be the
              same card twice on one short panel. */}
          {emailShown && (
          <div className={emailOk ? 'field-unfold' : 'opacity-50'}>
          <button type="submit" className="btn-accent group mt-6 w-full">
            Continue
            <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
              →
            </span>
          </button>
          </div>
          )}
        </div>
      ) : (
        <div className="mt-5 flex flex-1 flex-col">
          <dl className="space-y-2.5 rounded-xl border border-line bg-raise p-4 text-[14px]">
            {[
              ['Plan', q.term.label],
              ['Devices', `${q.devices} ${q.devices === 1 ? 'device' : 'devices'}`],
              ['Phone', phone.trim() || '—'],
              ['Email', email.trim() || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4">
                <dt className="flex-none text-ink-4">{k}</dt>
                <dd className="min-w-0 truncate text-right text-ink-2">{v}</dd>
              </div>
            ))}
            <div className="flex items-center justify-between gap-4 border-t border-line pt-2.5">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="nums font-display text-[19px] font-extrabold text-ink">{money(q.totalCents)}</dd>
            </div>
          </dl>

          {failure && (
            <p role="alert" className="mt-4 rounded-lg border border-accent/40 bg-accent/[.08] px-4 py-3 text-[13px] text-ink-2">
              {failure}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-accent group mt-5 w-full disabled:opacity-60">
            {busy ? 'Sending…' : <>Place order — {money(q.totalCents)}
              <span className="transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" aria-hidden="true">
                →
              </span></>}
          </button>

          <p className="mt-3 text-center text-[12.5px] leading-relaxed text-ink-3">
            <strong className="font-semibold text-ink">No payment is taken on this page.</strong>{' '}
            We&apos;ll send your invoice and payment instructions by email and WhatsApp.
          </p>
        </div>
      )}
    </form>
  );
}

function StepDot({ n, label, state }: { n: number; label: string; state: 'done' | 'current' | 'todo' }) {
  const tone =
    state === 'current' ? 'text-accent-ink' : state === 'done' ? 'text-ink-3' : 'text-ink-5';
  return (
    <li className={`flex items-center gap-1.5 ${tone}`} aria-current={state === 'current' ? 'step' : undefined}>
      <span
        className={`grid h-[18px] w-[18px] flex-none place-items-center rounded-full text-[9px] ${
          state === 'current'
            ? 'bg-accent text-white'
            : state === 'done'
              ? 'bg-raise-3 text-ink-2'
              : 'border border-line-2 text-ink-5'
        }`}
        aria-hidden="true"
      >
        {state === 'done' ? '✓' : n}
      </span>
      <span className="hidden sm:inline">{label}</span>
    </li>
  );
}

const Rail = () => <li aria-hidden="true" className="h-px flex-1 bg-raise-3" />;
