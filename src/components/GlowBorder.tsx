import type { ReactNode } from 'react';

/**
 * Animated brand-gradient rim for a single hero element.
 *
 * The look is borrowed from the "glowing shadow" pattern, but rebuilt to fit
 * this site:
 *
 * - Our two brand colours (#FF2B20 -> #FF7A18) rather than a rotating rainbow.
 * - Only `rotate` and `opacity` animate. Both are handled by the compositor, so
 *   the browser never repaints. The original animated a 60px blur, which forces
 *   a full repaint every frame and stutters on mid-range phones — most of our
 *   traffic.
 * - Motion stops under prefers-reduced-motion, leaving a static gradient rim.
 * - Purely decorative: aria-hidden, no pointer events, no fake button role. The
 *   real controls sit inside, untouched.
 *
 * Use it once per page. It stops being special the moment there are two.
 *
 * The rim is centred with the `translate` property, not `transform`. Individual
 * transform properties resolve translate -> rotate -> scale -> transform, so a
 * `transform: translate(-50%,-50%)` would be applied *after* the rotation, in
 * the rotated frame, and swing the rim around the card instead of spinning it
 * in place.
 */
export default function GlowBorder({
  children, className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <span
        aria-hidden="true"
        className="glow-halo pointer-events-none absolute -inset-x-3 -inset-y-8 z-0 rounded-[38px] blur-2xl"
      />
      <div className="relative z-10 overflow-hidden rounded-2xl bg-white/[.10] p-[2px]">
        {/* Below lg the card is tall and narrow, and a rotating square can only
            ever light a short stretch of the long edges — it reads as two stray
            slivers rather than a sweep. Static gradient rim there instead, which
            also means phones, where the animation would cost the most, run none
            of it. */}
        <span aria-hidden="true" className="glow-rim-static pointer-events-none absolute inset-0 lg:hidden" />
        <span
          aria-hidden="true"
          className="glow-rim pointer-events-none absolute left-1/2 top-1/2 hidden aspect-square w-[max(150%,640px)] lg:block [translate:-50%_-50%]"
        />
        <div className="relative rounded-[14px] bg-bg-alt">
          <div className="rounded-[14px] bg-white/[.025]">{children}</div>
        </div>
      </div>
    </div>
  );
}
