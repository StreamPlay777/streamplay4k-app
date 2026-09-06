/**
 * Titles shown as labelled cards in the on-demand section.
 *
 * Every entry maps to a poster file in src/assets/posters. Kept separate from
 * the wider poster set because these carry a genre and a title on screen —
 * the rest of the artwork only ever appears in the blurred backdrop, where a
 * name is neither shown nor needed.
 *
 * The "4K · Subtitles" line under each card is the point of this section: it
 * says what the customer gets, not merely that films exist.
 */

export interface ShowcaseTitle {
  /** Filename in src/assets/posters, without the extension. */
  slug: string;
  name: string;
  genre: string;
}

export const showcase: ShowcaseTitle[] = [
  { slug: 'forrest-gump', name: 'Forrest Gump', genre: 'Drama' },
  { slug: 'inception', name: 'Inception', genre: 'Sci-fi' },
  { slug: 'the-matrix', name: 'The Matrix', genre: 'Sci-fi' },
  { slug: 'goodfellas', name: 'Goodfellas', genre: 'Crime' },
  { slug: 'interstellar', name: 'Interstellar', genre: 'Sci-fi' },
  { slug: 'the-godfather', name: 'The Godfather', genre: 'Crime' },
  { slug: 'gladiator', name: 'Gladiator', genre: 'Action' },
  { slug: 'breaking-bad', name: 'Breaking Bad', genre: 'Series' },
];

/** Shown under every card — the actual selling point. */
export const STREAM_NOTE = '4K Stream · Subtitles';
