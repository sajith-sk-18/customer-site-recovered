import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const THEME = {
  festival: 'from-lime-500 via-brand-500 to-emerald-500',
  sale:     'from-brand-500 to-brand-700',
  coming:   'from-brand-400 to-brand-600',
  info:     'from-emerald-500 to-brand-500',
};

export default function AnnouncementBar() {
  const [list, setList] = useState([]);
  const [idx,  setIdx]  = useState(0);
  const [closed, setClosed] = useState(false);

  useEffect(() => {
    api.get('/announcements').then((r) => setList(r.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (list.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % list.length), 6000);
    return () => clearInterval(t);
  }, [list.length]);

  if (closed || list.length === 0) return null;
  const a = list[idx] || list[0];
  const tint = THEME[a.theme] || THEME.festival;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-r ${tint} text-white text-sm animate-gradient-x`}>
      <div className="container mx-auto px-4 h-10 flex items-center justify-center gap-3">
        {a.badge_label && (
          <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur text-[10px] font-bold tracking-widest">
            {a.badge_label}
          </span>
        )}
        <span className="truncate">
          <strong>{a.title}</strong>
          {a.subtitle && <span className="hidden sm:inline opacity-90"> — {a.subtitle}</span>}
        </span>
        {a.cta_label && a.cta_url && (
          <Link to={a.cta_url} className="hidden md:inline-flex shrink-0 text-xs font-semibold underline underline-offset-2 hover:no-underline">
            {a.cta_label} →
          </Link>
        )}
        <button
          onClick={() => setClosed(true)}
          aria-label="Dismiss"
          className="ml-auto w-6 h-6 rounded-full hover:bg-white/20 flex items-center justify-center text-base leading-none"
        >×</button>
      </div>

      {list.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-1 gap-1">
          {list.map((_, i) => (
            <span key={i} className={`h-1 rounded-full transition-all ${i === idx ? 'bg-white w-6' : 'bg-white/40 w-2'}`} />
          ))}
        </div>
      )}
    </div>
  );
}
