import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function MyReviews() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/me/reviews')
      .then((r) => setRows(r.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">My reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Reviews you've left on products. Admin approves them before they go public.</p>
      </div>

      {loading ? (
        <ul className="space-y-3">
          {[0,1].map((i) => <li key={i} className="h-24 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />)}
        </ul>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl">⭐</div>
          <h3 className="font-semibold text-lg mt-3">No reviews yet</h3>
          <p className="text-sm text-gray-500 mt-1">Bought something? Share what you thought — it helps other shoppers.</p>
          <Link to="/products" className="btn-primary mt-5 inline-flex">Browse products</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((r, i) => (
            <li key={r.id} className="card p-4 animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <span className="text-amber-500 text-sm leading-none">
                    {'★'.repeat(r.rating)}<span className="text-gray-300">{'★'.repeat(5 - r.rating)}</span>
                  </span>
                  <span className="ml-3 text-xs text-gray-500">on <span className="font-medium text-gray-700">{r.product?.name || '—'}</span></span>
                </div>
                <span className={`badge ring-1 ${r.is_approved
                  ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
                  : 'bg-amber-100 text-amber-800 ring-amber-200'}`}>
                  {r.is_approved ? '● approved' : 'pending'}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">{r.comment}</p>
              <div className="text-[11px] text-gray-400 mt-1">{timeAgo(r.created_at)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
