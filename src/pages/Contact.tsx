import Seo from '../components/Seo';
import { pageSeo } from '../data/seo';
import { site, routes } from '../data/site';
import { track } from '../lib/analytics';

/**
 * Two real channels, both of which actually reach us.
 *
 * "Live chat" was removed along with "median first reply under two minutes":
 * there is no chat widget on the site and no measurement behind that number.
 */
const channels = [
  {
    label: 'WhatsApp',
    value: site.whatsapp,
    href: site.whatsappUrl,
    note: 'Fastest for setup help. Send your device model and we will send the right guide.',
    event: true,
  },
  {
    label: 'Email',
    value: site.email,
    href: `mailto:${site.email}`,
    note: 'Best for billing, refunds and anything with attachments.',
  },
];

const triage = [
  {
    q: 'Not received your login?',
    a: 'Check the spam folder first — activation mail sometimes lands there. If it is not in either, message us with the email address you paid with and we will resend it.',
  },
  {
    q: 'Streams stopped working?',
    a: 'Usually another device is using your connection slot. Log out on the other device, or tell us and we will check the line from our side.',
  },
  {
    q: 'Buffering on live sport?',
    a: 'Try a wired connection or the 5GHz band first, then tell us your city and device. We can move you to a closer server.',
  },
  {
    q: 'Want a refund?',
    a: `Message us and we will process it under the ${site.refundDays}-day money-back guarantee. No lengthy questions.`,
  },
];

export default function Contact() {

  return (
    <>
      <Seo seo={pageSeo[routes.contact]} />
      <section className="section !pb-8">
        <div className="mx-auto max-w-shell">
          <div className="eyebrow">Contact</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Need help with
            <br />
            <span className="text-grad">your subscription?</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            Live chat is staffed around the clock. For anything that needs a longer answer, send a message
            and we will come back to you the same day.
          </p>
        </div>
      </section>

      <section className="px-7 pb-12">
        <div className="mx-auto grid max-w-shell gap-4 md:grid-cols-3">
          {channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              onClick={c.event ? () => track('whatsapp_click', { from: 'contact-card' }) : undefined}
              className="card-hover block min-w-0 px-5 py-6 sm:px-6 sm:py-7"
            >
              <div className="text-[11px] font-bold uppercase tracking-[.16em] text-accent-bright">{c.label}</div>
              <div className="mt-3 break-all font-display text-[20px] font-bold text-ink">{c.value}</div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-3">{c.note}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="section !pt-0">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-2">
          {/*
            No contact form.

            There is no backend to receive one, and a form that reports "message
            sent" while sending nothing is worse than no form at all — the
            customer believes they have reached us and waits. WhatsApp and email
            both actually arrive, so the page sends people there instead. Add a
            form back once /api/contact exists.
          */}
          <div className="card px-6 py-7 sm:px-8 sm:py-8">
            <h2 className="font-display text-[26px] font-extrabold text-ink">Talk to us</h2>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink-3">
              Tell us your device and what is happening, and we will send back the exact fix.
              Both channels below reach the same team.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('whatsapp_click', { from: 'contact' })}
                className="btn-accent w-full"
              >
                Message us on WhatsApp
              </a>
              <a
                href={`mailto:${site.email}`}
                className="btn-outline w-full !px-4 !text-[14px] sm:!px-7 sm:!text-[15.5px]"
              >
                <span className="min-w-0 break-all">Email {site.email}</span>
              </a>
            </div>

            <p className="mt-6 text-[13.5px] leading-relaxed text-ink-5">
              Support is available 24/7. When you write, include the email address you ordered with
              and your device model — it usually saves a round trip.
            </p>
          </div>

          {/* Triage */}
          <div className="card px-6 py-7 sm:px-8 sm:py-8">
            <div className="label">Before you write</div>
            <div className="mt-4">
              {triage.map((row, i) => (
                <div key={row.q} className={`py-[18px] ${i < triage.length - 1 ? 'border-b border-line' : ''}`}>
                  <h3 className="font-display text-[16.5px] font-bold text-ink">{row.q}</h3>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{row.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
