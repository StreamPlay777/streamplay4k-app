import { useState } from 'react';
import { ChevronRight, CheckCircle, Play, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const deviceGuides = [
  {
    id: 'firestick',
    name: 'Amazon Firestick',
    icon: '🔥',
    popular: true,
    steps: [
      { step: 1, title: 'Enable Apps from Unknown Sources', desc: 'Go to Settings → My Fire TV → Developer Options → Apps from Unknown Sources → Turn ON.' },
      { step: 2, title: 'Install Downloader App', desc: 'Go to the Fire TV Search bar → search "Downloader" → Install the Downloader app (orange icon) for free.' },
      { step: 3, title: 'Download the IPTV App', desc: 'Open Downloader → type the URL we send you after purchase → Download and install the IPTV player app.' },
      { step: 4, title: 'Enter Your Credentials', desc: 'Open the app → tap Add Playlist or M3U URL → enter the URL, username, and password from your welcome email.' },
      { step: 5, title: 'Start Streaming!', desc: 'Channels will load in under 60 seconds. Browse all 10,000+ channels, movies, and shows in 4K. Enjoy!' },
    ],
  },
  {
    id: 'android',
    name: 'Android TV / Box',
    icon: '📱',
    steps: [
      { step: 1, title: 'Open Google Play Store', desc: 'On your Android TV or box, open the Google Play Store from the home screen or apps menu.' },
      { step: 2, title: 'Install an IPTV Player', desc: 'Search for "IPTV Smarters Pro" or "TiviMate" → Download and install the app (free).' },
      { step: 3, title: 'Add Your Subscription', desc: 'Open the app → select "Add New User" or "Add Playlist" → choose M3U URL → enter your credentials from your welcome email.' },
      { step: 4, title: 'Load Channels', desc: 'The app will sync all 10,000+ channels and your full VOD library automatically. This takes about 60 seconds.' },
      { step: 5, title: 'Enjoy 4K Streaming', desc: 'Browse channels by category, use the EPG guide, or search for specific channels and movies. Start watching!' },
    ],
  },
  {
    id: 'appletv',
    name: 'Apple TV',
    icon: '🍎',
    steps: [
      { step: 1, title: 'Open the App Store', desc: 'On your Apple TV, navigate to the App Store from the home screen.' },
      { step: 2, title: 'Install GSE Smart IPTV', desc: 'Search for "GSE Smart IPTV" or "IPTV Smarters" → Download and install the app (may require purchase).' },
      { step: 3, title: 'Add Remote Playlist', desc: 'Open the app → go to Remote Playlists → tap the + icon → enter your M3U URL from your welcome email.' },
      { step: 4, title: 'Load Your Channels', desc: 'The app will import all your channels and VOD content. Wait about 60 seconds for everything to load.' },
      { step: 5, title: 'Start Watching', desc: 'Browse live channels, movies, and TV shows. Use the built-in EPG to see what\'s on and schedule recordings.' },
    ],
  },
  {
    id: 'smarttv',
    name: 'Smart TV (Samsung / LG)',
    icon: '📺',
    steps: [
      { step: 1, title: 'Open the App Store', desc: 'On Samsung: press Smart Hub → App Store. On LG: press Home → LG Content Store.' },
      { step: 2, title: 'Search for IPTV App', desc: 'Search for "Smart IPTV" (Samsung) or "SS IPTV" (LG) → Install the free app.' },
      { step: 3, title: 'Note Your Device MAC Address', desc: 'Open the app and note the MAC address shown on screen. You\'ll need this to activate your subscription.' },
      { step: 4, title: 'Activate on the Website', desc: 'Go to the Smart IPTV website, enter your MAC address and your M3U playlist URL from your welcome email.' },
      { step: 5, title: 'Restart and Stream', desc: 'Restart the app on your TV — all 10,000+ channels will load automatically. Start enjoying 4K content!' },
    ],
  },
  {
    id: 'pc',
    name: 'Windows PC / Mac',
    icon: '💻',
    steps: [
      { step: 1, title: 'Download VLC Media Player', desc: 'Go to videolan.org and download VLC Media Player (free and available for Windows and Mac).' },
      { step: 2, title: 'Open Network Stream', desc: 'In VLC, go to Media → Open Network Stream (Ctrl+N on Windows, Command+N on Mac).' },
      { step: 3, title: 'Enter Your M3U URL', desc: 'Paste your M3U playlist URL from your welcome email into the Network URL field → click Play.' },
      { step: 4, title: 'Browse Your Channels', desc: 'VLC will load your full playlist. You can also use IPTV apps like "Kodi" or "IPTV Smarters Web" for a better EPG experience.' },
      { step: 5, title: 'Stream in 4K', desc: 'Enjoy all 10,000+ channels and 60,000+ VOD titles directly on your PC or Mac in full 4K quality.' },
    ],
  },
  {
    id: 'iphone',
    name: 'iPhone / iPad',
    icon: '📱',
    steps: [
      { step: 1, title: 'Open the App Store', desc: 'On your iPhone or iPad, open the App Store app.' },
      { step: 2, title: 'Install GSE Smart IPTV', desc: 'Search for "GSE Smart IPTV" or "IPTV Smarters Pro" → Download and install (may require a small fee).' },
      { step: 3, title: 'Add Your M3U Playlist', desc: 'Open the app → go to Remote Playlists → tap + → enter your M3U URL from your welcome email.' },
      { step: 4, title: 'Let It Load', desc: 'The app will automatically import all channels, movies, and TV shows. This takes about 60 seconds on a good connection.' },
      { step: 5, title: 'Watch Anywhere', desc: 'Stream your favorite sports, shows, and movies on the go — at home, at work, or anywhere you have internet.' },
    ],
  },
];

export default function Setup() {
  const [activeDevice, setActiveDevice] = useState('firestick');
  const active = deviceGuides.find(d => d.id === activeDevice)!;

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-brand-darker border-b border-brand-border py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Setup Guide</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">
            Start Streaming in <span className="text-gradient">Under 5 Minutes</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Follow our step-by-step guide to set up StreamPlay4K on your favorite device. No technical skills needed.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Device selector */}
        <h2 className="text-white font-bold text-lg mb-5">Choose Your Device:</h2>
        <div className="flex flex-wrap gap-3 mb-12">
          {deviceGuides.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDevice(d.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeDevice === d.id
                  ? 'gradient-red text-white shadow-lg shadow-brand-red/30'
                  : 'bg-brand-card border border-brand-border text-gray-300 hover:border-brand-red hover:text-white'
              }`}
            >
              <span className="text-lg">{d.icon}</span>
              {d.name}
              {d.popular && <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded-full font-black">POPULAR</span>}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-4xl">{active.icon}</span>
              <h2 className="text-2xl font-black text-white">Setup on {active.name}</h2>
            </div>
            <div className="space-y-4">
              {active.steps.map((s) => (
                <div key={s.step} className="flex gap-4 bg-brand-card border border-brand-border rounded-xl p-5">
                  <div className="w-8 h-8 gradient-red rounded-full flex items-center justify-center shrink-0 text-white font-black text-sm">
                    {s.step}
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar info */}
          <div className="space-y-6">
            {/* Quick start */}
            <div className="bg-gradient-to-br from-brand-red/20 to-brand-orange/10 border border-brand-red/30 rounded-2xl p-6">
              <h3 className="text-white font-black text-lg mb-4">⚡ Quick Start Checklist</h3>
              <ul className="space-y-3">
                {[
                  'Subscribe to a plan and receive your credentials via email',
                  'Download the recommended IPTV app for your device',
                  'Enter your M3U URL, username & password',
                  'Wait 60 seconds for channels to load',
                  'Start streaming in 4K!',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended apps */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">📱 Recommended Apps</h3>
              <ul className="space-y-3">
                {[
                  { name: 'IPTV Smarters Pro', platform: 'Firestick, Android, iOS', rating: '★ 4.7' },
                  { name: 'TiviMate', platform: 'Android TV, Firestick', rating: '★ 4.9' },
                  { name: 'GSE Smart IPTV', platform: 'iOS, Apple TV', rating: '★ 4.6' },
                  { name: 'Kodi + PVR Add-on', platform: 'All platforms', rating: '★ 4.8' },
                  { name: 'VLC Media Player', platform: 'Windows, Mac', rating: '★ 4.7' },
                ].map(app => (
                  <li key={app.name} className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-medium">{app.name}</p>
                      <p className="text-gray-500 text-xs">{app.platform}</p>
                    </div>
                    <span className="text-brand-orange text-xs font-bold">{app.rating}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Requirements */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <h3 className="text-white font-bold mb-4">📋 Requirements</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-red" /> Internet: 10 Mbps+ for HD, 25 Mbps+ for 4K</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-red" /> Compatible device (see list above)</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-red" /> Active StreamPlay4K subscription</li>
                <li className="flex items-center gap-2"><ChevronRight size={12} className="text-brand-red" /> Your welcome email with login credentials</li>
              </ul>
            </div>

            {/* Support */}
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 text-center">
              <MessageCircle size={32} className="text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-bold mb-2">Need Help Setting Up?</h3>
              <p className="text-gray-400 text-sm mb-4">Our team will set it up for you — for free. Just contact support after subscribing.</p>
              <a
                href="https://wa.me/1234567890"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white font-bold text-sm rounded-xl hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={16} /> WhatsApp Support
              </a>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-brand-card to-brand-darker border border-brand-border rounded-3xl p-12">
          <Play size={40} className="text-brand-red mx-auto mb-4" />
          <h2 className="text-3xl font-black text-white mb-3">Ready to Start?</h2>
          <p className="text-gray-400 mb-6">Get your credentials instantly after subscribing. We'll even help you set up.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="flex items-center justify-center gap-2 px-8 py-4 gradient-red text-white font-black text-lg rounded-xl hover:opacity-90 transition-opacity">
              Subscribe Now <ChevronRight size={18} />
            </Link>
            <Link to="/channels" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all">
              Browse Channels
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
