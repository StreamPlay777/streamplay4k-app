import { Link } from 'react-router-dom';
import {
  Play, ChevronRight, Check, Star, Zap, Shield, Wifi, Monitor,
  Globe, Award, Users, Clock
} from 'lucide-react';
import { movies } from '../data/movies';
import { channels } from '../data/channels';
import { plans } from '../data/pricing';

const topChannels = ['ESPN', 'ABC', 'NBC', 'CBS', 'FOX', 'CNN', 'FOX News', 'HBO', 'NFL Network', 'NBA TV', 'MSNBC', 'Discovery', 'National Geographic', 'Nickelodeon', 'Disney Channel', 'TNT', 'TBS', 'Bravo', 'History Channel', 'HGTV', 'Food Network', 'AMC', 'MTV', 'BET', 'Showtime'];

const features = [
  { icon: Zap, title: '4K Ultra HD', desc: 'Crystal-clear picture quality on every channel — 4K, 1080p & HD streams.' },
  { icon: Wifi, title: '10,000+ Channels', desc: 'Live sports, news, movies, kids, international & more — all in one place.' },
  { icon: Monitor, title: 'Any Device', desc: 'Firestick, Android TV, Apple TV, Smart TV, PC, iPhone, iPad & more.' },
  { icon: Shield, title: '99.9% Uptime', desc: 'Anti-freeze technology ensures smooth, buffer-free streaming all day.' },
  { icon: Globe, title: 'No Contract', desc: 'Cancel anytime. No hidden fees. Month-to-month or save with longer plans.' },
  { icon: Clock, title: '24/7 Support', desc: 'Expert support team available around the clock via chat, WhatsApp & email.' },
];

const testimonials = [
  { name: 'Mike T.', location: 'Los Angeles, CA', rating: 5, text: 'Best IPTV service I\'ve ever used. The 4K quality on my NFL games is absolutely insane. Zero buffering all season long.' },
  { name: 'Sarah K.', location: 'New York, NY', rating: 5, text: 'Setup took less than 5 minutes on my Firestick. 10,000+ channels and they all work flawlessly. Worth every penny!' },
  { name: 'James R.', location: 'Chicago, IL', rating: 5, text: 'Been with StreamPlay4K for 8 months now. Never had a single issue. Customer support is top notch. Highly recommend.' },
  { name: 'Diana M.', location: 'Miami, FL', rating: 5, text: 'I cut the cord 6 months ago and this is better than cable in every way. My whole family loves it — sports, movies, kids shows, everything.' },
  { name: 'Carlos V.', location: 'Houston, TX', rating: 5, text: 'Amazing international channels for my family. We get Spanish, Arabic and French channels in addition to all US channels. Incredible value.' },
  { name: 'Priya S.', location: 'San Jose, CA', rating: 5, text: 'The EPG guide is super clean and easy to use. I can see what\'s on every channel ahead of time. Feels premium.' },
];

const devices = [
  { name: 'Amazon Firestick', icon: '🔥' },
  { name: 'Android TV', icon: '📱' },
  { name: 'Apple TV', icon: '🍎' },
  { name: 'Smart TV', icon: '📺' },
  { name: 'Windows PC', icon: '💻' },
  { name: 'Mac', icon: '🖥️' },
  { name: 'iPhone / iPad', icon: '📱' },
  { name: 'Android Phone', icon: '📲' },
  { name: 'Roku', icon: '📡' },
  { name: 'MAG Box', icon: '📦' },
  { name: 'Nvidia Shield', icon: '🎮' },
  { name: 'Kodi', icon: '🎬' },
];

const stats = [
  { value: '10,000+', label: 'Live Channels' },
  { value: '60,000+', label: 'Movies & Shows' },
  { value: '150+', label: 'Countries' },
  { value: '99.9%', label: 'Uptime' },
];

