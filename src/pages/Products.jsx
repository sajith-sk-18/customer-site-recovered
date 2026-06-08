import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

const FILTER_KEYS = ['q', 'category_id', 'brand', 'min_price', 'max_price'];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [meta, setMeta] = useState({ last_page: 1 });
  const [loading, setLoading] = useState(false);

  // URL is the single source of truth for filters + page, so the Navbar
  // search bar (which navigates to /products?q=…) just works, and the page
  // is refresh/bookmark safe.
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => Object.fromEntries(FILTER_KEYS.map((k) => [k, searchParams.get(k) || ''])),
    [searchParams]
  );
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  useDocumentTitle(filters.q ? `Search: ${filters.q}` : 'All products');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = { ...filters, page };
    Object.keys(params).forEach((k) => { if (params[k] === '' || params[k] === null) delete params[k]; });

    api.get('/products', { params }).then((r) => {
      if (cancelled) return;
      setProducts(r.data.data || []);
      setMeta({ last_page: r.data.last_page, total: r.data.total });
    }).catch(() => {
      if (!cancelled) setProducts([]);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [searchParams]);

  // Write a single filter into the URL, clearing page=1.
  // Use replace:true for text inputs so per-keystroke URL updates don't
  // pollute browser history; chip clicks/pagination use a new history entry.
  const set = (k, v, replace = false) => {
    const next = new URLSearchParams(searchParams);
    if (v === '' || v == null) next.delete(k); else next.set(k, v);
    next.delete('page');
    setSearchParams(next, { replace });
  };
  const setPage = (n) => {
    const next = new URLSearchParams(searchParams);
    if (n <= 1) next.delete('page'); else next.set('page', String(n));
    setSearchParams(next, { replace: false });
  };
  const clearAll = () => setSearchParams(new URLSearchParams());

  const activeCount = Object.values(filters).filter((v) => v !== '').length;

  return (
    <>
      {/* ---------- Page header ---------- */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 animate-gradient-x" />
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-brand-300/40 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-24 right-0 w-96 h-96 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />

        <div className="relative container mx-auto px-4 py-14 md:py-20">
          <div className="text-xs uppercase tracking-widest text-white/70 animate-fade-up">Shop</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 animate-fade-up delay-100">
            All <span className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white bg-clip-text text-transparent">products</span>
          </h1>
          <p className="mt-3 text-white/85 max-w-xl animate-fade-up delay-200">
            Filter by category, brand, price — and pick the machine that fits your work.
          </p>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="rgb(249 250 251)" d="M0,30 C360,80 1080,-10 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      <div className="container mx-auto px-4 pt-6">
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Products' }]} />
      </div>

      <div className="container mx-auto px-4 py-6 grid md:grid-cols-[260px_1fr] gap-6">
        {/* ---------- Filters ---------- */}
        <aside className="card p-5 h-fit md:sticky md:top-4 animate-fade-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M6 12h12M10 18h4" strokeLinecap="round"/>
              </svg>
              Filters
            </h2>
            {activeCount > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">
                {activeCount} active
              </span>
            )}
          </div>

          <div className="relative">
            <svg viewBox="0 0 24 24" className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" strokeLinecap="round"/>
            </svg>
            <input
              className="input pl-9"
              placeholder="Search products…"
              value={filters.q}
              onChange={(e) => set('q', e.target.value, true)}
            />
          </div>

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mt-4 mb-1">Category</label>
          {categories.length === 0 ? (
            <select className="input" disabled><option>Loading…</option></select>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              <Chip active={!filters.category_id} onClick={() => set('category_id', '')}>All</Chip>
              {categories.map((c) => (
                <Chip
                  key={c.id}
                  active={String(filters.category_id) === String(c.id)}
                  onClick={() => set('category_id', c.id)}
                >
                  {c.name}
                </Chip>
              ))}
            </div>
          )}

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mt-4 mb-1">Brand</label>
          <input
            className="input"
            placeholder="Dell, Apple…"
            value={filters.brand}
            onChange={(e) => set('brand', e.target.value, true)}
          />

          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mt-4 mb-1">Price (INR)</label>
          <div className="flex items-center gap-2">
            <input className="input" placeholder="Min" type="number" value={filters.min_price}
                   onChange={(e) => set('min_price', e.target.value, true)} />
            <span className="text-gray-400">—</span>
            <input className="input" placeholder="Max" type="number" value={filters.max_price}
                   onChange={(e) => set('max_price', e.target.value, true)} />
          </div>

          <button
            className="btn-secondary w-full mt-5 hover-lift disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={activeCount === 0}
            onClick={clearAll}
          >
            Clear all filters
          </button>
        </aside>

        {/* ---------- Results ---------- */}
        <section>
          <div className="flex items-center justify-between mb-5 animate-fade-up">
            <div>
              <h2 className="text-2xl font-bold">Results</h2>
              {meta.total !== undefined && (
                <div className="text-sm text-gray-500 mt-0.5">
                  {meta.total} product{meta.total === 1 ? '' : 's'} found
                </div>
              )}
            </div>
            {activeCount > 0 && (
              <button
                onClick={clearAll}
                className="text-sm font-medium text-brand-700 hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0,1,2,3,4,5].map((i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="aspect-[4/3] shimmer" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-1/3 shimmer rounded" />
                    <div className="h-4 w-3/4 shimmer rounded" />
                    <div className="h-4 w-1/2 shimmer rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="card p-12 text-center animate-fade-up">
              <div className="text-6xl">🔍</div>
              <h3 className="font-semibold text-lg mt-3">No products match your filters</h3>
              <p className="text-sm text-gray-500 mt-1">Try widening the price range or clearing a filter.</p>
              <button onClick={clearAll} className="btn-primary mt-5 hover-lift">Clear filters</button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {products.map((p, i) => (
                <div
                  key={p.id}
                  className="animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}

          {meta.last_page > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                className="btn-secondary hover-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                ‹ Prev
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                      n === page
                        ? 'bg-brand-600 text-white shadow'
                        : 'bg-white border border-gray-200 text-gray-700 hover:border-brand-300 hover:text-brand-700'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <button
                className="btn-secondary hover-lift disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
                disabled={page >= meta.last_page}
                onClick={() => setPage(page + 1)}
              >
                Next ›
              </button>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
        active
          ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
          : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-700'
      }`}
    >
      {children}
    </button>
  );
}
