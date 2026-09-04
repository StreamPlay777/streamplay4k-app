/**
 * Channel guide data.
 *
 * SCALE NOTE — the real line-up is 60,000+ channels across 73 countries. That cannot
 * ship as a static bundle (it would be hundreds of MB), so this file carries the
 * headline counts plus a browsable sample per country, exactly as the live Primo
 * guide does ("Showing 300 of 10,887"). `count` is the real figure shown to visitors;
 * `channels` is what the grid renders.
 *
 * TO GO LIVE with the full catalogue, replace `getChannels()` with a fetch against
 * your Xtream Codes panel (`player_api.php?action=get_live_streams`) or a parsed M3U.
 * Nothing else in the UI needs to change — it already reads through this function.
 */

export interface Channel {
  name: string;
  category: string;
  /** Marked 4K/8K in the provider line-up. */
  uhd?: boolean;
  /**
   * Channel logo URL. Your Xtream Codes panel already returns one per channel
   * as `stream_icon` on get_live_streams — map it straight onto this field when
   * you wire the live feed and every card picks it up automatically.
   * Do NOT scrape broadcaster logos from other sites.
   */
  logo?: string;
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  /** Real channel count for this region — displayed, not derived from the sample. */
  count: number;
  channels: Channel[];
}

/** Category chips above the grid. `null` id means "All categories". */
export const categories = [
  'Sports',
  'News',
  'Entertainment',
  'Movies',
  'Kids',
  'Documentary',
  'Music',
] as const;

export type Category = (typeof categories)[number];

const US: Channel[] = [
  { name: 'ESPN', category: 'Sports', uhd: true },
  { name: 'ESPN2', category: 'Sports' },
  { name: 'FOX Sports 1', category: 'Sports', uhd: true },
  { name: 'NFL Network', category: 'Sports', uhd: true },
  { name: 'NBA TV', category: 'Sports', uhd: true },
  { name: 'MLB Network', category: 'Sports' },
  { name: 'NBC Sports', category: 'Sports' },
  { name: 'CBS Sports Network', category: 'Sports' },
  { name: 'TNT Sports', category: 'Sports', uhd: true },
  { name: 'CNN', category: 'News' },
  { name: 'Fox News', category: 'News' },
  { name: 'MSNBC', category: 'News' },
  { name: 'CNBC', category: 'News' },
  { name: 'ABC News Live', category: 'News' },
  { name: 'CBS News', category: 'News' },
  { name: 'NBC', category: 'Entertainment', uhd: true },
  { name: 'ABC', category: 'Entertainment' },
  { name: 'CBS', category: 'Entertainment' },
  { name: 'FOX', category: 'Entertainment' },
  { name: 'USA Network', category: 'Entertainment' },
  { name: 'TNT', category: 'Entertainment' },
  { name: 'AMC', category: 'Entertainment' },
  { name: 'FX', category: 'Entertainment' },
  { name: 'Bravo', category: 'Entertainment' },
  { name: 'HBO', category: 'Movies', uhd: true },
  { name: 'HBO 2', category: 'Movies' },
  { name: 'Cinemax', category: 'Movies' },
  { name: 'Showtime', category: 'Movies', uhd: true },
  { name: 'Starz', category: 'Movies' },
  { name: 'Paramount Network', category: 'Movies' },
  { name: 'Cartoon Network', category: 'Kids' },
  { name: 'Nickelodeon', category: 'Kids' },
  { name: 'Disney Channel', category: 'Kids' },
  { name: 'Disney Junior', category: 'Kids' },
  { name: 'PBS Kids', category: 'Kids' },
  { name: 'Discovery Channel', category: 'Documentary', uhd: true },
  { name: 'National Geographic', category: 'Documentary', uhd: true },
  { name: 'History', category: 'Documentary' },
  { name: 'Animal Planet', category: 'Documentary' },
  { name: 'Smithsonian Channel', category: 'Documentary' },
  { name: 'MTV', category: 'Music' },
  { name: 'VH1', category: 'Music' },
  { name: 'CMT', category: 'Music' },
];

