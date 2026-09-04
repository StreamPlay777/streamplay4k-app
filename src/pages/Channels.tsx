import { useState } from 'react';
import { Search, Tv, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { channels, categories } from '../data/channels';

export default function Channels() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = channels.filter(ch => {
    const matchCat = activeCategory === 'All' || ch.category === activeCategory;
    const matchSearch = ch.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const counts: Record<string, number> = { All: channels.length };
  categories.slice(1).forEach(cat => {
    counts[cat] = channels.filter(c => c.category === cat).length;
  });

  return (
    <div className="min-h-screen pt-24">
      {/* Hero */}
      <section className="bg-brand-darker border-b border-brand-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-brand-red text-sm font-bold uppercase tracking-widest">Channel Guide</span>
          <h1 className="text-5xl font-black text-white mt-2 mb-4">
            10,000+ Live <span className="text-gradient">TV Channels</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
            Sports, news, movies, kids, international & more — all in stunning 4K Ultra HD. Browse our full channel lineup below.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search channels..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-brand-card border border-brand-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-brand-red transition-colors"
            />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'gradient-red text-white'
                  : 'bg-brand-card border border-brand-border text-gray-300 hover:border-brand-red hover:text-white'
              }`}
            >
              {cat}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeCategory === cat ? 'bg-white/20 text-white' : 'bg-brand-border text-gray-500'}`}>
                {counts[cat] ?? 0}
              </span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            Showing <span className="text-white font-bold">{filtered.length}</span> channels
            {activeCategory !== 'All' && <span> in <span className="text-brand-red">{activeCategory}</span></span>}
          </p>
        </div>

        {/* Channel grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filtered.map(ch => (
              <div
                key={ch.name}
                className="bg-brand-card border border-brand-border rounded-xl p-4 flex flex-col items-center gap-3 channel-card transition-all cursor-pointer group"
              >
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                  <img
                    src={ch.logo}
                    alt={ch.name}
                    className="w-11 h-11 object-contain"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      el.style.display = 'none';
                      el.parentElement!.innerHTML = `<span class="text-gray-800 font-black text-xs text-center leading-tight px-1">${ch.name}</span>`;
                    }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs font-semibold leading-tight group-hover:text-white transition-colors">{ch.name}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    {ch.uhd ? (
                      <span className="text-[9px] bg-brand-orange/20 text-brand-orange px-1.5 py-0.5 rounded font-bold">4K</span>
                    ) : ch.hd ? (
                      <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">HD</span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Tv size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No channels found for "{search}"</p>
          </div>
        )}

        {/* Note */}
        <div className="mt-12 bg-brand-card border border-brand-border rounded-2xl p-6 text-center">
          <p className="text-white font-bold text-lg mb-2">
            🌍 Plus 9,000+ More Channels
          </p>
          <p className="text-gray-400 text-sm mb-4">
            We show just a sample here. Our full library includes 10,000+ channels across all categories including international, PPV, premium, and regional channels.
          </p>
          <Link to="/pricing" className="inline-flex items-center gap-2 px-6 py-3 gradient-red text-white font-bold rounded-xl hover:opacity-90 transition-opacity">
            Get Full Access <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
