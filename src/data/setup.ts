import { site } from './site';

/**
 * Per-device install guide.
 *
 * ONE APP, ONE CODE. Every device that can sideload gets Hot Player, installed
 * with Downloader code {site.downloaderCode}. Devices that cannot sideload —
 * Samsung and LG televisions, Apple TV, iPhone — go to their own store, which
 * is the only route those platforms allow.
 *
 * LINKS ARE ONLY WHAT WE WERE GIVEN. The App Store listing and the Android APK
 * are client-confirmed and live in site.player. Nothing else here links out:
 * where a step means "search your TV's app store", it says so rather than
 * pointing at a URL nobody has verified. A broken download link on a setup page
 * costs a support conversation at exactly the moment a new customer is least
 * patient.
 */

const code = site.downloaderCode;
const player = site.player.name;

export interface Download {
  label: string;
  /** Omitted when the route is a store search rather than a link we can give. */
  href?: string;
  note?: string;
}

export interface Step {
  title: string;
  body: string;
}

export interface DeviceGuide {
  /** Also the URL hash. The navbar's Setup menu and the footer link straight
      to /setup-guide/#<id>, so these must stay identical to the `hash` values
      in data/site.ts — matching them means no lookup table to fall out of
      step when a device is added. */
  id: string;
  name: string;
  short: string;
  /** One line above the steps, saying what this device's route actually is. */
  summary: string;
  downloads: Download[];
  steps: Step[];
}