const UK: Channel[] = [
  { name: 'Sky Sports Main Event', category: 'Sports', uhd: true },
  { name: 'Sky Sports Premier League', category: 'Sports', uhd: true },
  { name: 'Sky Sports Football', category: 'Sports' },
  { name: 'Sky Sports F1', category: 'Sports', uhd: true },
  { name: 'Sky Sports Cricket', category: 'Sports' },
  { name: 'TNT Sports 1', category: 'Sports', uhd: true },
  { name: 'TNT Sports 2', category: 'Sports' },
  { name: 'Premier Sports 1', category: 'Sports' },
  { name: 'BBC News', category: 'News' },
  { name: 'Sky News', category: 'News' },
  { name: 'GB News', category: 'News' },
  { name: 'BBC One', category: 'Entertainment', uhd: true },
  { name: 'BBC Two', category: 'Entertainment' },
  { name: 'ITV1', category: 'Entertainment', uhd: true },
  { name: 'ITV2', category: 'Entertainment' },
  { name: 'Channel 4', category: 'Entertainment' },
  { name: 'Channel 5', category: 'Entertainment' },
  { name: 'Sky Showcase', category: 'Entertainment' },
  { name: 'Dave', category: 'Entertainment' },
  { name: 'Sky Cinema Premiere', category: 'Movies', uhd: true },
  { name: 'Sky Cinema Action', category: 'Movies' },
  { name: 'Sky Cinema Comedy', category: 'Movies' },
  { name: 'Film4', category: 'Movies' },
  { name: 'CBeebies', category: 'Kids' },
  { name: 'CBBC', category: 'Kids' },
  { name: 'Nick Jr. UK', category: 'Kids' },
  { name: 'Sky Documentaries', category: 'Documentary', uhd: true },
  { name: 'Sky Nature', category: 'Documentary' },
  { name: 'Discovery UK', category: 'Documentary' },
  { name: 'MTV UK', category: 'Music' },
  { name: 'Kiss TV', category: 'Music' },
];

const CA: Channel[] = [
  { name: 'TSN 1', category: 'Sports', uhd: true },
  { name: 'TSN 2', category: 'Sports' },
  { name: 'TSN 3', category: 'Sports' },
  { name: 'Sportsnet Ontario', category: 'Sports', uhd: true },
  { name: 'Sportsnet One', category: 'Sports' },
  { name: 'RDS', category: 'Sports' },
  { name: 'CBC News Network', category: 'News' },
  { name: 'CTV News Channel', category: 'News' },
  { name: 'ICI RDI', category: 'News' },
  { name: 'CBC', category: 'Entertainment', uhd: true },
  { name: 'CTV', category: 'Entertainment', uhd: true },
  { name: 'CTV 2', category: 'Entertainment' },
  { name: 'Global', category: 'Entertainment', uhd: true },
  { name: 'Citytv', category: 'Entertainment' },
  { name: 'ICI Radio-Canada Télé', category: 'Entertainment' },
  { name: 'TVA', category: 'Entertainment' },
  { name: 'Crave 1', category: 'Movies', uhd: true },
  { name: 'Super Écran 1', category: 'Movies' },
  { name: 'Showcase', category: 'Movies' },
  { name: 'Treehouse TV', category: 'Kids' },
  { name: 'YTV', category: 'Kids' },
  { name: 'Discovery Canada', category: 'Documentary' },
  { name: 'Nat Geo Canada', category: 'Documentary', uhd: true },
  { name: 'MuchMusic', category: 'Music' },
];

const ES: Channel[] = [
  { name: 'LaLiga TV', category: 'Sports', uhd: true },
  { name: 'DAZN LaLiga', category: 'Sports', uhd: true },
  { name: 'Movistar Deportes', category: 'Sports' },
  { name: 'Eurosport 1 ES', category: 'Sports' },
  { name: 'Canal 24 Horas', category: 'News' },
  { name: 'Antena 3 Noticias', category: 'News' },
  { name: 'La 1', category: 'Entertainment', uhd: true },
  { name: 'La 2', category: 'Entertainment' },
  { name: 'Antena 3', category: 'Entertainment', uhd: true },
  { name: 'Telecinco', category: 'Entertainment' },
  { name: 'Cuatro', category: 'Entertainment' },
  { name: 'laSexta', category: 'Entertainment' },
  { name: 'Movistar Estrenos', category: 'Movies', uhd: true },
  { name: 'AMC España', category: 'Movies' },
  { name: 'TCM España', category: 'Movies' },
  { name: 'Clan TVE', category: 'Kids' },
  { name: 'Boing', category: 'Kids' },
  { name: 'Odisea', category: 'Documentary' },
  { name: 'Nat Geo España', category: 'Documentary', uhd: true },
  { name: 'Los 40 TV', category: 'Music' },
];

