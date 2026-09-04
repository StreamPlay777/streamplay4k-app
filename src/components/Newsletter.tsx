import { useState, type FormEvent } from 'react';
import { site } from '../data/site';

/** Newsletter strip, sits directly above the footer on every page. */
export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  // Presentational — wire to a real list provider before launch.
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSent(true);
    setEmail('');
  };

  return (
    <section className="border-t border-white/[.06] bg-bg-deep px-7 py-11">
      <div className="mx-auto grid max-w-shell items-center gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div>
          <h3 className="font-display text-[20px] font-bold text-ink">Join the {site.name} insider list</h3>
          <p className="mt-1 text-[14px] text-ink-4">
            New channel drops, setup tips and subscriber-only deals. No spam, unsubscribe any time.
          </p>
        </div>
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2.5">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            aria-label="Email address"
            className="field w-full sm:w-[260px]"
          />
          <button type="submit" className="btn-accent shrink-0 !px-6 !py-3 !text-[14px]">
            {sent ? 'Subscribed' : 'Subscribe'}
          </button>
        </form>
      </div>
    </section>
  );
}
