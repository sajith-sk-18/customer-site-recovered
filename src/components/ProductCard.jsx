import { Link } from 'react-router-dom';
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';
import Tilt3D from './Tilt3D';
import { inr } from '../lib/money';

export default function ProductCard({ product }) {
  const primary  = product.images?.[0]?.url;
  const rating   = product.approved_reviews_avg_rating ?? 0;
  const count    = product.approved_reviews_count ?? 0;
  const price    = Number(product.price);

  // Pick the best "main product" offer (percent / flat) for headline pricing
  const liveOffers = product.live_offers || [];
  const priceOffer = liveOffers.find((o) => o.type === 'percent' || o.type === 'flat') || null;
  const bundleOffer = liveOffers.find((o) => o.type === 'bundle') || null;

  const effectivePrice = priceOffer?.discounted_price != null ? Number(priceOffer.discounted_price) : price;
  const oldPrice = product.old_price ? Number(product.old_price) : (priceOffer ? price : null);
  const discount =
    priceOffer?.type === 'percent'
      ? Math.round(Number(priceOffer.discount_value))
      : oldPrice && oldPrice > effectivePrice
        ? Math.round(((oldPrice - effectivePrice) / oldPrice) * 100)
        : null;
  const inStock  = product.stock == null ? true : Number(product.stock) > 0;
  const isNew    = !!product.is_new;
  const isFeat   = !!product.is_featured;

  return (
    <Tilt3D>
    <Link
      to={`/products/${product.id}`}
      className="group relative block h-full bg-white rounded-2xl border border-gray-200/70 overflow-hidden
                 hover:border-brand-300 transition-colors duration-300"
    >
      {/* gradient glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100
                      transition duration-500 bg-gradient-to-br from-brand-500/10 via-transparent to-lime-300/10" />

      {/* image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        {/* badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {discount && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold tracking-wide shadow">
              -{discount}%
            </span>
          )}
          {isNew && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold tracking-wide shadow">
              NEW
            </span>
          )}
          {isFeat && !isNew && !discount && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold tracking-wide shadow">
              ★ FEATURED
            </span>
          )}
          {bundleOffer && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-lime-400 to-brand-500 text-white text-[10px] font-bold tracking-wide shadow">
              🎁 BUNDLE
            </span>
          )}
        </div>

        {/* wishlist heart — always visible if already wishlisted, otherwise on hover */}
        <div className="absolute top-3 right-3 z-10 [&_button]:opacity-100 group-hover:[&_button]:opacity-100 transition">
          <WishlistButton productId={product.id} size="sm" />
        </div>

        {/* out-of-stock veil */}
        {!inStock && (
          <div className="absolute inset-0 z-10 bg-white/70 backdrop-blur-[1px] flex items-center justify-center">
            <span className="px-3 py-1 rounded-md bg-gray-900 text-white text-xs font-semibold">
              Out of stock
            </span>
          </div>
        )}

        {primary ? (
          <img
            src={primary}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-6xl text-gray-300
                           transition-transform duration-500 group-hover:scale-110">
            💻
          </span>
        )}

        {/* quick-action bar */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex gap-2 translate-y-3 opacity-0
                        group-hover:translate-y-0 group-hover:opacity-100 transition duration-300">
          <span className="flex-1 text-center py-2 rounded-lg bg-brand-600 text-white text-xs font-semibold
                           shadow-lg hover:bg-brand-700">
            View details
          </span>
        </div>
      </div>

      {/* body */}
      <div className="relative p-4">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
            {product.brand || '—'}
          </div>
          <div className="flex items-center gap-1">
            <RatingStars value={rating} />
            <span className="text-[11px] text-gray-500">({count})</span>
          </div>
        </div>

        <h3 className="mt-1.5 font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]
                       group-hover:text-brand-700 transition">
          {product.name}
        </h3>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-lg font-extrabold ${priceOffer ? 'text-brand-700' : 'text-gray-900'}`}>
                {inr(effectivePrice)}
              </span>
              {oldPrice && oldPrice > effectivePrice && (
                <span className="text-xs text-gray-400 line-through">
                  {inr(oldPrice)}
                </span>
              )}
            </div>
            {inStock ? (
              <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                In stock
              </div>
            ) : (
              <div className="text-[11px] text-gray-400 mt-0.5">Unavailable</div>
            )}
          </div>

          <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center
                          group-hover:bg-brand-600 group-hover:text-white transition shadow-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
    </Tilt3D>
  );
}