const FR: Channel[] = [
  { name: 'Canal+ Sport', category: 'Sports', uhd: true },
  { name: 'beIN Sports 1', category: 'Sports', uhd: true },
  { name: 'beIN Sports 2', category: 'Sports' },
  { name: 'RMC Sport 1', category: 'Sports' },
  { name: 'Eurosport 1 FR', category: 'Sports' },
  { name: 'BFM TV', category: 'News' },
  { name: 'France Info', category: 'News' },
  { name: 'LCI', category: 'News' },
  { name: 'TF1', category: 'Entertainment', uhd: true },
  { name: 'France 2', category: 'Entertainment', uhd: true },
  { name: 'France 3', category: 'Entertainment' },
  { name: 'M6', category: 'Entertainment' },
  { name: 'Arte', category: 'Entertainment' },
  { name: 'C8', category: 'Entertainment' },
  { name: 'Canal+ Cinéma', category: 'Movies', uhd: true },
  { name: 'OCS Max', category: 'Movies' },
  { name: 'Ciné+ Premier', category: 'Movies' },
  { name: 'Gulli', category: 'Kids' },
  { name: 'TiJi', category: 'Kids' },
  { name: 'Ushuaïa TV', category: 'Documentary', uhd: true },
  { name: 'RMC Découverte', category: 'Documentary' },
  { name: 'MTV France', category: 'Music' },
];

const DE: Channel[] = [
  { name: 'Sky Sport Bundesliga', category: 'Sports', uhd: true },
  { name: 'Sky Sport Top Event', category: 'Sports', uhd: true },
  { name: 'DAZN 1 DE', category: 'Sports' },
  { name: 'Eurosport 1 DE', category: 'Sports' },
  { name: 'n-tv', category: 'News' },
  { name: 'WELT', category: 'News' },
  { name: 'tagesschau24', category: 'News' },
  { name: 'Das Erste', category: 'Entertainment', uhd: true },
  { name: 'ZDF', category: 'Entertainment', uhd: true },
  { name: 'RTL', category: 'Entertainment', uhd: true },
  { name: 'SAT.1', category: 'Entertainment' },
  { name: 'ProSieben', category: 'Entertainment' },
  { name: 'VOX', category: 'Entertainment' },
  { name: 'Sky Cinema Premieren', category: 'Movies', uhd: true },
  { name: 'RTL Zwei', category: 'Movies' },
  { name: 'KiKA', category: 'Kids' },
  { name: 'Super RTL', category: 'Kids' },
  { name: 'ZDFinfo', category: 'Documentary' },
  { name: 'Nat Geo Deutschland', category: 'Documentary', uhd: true },
  { name: 'DELUXE MUSIC', category: 'Music' },
];

const IT: Channel[] = [
  { name: 'Sky Sport Serie A', category: 'Sports', uhd: true },
  { name: 'Sky Sport Calcio', category: 'Sports', uhd: true },
  { name: 'DAZN 1 IT', category: 'Sports' },
  { name: 'Eurosport 1 IT', category: 'Sports' },
  { name: 'Sky TG24', category: 'News' },
  { name: 'Rai News 24', category: 'News' },
  { name: 'Rai 1', category: 'Entertainment', uhd: true },
  { name: 'Rai 2', category: 'Entertainment' },
  { name: 'Rai 3', category: 'Entertainment' },
  { name: 'Canale 5', category: 'Entertainment', uhd: true },
  { name: 'Italia 1', category: 'Entertainment' },
  { name: 'Rete 4', category: 'Entertainment' },
  { name: 'Sky Cinema Uno', category: 'Movies', uhd: true },
  { name: 'Premium Cinema', category: 'Movies' },
  { name: 'Rai Gulp', category: 'Kids' },
  { name: 'Rai YoYo', category: 'Kids' },
  { name: 'Focus', category: 'Documentary' },
  { name: 'Nat Geo Italia', category: 'Documentary', uhd: true },
];