export const deviceGuides: DeviceGuide[] = [
  {
    id: 'firestick',
    name: 'Amazon Fire TV / Firestick',
    short: 'Firestick',
    summary: `Install ${player} with the free Downloader app — the whole thing is one code: ${code}.`,
    downloads: [],
    steps: [
      {
        title: 'Allow unknown apps',
        body: 'On your Fire TV: Settings → My Fire TV → Developer options → Install unknown apps → turn ON for Downloader. If Developer options is missing, open Settings → My Fire TV → About and click Fire TV Stick seven times.',
      },
      {
        title: 'Open the Downloader app',
        body: 'Install Downloader by AFTVnews from the Amazon Appstore if you do not have it, then open it once so it has permission to run.',
      },
      {
        title: `Enter code ${code}`,
        body: `In the Downloader URL box, type ${code} and press Go. ${player} downloads straight to your stick.`,
      },
      {
        title: `Install ${player}`,
        body: 'When the download finishes choose Install, then Open. You can delete the installer file afterwards to free up space.',
      },
      {
        title: 'Log in',
        body: 'Choose Xtream Codes and enter the server, username and password from your activation email — or Load M3U if that is what you were sent.',
      },
      {
        title: 'Watch',
        body: 'Open Live TV, Movies or Series. Your channels and the full guide load within a few seconds.',
      },
    ],
  },
  {
    id: 'android-tv',
    name: 'Android TV / Google TV',
    short: 'Android TV',
    summary: `Install ${player} straight from us — or sideload it with Downloader code ${code}.`,
    downloads: [{ label: `Direct APK · ${player}`, href: site.player.android }],
    steps: [
      {
        title: `Install ${player}`,
        body: `Use the direct APK button above, or open Downloader by AFTVnews on your Android TV and enter code ${code}.`,
      },
      {
        title: 'No Play Store? Use Downloader',
        body: 'Install Downloader, then enable "Install unknown apps" for it in Settings → Apps → Special app access. That is a normal Android setting, not a workaround.',
      },
      {
        title: 'Open and log in',
        body: 'Launch the app, choose Xtream Codes or M3U, and enter the details we emailed you. Type the port number after the server address — leaving it off is the most common mistake.',
      },
      {
        title: 'Watch',
        body: 'Open Live TV, Movies or Series and start streaming. Nvidia Shield and most Android boxes behave identically.',
      },
    ],
  },
  {
    id: 'smart-tv',
    name: 'Smart TV (Samsung / LG)',
    short: 'Smart TV',
    summary: 'Install from your television\'s own app store — Samsung and LG do not allow sideloading, so no code is needed.',
    downloads: [],
    steps: [
      {
        title: 'Open your TV\'s app store',
        body: 'On Samsung, open Samsung Apps (Tizen). On LG, open the LG Content Store. Both sit on the home bar.',
      },
      {
        title: 'Search for an IPTV player',
        body: `Look for ${player}, IBO Player or another player that supports Xtream Codes, and install it.`,
      },
      {
        title: 'Note your Device ID or MAC',
        body: 'Open the app once. Smart TV players show a Device ID or MAC address on first launch — some need it registered on the app\'s own activation page before a playlist will load.',
      },
      {
        title: 'Add your playlist',
        body: 'Follow the app\'s on-screen portal to enter your Xtream Codes details or upload your M3U. Both are in your activation email.',
      },
      {
        title: 'Reload and watch',
        body: 'Refresh or reopen the app. Your channels and the TV guide appear — no extra box or stick needed.',
      },
    ],
  },
  {
    id: 'apple-tv',
    name: 'Apple TV',
    short: 'Apple TV',
    summary: 'Install straight from the tvOS App Store. Apple allows no other route, and none is needed.',
    downloads: [{ label: `${player} · App Store`, href: site.player.ios }],
    steps: [
      {
        title: 'Open the App Store',
        body: `On your Apple TV home screen, open the App Store and search for ${player}. IBO Player works too if you prefer it.`,
      },
      {
        title: 'Install and open',
        body: 'Download the player and open it once. Some players show a Device ID or MAC address on this first screen — keep it visible.',
      },
      {
        title: 'Add your playlist',
        body: 'If the app asks you to register the device, open its activation page on your phone or computer, enter the ID from the TV screen, then add your Xtream Codes details or M3U link.',
      },
      {
        title: 'Reload and watch',
        body: 'Back on the Apple TV, refresh the player. Your channels and guide load in.',
      },
      {
        title: 'AirPlay (optional)',
        body: 'You can also AirPlay from your iPhone or iPad straight to the big screen if you would rather not set the TV up separately.',
      },
    ],
  },
  {
    id: 'mobile',
    name: 'iPhone / Android phone & tablet',
    short: 'Phone & tablet',
    summary: 'Android installs straight from us. iPhone and iPad use the App Store — Apple allows no other route.',
    downloads: [
      { label: `Android · ${player} APK`, href: site.player.android },
      { label: `iPhone / iPad · App Store`, href: site.player.ios },
    ],
    steps: [
      {
        title: `Install ${player}`,
        body: 'Use the button for your device above. On Android you may need to allow installs from your browser — that is a standard Android permission.',
      },
      {
        title: 'Open the app',
        body: 'Allow the permissions it asks for on first launch. On iOS this includes local network access, which the player needs to stream.',
      },
      {
        title: 'Log in',
        body: 'Choose Xtream Codes, or paste your M3U link, then enter the details from your activation email.',
      },
      {
        title: 'Watch anywhere',
        body: 'Stream Live TV, Movies and Series on the go — or cast to a television with Chromecast or AirPlay.',
      },
    ],
  },
  {
    id: 'computer',
    name: 'Windows PC / Mac',
    short: 'Computer',
    summary: 'Any player that reads Xtream Codes or an M3U link works. VLC will do it if you would rather not install anything new.',
    downloads: [],
    steps: [
      {
        title: 'Install a player',
        body: `On Windows, search the Microsoft Store for ${player} or another IPTV player. On Mac, use a player from the Mac App Store. Both accept the same login.`,
      },
      {
        title: 'Open the app',
        body: 'Launch it from your Start menu on Windows, or Launchpad and Applications on Mac.',
      },
      {
        title: 'Log in',
        body: 'Choose Xtream Codes or load your M3U, then enter the details we emailed you.',
      },
      {
        title: 'Prefer VLC?',
        body: 'VLC plays an M3U with no setup at all: Media → Open Network Stream → paste your M3U link → Play. You lose the TV guide, but the picture is identical.',
      },
    ],
  },
];

/** The two login formats, explained side by side. */
export const loginFormats = [
  {
    id: 'xtream',
    name: 'Xtream Codes login',
    what: 'Server / URL, Username, Password',
    example: 'http://your-server-address:8080',
    exampleLabel: 'Server / host (example)',
    body: 'Three separate pieces of information. The app signs in to your account, so you get the TV guide, sorted categories and your expiry date. Use this one where the app offers it.',
  },
  {
    id: 'm3u',
    name: 'M3U playlist',
    what: 'One long link ending in .m3u',
    example: 'http://your-server-address/get.php?...&type=m3u_plus',
    exampleLabel: 'M3U link (example)',
    body: 'A single link containing your whole playlist. Works everywhere, including VLC, but carries no guide and no account information. Keep it private — it is your subscription.',
  },
];

/** Facts for the activation strip at the top of the guide. */
export const activationFacts = {
  code,
  typicalTime: '3–6 min',
  player,
};
