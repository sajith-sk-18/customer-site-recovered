import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import api from '../api';
import RatingStars from '../components/RatingStars';
import OfferList from '../components/OfferList';
import Breadcrumbs from '../components/Breadcrumbs';
import ShareButton from '../components/ShareButton';
import WishlistButton from '../components/WishlistButton';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import { inr } from '../lib/money';
import { brandLogo } from '../lib/brands';
import { useAuth } from '../hooks/useAuth';
import { trackView } from '../lib/recentlyViewed';
import { useEnquiry } from '../Enquiry';
import Seo, { SITE_URL } from '../components/Seo';

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const { authed } = useAuth();
  const enquiry = useEnquiry();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  // Review form — name/email come from the account when logged in, or from
  // the guest fields below otherwise.
  const [form, setForm] = useState({ rating: 5, comment: '', name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/reviews`),
    ]).then(([p, r]) => {
      if (cancelled) return;
      setProduct(p.data);
      setReviews(r.data || []);
      // Persist to the browser's "recently viewed" memory once the product loads.
      trackView(p.data);
    }).catch(() => {
      if (!cancelled) setProduct(null);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const r = await api.post('/reviews', { ...form, product_id: Number(id) });
      setMsg({ type: 'ok', text: r.data.message || 'Thanks! Awaiting approval.' });
      setForm({ rating: 5, comment: '' });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setMsg({ type: 'err', text: 'Please sign in to write a review.' });
        return;
      }
      const errs = err?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setMsg({ type: 'err', text: first || err?.response?.data?.message || 'Could not submit review.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="container mx-auto p-12 text-center text-gray-500">Loading…</div>;
  if (!product) return <div className="container mx-auto p-12 text-center text-gray-500">Product not found. <Link to="/products" className="text-brand-700">Browse all →</Link></div>;

  const images = product.images || [];
  const current = images[activeImage]?.url;
  const avg = product.approved_reviews_avg_rating ?? 0;
  const count = product.approved_reviews_count ?? reviews.length;

  return (
    <div className="container mx-auto px-4 py-8">
      <Seo
        title={product.name}
        description={(product.description || `${product.brand} ${product.name}`).slice(0, 160)}
        path={`/products/${product.id}`}
        type="product"
        image={images[0]?.url}
        jsonLd={[
          {
            '@context': 'https://schema.org', '@type': 'Product',
            name: product.name,
            image: (product.images || []).map((i) => i.url),
            description: product.description || `${product.brand} ${product.name}`,
            sku: String(product.id),
            brand: { '@type': 'Brand', name: product.brand || 'Fluro Tech' },
            offers: {
              '@type': 'Offer', priceCurrency: 'INR', price: String(product.price),
              availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
              url: `${SITE_URL}/products/${product.id}`,
            },
            ...(count ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: String(Number(avg).toFixed(1)), reviewCount: String(count) } } : {}),
          },
          {
            '@context': 'https://schema.org', '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
              { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
              { '@type': 'ListItem', position: 3, name: product.name, item: `${SITE_URL}/products/${product.id}` },
            ],
          },
        ]}
      />
      {/* Breadcrumbs */}
      <Breadcrumbs items={[
        { label: 'Home', to: '/' },
        { label: 'Products', to: '/products' },
        ...(product.category ? [{ label: product.category.name, to: `/products?category_id=${product.category.id}` }] : []),
        { label: product.name },
      ]} />

      <div className="grid md:grid-cols-2 gap-8 mt-5">
        {/* Gallery with hover zoom */}
        <div>
          <ZoomImage src={current} alt={product.name} />
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 border-2 rounded-lg overflow-hidden flex-shrink-0 transition ${i === activeImage ? 'border-brand-600 ring-2 ring-brand-300/40' : 'border-gray-200 hover:border-brand-300'}`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wide">
            {brandLogo(product.brand) && (
              <img
                src={brandLogo(product.brand)}
                alt={product.brand}
                className="h-4 max-w-[64px] object-contain opacity-75"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            )}
            <span>{product.brand} • {product.category?.name}</span>
          </div>
          <div className="flex items-start justify-between gap-3 mt-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex-1">{product.name}</h1>
            <div className="shrink-0 flex items-center gap-2">
              <WishlistButton productId={product.id} />
              <ShareButton title={product.name} text={`Check out the ${product.brand} ${product.name} on Fluro Tech`} />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <RatingStars value={avg} size="md" />
            <span className="text-sm text-gray-500">{Number(avg).toFixed(1)} ({count} review{count !== 1 ? 's' : ''})</span>
          </div>
          <div className="text-3xl font-bold text-brand-700 mt-4">{inr(product.price)}</div>
          <div className={`mt-1 text-sm ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </div>

          <OfferList offers={product.live_offers || []} basePrice={product.price} />

          {product.description && (
            <p className="mt-5 text-gray-700 leading-relaxed">{product.description}</p>
          )}

          {product.specs && Object.keys(product.specs).length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <dl className="card divide-y">
                {Object.entries(product.specs).map(([k, v]) => (
                  <div key={k} className="flex px-4 py-2 text-sm">
                    <dt className="w-1/3 text-gray-500">{k}</dt>
                    <dd className="flex-1 font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => enquiry.open(product)}
              className="btn bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 px-7 py-3 text-base font-semibold shadow-lg shadow-brand-500/30"
            >
              📩 Enquiry Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customer reviews</h2>

        {reviews.length === 0 ? (
          <div className="text-gray-500 mb-4">No reviews yet. Be the first.</div>
        ) : (
          <ul className="space-y-3 mb-6">
            {reviews.map((r) => (
              <li key={r.id} className="card p-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{r.customer_name}</div>
                  <RatingStars value={r.rating} />
                </div>
                <p className="text-sm text-gray-700 mt-2">{r.comment}</p>
                <div className="text-xs text-gray-400 mt-2">{new Date(r.created_at).toLocaleDateString()}</div>
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={submitReview} className="card p-4 max-w-lg">
          <h3 className="font-semibold mb-3">Write a review</h3>

          {msg && (
            <div className={`text-sm mb-3 p-2 rounded ${msg.type === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-700'}`}>
              {msg.text}
            </div>
          )}

          {!authed && (
            <div className="grid sm:grid-cols-2 gap-2 mb-3">
              <input
                className="input"
                type="text"
                required
                maxLength={120}
                placeholder="Your name *"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="input"
                type="email"
                required
                maxLength={190}
                placeholder="Your email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rating:</span>
            <RatingStars value={form.rating} size="lg" interactive onChange={(n) => setForm({ ...form, rating: n })} />
          </div>
          <textarea className="input mt-3" rows="4" placeholder="Share what you liked / didn't like *" required value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })} />
          <button className="btn-primary mt-3" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit review'}
          </button>
          <p className="text-[11px] text-gray-400 mt-2">Reviews appear after admin approval.</p>
        </form>
      </section>

      {/* Related products */}
      <RelatedProducts productId={Number(id)} />

      {/* Recently viewed (excluding this product) */}
      <RecentlyViewed excludeId={Number(id)} />
    </div>
  );
}

