/**
 * Titles shown as labelled cards in the on-demand section.
 *
 * Covers every supplied poster that carries a readable filename — the rest of
 * the set arrived with hashed names, so those stay in the blurred backdrop
 * where no label is shown or needed.
 *
 * The "4K · Subtitles" line under each card is the point of the section: it
 * says what the customer gets, not merely that films exist.
 */

export interface ShowcaseTitle {
  /** Filename in src/assets/posters, without the extension. */
  slug: string;
  name: string;
  genre: string;
}

export const showcase: ShowcaseTitle[] = [
  { slug: 'the-matrix', name: 'The Matrix', genre: 'Sci-fi' },
  { slug: 'inception', name: 'Inception', genre: 'Sci-fi' },
  { slug: 'interstellar', name: 'Interstellar', genre: 'Sci-fi' },
  { slug: 'the-godfather', name: 'The Godfather', genre: 'Crime' },
  { slug: 'goodfellas', name: 'Goodfellas', genre: 'Crime' },
  { slug: 'pulp-fiction', name: 'Pulp Fiction', genre: 'Crime' },
  { slug: 'the-shawshank-redemption', name: 'The Shawshank Redemption', genre: 'Drama' },
  { slug: 'forrest-gump', name: 'Forrest Gump', genre: 'Drama' },
  { slug: 'whiplash', name: 'Whiplash', genre: 'Drama' },
  { slug: 'joker', name: 'Joker', genre: 'Drama' },
  { slug: 'oppenheimer', name: 'Oppenheimer', genre: 'Drama' },
  { slug: 'titanic', name: 'Titanic', genre: 'Romance' },
  { slug: 'the-dark-knight', name: 'The Dark Knight', genre: 'Action' },
  { slug: 'gladiator', name: 'Gladiator', genre: 'Action' },
  { slug: 'john-wick', name: 'John Wick', genre: 'Action' },
  { slug: 'mad-max-fury-road', name: 'Mad Max: Fury Road', genre: 'Action' },
  { slug: 'top-gun-maverick', name: 'Top Gun: Maverick', genre: 'Action' },
  { slug: 'skyfall', name: 'Skyfall', genre: 'Action' },
  { slug: 'django-unchained', name: 'Django Unchained', genre: 'Western' },
  { slug: 'avengers-endgame', name: 'Avengers: Endgame', genre: 'Action' },
  { slug: 'black-panther', name: 'Black Panther', genre: 'Action' },
  { slug: 'aquaman', name: 'Aquaman', genre: 'Action' },
  { slug: 'venom-last-dance', name: 'Venom: The Last Dance', genre: 'Action' },
  { slug: 'avatar', name: 'Avatar', genre: 'Sci-fi' },
  { slug: 'star-wars-a-new-hope', name: 'Star Wars: A New Hope', genre: 'Sci-fi' },
  { slug: 'jurassic-park', name: 'Jurassic Park', genre: 'Adventure' },
  { slug: 'lotr-fellowship', name: 'The Fellowship of the Ring', genre: 'Fantasy' },
  { slug: 'harry-potter-philosophers-stone', name: "Harry Potter and the Philosopher's Stone", genre: 'Fantasy' },
  { slug: 'get-out', name: 'Get Out', genre: 'Horror' },
  { slug: 'the-lion-king', name: 'The Lion King', genre: 'Family' },
  { slug: 'frozen', name: 'Frozen', genre: 'Family' },
  { slug: 'red-one', name: 'Red One', genre: 'Family' },
  { slug: 'breaking-bad', name: 'Breaking Bad', genre: 'Series' },
  { slug: 'game-of-thrones', name: 'Game of Thrones', genre: 'Series' },
];

/** Shown under every card — the actual selling point. */
export const STREAM_NOTE = '4K · Subtitles';
