import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AnnouncementBar from './AnnouncementBar';

// Public storefront navbar — no sign-in / account UI.
export default function Navbar() {
  const [open, setOpen]   = useState(false);
  const [search, setSearch] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?q=${encodeURIComponent(q)}` : '/products');
    setOpen(false);
  };

  return (
    <>
      {/* dynamic announcements from admin */}
      <AnnouncementBar />

      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-md shadow-md border-b border-gray-200/60'
            : 'bg-white border-b border-gray-200'
        }`}
      >
        <div className="container mx-auto px-4 flex items-center gap-4 h-16">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group" aria-label="Fluro Tech home">
            <img
              src="/logo.jpg"
              alt="Fluro Tech"
              className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-400/40 shadow-md shadow-brand-500/30 group-hover:ring-brand-500 group-hover:shadow-lg transition"
              onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'inline-flex'; }}
            />
            <span
              style={{ display: 'none' }}
              className="items-center gap-2 text-xl font-extrabold tracking-tight"
            >
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white text-lg inline-flex items-center justify-center shadow-md shadow-brand-500/40">⚡</span>
              <span className="bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
                Fluro<span className="text-brand-700"> Tech</span>
              </span>
            </span>
          </Link>

          {/* search */}
          <form
            onSubmit={submitSearch}
            className="hidden md:flex flex-1 max-w-xl relative group"
          >
            <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-600 transition" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" strokeLinecap="round"/>
            </svg>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search laptops, accessories, brands…"
              className="w-full pl-9 pr-24 py-2 text-sm rounded-full bg-gray-100 border border-transparent
                         focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100
                         focus:outline-none transition"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 text-xs font-semibold
                         bg-brand-600 hover:bg-brand-700 text-white px-4 py-1.5 rounded-full transition"
            >
              Search
            </button>
          </form>

          {/* desktop nav */}
          <nav className="hidden lg:flex items-center gap-1 ml-auto">
            <NavItem to="/" end>Home</NavItem>
            <NavItem to="/products">Products</NavItem>
            <NavItem to="/used-laptops">Used Laptops</NavItem>
            <NavItem to="/cctv">CCTV</NavItem>
            <NavItem to="/upcoming">Coming Soon</NavItem>
            <NavItem to="/about">About</NavItem>
            <NavItem to="/contact">Contact</NavItem>
          </nav>

          {/* mobile menu toggle */}
          <button
            type="button"
            onClick={() => setOpen((s) => !s)}
            className="lg:hidden ml-auto w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
              {open
                ? <path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/>
                : <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>

        {/* mobile drawer */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            open ? 'max-h-96 border-t border-gray-200' : 'max-h-0'
          }`}
        >
          <div className="container mx-auto px-4 py-4 space-y-2">
            <form onSubmit={submitSearch} className="relative md:hidden mb-2">
              <svg viewBox="0 0 24 24" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/><path d="m20 20-3-3" strokeLinecap="round"/>
              </svg>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                className="w-full pl-9 pr-4 py-2 text-sm rounded-full bg-gray-100 border border-transparent
                           focus:bg-white focus:border-brand-400 focus:outline-none"
              />
            </form>
            <MobileItem to="/" end onClick={() => setOpen(false)}>Home</MobileItem>
            <MobileItem to="/products" onClick={() => setOpen(false)}>Products</MobileItem>
            <MobileItem to="/used-laptops" onClick={() => setOpen(false)}>Used Laptops</MobileItem>
            <MobileItem to="/cctv" onClick={() => setOpen(false)}>CCTV</MobileItem>
            <MobileItem to="/upcoming" onClick={() => setOpen(false)}>Coming Soon</MobileItem>
            <MobileItem to="/about" onClick={() => setOpen(false)}>About</MobileItem>
            <MobileItem to="/contact" onClick={() => setOpen(false)}>Contact</MobileItem>
          </div>
        </div>
      </header>
    </>
  );
}

function NavItem({ to, end, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative px-4 py-2 text-sm font-medium transition-colors ${
          isActive ? 'text-brand-700' : 'text-gray-700 hover:text-brand-700'
        } group`
      }
    >
      {({ isActive }) => (
        <>
          {children}
          <span
            className={`pointer-events-none absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 origin-left transition-transform duration-300 ${
              isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
            }`}
          />
        </>
      )}
    </NavLink>
  );
}

function MobileItem({ to, end, onClick, children }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `block px-4 py-2.5 rounded-lg text-sm font-medium transition ${
          isActive
            ? 'bg-brand-50 text-brand-700'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {children}
    </NavLink>
  );
}
