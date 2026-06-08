import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inr } from '../lib/money';
import { getRecent } from '../lib/recentlyViewed';

/**
 * Horizontal strip of products this browser has viewed recently.
 * Reads localStorage on mount; no server call. Hidden when empty.
 *
 * @param excludeId — typically the current product on a PDP, so it isn't
 *                   listed alongside the main hero.
 */
export default function RecentlyViewed({ excludeId = null, title = 'Recently viewed' }) {
  const [list, setList] = useState([]);

  useEffect(() => { setList(getRecent(excludeId)); }, [excludeId]);

  if (list.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-5">{title}</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scroll-smooth snap-x">
        {list.map((p) => (
          <Link
            key={p.id}
            to={`/products/${p.id}`}
            className="snap-start shrink-0 w-44 card overflow-hidden hover-lift"
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
              {p.image
                ? <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                : <span className="text-4xl text-gray-300">💻</span>}
            </div>
            <div className="p-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-500">{p.brand}</div>
              <div className="text-sm font-semibold text-gray-900 line-clamp-2 mt-0.5">{p.name}</div>
              <div className="text-sm font-bold text-brand-700 mt-1">{inr(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
