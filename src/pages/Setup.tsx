import { useEffect, useState } from 'react';
import Seo from '../components/Seo';
import { pageSeo } from '../data/seo';
import { Link } from 'react-router-dom';
import { site, routes, trialUrl, whatsappUrlWith } from '../data/site';
import { deviceGuides, loginFormats, activationFacts } from '../data/setup';
import { SectionHeading } from '../components/ui';
import Reveal from '../components/Reveal';
import ClosingCta from '../components/ClosingCta';
import { CatIcon } from '../components/CategoryIcons';
import { track } from '../lib/analytics';

/**
 * Installation guide.
 *
 * ONE DEVICE AT A TIME. The page shows the steps for the device you pick and
 * nothing else. Six guides printed at once is how setup pages become the thing
 * customers message support about instead of reading — the point of an install
 * guide is that the visitor sees four steps, not thirty.
 *
 * Everything above the picker is what applies to every device: the code, how
 * long it takes, and what the two login formats are. Everything below is the
 * one device's steps.
 */
export default function Setup() {
  const [deviceId, setDeviceId] = useState(deviceGuides[0].id);

  /**
   * The navbar's Setup menu and the footer link to /setup-guide/#firestick and
   * friends. With one panel instead of six sections there is nothing for the
   * browser to scroll to, so the hash selects the device instead — otherwise
   * every one of those links would land on the page showing Firestick.
   *
   * hashchange as well as mount: those links are same-page navigations once a
   * visitor is already here, and React Router will not remount for them.
   */
  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.replace('#', '');
      if (deviceGuides.some((d) => d.id === id)) {
        setDeviceId(id);
        document.getElementById('your-device')?.scrollIntoView({ block: 'start' });
      }
    };
    apply();
    window.addEventListener('hashchange', apply);
    return () => window.removeEventListener('hashchange', apply);
  }, []);
  const [copied, setCopied] = useState(false);
  const device = deviceGuides.find((d) => d.id === deviceId)!;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(activationFacts.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context, or permission denied) — the code
      // is on screen either way, so fail quietly rather than at the user.
      setCopied(false);
    }
  };

  return (
    <>
      <Seo seo={pageSeo[routes.setup]} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <section className="px-7 pb-[46px] pt-[74px] text-center">
        <div className="mx-auto max-w-[760px]">
          <p className="eyebrow">Set up in minutes</p>
          <h1
            className="mt-4 font-display font-extrabold leading-none text-ink"
            style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}
          >
            Installation <span className="text-grad">Guide</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[560px] text-[17.5px] leading-relaxed text-ink-3">
            Pick your device below and follow the exact steps. Your login arrives by email right
            after purchase.
          </p>
          <p className="mt-5 text-[11.5px] font-bold uppercase tracking-[.16em] text-accent-ink">
            No hidden fees · Fast activation · 24/7 support
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to={routes.pricing} onClick={() => track('view_pricing', { from: 'setup-hero' })} className="btn-accent">
              See pricing →
            </Link>
            <a
              href={trialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('start_free_trial', { from: 'setup-hero' })}
              className="btn-outline"
            >
              Free trial
            </a>
          </div>
          <p className="mt-5 text-[12.5px] text-ink-5">
            <a href="#your-device" className="hover:text-accent-link">Or jump to your device ↓</a>
          </p>
        </div>
      </section>

      {/* ── What applies to every device ───────────────────────────────── */}
      <section className="section-tight px-7">
        <div className="mx-auto max-w-shell">
          <div className="card px-6 py-7 sm:px-8 sm:py-8">
            <h2 className="font-display text-[22px] font-extrabold text-ink sm:text-[25px]">
              Activate {site.name} on any device
            </h2>
            <p className="mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-ink-3">
              Pick your device and we will show the exact steps. Where the device allows it we install{' '}
              {activationFacts.player} with the Downloader app using the code below. Televisions that
              cannot sideload go to their own app store instead.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl border border-line bg-raise px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">Downloader code</p>
                <div className="mt-2.5 flex flex-wrap items-center gap-3">
                  <span className="nums font-display text-[26px] font-extrabold tracking-[.1em] text-ink">
                    {activationFacts.code}
                  </span>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="btn-sm border border-line-2 bg-raise-2 text-ink-2 hover:border-accent hover:text-ink"
                  >
                    {copied ? '✓ Copied' : 'Copy code'}
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-line bg-raise px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">Typical time</p>
                <p className="nums mt-2.5 font-display text-[26px] font-extrabold text-ink">
                  {activationFacts.typicalTime}
                </p>
              </div>

              <div className="rounded-xl border border-line bg-raise px-5 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">Need a hand?</p>
                <a
                  href={whatsappUrlWith(`Hi ${site.name}, I need help setting up on my device.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track('whatsapp_click', { from: 'setup-help' })}
                  className="btn-accent mt-2.5 !w-full !py-2.5 !text-[13.5px]"
                >
                  Chat with an expert
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The two login formats ──────────────────────────────────────── */}
      <section className="section-tight px-7">
        <div className="mx-auto max-w-shell">
          <div className="card px-6 py-7 sm:px-8 sm:py-8">
            <h2 className="font-display text-[22px] font-extrabold text-ink sm:text-[25px]">
              Where do I find my login details?
            </h2>
            <p className="mt-3 max-w-[680px] text-[14.5px] leading-relaxed text-ink-3">
              After your purchase we email your login. Players accept one of two formats, and your
              email tells you which you have.
            </p>

            {/* min-w-0 on each card: a grid item defaults to min-width:auto,
                so the long unbroken M3U example below would set the track's
                width and push the whole page sideways on a phone. */}
            <div className="mt-7 grid gap-3 lg:grid-cols-2">
              {loginFormats.map((f, i) => (
                <Reveal key={f.id} delay={i} shift={12} className="min-w-0 rounded-xl border border-line bg-raise p-5">
                  <div className="flex items-start gap-3">
                    <span className="cat-icon grid h-10 w-10 flex-none place-items-center rounded-xl" aria-hidden="true">
                      <CatIcon name={f.id === 'xtream' ? 'setup' : 'devices'} />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-display text-[16px] font-bold text-ink">{f.name}</h3>
                      <p className="mt-0.5 text-[12.5px] text-ink-4">{f.what}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[13.5px] leading-relaxed text-ink-3">{f.body}</p>
                  <p className="mt-4 text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">
                    {f.exampleLabel}
                  </p>
                  <p className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap rounded-lg border border-line bg-raise-2 px-3 py-2.5 font-mono text-[12px] text-ink-4">
                    {f.example}
                  </p>
                </Reveal>
              ))}
            </div>

            <p className="mt-6 rounded-xl border border-line bg-raise-2 px-4 py-3.5 text-[13px] leading-relaxed text-ink-3">
              <strong className="font-semibold text-ink-2">Tip:</strong> your plan allows a set number of
              devices at once. If a stream stops working, another device is probably using the slot — log
              out there, or message us and we will check.
            </p>
          </div>
        </div>
      </section>

      {/* ── One device, its steps ──────────────────────────────────────── */}
      <section id="your-device" className="section amb amb-warm bg-bg">
        <div className="mx-auto max-w-shell">
          <SectionHeading
            label="Step by step"
            title={<>What are you <span className="text-grad">installing on?</span></>}
            sub="Choose your device and we will show only the steps that matter for it."
          />

          <div className="mt-10 rounded-2xl border border-line bg-surface p-5 sm:p-7">
            <label htmlFor="device-picker" className="block text-[13px] font-semibold text-ink-2">
              Select your device
            </label>
            <select
              id="device-picker"
              value={deviceId}
              onChange={(e) => { setDeviceId(e.target.value); track('channel_search', { from: 'setup-device', q: e.target.value }); }}
              className="field mt-2 max-w-[380px] !py-3"
            >
              {deviceGuides.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* key on the device id so the panel replays its entrance when the
                selection changes — otherwise the steps swap silently and it is
                easy to miss that the list is now a different device's. */}
            <div key={device.id} className="panel-swap mt-7">
              <p className="text-[11px] font-bold uppercase tracking-[.14em] text-ink-5">
                Steps for {device.name}
              </p>
              <p className="mt-2 max-w-[720px] text-[14.5px] leading-relaxed text-ink-2">
                {device.summary}
              </p>

              {device.downloads.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {device.downloads.map((d) => (
                    <a
                      key={d.label}
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => track('start_free_trial', { from: 'setup-download', device: device.id })}
                      className="btn-accent !py-2.5 !text-[13.5px]"
                    >
                      ↓ {d.label}
                    </a>
                  ))}
                </div>
              )}

              <ol className="mt-7 grid gap-3 lg:grid-cols-2">
                {device.steps.map((s, i) => (
                  <li key={s.title} className="step-card rounded-xl border border-line bg-raise p-5">
                    <span className="step-badge inline-flex items-center rounded-md px-2 py-[3px] font-display text-[10.5px] font-extrabold uppercase tracking-[.1em]">
                      Step {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-display text-[16px] font-bold text-ink">{s.title}</h3>
                    <p className="mt-2 text-[13.5px] leading-relaxed text-ink-3">{s.body}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <p className="mx-auto mt-7 max-w-[620px] text-center text-[13.5px] leading-relaxed text-ink-4">
            Stuck at any step?{' '}
            <a
              href={whatsappUrlWith(`Hi ${site.name}, I'm stuck setting up on ${device.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('whatsapp_click', { from: 'setup-stuck', device: device.id })}
              className="font-semibold text-accent-ink hover:underline"
            >
              Message us on WhatsApp
            </a>{' '}
            — tell us your device and where you got to, and we will walk you through it.
          </p>
        </div>
      </section>

      <ClosingCta from="setup-closing" />
    </>
  );
}
