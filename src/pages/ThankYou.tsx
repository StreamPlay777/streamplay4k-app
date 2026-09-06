import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { readOrder } from '../lib/orderService';
import Check from '../components/pricing/Check';

/**
 * /thank-you — order request received.
 *
 * This is NOT a payment confirmation (spec §19). Nothing has been charged; the
 * invoice follows separately. Details come from sessionStorage rather than the
 * URL so the customer's phone and email stay out of history and referrers.
 *
 * noindex,follow is set at runtime and the route is excluded from the sitemap.
 */
export default function ThankYou() {
  const order = readOrder();

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex,follow';
    document.head.appendChild(meta);
    const prevTitle = document.title;
    document.title = 'Order confirmed — Streamplay4k';
    return () => {
      document.head.removeChild(meta);
      document.title = prevTitle;
    };
  }, []);

  const whatsapp = `https://wa.me/${site.whatsapp.replace(/[^\d]/g, '')}`;

  const steps = [
    'We review your order.',
    'Your invoice and payment instructions are sent shortly by email and WhatsApp.',
    'After payment, your account details are usually delivered within 5–15 minutes.',
  ];

  return (
    <section className="px-5 py-20 sm:px-7 sm:py-[100px]">
      <div className="mx-auto max-w-[720px]">
        <p className="text-[12px] font-bold uppercase tracking-[.18em] text-accent-bright">Order confirmed</p>
        <h1
          className="mt-4 font-display font-extrabold leading-none text-ink"
          style={{ fontSize: 'clamp(38px, 6.5vw, 60px)' }}
        >
          You're all set.
        </h1>
        <p className="mt-5 text-[18px] text-ink-3">We'll be in touch shortly.</p>

        {order ? (
          <dl className="mt-9 rounded-2xl border border-white/[.1] bg-white/[.02] p-5 text-[14.5px] sm:p-6">
            {[
              ['Plan', order.planLabel],
              ['Devices', `${order.devices} ${order.devices === 1 ? 'device' : 'devices'}`],
              ['Phone', order.phone],
              ['Email', order.email],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 py-2">
                <dt className="text-ink-4">{k}</dt>
                <dd className="truncate text-right text-ink-2">{v}</dd>
              </div>
            ))}
            <div className="mt-1 flex justify-between gap-4 border-t border-white/[.1] pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="nums font-display text-[19px] font-extrabold text-ink">{order.total}</dd>
            </div>
            {order.orderId && (
              <p className="mt-4 text-[12.5px] text-ink-5">Reference {order.orderId}</p>
            )}
            {order.mock && (
              <p className="mt-3 rounded-lg border border-white/[.1] bg-white/[.03] px-3 py-2 text-[12px] text-ink-4">
                Development mode — this order was not actually submitted.
              </p>
            )}
          </dl>
        ) : (
          <p className="mt-9 rounded-2xl border border-white/[.1] bg-white/[.02] p-5 text-[14.5px] text-ink-3">
            Your order details are no longer in this browser session, but your request was received.
            Contact us at {site.email} if you need a copy.
          </p>
        )}

        <h2 className="mt-12 font-display text-[22px] font-extrabold text-ink">What happens next</h2>
        <ol className="mt-5 space-y-4">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-4">
              <span className="grid h-7 w-7 flex-none place-items-center rounded-full bg-accent/[.14] font-display text-[13px] font-bold text-accent">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15.5px] leading-relaxed text-ink-2">{s}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap gap-3">
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn-accent">
            Open WhatsApp
          </a>
          <Link to="/" className="btn-outline">Back to home</Link>
        </div>

        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/[.09] pt-6">
          {['7-Day Money-Back Guarantee', 'Secure invoice payment', 'Support available 24/7'].map((t) => (
            <li key={t} className="flex items-center gap-2 text-[13px] text-ink-4">
              <span className="text-accent"><Check /></span>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
