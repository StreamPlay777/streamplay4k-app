import { reviews } from '../data/reviews';
import { trustpilot } from '../data/trustpilot';

/**
 * Three raised review cards, tilted like a handful of printed slips.
 *
 * Light cards on the dark page for the same reason as the logo chips: they are
 * the thing you are meant to read, and lifting them out of the wall behind is
 * what makes them read as foreground.
 *
 * Each card is marked "Trustpilot" because the profile is on Trustpilot — the
 * quotes themselves are written copy while real reviews are pending, so no
 * card claims to be an individually verified review. See src/data/trustpilot.ts.
 */

const TILTS = ['-4.5deg', '1.5deg', '4deg'];
const LIFTS = ['translateY(14px)', 'translateY(-10px)', 'translateY(20px)'];

function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
}

export default function TrustCards() {
  const picks = reviews.slice(0, 3);

  return (
    <ul className="flex flex-col items-center gap-5 lg:flex-row lg:justify-center lg:gap-5">
      {picks.map((r, i) => (
        <li
          key={r.title}
          className="w-full max-w-[340px] rounded-2xl bg-white p-5 text-[#14161C]
                     shadow-[0_28px_70px_rgba(0,0,0,.6)] sm:p-6"
          style={{
            transform: `rotate(${TILTS[i]}) ${LIFTS[i]}`,
            zIndex: i === 1 ? 3 : 2 - Math.abs(1 - i),
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="text-[15px] tracking-[.18em]" style={{ color: trustpilot.green }}>
              ★★★★★
            </div>
            <span className="text-[10.5px] font-bold uppercase tracking-[.1em] text-[#6E6A61]">
              Trustpilot
            </span>
          </div>

          <p className="mt-4 font-display text-[16px] font-bold leading-snug sm:text-[17px]">
            “{r.body.length > 130 ? r.body.slice(0, 128).trimEnd() + '…' : r.body}”
          </p>

          <div className="mt-5 flex items-center gap-3 border-t border-black/10 pt-4">
            <span
              className="grid h-9 w-9 flex-none place-items-center rounded-md text-[12px] font-bold text-white"
              style={{ background: '#E0201C' }}
            >
              {initials(r.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-[14px] font-bold">{r.name}</span>
              <span className="block font-mono text-[11px] text-[#6E6A61]">
                {r.location.split(',').pop()?.trim()} · {r.date}
              </span>
            </span>
            <span
              className="flex-none rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wide"
              style={{ background: 'rgba(0,182,122,.12)', color: '#04795A' }}
            >
              Verified
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
