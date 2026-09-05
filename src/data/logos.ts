/**
 * Network logo wall.
 *
 * Every SVG in src/assets/logos is picked up automatically, so adding more
 * marks is a matter of dropping files into that folder — no code change and
 * no list to keep in sync.
 *
 * RENDERING: the marks arrive in mixed states — 80 carry brand colour, 17 have
 * no fill (so paint black), and 3 are white-only. They are shown at natural
 * colour on a light chip, which is how the same set is presented on the Primo
 * sites and reads correctly for 97 of the 100. Forcing everything to white
 * instead looks tidier in theory but collapses any mark built as knockout type
 * on a solid shape — Cartoon Network, ABC and friends turn into blank slabs.
 * The three white-only marks are inverted so they read dark on the chip.
 *
 * RIGHTS: these are broadcaster trade marks. They are fine to show as a
 * line-up indication, but confirm redistribution terms before launch and never
 * scrape further marks from competitor sites — use network press/brand kits.
 */

const files = import.meta.glob('../assets/logos/*.svg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

/** Names that title-casing gets wrong. */
const OVERRIDES: Record<string, string> = {
  aande: 'A&E',
  abc: 'ABC',
  amc: 'AMC',
  bbc: 'BBC',
  'bbc-america': 'BBC America',
  'bein-sports': 'beIN Sports',
  bet: 'BET',
  cbs: 'CBS',
  'cbs-sports': 'CBS Sports',
  'cbs-sports-network': 'CBS Sports Network',
  cgtn: 'CGTN',
  cnbc: 'CNBC',
  cnn: 'CNN',
  'directv-stream': 'DIRECTV STREAM',
  'disney-xd': 'Disney XD',
  disneyplus: 'Disney+',
  diy: 'DIY',
  'diy-network': 'DIY Network',
  e: 'E!',
  espn: 'ESPN',
  espn2: 'ESPN2',
  espnplus: 'ESPN+',
  fox: 'FOX',
  'fox-business': 'FOX Business',
  'fox-news': 'FOX News',
  'fox-weather': 'FOX Weather',
  fx: 'FX',
  fxx: 'FXX',
  gsn: 'GSN',
  hgtv: 'HGTV',
  hln: 'HLN',
  ifc: 'IFC',
  insp: 'INSP',
  'logo-tv': 'Logo TV',
  mtv: 'MTV',
  mtv2: 'MTV2',
  'nat-geo': 'National Geographic',
  nbc: 'NBC',
  'nbc-golf': 'NBC Golf',
  'nbc-sports': 'NBC Sports',
  nfl: 'NFL',
  nhl: 'NHL',
  'nhl-network': 'NHL Network',
  'nick-jr': 'Nick Jr.',
  own: 'OWN',
  paramountplus: 'Paramount+',
  pbs: 'PBS',
  'pbs-kids': 'PBS Kids',
  'sec-network': 'SEC Network',
  sny: 'SNY',
  syfy: 'Syfy',
  tcm: 'TCM',
  'the-movie-channel': 'The Movie Channel',
  'the-weather-channel': 'The Weather Channel',
  tnt: 'TNT',
  trutv: 'truTV',
  tudn: 'TUDN',
  'uefa-champions-league': 'UEFA Champions League',
  ufc: 'UFC',
  'usa-network': 'USA Network',
  vh1: 'VH1',
  'vice-tv': 'VICE TV',
  'we-tv': 'WE tv',
  'yes-network': 'YES Network',
};

function displayName(slug: string): string {
  if (OVERRIDES[slug]) return OVERRIDES[slug];
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Marks drawn in white only. Everything else sits on the light chip as-is;
 * these need inverting to black or they vanish into it.
 */
const INVERT_ON_LIGHT = new Set(['cartoon-network', 'nhl-network', 'syfy']);

export interface NetworkLogo {
  slug: string;
  name: string;
  src: string;
  /** Needs inverting to stay visible on the light chip. */
  invert: boolean;
}

export const networkLogos: NetworkLogo[] = Object.entries(files)
  .map(([path, src]) => {
    const slug = path.split('/').pop()!.replace(/\.svg$/, '');
    return { slug, name: displayName(slug), src, invert: INVERT_ON_LIGHT.has(slug) };
  })
  .sort((a, b) => a.slug.localeCompare(b.slug));

/** Two rails of roughly equal length, dealt alternately so each row mixes. */
export const logoRowA = networkLogos.filter((_, i) => i % 2 === 0);
export const logoRowB = networkLogos.filter((_, i) => i % 2 === 1);

/** Look a mark up by channel name, for the channel guide cards. */
const bySlug = new Map(networkLogos.map((l) => [l.slug, l]));

export function logoFor(channelName: string): string | undefined {
  const slug = channelName
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return bySlug.get(slug)?.src;
}
