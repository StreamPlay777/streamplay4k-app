import { showcase, STREAM_NOTE } from '../data/showcase';

const files = import.meta.glob('../assets/posters/*.webp', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

function posterFor(slug: string): string | undefined {
  const key = Object.keys(files).find((k) => k.endsWith(`/${slug}.webp`));
  return key ? files[key] : undefined;
}

/**
 * Row of labelled poster cards, the centre one raised.
 *
 * Unlike the wall behind it, these are content rather than decoration: each
 * card names the title and says "4K Stream · Subtitles", which is the point of
 * the section. So they carry real alt text and are not hidden from readers.
 */
export default function ShowcaseRow() {
  // An odd count keeps a true centre card to raise.
  const cards = showcase.slice(0, 5);
  const middle = Math.floor(cards.length / 2);

  return (
    <ul className="flex items-center justify-center gap-3 overflow-x-auto px-5 pb-2 sm:gap-4 sm:overflow-visible sm:px-0">
      {cards.map((t, i) => {
        const src = posterFor(t.slug);
        const isMiddle = i === middle;
        return (
          <li
            key={t.slug}
            className={`relative w-[150px] flex-none overflow-hidden rounded-xl sm:w-[172px] lg:w-[196px] ${
              isMiddle
                ? 'z-10 border-2 border-white/70 shadow-[0_24px_60px_rgba(0,0,0,.7)] sm:scale-[1.14]'
                : 'border border-white/10 shadow-[0_14px_36px_rgba(0,0,0,.55)] sm:opacity-90'
            }`}
          >
            {src ? (
              <img
                src={src}
                alt={`${t.name} — ${t.genre}`}
                loading="lazy"
                decoding="async"
                className="block aspect-[2/3] w-full object-cover"
              />
            ) : (
              <div className="placeholder-stripes aspect-[2/3] w-full" />
            )}

            {/* Scrim keeps the label readable over any artwork */}
            <div
              className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-10"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(4,6,11,.93))' }}
            >
              <span className="inline-block rounded bg-accent px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wide text-white">
                {t.genre}
              </span>
              <p className="mt-1.5 truncate font-display text-[14px] font-bold text-white">{t.name}</p>
              <p className="text-[11px] text-white/70">{STREAM_NOTE}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
