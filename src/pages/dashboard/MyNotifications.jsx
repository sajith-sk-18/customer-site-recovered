import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleString();
}

const TYPE_ICON = {
  enquiry_reply: '📩',
  system:        '🔔',
};

export default function MyNotifications() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [unread, setUnread] = useState(0);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    const params = filter === 'unread' ? { unread_only: 1 } : {};
    Promise.all([
      api.get('/me/notifications', { params }),
      api.get('/me/notifications/unread-count'),
    ]).then(([r, c]) => {
      setRows(r.data.data || []);
      setUnread(c.data?.unread ?? 0);
    }).finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const openItem = async (n) => {
    if (!n.read_at) {
      try { await api.post(`/me/notifications/${n.id}/read`); } catch {}
      setRows((xs) => xs.map((x) => x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x));
      setUnread((u) => Math.max(0, u - 1));
    }
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    try { await api.post('/me/notifications/read-all'); } catch {}
    setRows((xs) => xs.map((x) => ({ ...x, read_at: x.read_at || new Date().toISOString() })));
    setUnread(0);
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Replies and updates from Fluro Tech.</p>
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 text-brand-700 ring-1 ring-brand-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
              {unread} unread
            </span>
          )}
          <button onClick={markAllRead} disabled={unread === 0}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed">
            Mark all read
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {[{ v: 'all', l: 'All' }, { v: 'unread', l: 'Unread' }].map((f) => (
          <button key={f.v}
                  onClick={() => setFilter(f.v)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    filter === f.v
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white border-transparent shadow shadow-brand-500/30'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}>{f.l}</button>
        ))}
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-5 space-y-3">
            {[0,1,2].map((i) => <div key={i} className="h-16 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />)}
          </div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-5xl">📭</div>
            <h3 className="font-semibold text-lg mt-3">{filter === 'unread' ? "You're all caught up" : 'No notifications yet'}</h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
              {filter === 'unread'
                ? 'No unread updates right now. Nice.'
                : "When we reply to your enquiries, you'll see updates here."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {rows.map((n, i) => (
              <li key={n.id}>
                <button
                  onClick={() => openItem(n)}
                  className={`w-full text-left flex items-start gap-4 px-5 py-4 transition hover:bg-brand-50/40 animate-fade-up ${
                    n.read_at ? '' : 'bg-brand-50/30'
                  }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white text-lg flex items-center justify-center shrink-0 shadow">
                    {TYPE_ICON[n.type] || '🔔'}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-gray-900 truncate">{n.title}</span>
                      {!n.read_at && <span className="w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_6px_rgba(34,227,107,0.6)] shrink-0" />}
                    </span>
                    {n.body && <span className="block text-sm text-gray-600 line-clamp-2 mt-0.5">{n.body}</span>}
                    <span className="block text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
