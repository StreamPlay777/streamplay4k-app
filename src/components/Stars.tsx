import { trustpilot } from '../data/reviews';

/**
 * Trustpilot-style rating. Carries the rating as text for screen readers, so
 * it never depends on the star colour alone.
 */
export default function Stars({ value = 5, size = 15 }: { value?: number; size?: number }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5 align-middle">
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
          <path
            fill={i < value ? trustpilot.green : 'rgba(255,255,255,.22)'}
            d="M12 1.6l3.1 6.9 7.5.7-5.6 5 1.6 7.4L12 17.8 5.4 21.6 7 14.2l-5.6-5 7.5-.7z"
          />
        </svg>
      ))}
    </span>
  );
}
