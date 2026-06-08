import { useEffect, useState } from 'react';
import api from '../api';
import UpcomingCard from '../components/UpcomingCard';

export default function Upcoming() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api.get('/upcoming')
      .then((r) => { if (!cancelled) setList(r.data || []); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 animate-gradient-x" />
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-brand-500/30 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 -right-20 w-96 h-96 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />

        <div className="relative container mx-auto px-4 py-14 md:py-20 text-center">
          <div className="text-xs uppercase tracking-widest text-white/70 animate-fade-up">Sneak peek</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-2 animate-fade-up delay-100">
            Coming <span className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white bg-clip-text text-transparent">soon</span>
          </h1>
          <p className="mt-3 text-white/85 max-w-xl mx-auto animate-fade-up delay-200">
            What's landing in our store next. Bookmark the ones you love — we'll notify you the moment they go live.
          </p>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="rgb(249 250 251)" d="M0,30 C360,80 1080,-10 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[0,1,2].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="aspect-[4/3] shimmer" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-1/3 shimmer rounded" />
                  <div className="h-4 w-3/4 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : list.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl">⏳</div>
            <h3 className="font-semibold text-lg mt-3">Nothing in the pipeline yet</h3>
            <p className="text-sm text-gray-500 mt-1">Check back soon — we're adding fresh arrivals all the time.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {list.map((item, i) => (
              <div key={item.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <UpcomingCard item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
