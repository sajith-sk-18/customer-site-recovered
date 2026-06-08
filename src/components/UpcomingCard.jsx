import { inr } from '../lib/money';

export default function UpcomingCard({ item }) {
  const expected = item.expected_at ? new Date(item.expected_at) : null;
  const dateLabel = expected
    ? expected.toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
    : 'TBA';
  const daysToGo = expected
    ? Math.max(0, Math.ceil((expected - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-200/70 overflow-hidden
                    shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-brand-300
                    transition-all duration-300">
      {/* badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 text-white text-[10px] font-bold tracking-wider shadow">
          ⏳ COMING SOON
        </span>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-brand-50 via-lime-50 to-emerald-50">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name}
               className="w-full h-full object-cover blur-[1px] group-hover:blur-0 transition duration-500 group-hover:scale-105" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-7xl opacity-60 group-hover:scale-110 transition">
            ⏳
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <div className="text-[10px] uppercase tracking-wider opacity-80">Expected</div>
            <div className="font-bold text-sm">{dateLabel}</div>
          </div>
          {daysToGo != null && (
            <div className="text-right bg-white/15 backdrop-blur px-2.5 py-1 rounded-lg">
              <div className="text-lg font-extrabold leading-none">{daysToGo}</div>
              <div className="text-[10px] uppercase opacity-80">days</div>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
          {item.brand || item.category?.name || '—'}
        </div>
        <h3 className="mt-1 font-semibold text-sm text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {item.name}
        </h3>
        {item.teaser && (
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.teaser}</p>
        )}
        <div className="mt-3 flex items-end justify-between">
          {item.expected_price ? (
            <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-wider">Est. price</div>
              <div className="text-lg font-extrabold text-gray-900">
                {inr(item.expected_price)}
              </div>
            </div>
          ) : <span />}
          <span className="text-xs font-semibold text-brand-700">Notify me →</span>
        </div>
      </div>
    </div>
  );
}
