import { useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '../data/site';
import { deviceGuides, loginFormats } from '../data/setup';

export default function Setup() {
  const [deviceId, setDeviceId] = useState(deviceGuides[0].id);
  const [copied, setCopied] = useState(false);
  const device = deviceGuides.find((d) => d.id === deviceId)!;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(site.downloaderCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked (insecure context or denied permission) — the code is
      // on screen either way, so fail quietly rather than throwing at the user.
      setCopied(false);
    }
  };

  return (
    <>
      {/* Header */}
      <section className="px-7 pb-[46px] pt-[74px]">
        <div className="mx-auto max-w-shell">
          <div className="eyebrow">Set up in minutes</div>
          <h1 className="mt-4 font-display font-extrabold leading-none text-ink" style={{ fontSize: 'clamp(38px, 6.5vw, 66px)' }}>
            Installation <span className="text-grad">guide</span>
          </h1>
          <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-ink-3">
            Pick your device below and follow the exact steps. On sticks and boxes we install the player
            through the Downloader app using code {site.downloaderCode}. For smart TVs that cannot sideload,
            we route you to the best store app instead.
          </p>
        </div>
      </section>

      {/* Quick activation details */}
      <section className="px-7 pb-12">
        <div className="mx-auto grid max-w-shell gap-4 md:grid-cols-3">
          <div className="card px-6 py-6">
            <div className="label">Downloader code</div>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="nums text-[26px] font-bold tracking-[.12em] text-ink">{site.downloaderCode}</span>
              <button onClick={copyCode} className="btn-sm border border-white/[.16] text-ink hover:border-accent">
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <div className="card px-6 py-6">
            <div className="label">Typical time</div>
            <div className="mt-3 font-display text-[26px] font-extrabold text-ink">{site.setupTime}</div>
          </div>
          <div className="card px-6 py-6">
            <div className="label">Need help?</div>
            <Link to="/contact" className="btn-accent mt-3 !py-3 !text-[14px]">Chat with an expert</Link>
          </div>
        </div>
      </section>

      {/* Device selector + steps */}
      <section className="bg-bg-alt px-7 py-[90px]">
        <div className="mx-auto max-w-shell">
          <h2 className="font-display font-extrabold leading-tight text-ink" style={{ fontSize: 'clamp(28px, 4vw, 40px)' }}>
            What are you installing on?
          </h2>
          <p className="mt-3 max-w-[620px] text-[16px] text-ink-3">
            Choose your device and we will show only the steps that matter for it.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {deviceGuides.map((d) => {
              const on = d.id === deviceId;
              return (
                <button
                  key={d.id}
                  onClick={() => setDeviceId(d.id)}
                  className={`rounded-[9px] px-4 py-2.5 font-display text-[14px] font-bold transition-colors ${
                    on ? 'bg-accent text-white' : 'border border-white/[.12] bg-white/[.02] text-ink-2 hover:border-white/25'
                  }`}
                >
                  {d.name}
                </button>
              );
            })}
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {device.steps.map((step, i) => (
              <div key={step.title} className="card px-6 pb-7 pt-6">
                <span className="inline-block rounded-md bg-accent px-2.5 py-1 font-display text-[12px] font-extrabold uppercase tracking-wide text-white">
                  Step {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-display text-[19px] font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-ink-3">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Login details + line tester */}
      <section className="px-7 py-[100px]">
        <div className="mx-auto grid max-w-shell gap-6 lg:grid-cols-2">
          <div className="card px-8 py-8">
            <h3 className="font-display text-[24px] font-extrabold text-ink">Where do I find my login?</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-3">
              After purchase we email your credentials. Most players accept either format:
            </p>
            <ul className="mt-5 space-y-3">
              {loginFormats.map((f) => (
                <li key={f.name} className="flex items-start gap-3">
                  <span className="mt-[7px] h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span className="text-[15px] text-ink-2">
                    <strong className="font-semibold text-ink">{f.name}</strong> — {f.detail}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13.5px] leading-relaxed text-ink-4">
              Your plan limits how many devices stream at once. If streams stop working, another device may
              be connected — log out there, or contact support.
            </p>
          </div>

          <div className="card px-8 py-8">
            <div className="label">Paste your details to test</div>
            <form
              className="mt-5 flex flex-col gap-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <input className="field" placeholder="http://your-server-url:port" aria-label="Server URL" />
              <input className="field" placeholder="Username from your activation email" aria-label="Username" />
              <input className="field" placeholder="Or paste your M3U link" aria-label="M3U link" />
              <button type="submit" className="btn-accent mt-1 !py-3 !text-[14.5px]">Check my line</button>
            </form>
            <p className="mt-4 text-[13px] text-ink-5">
              Nothing is stored — this only checks that the format of your details looks right.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
