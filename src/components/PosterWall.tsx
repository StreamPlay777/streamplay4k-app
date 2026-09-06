/**
 * Tilted poster wall with drifting columns.
 *
 * Purely decorative, so the whole thing is hidden from screen readers — the
 * section's own copy carries the meaning. That also lets the posters be chosen
 * for how they look together rather than needing individual alt text.
 *
 * Built as independent vertical columns rather than one rotated grid: with the
 * frame tilted, columns travelling up and down alternately read as a diagonal
 * drift, which is the effect the brand sites use. Each column renders its
 * posters twice and travels exactly -50%, so the second copy lands where the
 * first began and the loop never shows a seam.
 */

const files = import.meta.glob('../assets/posters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const ALL = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const COLUMNS = 5;
const PER_COLUMN = 5;

/** Different speeds so the columns never fall into step with one another. */
const DURATIONS = [38, 46, 32, 52, 42];

export default function PosterWall() {
  // Deal the posters across the columns so no two neighbours repeat.
  const columns = Array.from({ length: COLUMNS }, (_, c) =>
    Array.from({ length: PER_COLUMN }, (_, r) => ALL[(c * PER_COLUMN + r) % ALL.length]),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative h-[340px] select-none overflow-hidden sm:h-[420px] lg:h-[520px]"
    >
      {/* The rotated plane is given an explicit size larger than the frame, so
          its corners stay outside after rotation and the columns always have a
          definite height to fill. Sizing the columns off an auto-height parent
          left them short, and the wall showed gaps as they drifted. */}
      <div
        className="absolute left-1/2 top-1/2 flex gap-2 sm:gap-2.5"
        style={{
          width: '132%',
          height: '175%',
          transform: 'translate(-50%, -50%) rotate(-9deg)',
        }}
      >
        {columns.map((col, c) => (
          <div key={c} className="h-full min-w-0 flex-1 overflow-hidden">
            <div
              className="marquee-track flex flex-col gap-2 sm:gap-2.5"
              style={{
                animationName: c % 2 === 0 ? 'marquee-up' : 'marquee-down',
                animationDuration: `${DURATIONS[c % DURATIONS.length]}s`,
                animationTimingFunction: 'linear',
                animationIterationCount: 'infinite',
              }}
            >
              {/* Two passes — the loop depends on the exact duplicate. */}
              {[0, 1].map((pass) =>
                col.map((src, r) => (
                  <div
                    key={`${pass}-${r}`}
                    className="overflow-hidden rounded-lg shadow-[0_10px_30px_rgba(0,0,0,.5)] sm:rounded-xl"
                  >
                    <img
                      src={src}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[2/3] w-full object-cover"
                    />
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edge fades painted in the section's own background colour. A CSS mask
          left a hard straight line where the rotated frame met the overflow
          boundary, so gradients do the blending instead. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg to-transparent sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-bg to-transparent sm:w-24" />
    </div>
  );
}
