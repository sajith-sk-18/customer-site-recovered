import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api';
import { useAuth } from '../../hooks/useAuth';

const STATUS_META = {
  new:         { label: 'New',         tint: 'bg-amber-100 text-amber-800 ring-amber-200',     dot: 'bg-amber-500' },
  in_progress: { label: 'In progress', tint: 'bg-sky-100 text-sky-800 ring-sky-200',           dot: 'bg-sky-500' },
  responded:   { label: 'Responded',   tint: 'bg-violet-100 text-violet-800 ring-violet-200',  dot: 'bg-violet-500' },
  closed:      { label: 'Closed',      tint: 'bg-emerald-100 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-500' },
};

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [data, setData] = useState({ enquiries: [], reviews: [], unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/me/enquiries').then((r) => r.data.data || []).catch(() => []),
      api.get('/me/reviews').then((r) => r.data.data || []).catch(() => []),
      api.get('/me/notifications/unread-count').then((r) => r.data?.unread ?? 0).catch(() => 0),
    ]).then(([enquiries, reviews, unread]) => {
      setData({ enquiries, reviews, unread });
    }).finally(() => setLoading(false));
  }, []);

  const openEnq = data.enquiries.filter((e) => e.status !== 'closed').length;

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 text-white p-6 md:p-8">
        <div className="pointer-events-none absolute -top-24 -right-12 w-72 h-72 bg-white/15 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 w-72 h-72 bg-lime-300/30 rounded-full blur-3xl animate-blob delay-300" />
        <div className="relative">
          <div className="text-[10px] uppercase tracking-[0.18em] text-white/80">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-1">
            Welcome back, <span className="bg-gradient-to-r from-lime-200 to-white bg-clip-text text-transparent">{(user?.name || '').split(' ')[0] || 'friend'}</span>
          </h1>
          <p className="text-white/85 text-sm mt-2 max-w-xl">
            Track your enquiries, reviews and notifications in one place.
          </p>
        </div>
      </section>

      {/* KPI cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <KpiLink to="/dashboard/enquiries"    label="Open enquiries"   value={loading ? '…' : openEnq}      icon="📩" gradient="from-amber-400 to-orange-500" />
        <KpiLink to="/dashboard/reviews"      label="My reviews"       value={loading ? '…' : data.reviews.length}    icon="⭐" gradient="from-fuchsia-400 to-rose-500" />
        <KpiLink to="/dashboard/notifications" label="Unread updates" value={loading ? '…' : data.unread}   icon="🔔" gradient="from-brand-400 to-brand-600" pulse={data.unread > 0} />
      </div>

      {/* Recent enquiries */}
      <Panel title="Recent enquiries" link={{ to: '/dashboard/enquiries', label: 'See all →' }}>
        {loading ? (
          <Skeleton lines={3} />
        ) : data.enquiries.length === 0 ? (
          <Empty
            emoji="📭"
            title="No enquiries yet"
            body="Visit a product page and click 'Enquire about this product' to ask a question."
            cta={{ to: '/products', label: 'Browse products' }}
          />
        ) : (
          <ul className="divide-y divide-gray-100">
            {data.enquiries.slice(0, 3).map((e) => {
              const meta = STATUS_META[e.status] || STATUS_META.new;
              return (
                <li key={e.id}>
                  <Link to={`/dashboard/enquiries/${e.id}`} className="block py-3 hover:bg-brand-50/40 transition px-3 -mx-3 rounded-lg">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`badge ring-1 ${meta.tint}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} mr-1.5`} />
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-gray-400">{timeAgo(e.created_at)}</span>
                    </div>
                    <div className="font-semibold text-gray-900 mt-1 line-clamp-1">
                      {e.product ? <>About <span className="text-brand-700">{e.product.name}</span></> : 'General enquiry'}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{e.message}</p>
                    {e.admin_reply && (
                      <div className="text-[11px] text-brand-700 mt-1 inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                        Reply received
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Panel>
    </div>
  );
}

function KpiLink({ to, label, value, icon, gradient, pulse }) {
  return (
    <Link to={to} className="card p-5 hover-lift group relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md text-xl`}>
          {icon}
        </div>
        {pulse && <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-ping" />}
      </div>
      <div className="mt-4">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
        <div className="text-3xl font-extrabold text-gray-900 mt-1">{value}</div>
      </div>
    </Link>
  );
}

function Panel({ title, link, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold">{title}</h2>
        {link && <Link to={link.to} className="text-xs font-semibold text-brand-700 hover:underline">{link.label}</Link>}
      </div>
      {children}
    </div>
  );
}

function Skeleton({ lines = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-16 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
      ))}
    </div>
  );
}

function Empty({ emoji, title, body, cta }) {
  return (
    <div className="py-8 text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="font-semibold mt-2">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">{body}</p>
      {cta && <Link to={cta.to} className="btn-primary mt-4 inline-flex">{cta.label}</Link>}
    </div>
  );
}
