import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import ProductCard from '../components/ProductCard';
import Tilt3D from '../components/Tilt3D';
import UpcomingCard from '../components/UpcomingCard';
import RecentlyViewed from '../components/RecentlyViewed';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useDocumentTitle('Quality laptops & accessories');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r1 = await api.get('/products', { params: { featured: 1, per_page: 8 } });
        if (cancelled) return;
        setFeatured(r1.data.data || []);

        const r2 = await api.get('/categories');
        if (cancelled) return;
        const acc = r2.data.find((c) => c.slug === 'accessories');
        if (acc) {
          const r3 = await api.get('/products', { params: { category_id: acc.id, per_page: 4 } });
          if (cancelled) return;
          setAccessories(r3.data.data || []);
        }

        const r4 = await api.get('/upcoming');
        if (cancelled) return;
        setUpcoming((r4.data || []).slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="relative overflow-hidden text-white">
        {/* animated gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 animate-gradient-x" />

        {/* floating colour blobs */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-brand-300/40 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute top-20 -right-32 w-[28rem] h-[28rem] bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-blob delay-500" />

        <div className="relative container mx-auto px-4 py-20 md:py-28 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium border border-white/20 animate-fade-up">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              New 2026 laptops just landed
            </span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight tracking-tight animate-fade-up delay-100">
              Power your work.<br/>
              <span className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white bg-clip-text text-transparent">
                Pick a laptop you'll love.
              </span>
            </h1>
            <p className="mt-5 text-brand-50/90 max-w-md text-lg animate-fade-up delay-200">
              Hand-picked laptops + accessories from Dell, Apple, Lenovo, ASUS and more.
              30-day returns. Free shipping over ₹50,000.
            </p>
            <div className="mt-7 flex flex-wrap gap-3 animate-fade-up delay-300">
              <Link
                to="/products"
                className="btn bg-white text-brand-700 hover:bg-gray-100 shadow-lg shadow-black/10 hover-lift px-6 py-3 font-semibold"
              >
                Shop now →
              </Link>
              <Link
                to="/about"
                className="btn border border-white/30 text-white hover:bg-white/10 backdrop-blur px-6 py-3"
              >
                Why us
              </Link>
            </div>

            {/* mini stats */}
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md animate-fade-up delay-500">
              <Stat n="50K+" label="Happy buyers" />
              <Stat n="4.9★"  label="Avg. rating" />
              <Stat n="24/7"  label="Live support" />
            </div>
          </div>

          {/* floating laptop with glow — leans toward the cursor in 3D */}
          <div className="hidden md:flex justify-center relative animate-fade-in delay-300">
            <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
            <Tilt3D max={16} glare={false} card={false} className="relative">
              <div className="text-[16rem] drop-shadow-2xl animate-float select-none">💻</div>
            </Tilt3D>
            <div className="absolute top-10 right-0 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-sm shadow-lg animate-fade-up delay-500">
              ⚡ <span className="font-semibold">i9 · 32GB · RTX</span>
            </div>
            <div className="absolute bottom-12 left-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 text-sm shadow-lg animate-fade-up delay-700">
              🔋 <span className="font-semibold">18hr battery</span>
            </div>
          </div>
        </div>

        {/* wave divider */}
        <svg className="relative block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
          <path fill="rgb(249 250 251)" d="M0,40 C360,100 1080,-20 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </section>

      {/* ---------- Brand strip (marquee) ---------- */}
      <section className="bg-gray-50 border-b border-gray-200 overflow-hidden">
        <div className="container mx-auto px-4 py-5">
          <div className="text-center text-xs uppercase tracking-widest text-gray-500 mb-3">
            Trusted brands we carry
          </div>
          <div className="relative">
            <div className="flex gap-12 whitespace-nowrap animate-marquee">
              {['Apple','Dell','Lenovo','ASUS','HP','MSI','Razer','Acer','Apple','Dell','Lenovo','ASUS','HP','MSI','Razer','Acer'].map((b, i) => (
                <div key={i} className="text-2xl md:text-3xl font-bold text-gray-400 hover:text-brand-600 transition">
                  {b}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Featured ---------- */}
      <section className="container mx-auto px-4 py-14">
        <div className="flex items-end justify-between mb-8 animate-fade-up">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">Top picks</div>
            <h2 className="text-3xl font-bold mt-1">Featured laptops</h2>
          </div>
          <Link to="/products" className="text-sm font-medium text-brand-700 hover:underline">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0,1,2,3].map((i) => (
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
        ) : featured.length === 0 ? (
          <div className="text-gray-500">No featured products yet. Check back soon.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up hover-lift"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ---------- Accessories ---------- */}
      {accessories.length > 0 && (
        <section className="container mx-auto px-4 py-6">
          <div className="flex items-end justify-between mb-8 animate-fade-up">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">Boost your setup</div>
              <h2 className="text-3xl font-bold mt-1">Accessories</h2>
            </div>
            <Link to="/products?category_slug=accessories" className="text-sm font-medium text-brand-700 hover:underline">
              More →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {accessories.map((p, i) => (
              <div
                key={p.id}
                className="animate-fade-up hover-lift"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Coming Soon ---------- */}
      {upcoming.length > 0 && (
        <section className="container mx-auto px-4 py-6">
          <div className="flex items-end justify-between mb-8 animate-fade-up">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-700">⏳ Sneak peek</div>
              <h2 className="text-3xl font-bold mt-1">Coming soon</h2>
            </div>
            <Link to="/upcoming" className="text-sm font-medium text-brand-700 hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcoming.map((item, i) => (
              <div
                key={item.id}
                className="animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <UpcomingCard item={item} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Trust strip ---------- */}
      <section className="bg-white border-y border-gray-200 mt-10">
        <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-6">
          <Tile icon="🚚" title="Free shipping" body="Orders over ₹50,000 ship free across India." />
          <Tile icon="🛡️" title="2-year warranty" body="Manufacturer warranty on every product, no fine print." />
          <Tile icon="↩️" title="30-day returns" body="Not what you expected? Return it within 30 days for a full refund." />
        </div>
      </section>

      {/* ---------- CTA banner ---------- */}
      <section className="container mx-auto px-4 py-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 text-white p-10 md:p-14 animate-gradient-x">
          <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-72 h-72 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold">Not sure which laptop is right?</h3>
            <p className="mt-3 text-white/90 text-lg">
              Tell us your budget and use-case — our team will hand-pick the best 3 options for you within 24 hours.
            </p>
            <Link
              to="/contact"
              className="btn mt-6 bg-white text-brand-700 hover:bg-gray-100 px-6 py-3 font-semibold hover-lift"
            >
              Get a recommendation →
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- Recently viewed ---------- */}
      <RecentlyViewed />
    </>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="text-2xl md:text-3xl font-extrabold">{n}</div>
      <div className="text-xs text-white/70">{label}</div>
    </div>
  );
}

function Tile({ icon, title, body }) {
  return (
    <div className="text-center p-6 rounded-xl hover-lift bg-gray-50/40">
      <div className="text-5xl">{icon}</div>
      <h3 className="mt-3 font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{body}</p>
    </div>
  );
}
