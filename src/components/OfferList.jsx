import { Link } from 'react-router-dom';
import { inr } from '../lib/money';

export default function OfferList({ offers, basePrice }) {
  if (!offers || offers.length === 0) return null;

  const fmt = (n) => inr(n);

  return (
    <div className="mt-6 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
          🎁 Offers available
        </span>
        <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[10px] font-bold">
          {offers.length}
        </span>
      </div>

      {offers.map((o) => {
        if (o.type === 'bundle') {
          const bp = o.bundle_product;
          if (!bp) return null;
          const isFree = Number(o.bundle_discount) >= 100;
          const bundleSavings = isFree
            ? Number(bp.price)
            : Number(bp.price) * (Number(o.bundle_discount) / 100);

          return (
            <div
              key={o.id}
              className="relative overflow-hidden rounded-xl border border-lime-200 bg-gradient-to-br
                         from-lime-50 via-emerald-50 to-brand-50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lime-400 to-brand-600 text-white
                                flex items-center justify-center shadow shrink-0">
                  🎁
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900">{o.title}</div>
                  {o.description && (
                    <div className="text-xs text-gray-600 mt-0.5">{o.description}</div>
                  )}

                  <Link
                    to={`/products/${bp.id}`}
                    className="mt-3 flex items-center gap-3 bg-white/80 hover:bg-white border border-lime-200
                               rounded-lg p-2.5 transition"
                  >
                    <div className="w-14 h-14 rounded-md bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                      {bp.images?.[0]?.url
                        ? <img src={bp.images[0].url} alt="" className="w-full h-full object-cover" />
                        : <span className="text-2xl text-gray-300">🖱️</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">{bp.brand}</div>
                      <div className="font-medium text-sm truncate">{bp.name}</div>
                      <div className="text-xs mt-0.5">
                        {isFree ? (
                          <>
                            <span className="line-through text-gray-400 mr-1">{fmt(bp.price)}</span>
                            <span className="font-bold text-emerald-600">FREE</span>
                          </>
                        ) : (
                          <>
                            <span className="line-through text-gray-400 mr-1">{fmt(bp.price)}</span>
                            <span className="font-bold text-brand-700">
                              −{o.bundle_discount}% (save {fmt(bundleSavings)})
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="text-brand-700 text-sm">→</span>
                  </Link>
                </div>
              </div>
            </div>
          );
        }

        // percent or flat — main-product discount
        const newPrice = o.discounted_price ?? null;
        const savings = newPrice != null ? Math.max(0, Number(basePrice) - newPrice) : null;

        return (
          <div
            key={o.id}
            className="relative overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-br
                       from-brand-50 via-lime-50 to-emerald-50 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white
                              flex items-center justify-center shadow shrink-0 font-bold text-sm">
                {o.type === 'percent' ? `${Math.round(Number(o.discount_value))}%` : '₹'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{o.title}</div>
                {o.description && (
                  <div className="text-xs text-gray-600 mt-0.5">{o.description}</div>
                )}
                {newPrice != null && (
                  <div className="mt-2 flex items-baseline gap-2 flex-wrap">
                    <span className="text-2xl font-extrabold text-brand-700">{fmt(newPrice)}</span>
                    <span className="text-sm text-gray-400 line-through">{fmt(basePrice)}</span>
                    {savings > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-100 text-brand-700 text-[11px] font-bold">
                        Save {fmt(savings)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