const AR: Channel[] = [
  { name: 'beIN Sports MENA 1', category: 'Sports', uhd: true },
  { name: 'beIN Sports MENA 2', category: 'Sports', uhd: true },
  { name: 'SSC Sport 1', category: 'Sports', uhd: true },
  { name: 'Abu Dhabi Sports 1', category: 'Sports' },
  { name: 'Al Kass One', category: 'Sports' },
  { name: 'Al Jazeera', category: 'News' },
  { name: 'Al Arabiya', category: 'News' },
  { name: 'Sky News Arabia', category: 'News' },
  { name: 'Al Hadath', category: 'News' },
  { name: 'MBC 1', category: 'Entertainment', uhd: true },
  { name: 'MBC 4', category: 'Entertainment' },
  { name: 'MBC Drama', category: 'Entertainment' },
  { name: 'Dubai TV', category: 'Entertainment' },
  { name: 'Rotana Khalijia', category: 'Entertainment' },
  { name: 'MBC 2', category: 'Movies', uhd: true },
  { name: 'MBC Max', category: 'Movies' },
  { name: 'Rotana Cinema', category: 'Movies' },
  { name: 'MBC 3', category: 'Kids' },
  { name: 'Spacetoon', category: 'Kids' },
  { name: 'Nat Geo Abu Dhabi', category: 'Documentary', uhd: true },
  { name: 'Rotana Clip', category: 'Music' },
];

const ASIA: Channel[] = [
  { name: 'Star Sports 1', category: 'Sports', uhd: true },
  { name: 'Star Sports 2', category: 'Sports' },
  { name: 'Sony Sports Ten 1', category: 'Sports', uhd: true },
  { name: 'Willow Cricket', category: 'Sports' },
  { name: 'NDTV 24x7', category: 'News' },
  { name: 'India Today', category: 'News' },
  { name: 'Times Now', category: 'News' },
  { name: 'Star Plus', category: 'Entertainment', uhd: true },
  { name: 'Zee TV', category: 'Entertainment' },
  { name: 'Sony Entertainment', category: 'Entertainment' },
  { name: 'Colors TV', category: 'Entertainment' },
  { name: 'Star Gold', category: 'Movies', uhd: true },
  { name: 'Zee Cinema', category: 'Movies' },
  { name: 'Sony MAX', category: 'Movies' },
  { name: 'Pogo', category: 'Kids' },
  { name: 'Hungama TV', category: 'Kids' },
  { name: 'Discovery India', category: 'Documentary' },
  { name: 'Zing', category: 'Music' },
];

const SE: Channel[] = [
  { name: 'Viaplay Sport 1', category: 'Sports', uhd: true },
  { name: 'TV4 Sport', category: 'Sports' },
  { name: 'C More Fotboll', category: 'Sports', uhd: true },
  { name: 'SVT24', category: 'News' },
  { name: 'TV4 Nyheterna', category: 'News' },
  { name: 'SVT1', category: 'Entertainment', uhd: true },
  { name: 'SVT2', category: 'Entertainment' },
  { name: 'TV4', category: 'Entertainment', uhd: true },
  { name: 'Kanal 5', category: 'Entertainment' },
  { name: 'TV6', category: 'Entertainment' },
  { name: 'C More First', category: 'Movies', uhd: true },
  { name: 'SVT Barn', category: 'Kids' },
  { name: 'Kunskapskanalen', category: 'Documentary' },
];

const NL: Channel[] = [
  { name: 'ESPN 1 NL', category: 'Sports', uhd: true },
  { name: 'Ziggo Sport Totaal', category: 'Sports', uhd: true },
  { name: 'NOS Journaal', category: 'News' },
  { name: 'NPO Nieuws', category: 'News' },
  { name: 'NPO 1', category: 'Entertainment', uhd: true },
  { name: 'NPO 2', category: 'Entertainment' },
  { name: 'RTL 4', category: 'Entertainment', uhd: true },
  { name: 'RTL 5', category: 'Entertainment' },
  { name: 'SBS6', category: 'Entertainment' },
  { name: 'Film1 Premiere', category: 'Movies', uhd: true },
  { name: 'NPO Zapp', category: 'Kids' },
  { name: 'Discovery NL', category: 'Documentary' },
];

