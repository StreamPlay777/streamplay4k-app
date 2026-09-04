import { site } from './site';

/**
 * Per-device install steps for the Setup guide.
 * Six beats per device: permissions → get the sideload tool → enter the code →
 * install the player → log in → watch. Mirrors the live Primo tutorial page.
 */

export interface Step {
  title: string;
  body: string;
}

export interface DeviceGuide {
  id: string;
  name: string;
  short: string;
  steps: Step[];
}

const code = site.downloaderCode;

export const deviceGuides: DeviceGuide[] = [
  {
    id: 'firestick',
    name: 'Amazon Fire TV / Firestick',
    short: 'Firestick',
    steps: [
      { title: 'Allow unknown apps', body: `Settings → My Fire TV → Developer options → Install unknown apps → turn ON for Downloader.` },
      { title: 'Install Downloader', body: 'Search the Amazon Appstore for Downloader by AFTVnews and install it. Open it once so it has permission to run.' },
      { title: `Enter code ${code}`, body: `In the Downloader URL box, type ${code} and press Go. The player package downloads straight to your stick.` },
      { title: 'Install the player', body: 'When the download finishes choose Install, then Open. You can delete the installer file afterwards to save space.' },
      { title: 'Log in', body: 'Pick Xtream Codes or Load M3U, then enter the server, username and password from your activation email.' },
      { title: 'Watch', body: 'Open Live TV, Movies or Series. Your channels and the full guide load within a few seconds.' },
    ],
  },
  {
    id: 'androidtv',
    name: 'Android TV / Google TV',
    short: 'Android TV',
    steps: [
      { title: 'Allow unknown sources', body: 'Settings → Apps → Security & restrictions → Unknown sources → enable it for your browser or file manager.' },
      { title: 'Install Downloader', body: 'Find Downloader by AFTVnews on the Google Play Store and install it on your box or Google TV device.' },
      { title: `Enter code ${code}`, body: `Open Downloader, type ${code} into the URL field and press Go to fetch the player.` },
      { title: 'Install the player', body: 'Confirm the install prompt, then choose Open. Nvidia Shield and most Android boxes install it the same way.' },
      { title: 'Log in', body: 'Choose Xtream Codes login and paste the server URL, username and password we emailed you.' },
      { title: 'Watch', body: 'The channel list and seven-day guide populate automatically. Pick a category to start.' },
    ],
  },
  {
    id: 'smarttv',
    name: 'Samsung / LG smart TV',
    short: 'Smart TV',
    steps: [
      { title: 'Open your app store', body: 'Samsung TVs use the Samsung Apps store; LG TVs use the LG Content Store. Both are on the home bar.' },
      { title: 'Search for a player', body: 'Look for an IPTV player that supports Xtream Codes. Smart TVs cannot sideload APKs, so we route you to a store app.' },
      { title: 'Install and open it', body: 'Install the player and open it once. It will show a device ID or MAC address on first launch.' },
      { title: 'Note your device ID', body: 'Some smart TV players need the device ID registered before they will load a playlist. Send it to support if prompted.' },
      { title: 'Log in', body: 'Enter the server URL, username and password from your activation email, or paste your M3U link.' },
      { title: 'Watch', body: 'Channels load straight into the TV interface — no extra box or stick needed.' },
    ],
  },
  {
    id: 'appletv',
    name: 'Apple TV / iPhone / iPad',
    short: 'Apple TV',
    steps: [
      { title: 'Open the App Store', body: 'On Apple TV 4K or HD, open the App Store from the home screen. On iPhone and iPad use the normal App Store.' },
      { title: 'Get an IPTV player', body: 'Install a player that supports Xtream Codes or M3U playlists. Apple devices do not allow sideloading, so this comes from the store.' },
      { title: 'Open the player', body: 'Launch it and choose to add a new playlist or account when it asks.' },
      { title: 'Choose your login type', body: 'Pick Xtream Codes for server, username and password — or M3U if you would rather paste a single link.' },
      { title: 'Log in', body: 'Enter the details from your activation email exactly as they appear, including the port number.' },
      { title: 'Watch', body: 'AirPlay works normally, so anything playing on the iPhone can be pushed to the TV.' },
    ],
  },
  {
    id: 'computer',
    name: 'Windows PC / Mac',
    short: 'Computer',
    steps: [
      { title: 'Pick a desktop player', body: 'VLC and most desktop IPTV players handle M3U playlists on both Windows and macOS.' },
      { title: 'Download and install it', body: 'Get it from the developer site rather than a mirror, then run the installer as normal.' },
      { title: 'Open the network stream', body: 'In VLC choose Media → Open Network Stream. Other players have an equivalent "add playlist" option.' },
      { title: 'Paste your M3U link', body: 'Use the long link ending in .m3u or m3u_plus from your activation email.' },
      { title: 'Load the playlist', body: 'Press Play or Load. The full channel list appears in the playlist panel.' },
      { title: 'Watch', body: 'Full screen behaves like any video. A wired connection gives the steadiest picture for live sport.' },
    ],
  },
];

/** Login-format explainer shown beside the steps. */
export const loginFormats = [
  { name: 'Xtream Codes login', detail: 'server or URL, username, password' },
  { name: 'M3U playlist', detail: 'a long link ending in .m3u or m3u_plus' },
];
