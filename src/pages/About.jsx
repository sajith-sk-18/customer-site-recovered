import { Link } from 'react-router-dom';

export default function About() {
  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 animate-gradient-x" />
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 bg-brand-300/40 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 w-96 h-96 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />

        <div className="relative container mx-auto px-4 py-16 md:py-24 text-center">
          <div className="text-xs uppercase tracking-widest text-white/70 animate-fade-up">Our story</div>
          <h1 className="text-4xl md:text-6xl font-extrabold mt-2 leading-tight animate-fade-up delay-100">
            We help India pick the <span className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white bg-clip-text text-transparent">right laptop</span>.
          </h1>
          <p className="mt-5 text-white/85 max-w-2xl mx-auto text-lg animate-fade-up delay-200">
            Since 2019 — curated models, honest pricing, and a 2-year warranty on every machine.
          </p>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="rgb(249 250 251)" d="M0,30 C360,80 1080,-10 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      {/* ---------- Stats strip ---------- */}
      <section className="container mx-auto px-4 -mt-12 md:-mt-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          <Stat n="50K+" label="Happy buyers" delay={0} />
          <Stat n="6 yrs" label="In business" delay={100} />
          <Stat n="120+" label="Curated models" delay={200} />
          <Stat n="4.9★" label="Avg. rating" delay={300} />
        </div>
      </section>

      {/* ---------- Mission ---------- */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center max-w-6xl">
        <div className="animate-fade-up">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">Our mission</div>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
            No markup. No fluff.<br/>Just the right machine.
          </h2>
          <p className="mt-4 text-gray-700 leading-relaxed">
            We started Fluro Tech in Kanniyakumari because picking a laptop in India
            felt impossible — fake reviews, hidden margins, sketchy warranties. So we built
            the opposite: a tight catalogue of <strong>120 hand-picked models</strong> from
            Dell, Apple, Lenovo, ASUS, HP, MSI, and accessories from Logitech, Keychron,
            Anker and LG — each one we'd buy ourselves.
          </p>
          <p className="mt-4 text-gray-700 leading-relaxed">
            We publish our margins on big-ticket items, offer a free 30-day return on
            anything, and bundle a 2-year extended warranty at zero cost.
          </p>
          <Link to="/products" className="btn-primary mt-6 hover-lift px-6 py-3 font-semibold inline-flex">
            Browse the catalogue →
          </Link>
        </div>

        {/* visual stack */}
        <div className="relative h-80 md:h-96 animate-fade-up delay-200">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-lime-100 to-emerald-100 rounded-3xl rotate-2" />
          <div className="absolute inset-0 bg-white rounded-3xl shadow-xl flex items-center justify-center text-[10rem] -rotate-1">
            <span className="animate-float select-none">💻</span>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 animate-fade-up delay-500">
            <div className="text-2xl font-extrabold text-brand-700">4.9★</div>
            <div className="text-[11px] text-gray-500">12,400+ reviews</div>
          </div>
          <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-3 animate-fade-up delay-700">
            <div className="text-2xl font-extrabold text-emerald-600">2-yr</div>
            <div className="text-[11px] text-gray-500">Free warranty</div>
          </div>
        </div>
      </section>

      {/* ---------- Values ---------- */}
      <section className="bg-white border-y border-gray-200">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-10 animate-fade-up">
            <div className="text-xs font-semibold uppercase tracking-wider text-brand-600">What we stand for</div>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Why customers stay with us</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Value icon="💸" title="Honest pricing"
                   body="We publish margins on big-ticket laptops. No hidden markup."
                   accent="from-emerald-500 to-teal-500" delay={0} />
            <Value icon="↩️" title="30-day returns"
                   body="Not what you expected? Return it within 30 days for a full refund."
                   accent="from-brand-400 to-brand-600" delay={100} />
            <Value icon="🛡️" title="2-year warranty"
                   body="Free extended warranty on every laptop — no fine print."
                   accent="from-lime-500 to-brand-600" delay={200} />
            <Value icon="🔧" title="Free assessment"
                   body="Thinking about an upgrade? Bring your old machine for a free spec audit."
                   accent="from-emerald-500 to-brand-500" delay={300} />
          </div>
        </div>
      </section>

      {/* ---------- Location + Contact split ---------- */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-5 max-w-5xl">
        <InfoBlock
          title="Visit our showroom"
          accent="from-brand-500 to-brand-700"
          rows={[
            { k: 'Address', v: 'Melpuram Junction, Near Bharath Petroleum Bunk, Pacode (P.O), Kanniyakumari District, Tamil Nadu - 629168' },
            { k: 'Hours',   v: 'Mon–Sat · 10 AM – 8 PM IST' },
            { k: 'Landmark', v: 'Near Bharath Petroleum Bunk' },
          ]}
        />
        <InfoBlock
          title="Talk to a human"
          accent="from-lime-500 to-emerald-500"
          rows={[
            { k: 'Phone',     v: <a href="tel:+919677409009" className="hover:text-brand-700">+91 96774 09009</a> },
            { k: 'Email',     v: <a href="mailto:Flurotech46@gmail.com" className="hover:text-brand-700">Flurotech46@gmail.com</a> },
            { k: 'Instagram', v: <a href="https://www.instagram.com/fluro_tech_" target="_blank" rel="noopener noreferrer" className="hover:text-brand-700">@fluro_tech_</a> },
            { k: 'Reply',     v: 'Within 24 hours, any day' },
          ]}
        />
      </section>

      {/* ---------- CTA ---------- */}
      <section className="container mx-auto px-4 pb-16">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-500 to-brand-400 text-white p-10 md:p-14 animate-gradient-x">
          <div className="pointer-events-none absolute -top-10 -right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-blob" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 w-72 h-72 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl md:text-4xl font-extrabold">Ready to find your next laptop?</h3>
            <p className="mt-3 text-white/90 text-lg">
              Tell us your budget and use-case — we'll hand-pick the best 3 options within 24 hours.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/contact" className="btn bg-white text-brand-700 hover:bg-gray-100 px-6 py-3 font-semibold hover-lift">
                Get a recommendation →
              </Link>
              <Link to="/products" className="btn border border-white/30 text-white hover:bg-white/10 backdrop-blur px-6 py-3">
                Browse instead
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ n, label, delay }) {
  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 text-center hover-lift animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">
        {n}
      </div>
      <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Value({ icon, title, body, accent, delay }) {
  return (
    <div
      className="card p-6 hover-lift animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accent} text-white text-2xl flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      <h3 className="font-semibold mt-4 text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-1">{body}</p>
    </div>
  );
}

function InfoBlock({ title, accent, rows }) {
  return (
    <div className="card p-6 hover-lift animate-fade-up">
      <div className={`inline-block text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${accent} text-white px-3 py-1 rounded-full`}>
        {title}
      </div>
      <dl className="mt-4 divide-y divide-gray-100">
        {rows.map((r, i) => (
          <div key={i} className="py-2.5 flex items-baseline gap-3">
            <dt className="w-20 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{r.k}</dt>
            <dd className="text-sm text-gray-800 flex-1">{r.v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
