/**
 * Tilted poster collage.
 *
 * Purely decorative, so the whole thing is hidden from screen readers — the
 * section's own copy carries the meaning. That also lets the posters be chosen
 * for how they look together rather than needing individual alt text.
 *
 * The grid is rotated and over-scaled so its corners stay outside the frame;
 * a rotated rectangle inside a straight one would otherwise show wedges of
 * empty background. `overflow-hidden` plus a soft edge mask does the rest.
 */

const files = import.meta.glob('../assets/posters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const ALL = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export default function PosterWall({ count = 15 }: { count?: number }) {
  // Spread the picks across the set so the same few never sit side by side.
  const step = Math.max(1, Math.floor(ALL.length / count));
  const picks = Array.from({ length: count }, (_, i) => ALL[(i * step) % ALL.length]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-[340px] select-none overflow-hidden sm:h-[420px] lg:h-[520px]"

    >
      <div
        className="absolute left-1/2 top-1/2 w-[128%] -translate-x-1/2 -translate-y-1/2"
        style={{ transform: 'translate(-50%, -50%) rotate(-9deg)' }}
      >
        <div className="grid grid-cols-5 gap-2 sm:gap-2.5">
          {picks.map((src, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,.5)] sm:rounded-xl"
              // Nudge alternate columns so the rows read as a collage rather
              // than a plain table of images.
              style={{ transform: `translateY(${(i % 5) * 12 - 24}px)` }}
            >
              <img
                src={src}
                alt=""
                loading="lazy"
                decoding="async"
                className="block aspect-[2/3] w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Edge fades.
          A CSS mask left a hard straight line where the rotated grid met the
          overflow boundary, so the edges are blended with gradients painted in
          the section's own background colour instead — exact, and no reliance
          on mask support. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />
    </div>
  );
}
