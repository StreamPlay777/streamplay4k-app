/**
 * Platforms StreamPlay4K runs on (brief §10, expanded in the correction pass).
 *
 * The client has confirmed support for all major device categories including
 * MAG boxes, so Roku, Sony, MAG and Kodi are now listed. Where a platform has
 * no dedicated walkthrough yet it points at the nearest guide that covers it —
 * Roku and Sony at the smart-TV steps, MAG and Kodi at the M3U/Xtream login
 * that both use.
 *
 * TODO(content): give MAG, Roku and Kodi their own sections in data/setup.ts so
 * `guide` stops sharing an anchor with a neighbour.
 *
 * NO DUPLICATES: each row is a distinct platform. Devices that install
 * identically are merged rather than repeated — "Android phone & tablet" is one
 * row, not two, and Fire TV covers the whole Fire family.
 */

export interface Platform {
  /** Short display name on the tile. */
  name: string;
  /** Which drawn mark to use — see components/PlatformMarks.tsx. */
  mark: 'fire' | 'android' | 'apple' | 'tv' | 'cast' | 'windows' | 'mac' | 'vlc'
      | 'roku' | 'mag' | 'kodi' | 'box' | 'tablet' | 'phone';
  /** Anchor on /setup-guide/. */
  guide?: 'firestick' | 'android-tv' | 'smart-tv' | 'apple-tv' | 'mobile' | 'computer';
  /** One short line, used as the tile's title attribute. */
  note: string;
}

export const platforms: Platform[] = [
  /* Streaming devices */
  { name: 'Fire TV / Firestick', mark: 'fire',    guide: 'firestick',  note: 'Fire TV Stick, Fire TV Cube and Fire TV' },
  { name: 'Android TV',          mark: 'android', guide: 'android-tv', note: 'Google TV, Nvidia Shield' },
  { name: 'Apple TV',            mark: 'apple',   guide: 'apple-tv',   note: 'Apple TV 4K and Apple TV HD' },
  { name: 'Roku',                mark: 'roku',    guide: 'smart-tv',   note: 'Roku players and Roku TV' },
  { name: 'Chromecast',          mark: 'cast',    guide: 'android-tv', note: 'Chromecast with Google TV' },
  { name: 'Android Box',         mark: 'box',     guide: 'android-tv', note: 'Generic Android set-top boxes' },
  { name: 'MAG Box',             mark: 'mag',     guide: 'smart-tv',   note: 'MAG set-top boxes' },

  /* Televisions */
  { name: 'Samsung TV',          mark: 'tv',      guide: 'smart-tv',   note: 'Via the Samsung Apps store' },
  { name: 'LG TV',               mark: 'tv',      guide: 'smart-tv',   note: 'Via the LG Content Store' },
  { name: 'Sony TV',             mark: 'tv',      guide: 'android-tv', note: 'Sony sets running Google TV' },

  /* Handhelds */
  { name: 'iPhone',              mark: 'apple',   guide: 'mobile',     note: 'iOS, from the App Store' },
  { name: 'iPad',                mark: 'tablet',  guide: 'mobile',     note: 'iPadOS, from the App Store' },
  { name: 'Android phone',       mark: 'phone',   guide: 'mobile',     note: 'Android phones' },
  { name: 'Android tablet',      mark: 'tablet',  guide: 'mobile',     note: 'Android tablets' },

  /* Computers and players */
  { name: 'Windows',             mark: 'windows', guide: 'computer',   note: 'Windows 10 and 11' },
  { name: 'macOS',               mark: 'mac',     guide: 'computer',   note: 'Intel and Apple silicon' },
  { name: 'Kodi',                mark: 'kodi',    guide: 'computer',   note: 'PVR / M3U add-on' },
  { name: 'VLC',                 mark: 'vlc',     guide: 'computer',   note: 'M3U playlist on desktop' },
];

/** Split into two rows for the alternating marquee. */
export const platformRowA = platforms.filter((_, i) => i % 2 === 0);
export const platformRowB = platforms.filter((_, i) => i % 2 === 1);
