/** Inline tick. Kept local rather than pulling a further icon set (spec §9). */
export default function Check({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className={className}>
      <path
        d="M13.5 4.5 6.5 11.5 2.5 7.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