export default function Home() {
  const featuredMovies = movies.slice(0, 8);
  const sportChannels = channels.filter(c => c.category === 'Sports').slice(0, 12);
  const entertainmentChannels = channels.filter(c => c.category === 'Entertainment').slice(0, 12);

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-darker">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-brand-dark to-brand-darker" />
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #E8322A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #F5A623 0%, transparent 50%)' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-red/20 border border-brand-red/30 rounded-full text-brand-red text-xs font-bold mb-6 animate-pulse">
                <span className="w-2 h-2 bg-brand-red rounded-full"></span>
                LIVE NOW — 10,000+ CHANNELS STREAMING
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6">
                <span className="text-white">Stream </span>
                <span className="text-gradient">Everything</span>
                <br />
                <span className="text-white">in </span>
                <span className="text-brand-orange">4K Ultra HD</span>
              </h1>
              <p className="text-gray-300 text-xl leading-relaxed mb-8 max-w-lg">
                The #1 IPTV service in the USA. Watch <strong className="text-white">10,000+ live channels</strong>, <strong className="text-white">60,000+ movies & TV shows</strong> on any device — no contract, no BS.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {['✓ NFL & NBA Live', '✓ 4K Quality', '✓ No Contract', '✓ 24/7 Support'].map(f => (
                  <span key={f} className="text-sm text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">{f}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/pricing"
                  className="flex items-center gap-2 px-8 py-4 gradient-red text-white font-bold text-lg rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-red/30"
                >
                  <Play size={20} fill="white" /> Start Streaming Now
                </Link>
                <Link
                  to="/channels"
                  className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all"
                >
                  View Channels <ChevronRight size={20} />
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-brand-card to-brand-darker rounded-2xl border border-brand-border p-1 shadow-2xl">
                <div className="aspect-video bg-brand-darker rounded-xl overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-red/20 to-brand-orange/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 gradient-red rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-red/40">
                        <Play size={36} fill="white" className="text-white ml-1" />
                      </div>
                      <p className="text-white font-bold text-xl">4K Live TV</p>
                      <p className="text-gray-400 text-sm">10,000+ Channels</p>
                    </div>
                  </div>
                </div>
                {/* Live badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-brand-red px-2 py-1 rounded text-xs font-bold text-white">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span> LIVE
                </div>
              </div>
              {/* Floating cards */}
              <div className="absolute -bottom-6 -left-6 bg-brand-card border border-brand-border rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <Users size={14} className="text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Active Users</p>
                    <p className="text-white font-bold text-sm">48,291</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-brand-card border border-brand-border rounded-xl p-3 shadow-xl">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#F5A623" className="text-brand-orange" />)}
                </div>
                <p className="text-white font-bold text-sm mt-1">4.9/5 Rating</p>
                <p className="text-xs text-gray-400">2,847 Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-brand-red py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map(s => (
              <div key={s.label}>
                <div className="text-3xl md:text-4xl font-black text-white">{s.value}</div>
                <div className="text-red-200 text-sm font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHANNEL TICKER */}
      <section className="bg-brand-darker py-8 border-y border-brand-border overflow-hidden">
        <p className="text-center text-xs text-gray-500 uppercase tracking-widest mb-4">Included Channels</p>
        <div className="ticker-wrap">
          <div className="ticker">
            {[...topChannels, ...topChannels].map((ch, i) => (
              <span key={i} className="flex items-center gap-3 mx-6 text-gray-400 text-sm font-medium whitespace-nowrap">
                <span className="w-1.5 h-1.5 bg-brand-red rounded-full"></span>
                {ch}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Why StreamPlay4K?</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            Everything You Need to <span className="text-gradient">Cut the Cord</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Premium 4K streaming without the premium cable price. Get everything cable has — plus more — for a fraction of the cost.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="bg-brand-card border border-brand-border rounded-2xl p-6 card-hover">
              <div className="w-12 h-12 gradient-red rounded-xl flex items-center justify-center mb-4">
                <f.icon size={22} className="text-white" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SPORTS CHANNELS */}
      <section className="py-20 bg-brand-darker border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Live Sports</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Every Game. Every Sport.</h2>
            </div>
            <Link to="/channels" className="hidden md:flex items-center gap-1 text-brand-red text-sm font-medium hover:underline">
              All Sports Channels <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {sportChannels.map(ch => (
              <div key={ch.name} className="bg-brand-card border border-brand-border rounded-xl p-3 flex flex-col items-center gap-2 channel-card transition-all cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-brand-dark font-black text-xs text-center">${ch.name.slice(0,3)}</span>`;
                    }}
                  />
                </div>
                <span className="text-gray-300 text-xs text-center font-medium leading-tight">{ch.name}</span>
                {ch.uhd && <span className="text-[9px] bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded font-bold">4K</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MOVIES SECTION */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Now Streaming</span>
            <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Latest Movies & Blockbusters</h2>
          </div>
          <Link to="/channels" className="hidden md:flex items-center gap-1 text-brand-red text-sm font-medium hover:underline">
            Full VOD Library <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {featuredMovies.map(movie => (
            <div key={movie.title} className="group relative bg-brand-card border border-brand-border rounded-xl overflow-hidden card-hover cursor-pointer">
              <div className="aspect-[2/3] bg-gradient-to-br from-brand-border to-brand-darker relative overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                {movie.badge && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-brand-red text-white text-[10px] font-black rounded">
                    {movie.badge}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white font-bold text-sm leading-tight">{movie.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-brand-orange text-xs font-bold">★ {movie.score}</span>
                    <span className="text-gray-400 text-xs">{movie.year}</span>
                    <span className="text-gray-500 text-xs bg-white/10 px-1 rounded">{movie.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENTERTAINMENT CHANNELS */}
      <section className="py-20 bg-brand-darker border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Entertainment</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mt-1">Top TV Networks Included</h2>
            </div>
            <Link to="/channels" className="hidden md:flex items-center gap-1 text-brand-red text-sm font-medium hover:underline">
              All Channels <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {entertainmentChannels.map(ch => (
              <div key={ch.name} className="bg-brand-card border border-brand-border rounded-xl p-3 flex flex-col items-center gap-2 channel-card transition-all cursor-pointer">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-brand-dark font-black text-xs text-center">${ch.name.slice(0,4)}</span>`;
                    }}
                  />
                </div>
                <span className="text-gray-300 text-xs text-center font-medium leading-tight">{ch.name}</span>
                {ch.uhd && <span className="text-[9px] bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded font-bold">4K</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Simple Pricing</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            Plans That Fit <span className="text-gradient">Every Budget</span>
          </h2>
          <p className="text-gray-400 text-lg mt-4">No hidden fees. Cancel anytime. Start streaming in minutes.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative bg-brand-card border rounded-2xl p-6 card-hover ${plan.popular ? 'border-brand-red shadow-lg shadow-brand-red/20' : 'border-brand-border'}`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 gradient-red text-white text-xs font-black rounded-full whitespace-nowrap">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-white font-bold text-lg mb-1">{plan.name}</h3>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-4xl font-black text-white">${plan.price}</span>
                <span className="text-gray-400 text-sm mb-1">/{plan.duration.toLowerCase()}</span>
              </div>
              {plan.originalPrice && (
                <p className="text-xs text-gray-500 line-through mb-3">${plan.originalPrice} regular price</p>
              )}
              <p className="text-brand-orange text-xs font-bold mb-4">≈ ${plan.pricePerMonth}/month</p>
              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 5).map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-gray-300">
                    <Check size={12} className="text-green-400 mt-0.5 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/pricing"
                className={`block text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.popular ? 'gradient-red text-white hover:opacity-90' : 'bg-white/10 text-white hover:bg-white/20'}`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/pricing" className="text-brand-red font-medium hover:underline flex items-center justify-center gap-1">
            See full plan details <ChevronRight size={14} />
          </Link>
        </div>
      </section>

      {/* DEVICES */}
      <section className="py-20 bg-brand-darker border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Compatible Devices</span>
            <h2 className="text-4xl font-black text-white mt-2">Stream on Any Screen</h2>
            <p className="text-gray-400 mt-3">Works on 12+ device types — no extra equipment needed</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {devices.map(d => (
              <div key={d.name} className="bg-brand-card border border-brand-border rounded-xl p-4 text-center card-hover">
                <div className="text-3xl mb-2">{d.icon}</div>
                <p className="text-gray-300 text-xs font-medium leading-tight">{d.name}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/setup" className="inline-flex items-center gap-2 px-6 py-3 gradient-red text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
              Setup Guide <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Customer Reviews</span>
          <h2 className="text-4xl md:text-5xl font-black text-white mt-2">
            Trusted by <span className="text-gradient">50,000+ Subscribers</span>
          </h2>
          <div className="flex items-center justify-center gap-2 mt-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="#F5A623" className="text-brand-orange" />)}
            <span className="text-white font-bold ml-1">4.9/5</span>
            <span className="text-gray-400 text-sm">based on 2,847 reviews</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.name} className="bg-brand-card border border-brand-border rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} fill="#F5A623" className="text-brand-orange" />)}
              </div>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">"{t.text}"</p>
              <div>
                <p className="text-white font-bold text-sm">{t.name}</p>
                <p className="text-gray-500 text-xs">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-brand-darker">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-brand-red/20 to-brand-orange/10 border border-brand-red/30 rounded-3xl p-12">
            <Award size={48} className="text-brand-orange mx-auto mb-4" />
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Cut the Cord?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ customers streaming in 4K today. Setup in under 5 minutes. No contract, no commitment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pricing" className="flex items-center justify-center gap-2 px-10 py-4 gradient-red text-white font-black text-lg rounded-xl hover:opacity-90 transition-all shadow-lg shadow-brand-red/30">
                <Play size={22} fill="white" /> Get Started Now
              </Link>
              <Link to="/channels" className="flex items-center justify-center gap-2 px-10 py-4 bg-white/10 border border-white/20 text-white font-bold text-lg rounded-xl hover:bg-white/20 transition-all">
                Browse Channels
              </Link>
            </div>
            <p className="text-gray-500 text-xs mt-6">30-Day Money-Back Guarantee • Secure Payment • Instant Activation</p>
          </div>
        </div>
      </section>
    </div>
  );
}
