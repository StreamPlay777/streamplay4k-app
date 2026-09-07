import { trustpilot } from '../data/reviews';
import Stars from './Stars';

/**
 * Rating summary linking to the public Trustpilot profile.
 * Figures come from src/data/reviews.ts — never typed in here.
 */
export default function TrustpilotBadge({ className = '' }: { className?: string }) {
  return (
    <a
      href={trustpilot.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`StreamPlay4K is rated ${trustpilot.rating} out of 5 from ${trustpilot.reviewCount} reviews on Trustpilot. Opens in a new tab.`}
      className={`inline-flex items-center gap-2.5 rounded-xl border border-white/[.12] bg-white/[.05]
                  px-3.5 py-2.5 transition-colors hover:border-white/25 sm:gap-3 sm:px-4 ${className}`}
    >
      <span
        className="grid h-7 w-7 flex-none place-items-center rounded-md"
        style={{ background: trustpilot.green }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" width="16" height="16">
          <path fill="#fff" d="M12 1.6l3.1 6.9 7.5.7-5.6 5 1.6 7.4L12 17.8 5.4 21.6 7 14.2l-5.6-5 7.5-.7z" />
        </svg>
      </span>
      <Stars />
      <span aria-hidden="true" className="text-[13px] text-ink-2 sm:text-[13.5px]">
        <strong className="font-semibold text-ink">{trustpilot.rating}</strong> on Trustpilot
        <span className="hidden sm:inline"> · {trustpilot.reviewCount} reviews</span>
      </span>
    </a>
  );
}
