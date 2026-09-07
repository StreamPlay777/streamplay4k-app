/**
 * Platforms StreamPlay4K runs on (brief §10).
 *
 * SOURCE OF TRUTH: this list is derived from data/setup.ts, which holds the
 * install steps we actually publish. Nothing is listed here that we cannot
 * walk a customer through.
 *
 * Deliberately NOT listed, despite being suggested in the brief, because no
 * setup guide or support confirmation exists for them:
 *   - Roku          (no guide; Roku blocks sideloading)
 *   - Sony Smart TV (covered only where the set runs Google TV — see androidtv)
 *   - MAG box       (no guide, no confirmation from the provider)
 * TODO(client): confirm support for these three and we will add a guide and a
 * tile for each. Until then they stay off the page rather than being implied.
 *
 * `guide` links the tile to a section on /setup-guide/. Tiles without a guide
 * are covered by a sibling guide and say so in `note`.
 */

export interface Platform {
  /** Short display name on the tile. */
  name: string;
  /** Which drawn mark to use — see components/PlatformMarks.tsx. */
  mark: 'fire' | 'android' | 'apple' | 'tv' | 'cast' | 'windows' | 'mac' | 'vlc';
  /** Anchor on /setup-guide/, when we publish steps for it. */
  guide?: 'firestick' | 'android-tv' | 'smart-tv' | 'apple-tv' | 'mobile' | 'computer';
  /** One short line, shown on larger screens. */
  note: string;
}

export const platforms: Platform[] = [
  { name: 'Fire TV / Firestick', mark: 'fire',    guide: 'firestick',  note: 'Amazon Fire TV Stick and Fire TV' },
  { name: 'Android TV',          mark: 'android', guide: 'android-tv', note: 'Google TV, Nvidia Shield, Android boxes' },
  { name: 'Chromecast',          mark: 'cast',    guide: 'android-tv', note: 'Chromecast with Google TV' },
  { name: 'Apple TV',            mark: 'apple',   guide: 'apple-tv',   note: 'Apple TV 4K and Apple TV HD' },
  { name: 'Samsung TV',          mark: 'tv',      guide: 'smart-tv',   note: 'Via the Samsung Apps store' },
  { name: 'LG TV',               mark: 'tv',      guide: 'smart-tv',   note: 'Via the LG Content Store' },
  { name: 'Android Box',         mark: 'android', guide: 'android-tv', note: 'Generic Android set-top boxes' },
  { name: 'iPhone',              mark: 'apple',   guide: 'mobile',     note: 'iOS, from the App Store' },
  { name: 'iPad',                mark: 'apple',   guide: 'mobile',     note: 'iPadOS, from the App Store' },
  { name: 'Android phone',       mark: 'android', guide: 'mobile',     note: 'Phones and tablets' },
  { name: 'Windows',             mark: 'windows', guide: 'computer',   note: 'Windows 10 and 11' },
  { name: 'macOS',               mark: 'mac',     guide: 'computer',   note: 'Intel and Apple silicon' },
  { name: 'VLC',                 mark: 'vlc',     guide: 'computer',   note: 'M3U playlist on desktop' },
];

/** Split into two rows for the alternating marquee. */
export const platformRowA = platforms.filter((_, i) => i % 2 === 0);
export const platformRowB = platforms.filter((_, i) => i % 2 === 1);