const AL: Channel[] = [
  { name: 'SuperSport Kosova 1', category: 'Sports', uhd: true },
  { name: 'Tring Sport 1', category: 'Sports' },
  { name: 'Top News', category: 'News' },
  { name: 'News 24 AL', category: 'News' },
  { name: 'Top Channel', category: 'Entertainment', uhd: true },
  { name: 'TV Klan', category: 'Entertainment' },
  { name: 'RTSH 1', category: 'Entertainment' },
  { name: 'Film Autor', category: 'Movies' },
  { name: 'Bang Bang', category: 'Kids' },
  { name: 'Explorer History', category: 'Documentary' },
];

const GR: Channel[] = [
  { name: 'Cosmote Sport 1', category: 'Sports', uhd: true },
  { name: 'Novasports 1', category: 'Sports', uhd: true },
  { name: 'SKAI News', category: 'News' },
  { name: 'ERT News', category: 'News' },
  { name: 'ERT1', category: 'Entertainment', uhd: true },
  { name: 'ANT1', category: 'Entertainment' },
  { name: 'MEGA', category: 'Entertainment' },
  { name: 'STAR', category: 'Entertainment' },
  { name: 'Cosmote Cinema 1', category: 'Movies', uhd: true },
  { name: 'ERT Kids', category: 'Kids' },
  { name: 'Cosmote History', category: 'Documentary' },
];

/**
 * Countries shown in the guide rail, biggest groups first.
 * Counts are the real line-up figures; the remaining 59 regions live behind
 * the "all 73 countries" total rather than being listed individually.
 */
export const countries: Country[] = [
  { id: 'us', name: 'United States', flag: '🇺🇸', count: 10887, channels: US },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', count: 2897, channels: UK },
  { id: 'ar', name: 'Arabic', flag: '🇸🇦', count: 4583, channels: AR },
  { id: 'de', name: 'Germany', flag: '🇩🇪', count: 2126, channels: DE },
  { id: 'in', name: 'Asia / India', flag: '🇮🇳', count: 1914, channels: ASIA },
  { id: 'fr', name: 'France', flag: '🇫🇷', count: 1815, channels: FR },
  { id: 'es', name: 'Spain', flag: '🇪🇸', count: 1688, channels: ES },
  { id: 'se', name: 'Sweden', flag: '🇸🇪', count: 1570, channels: SE },
  { id: 'nl', name: 'Netherlands', flag: '🇳🇱', count: 1421, channels: NL },
  { id: 'ca', name: 'Canada', flag: '🇨🇦', count: 1309, channels: CA },
  { id: 'it', name: 'Italy', flag: '🇮🇹', count: 1295, channels: IT },
  { id: 'al', name: 'Albania', flag: '🇦🇱', count: 841, channels: AL },
  { id: 'gr', name: 'Greece', flag: '🇬🇷', count: 828, channels: GR },
];

/**
 * The guide's read path. Swap the body of this for a panel/M3U fetch to go live
 * against the full catalogue — every caller already goes through here.
 */
export function getChannels(countryId: string, category: Category | null, query: string): Channel[] {
  const country = countries.find((c) => c.id === countryId);
  if (!country) return [];
  const q = query.trim().toLowerCase();
  return country.channels.filter(
    (ch) =>
      (!category || ch.category === category) &&
      (!q || ch.name.toLowerCase().includes(q) || ch.category.toLowerCase().includes(q)),
  );
}

/** Initials fallback shown until a real channel logo is supplied. */
export function channelInitials(name: string): string {
  return name
    .replace(/[^A-Za-z0-9 ]/g, '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

/** Per-category counts for the filter chips, scaled to the country's real total. */
export function categoryCounts(country: Country): { category: Category; count: number }[] {
  const sample = country.channels.length || 1;
  return categories.map((category) => {
    const inSample = country.channels.filter((c) => c.category === category).length;
    return { category, count: Math.round((inSample / sample) * country.count) };
  });
}
