import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

/**
 * Landing page for "cctv" searches in Marthandam and Melpuram.
 *
 * Same reasoning as UsedLaptops.jsx: "cctv", "camera" and "surveillance"
 * appeared ZERO times across the whole catalogue, so the site could not rank for
 * them however good the technical SEO was. This gives that search something to
 * match.
 *
 * CCTV is a SERVICE, not a catalogue product — the schema below says so, and the
 * page drives an enquiry rather than an add-to-cart.
 *
 * The copy makes no claim about brands carried, pricing, AMC terms or response
 * times — none were supplied. Those specifics are what win the enquiry, so they
 * are worth filling in.
 */
export default function Cctv() {
  return (
    <>
      <Seo
        title="CCTV Installation in Marthandam"
        description="CCTV camera installation and service in Marthandam and Melpuram — home, shop and office security systems. Contact Fluro Tech for a site visit and quote."
        path="/cctv"
        jsonLd={[
          {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: 'CCTV Installation & Service',
            serviceType: 'CCTV camera installation, maintenance and repair',
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
            CCTV installation &amp; service
          </h1>
          <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg">
            Security cameras for homes, shops and offices — supplied, installed and
            maintained.
          </p>
          <div className="mt-8">
            <Link to="/contact" className="px-6 py-3 rounded-lg bg-white text-brand-700 font-semibold hover:bg-gray-100 transition">
              Request a site visit
            </Link>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Installation</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Camera placement planned around your building, with cabling, recorder setup and
              mobile viewing configured so you can check the feed from your phone.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Service &amp; repair</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              Existing system not recording, or a camera gone dark? We service and repair CCTV
              setups as well as installing new ones.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Where we work</h2>
            <p className="mt-2 text-gray-600 text-sm leading-relaxed">
              <strong>Marthandam</strong>, <strong>Melpuram</strong> and the surrounding areas
              of Kanyakumari district — homes, shops, offices and godowns.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-200 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Tell us what you need covered</h2>
          <p className="mt-2 text-gray-600 text-sm">
            Send us the number of cameras, or just describe the place, and we will advise what
            suits it and what it will cost.
          </p>
          <Link to="/contact" className="inline-block mt-5 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition">
            Get a quote
          </Link>
        </div>
      </section>
    </>
  );
}
