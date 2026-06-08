import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [sent,  setSent]  = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    setEmail('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <footer className="relative mt-16 bg-gray-950 text-gray-300 overflow-hidden">
      {/* decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -left-20 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl animate-blob" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl animate-blob delay-300" />

      {/* top accent line */}
      <div className="h-1 bg-gradient-to-r from-brand-400 via-brand-500 to-brand-700 animate-gradient-x" />

      <div className="relative container mx-auto px-4 py-14 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3 group" aria-label="Fluro Tech home">
            <img
              src="/logo.jpg"
              alt="Fluro Tech"
              className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-400/50 shadow-lg shadow-brand-500/40 group-hover:ring-brand-400 group-hover:shadow-brand-500/60 transition"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'inline-flex'; }}
            />
            <span style={{ display: 'none' }} className="items-center gap-2 text-2xl font-extrabold">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white text-lg inline-flex items-center justify-center shadow-lg shadow-brand-500/40">⚡</span>
              <span>
                <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">Fluro</span>
                <span className="text-white"> Tech</span>
              </span>
            </span>
            <span className="text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-brand-300 to-brand-500 bg-clip-text text-transparent">Fluro</span>
              <span className="text-white"> Tech</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed">
            Quality laptops &amp; accessories at fair prices.
            Hand-picked since 2019. Trusted buyers across South India.
          </p>

          <address className="not-italic mt-4 text-sm text-gray-400 leading-relaxed">
            Melpuram Junction,<br/>
            Near Bharath Petroleum Bunk,<br/>
            Pacode (P.O), Kanniyakumari District,<br/>
            Tamil Nadu - 629168<br/>
            <a href="tel:+919677409009" className="footer-link inline-block mt-2">+91 96774 09009</a><br/>
            <a href="mailto:Flurotech46@gmail.com" className="footer-link">Flurotech46@gmail.com</a>
          </address>

          <div className="mt-5 flex gap-2">
            {[
              { name: 'instagram', href: 'https://www.instagram.com/fluro_tech_', path: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5-1.2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z' },
              { name: 'email',     href: 'mailto:Flurotech46@gmail.com', path: 'M3 5h18a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 2v.4l9 5.6 9-5.6V7H3zm0 2.8V18h18V9.8l-9 5.6L3 9.8z' },
              { name: 'phone',     href: 'tel:+919677409009', path: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z' },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={s.name}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-gradient-to-br hover:from-brand-400 hover:to-brand-600 border border-white/10 hover:border-transparent flex items-center justify-center text-gray-400 hover:text-white transition-all hover:-translate-y-0.5"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <FooterCol title="Shop">
          <FooterLink to="/products">All products</FooterLink>
          <FooterLink to="/products?category_slug=laptops">Laptops</FooterLink>
          <FooterLink to="/products?category_slug=accessories">Accessories</FooterLink>
          <FooterLink to="/products?featured=1">Featured</FooterLink>
        </FooterCol>

        {/* Support */}
        <FooterCol title="Support">
          <FooterLink to="/contact">Contact us</FooterLink>
          <FooterLink to="/about">About</FooterLink>
          <span className="footer-link">30-day returns</span>
          <span className="footer-link">2-year warranty</span>
          <span className="footer-link">Shipping</span>
        </FooterCol>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Stay in the loop</h3>
          <p className="text-sm text-gray-400 mb-3">
            New arrivals, deals and config guides — once a week, no spam.
          </p>
          <form onSubmit={subscribe} className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-4 pr-28 py-2.5 text-sm rounded-full bg-white/5 border border-white/10
                         text-white placeholder:text-gray-500
                         focus:bg-white/10 focus:border-brand-400 focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-4 rounded-full text-xs font-semibold
                         bg-gradient-to-r from-brand-400 to-brand-600 text-white
                         hover:from-brand-500 hover:to-brand-700 transition shadow"
            >
              Subscribe
            </button>
          </form>
          {sent && (
            <div className="mt-2 text-xs text-emerald-400 animate-fade-in">
              ✓ Thanks — check your inbox!
            </div>
          )}

          <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">VISA</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">MC</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">UPI</span>
            <span className="px-2 py-1 rounded bg-white/5 border border-white/10">COD</span>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="relative border-t border-white/10">
        <div className="container mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div>© {new Date().getFullYear()} Fluro Tech. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition">Privacy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms</a>
            <a href="#" className="hover:text-gray-300 transition">Sitemap</a>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              All systems normal
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }) {
  return (
    <div>
      <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">{title}</h3>
      <ul className="space-y-2">
        {Array.isArray(children) ? children.map((c, i) => <li key={i}>{c}</li>) : <li>{children}</li>}
      </ul>
    </div>
  );
}

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="footer-link"
    >
      {children}
    </Link>
  );
}
