import { trustpilot } from '../data/trustpilot';

/** Trustpilot's star glyph, drawn inline rather than pulling their widget. */
function Star({ size = 15 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path
        fill={trustpilot.green}
        d="M12 1.6l3.1 6.9 7.5.7-5.6 5 1.6 7.4L12 17.8 5.4 21.6 7 14.2l-5.6-5 7.5-.7z"
      />
    </svg>
  );
}

/**
 * Rating badge linking to the public Trustpilot profile.
 *
 * The figures come from src/data/trustpilot.ts and are placeholders until the
 * real profile numbers are wired in — see the note in that file.
 */
export default function TrustpilotBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={trustpilot.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 rounded-xl border border-white/[.12] bg-white/[.05]
                  px-3.5 py-2.5 transition-colors hover:border-white/25 sm:gap-3 sm:px-4 ${className}`}
    >
      <span
        className="grid h-7 w-7 flex-none place-items-center rounded-md"
        style={{ background: trustpilot.green }}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path fill="#fff" d="M12 1.6l3.1 6.9 7.5.7-5.6 5 1.6 7.4L12 17.8 5.4 21.6 7 14.2l-5.6-5 7.5-.7z" />
        </svg>
      </span>
      <span className="flex flex-none gap-0.5">
        {Array.from({ length: 5 }, (_, i) => <Star key={i} />)}
      </span>
      <span className="text-[13px] text-ink-2 sm:text-[13.5px]">
        <strong className="font-semibold text-ink">{trustpilot.rating}</strong> on Trustpilot
        <span className="hidden sm:inline"> · {trustpilot.reviewCount.toLocaleString('en-US')} reviews</span>
      </span>
    </a>
  );
}
