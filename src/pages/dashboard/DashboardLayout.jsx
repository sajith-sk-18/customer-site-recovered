import { Outlet, NavLink, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Svg = ({ children, ...p }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
       strokeLinecap="round" strokeLinejoin="round" {...p}>{children}</svg>
);
const IconHome   = (p) => <Svg className="w-5 h-5" {...p}><path d="M3 12 12 3l9 9"/><path d="M5 10v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10"/></Svg>;
const IconInbox  = (p) => <Svg className="w-5 h-5" {...p}><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></Svg>;
const IconStar   = (p) => <Svg className="w-5 h-5" {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></Svg>;
const IconBell   = (p) => <Svg className="w-5 h-5" {...p}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></Svg>;
const IconUser   = (p) => <Svg className="w-5 h-5" {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></Svg>;
const IconHeart  = (p) => <Svg className="w-5 h-5" {...p}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></Svg>;

const ITEMS = [
  { to: '/dashboard',                end: true, label: 'Overview',     Icon: IconHome },
  { to: '/dashboard/enquiries',                 label: 'My enquiries', Icon: IconInbox },
  { to: '/dashboard/wishlist',                  label: 'Wishlist',     Icon: IconHeart },
  { to: '/dashboard/reviews',                   label: 'My reviews',   Icon: IconStar },
  { to: '/dashboard/notifications',             label: 'Notifications',Icon: IconBell },
  { to: '/dashboard/profile',                   label: 'Profile',      Icon: IconUser },
];

function initials(name) {
  return (name || 'U').split(' ').slice(0, 2).map((s) => s[0]?.toUpperCase() || '').join('');
}

export default function DashboardLayout() {
  const { authed, user } = useAuth();
  const location = useLocation();

  if (!authed) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-20 lg:self-start space-y-3">
        <div className="card p-4 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 bg-brand-100/60 rounded-full blur-3xl" />
          <div className="relative flex items-center gap-3">
            <span className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white font-bold flex items-center justify-center shadow-md shadow-brand-500/30">
              {initials(user?.name)}
            </span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.16em] text-gray-400">My account</div>
              <div className="font-bold truncate">{user?.name}</div>
              <div className="text-xs text-gray-500 truncate">{user?.email}</div>
            </div>
          </div>
        </div>

        <nav className="card p-2 space-y-1">
          {ITEMS.map((it) => (
            <NavLink
              key={it.to}
              to={it.to}
              end={it.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-500/15 via-brand-50 to-transparent text-brand-700'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-brand-700'
                }`
              }
            >
              <it.Icon />
              <span className="flex-1">{it.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