/**
 * Square-aspect image that leans toward the cursor in 3D and zooms on hover.
 * The frame tilts (rotateX/rotateY) with a moving light-glare while the inner
 * image pans + zooms — all from one pointer handler, pure CSS, no deps.
 */
function ZoomImage({ src, alt }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hover, setHover] = useState(false);

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPos({ x, y });
  };

  if (!src) {
    return (
      <div className="card aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        <span className="text-8xl text-gray-300">💻</span>
      </div>
    );
  }

  // Tilt the frame toward the pointer (max ~8°). Neutral when not hovering.
  const MAX = 8;
  const rx = hover ? ((50 - pos.y) / 50) * MAX : 0;
  const ry = hover ? ((pos.x - 50) / 50) * MAX : 0;

  return (
    <div className="[perspective:1200px]">
      <div
        className={`card aspect-[4/3] bg-gray-100 overflow-hidden relative cursor-zoom-in select-none
                    transition-[transform,box-shadow] duration-150 will-change-transform
                    ${hover ? 'shadow-2xl shadow-brand-500/30' : ''}`}
        style={{ transform: `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)` }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={onMove}
        role="img"
        aria-label={alt}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          style={{
            transformOrigin: `${pos.x}% ${pos.y}%`,
            transform: hover ? 'scale(1.8)' : 'scale(1)',
          }}
          className="w-full h-full object-cover transition-transform duration-150"
        />
        {/* moving light glare */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-200 mix-blend-overlay"
          style={{
            opacity: hover ? 1 : 0,
            background: `radial-gradient(55% 55% at ${pos.x}% ${pos.y}%, rgba(255,255,255,.5), rgba(255,255,255,0) 60%)`,
          }}
        />
        <div className={`pointer-events-none absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider bg-gray-900/70 text-white backdrop-blur transition ${hover ? 'opacity-0' : 'opacity-100'}`}>
          ⤢ Hover to zoom
        </div>
      </div>
    </div>
  );
}
