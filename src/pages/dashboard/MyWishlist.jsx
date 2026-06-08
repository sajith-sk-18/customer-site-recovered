import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import ProductCard from '../../components/ProductCard';

export default function MyWishlist() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/me/wishlist')
      .then((r) => setRows(r.data.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">My wishlist</h1>
        <p className="text-sm text-gray-500 mt-1">Saved for later. Tap the heart on a product page to add or remove items.</p>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl">💖</div>
          <h3 className="font-semibold text-lg mt-3">No favourites yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            Found a laptop you love? Tap the heart on a product card to save it here.
          </p>
          <Link to="/products" className="btn-primary mt-5 inline-flex">Browse products</Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((w, i) => (
            <div key={w.id} className="animate-fade-up" style={{ animationDelay: `${i * 50}ms` }}>
              {w.product
                ? <ProductCard product={w.product} />
                : <div className="card p-6 text-sm text-gray-500 italic">This product is no longer available.</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
