import { useEffect, useState } from 'react';
import api from '../api';
import ProductCard from './ProductCard';

/**
 * Loads /api/products/{id}/related and renders a "You may also like" grid.
 * Hidden when no related items exist (server returns []).
 */
export default function RelatedProducts({ productId }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(`/products/${productId}/related`)
      .then((r) => { if (!cancelled) setList(r.data || []); })
      .catch(() => { if (!cancelled) setList([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [productId]);

  if (!loading && list.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-2xl font-bold">
          You may also <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">like</span>
        </h2>
      </div>
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0,1,2,3].map((i) => (
            <div key={i} className="card overflow-hidden">
              <div className="aspect-[4/3] shimmer" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-1/3 shimmer rounded" />
                <div className="h-4 w-3/4 shimmer rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {list.map((p, i) => (
            <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
