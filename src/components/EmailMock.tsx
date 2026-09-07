import { site } from '../data/site';

/**
 * "Your login is ready" — the email a customer receives, sitting in an
 * opened envelope. Step 03 of the how-it-works section.
 *
 * Credentials are redacted dots on purpose: this is what the email looks
 * like, not a real login. Decorative as a whole, so hidden from screen
 * readers — the step copy says what happens.
 */
export default function EmailMock() {
  const rows = [
    { k: 'Portal', v: 'your-portal ••••', accent: true },
    { k: 'Username', v: '•••• •••• 57' },
    { k: 'Password', v: '•••• ••••' },
  ];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[340px] select-none pt-6 sm:pt-8">
      {/* Envelope back */}
      <div className="absolute inset-x-2 bottom-0 top-[42%] rounded-2xl border border-white/[.08] bg-[#101524]" />

      {/* Letter, pulled up out of the envelope and tilted a touch */}
      <div
        className="relative mx-4 rounded-xl border border-white/[.1] bg-[#171C2B] p-4 shadow-[0_22px_50px_rgba(0,0,0,.6)]
                   sm:mx-6 sm:p-5"
        style={{ transform: 'rotate(-2deg)' }}
      >
        <div className="flex items-start gap-3">
          <span
            className="grid h-9 w-9 flex-none place-items-center rounded-lg bg-accent-gradient-diag font-display text-[15px] font-extrabold text-white"
            >
            S
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate font-display text-[14px] font-bold text-ink">{site.name}</span>
            <span className="block truncate text-[11.5px] text-ink-4">no-reply@streamplay4k.com</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[.12em] text-ink-5">Just now</span>
        </div>

        <p className="mt-4 text-[11px] text-ink-4">
          <span className="font-bold uppercase tracking-[.12em] text-ink-5">Subject</span>{' '}
          Your {site.name} login is ready
        </p>
        <p className="mt-1.5 font-display text-[19px] font-extrabold leading-tight text-ink sm:text-[21px]">
          You're in. Start watching.
        </p>

        <dl className="mt-4 divide-y divide-white/[.07] rounded-lg bg-[#0E1220] px-3.5">
          {rows.map((r) => (
            <div key={r.k} className="flex items-center justify-between gap-4 py-2.5">
              <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-ink-5">{r.k}</dt>
              <dd className={`nums font-mono text-[12px] ${r.accent ? 'text-accent-bright' : 'text-ink-2'}`}>{r.v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-[11px] text-ink-4">Paste these into the app on any device — that's it.</p>
      </div>

      {/* Envelope front flap, drawn on top so the letter reads as inside it */}
      <div
        className="pointer-events-none absolute inset-x-2 bottom-0 h-[38%] rounded-b-2xl border border-t-0 border-white/[.1]
                   bg-gradient-to-b from-[#141A2C] to-[#0E1220]"
        style={{ clipPath: 'polygon(0 0, 50% 46%, 100% 0, 100% 100%, 0 100%)' }}
      />
    </div>
  );
}
