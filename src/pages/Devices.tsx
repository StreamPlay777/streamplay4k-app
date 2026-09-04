import { Link } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';

const devices = [
  { name: 'Amazon Firestick', icon: '🔥', desc: 'The most popular way to stream StreamPlay4K. Plug into any TV and start watching in minutes.', supported: ['Firestick 4K', 'Firestick 4K Max', 'Firestick Lite', 'Fire TV Cube', 'All Fire TV editions'] },
  { name: 'Android TV & Box', icon: '📱', desc: 'Perfect for Android-based smart TVs and media boxes. Install directly from Google Play.', supported: ['Android TV 5.0+', 'Nvidia Shield', 'Xiaomi Mi Box', 'MECOOL Boxes', 'All Android boxes'] },
  { name: 'Apple TV', icon: '🍎', desc: 'Stream in 4K on Apple TV using compatible IPTV apps from the App Store.', supported: ['Apple TV 4K (all gen)', 'Apple TV HD', 'Apple TV 3rd gen (limited)'] },
  { name: 'Smart TV', icon: '📺', desc: 'Works on most modern Samsung, LG, Sony, TCL and Hisense smart TVs.', supported: ['Samsung Tizen (2016+)', 'LG webOS (2016+)', 'Sony Android TV', 'Hisense VIDAA', 'TCL Roku TV'] },
  { name: 'Windows PC', icon: '💻', desc: 'Watch on your computer using VLC, Kodi, or dedicated IPTV software.', supported: ['Windows 10', 'Windows 11', 'VLC Player', 'Kodi', 'IPTV Smarters Web'] },
  { name: 'Mac', icon: '🖥️', desc: 'Stream on macOS using VLC, IINA, or Kodi with our playlist URL.', supported: ['macOS 10.14+', 'VLC for Mac', 'IINA Player', 'Kodi for Mac'] },
  { name: 'iPhone / iPad', icon: '📱', desc: 'Watch live TV and VOD on the go with compatible iOS IPTV apps.', supported: ['iPhone (iOS 13+)', 'iPad (iPadOS 13+)', 'GSE Smart IPTV', 'IPTV Smarters Pro'] },
  { name: 'Android Phone / Tablet', icon: '📲', desc: 'Stream anywhere on your Android device with multiple app options.', supported: ['Android 6.0+', 'IPTV Smarters Pro', 'TiviMate', 'OTT Navigator'] },
  { name: 'Roku', icon: '📡', desc: 'Use Roku with compatible channel-based IPTV players for easy streaming.', supported: ['Roku Streaming Stick', 'Roku Ultra', 'Roku Express', 'Roku TV'] },
  { name: 'MAG Box', icon: '📦', desc: 'Direct portal support for MAG set-top boxes — plug in your portal URL and go.', supported: ['MAG 322', 'MAG 324', 'MAG 350', 'MAG 420', 'All MAG devices'] },
  { name: 'Nvidia Shield', icon: '🎮', desc: 'The ultimate Android TV streaming box. Pair with TiviMate for the best IPTV experience.', supported: ['Nvidia Shield Pro', 'Nvidia Shield TV', 'Nvidia Shield Tube'] },
  { name: 'Kodi', icon: '🎬', desc: 'Install PVR IPTV Simple Client addon on Kodi and add your M3U playlist for full access.', supported: ['Kodi 18+', 'All platforms', 'PVR IPTV Simple Client', 'Full EPG support'] },
];

export default function Devices() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-brand-darker border-b border-brand-border py-16 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Compatible Devices</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">
            Stream on <span className="text-gradient">Any Device</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            StreamPlay4K works on 12+ device types. One subscription — watch on your TV, phone, tablet, or computer.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(d => (
            <div key={d.name} className="bg-brand-card border border-brand-border rounded-2xl p-6 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{d.icon}</span>
                <h2 className="text-white font-black text-xl">{d.name}</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{d.desc}</p>
              <ul className="space-y-1.5">
                {d.supported.map(s => (
                  <li key={s} className="flex items-center gap-2 text-xs text-gray-300">
                    <Check size={12} className="text-green-400 shrink-0" /> {s}
                  </li>
                ))}
              </ul>
              <Link to="/setup" className="mt-5 flex items-center gap-1 text-brand-red text-xs font-bold hover:underline">
                Setup Guide <ChevronRight size={12} />
              </Link>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center bg-gradient-to-br from-brand-red/20 to-brand-orange/10 border border-brand-red/30 rounded-3xl p-12">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Stream on Your Device?</h2>
          <p className="text-gray-300 mb-6">One subscription covers up to 3 devices. Instant setup. No contract.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing" className="flex items-center justify-center gap-2 px-8 py-4 gradient-red text-white font-black text-lg rounded-xl hover:opacity-90">
              Get Started Now <ChevronRight size={18} />
            </Link>
            <Link to="/setup" className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20">
              View Setup Guide
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
