import { useState, type FormEvent } from 'react';
import { site } from '../data/site';

const channels = [
  { label: 'Live chat', value: '24 hours, 7 days', note: 'Median first reply under two minutes.' },
  { label: 'Email', value: site.email, note: 'Answered within a few hours.' },
  { label: 'WhatsApp', value: site.whatsapp, note: 'Send your device model for a tailored guide.' },
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
    a: 'Say so in chat and we will process it under the money-back guarantee. No lengthy questions.',
  },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Presentational — point this at your form handler or helpdesk before launch.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get('name') || !data.get('email') || !data.get('message')) {
      setError('Please fill in your name, email and message.');
      return;
    }
    setError('');
    setSent(true);
  };

  return (
    <>
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="label-accent">Contact</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Need help with
            <br />
            <span className="text-accent">your subscription?</span>
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
            <div key={c.label} className="card min-w-0 px-6 py-7">
              <div className="text-[11px] font-bold uppercase tracking-[.16em] text-accent-bright">{c.label}</div>
              <div className="mt-3 break-all font-display text-[20px] font-bold text-ink">{c.value}</div>
              <p className="mt-2 text-[14px] text-ink-3">{c.note}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-7 pb-[110px]">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-2">
          {/* Message form */}
          <div className="card px-8 py-8">
            <h2 className="font-display text-[26px] font-extrabold text-ink">Send us a message</h2>
            <p className="mt-2.5 text-[15px] text-ink-3">
              Tell us your device and what is happening, and we will send back the exact fix.
            </p>

            {sent ? (
              <div className="mt-7 rounded-xl border border-success/30 bg-success/[.08] px-5 py-6">
                <p className="font-display text-[17px] font-bold text-ink">Message sent.</p>
                <p className="mt-1.5 text-[14.5px] text-ink-3">
                  We will reply to your email shortly. For anything urgent, live chat is faster.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 flex flex-col gap-3" noValidate>
                <input name="name" className="field" placeholder="Full name" aria-label="Full name" />
                <input name="email" type="email" className="field" placeholder="you@email.com" aria-label="Email" />
                <input name="device" className="field" placeholder="Device and model — e.g. Firestick 4K Max" aria-label="Device" />
                <textarea
                  name="message"
                  className="field min-h-[110px] resize-y"
                  placeholder="Describe the issue or question"
                  aria-label="Message"
                />
                {error && <p className="text-[13.5px] text-accent">{error}</p>}
                <button type="submit" className="btn-accent mt-1">Send message</button>
              </form>
            )}
          </div>

          {/* Triage */}
          <div className="card px-8 py-8">
            <div className="label">Before you write</div>
            <div className="mt-4">
              {triage.map((row, i) => (
                <div key={row.q} className={`py-[18px] ${i < triage.length - 1 ? 'border-b border-white/[.08]' : ''}`}>
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
