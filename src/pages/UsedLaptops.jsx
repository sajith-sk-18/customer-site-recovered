import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/**
 * Landing page for "used laptop" / "second hand laptop" searches in Marthandam
 * and Melpuram.
 *
 * Why a dedicated page rather than a category filter: those searches were
 * unreachable because the words appeared NOWHERE on the site — zero mentions of
 * "used", "second hand" or "refurbished" across all products. A filter URL has
 * no title, description or copy of its own, so there is nothing for Google to
 * match. This page does.
 *
 * The copy deliberately makes no claim about warranty, pricing or stock levels —
 * none were supplied. Fill those in; specifics are what convert a visitor.
 *
 * TODO: once a "Used & Refurbished Laptops" category exists, list its products
 * here. Left out on purpose so the page never renders an empty grid.
 */
export default function UsedLaptops() {
  return (
    <>
      <Seo
        title="Second Hand & Used Laptops in Marthandam"
        description="Buy second hand and used laptops in Marthandam and Melpuram. Tested refurbished laptops from Dell, HP, Lenovo and Asus — enquire on WhatsApp for current stock and prices."
        path="/used-laptops"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'Second Hand & Used Laptops',
            serviceType: 'Used and refurbished laptop sales',
            provider: { '@type': 'LocalBusiness', name: 'Fluro Tech' },
            areaServed: [
              { '@type': 'City', name: 'Marthandam' },
              { '@type': 'City', name: 'Melpuram' },
            ],
          },
        ]}
      />

      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400" />
        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="text-xs uppercase tracking-widest text-white/70">Marthandam &amp; Melpuram</div>
          <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">
            Second hand &amp; used laptops
          </h1>
          <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
            Refurbished laptops checked before they are sold — a lower-cost way to get a
            reliable machine for study, work or home.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="px-6 py-3 rounded-lg bg-white text-brand-700 font-semibold hover:bg-gray-100 transition">
              Ask about current stock
            </Link>
            <Link to="/products" className="px-6 py-3 rounded-lg border border-white/60 font-semibold hover:bg-white/10 transition">
              Browse all laptops
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">What we stock</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Used and refurbished laptops from brands including Dell, HP, Lenovo and Asus —
              from everyday machines for browsing and study to higher-spec models for design
              and development work.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Before it is sold</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Each machine is checked and cleaned, and we tell you honestly what condition it
              is in — battery health, screen, keyboard and ports — so there are no surprises
              after you buy.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Where we are</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              We serve <strong>Marthandam</strong> and <strong>Melpuram</strong> and the
              surrounding areas of Kanyakumari district. Message us on WhatsApp to check what
              is in stock today.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Looking for a specific model?</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Stock of second hand laptops changes constantly. Tell us your budget and what you
            need it for, and we will let you know what we have.
          </p>
          <Link to="/contact" className="inline-block mt-5 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
            Enquire now
          </Link>
        </div>
      </section>
    </>
  );
}
