import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';

const POLL_MS = 30_000;
const ICON_BY_TYPE = { enquiry_reply: '📩', system: '🔔' };

function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function CustomerBell() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  const refreshCount = useCallback(() => {
    api.get('/me/notifications/unread-count')
      .then((r) => setUnread(r.data?.unread ?? 0))
      .catch(() => {});
  }, []);

  const loadList = useCallback(() => {
    setLoading(true);
    api.get('/me/notifications')
      .then((r) => setItems(r.data?.data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refreshCount();
    const t = setInterval(refreshCount, POLL_MS);
    return () => clearInterval(t);
  }, [refreshCount]);

  useEffect(() => { if (open) loadList(); }, [open, loadList]);

  useEffect(() => {
    if (!open) return;
    const close = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);

  const openItem = async (n) => {
    setOpen(false);
    if (!n.read_at) {
      try { await api.post(`/me/notifications/${n.id}/read`); } catch {}
      setUnread((u) => Math.max(0, u - 1));
    }
    if (n.link) navigate(n.link);
  };

  const markAllRead = async () => {
    try { await api.post('/me/notifications/read-all'); } catch {}
    setUnread(0);
    setItems((xs) => xs.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
  };

  return (
    <div ref={wrapRef} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="relative w-10 h-10 rounded-lg text-gray-600 hover:text-brand-700 hover:bg-gray-100 flex items-center justify-center transition"
        aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ''}`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(34,227,107,0.6)]">
              {unread > 99 ? '99+' : unread}
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-brand-500/40 animate-ping" />
          </>
        )}
      </button>

      <div className={`absolute right-0 mt-2 w-[360px] origin-top-right transition-all duration-200 z-30 ${
        open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="card overflow-hidden ring-1 ring-gray-200 shadow-2xl">
          <div className="relative px-4 py-3 bg-gradient-to-r from-brand-600 via-brand-500 to-brand-400 text-white overflow-hidden">
            <div className="pointer-events-none absolute -top-12 -right-8 w-32 h-32 bg-white/15 rounded-full blur-2xl" />
            <div className="relative flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/80">Notifications</div>
                <div className="font-bold text-base mt-0.5">
                  {unread > 0 ? `${unread} unread` : 'All caught up'}
                </div>
              </div>
              {unread > 0 && (
                <button onClick={markAllRead}
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/15 hover:bg-white/25 transition">
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[0,1,2].map((i) => <div key={i} className="h-14 rounded-lg bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />)}
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-sm">
                <div className="text-3xl">📭</div>
                <p className="mt-2">No notifications yet.</p>
                <p className="text-xs text-gray-400 mt-1">Replies to your enquiries land here.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {items.map((n) => (
                  <li key={n.id}>
                    <button onClick={() => openItem(n)}
                            className={`w-full text-left flex items-start gap-3 px-4 py-3 transition hover:bg-brand-50/60 ${n.read_at ? '' : 'bg-brand-50/30'}`}>
                      <span className="shrink-0 w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center text-base shadow-sm">
                        {ICON_BY_TYPE[n.type] || '🔔'}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-sm text-gray-900 truncate">{n.title}</span>
                          {!n.read_at && <span className="shrink-0 w-2 h-2 rounded-full bg-brand-500 shadow-[0_0_6px_rgba(34,227,107,0.6)]" />}
                        </span>
                        {n.body && <span className="block text-xs text-gray-600 line-clamp-2 mt-0.5">{n.body}</span>}
                        <span className="block text-[11px] text-gray-400 mt-1">{timeAgo(n.created_at)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Link to="/dashboard/notifications" onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-brand-700 hover:bg-brand-50 py-2.5 border-t border-gray-100 transition">
            See all notifications →
          </Link>
        </div>
      </div>
    </div>
  );
}
