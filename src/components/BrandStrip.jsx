import { Link } from 'react-router-dom';

/**
 * "Shop by brand" logo strip. Uses Simple Icons CDN for brand logos (free, hotlink-friendly),
 * with a clean text fallback for brands without an icon. Each links to the brand-filtered list.
 */
const BRANDS = [
  { name: 'Dell', slug: 'dell' },
  { name: 'Apple', slug: 'apple' },
  { name: 'Lenovo', slug: 'lenovo' },
  { name: 'ASUS', slug: 'asus' },
  { name: 'HP', slug: 'hp' },
  { name: 'Acer', slug: 'acer' },
  { name: 'MSI', slug: 'msibusiness' },
  { name: 'Razer', slug: 'razer' },
  { name: 'Samsung', slug: 'samsung' },
  { name: 'Sony', slug: 'sony' },
  { name: 'LG', slug: 'lg' },
  { name: 'TP-Link', slug: 'tplink' },
  { name: 'Logitech', slug: null },
  { name: 'Anker', slug: null },
  { name: 'Bose', slug: null },
  { name: 'JBL', slug: 'jbl' },
];

export default function BrandStrip() {
  return (
    <section className="bg-white border-y border-gray-200">
      <div className="container mx-auto px-4 py-10">
        <div className="text-xs uppercase tracking-widest text-brand-600 font-semibold text-center">Top brands</div>
        <h2 className="text-2xl font-bold text-center mt-1 mb-6">Shop by brand</h2>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {BRANDS.map((b) => (
            <Link
              key={b.name}
              to={`/products?brand=${encodeURIComponent(b.name)}`}
              title={b.name}
              className="group flex items-center justify-center h-14 w-28 rounded-xl border border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm transition px-3"
            >
              {b.slug && (
                <img
                  src={`https://cdn.simpleicons.org/${b.slug}/64748b`}
                  alt={b.name}
                  className="max-h-7 max-w-[84px] object-contain opacity-70 group-hover:opacity-100 transition"
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'inline'; }}
                />
              )}
              <span
                style={{ display: b.slug ? 'none' : 'inline' }}
                className="text-sm font-extrabold text-gray-500 group-hover:text-brand-700 tracking-tight"
              >
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
