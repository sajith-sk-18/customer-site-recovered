import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const STATUS_META = {
  new:         { label: 'New',         tint: 'bg-amber-100 text-amber-800 ring-amber-200',     dot: 'bg-amber-500' },
  in_progress: { label: 'In progress', tint: 'bg-sky-100 text-sky-800 ring-sky-200',           dot: 'bg-sky-500' },
  responded:   { label: 'Responded',   tint: 'bg-violet-100 text-violet-800 ring-violet-200',  dot: 'bg-violet-500' },
  closed:      { label: 'Closed',      tint: 'bg-emerald-100 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-500' },
};

const FILTERS = [
  { v: '',            label: 'All' },
  { v: 'new',         label: 'New' },
  { v: 'in_progress', label: 'In progress' },
  { v: 'responded',   label: 'Responded' },
  { v: 'closed',      label: 'Closed' },
];

function fmt(iso) { return iso ? new Date(iso).toLocaleString() : ''; }
function timeAgo(iso) {
  if (!iso) return '';
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function MyEnquiriesList() {
  const [rows, setRows]   = useState([]);
  const [meta, setMeta]   = useState({ last_page: 1 });
  const [page, setPage]   = useState(1);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = { page };
    if (filter) params.status = filter;
    api.get('/me/enquiries', { params })
      .then((r) => {
        setRows(r.data.data || []);
        setMeta({ last_page: r.data.last_page, total: r.data.total });
      })
      .finally(() => setLoading(false));
  }, [page, filter]);

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">My enquiries</h1>
        <p className="text-sm text-gray-500 mt-1">Every question you've sent us, with the latest status.</p>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.v || 'all'}
                  onClick={() => { setPage(1); setFilter(f.v); }}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                    filter === f.v
                      ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white border-transparent shadow shadow-brand-500/30'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-brand-300 hover:text-brand-700'
                  }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ul className="space-y-3">
          {[0,1,2].map((i) => <li key={i} className="h-24 rounded-xl bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 animate-pulse" />)}
        </ul>
      ) : rows.length === 0 ? (
        <div className="card p-10 text-center">
          <div className="text-5xl">📭</div>
          <h3 className="font-semibold text-lg mt-3">No enquiries here</h3>
          <p className="text-sm text-gray-500 mt-1">Visit a product page to ask a question and start a conversation.</p>
          <Link to="/products" className="btn-primary mt-5 inline-flex">Browse products</Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {rows.map((e, i) => {
            const meta = STATUS_META[e.status] || STATUS_META.new;
            return (
              <li key={e.id} className="animate-fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                <Link to={`/dashboard/enquiries/${e.id}`}
                      className="card p-4 hover-lift flex items-start gap-4 cursor-pointer group">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 text-white flex items-center justify-center text-xl shadow-md shrink-0">📩</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`badge ring-1 ${meta.tint}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} mr-1.5`} />
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-gray-400">{timeAgo(e.created_at)}</span>
                    </div>
                    <div className="font-semibold text-gray-900 mt-1">
                      {e.product ? <>About <span className="text-brand-700">{e.product.name}</span></> : 'General enquiry'}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">{e.message}</p>
                    {e.admin_reply && (
                      <div className="text-[11px] text-brand-700 mt-1 inline-flex items-center gap-1">
                        <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 17 4 12 9 7"/><path d="M20 18v-2a4 4 0 0 0-4-4H4"/></svg>
                        Reply received
                      </div>
                    )}
                  </div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gray-300 group-hover:text-brand-600 transition shrink-0 mt-2" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {meta.last_page > 1 && (
        <div className="flex justify-center items-center gap-2 mt-3">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}
                  className="btn-secondary disabled:opacity-40">‹ Prev</button>
          <span className="text-sm text-gray-600">Page {page} of {meta.last_page}</span>
          <button onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))} disabled={page >= meta.last_page}
                  className="btn-secondary disabled:opacity-40">Next ›</button>
        </div>
      )}
    </div>
  );
}

export function MyEnquiryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [enq, setEnq] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/me/enquiries/${id}`)
      .then((r) => setEnq(r.data))
      .catch((e) => setErr(e?.response?.data?.message || 'Could not load this enquiry.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="card p-10 animate-pulse h-40" />;
  if (err)     return <div className="card p-6 text-rose-600">{err}</div>;
  if (!enq)    return <div className="card p-6 text-gray-500">Not found.</div>;

  const meta = STATUS_META[enq.status] || STATUS_META.new;

  return (
    <div className="space-y-5 animate-fade-up">
      <button onClick={() => navigate('/dashboard/enquiries')}
              className="text-sm text-brand-700 hover:underline inline-flex items-center gap-1">
        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        All enquiries
      </button>

      <div className="card overflow-hidden">
        <div className="bg-gradient-to-br from-brand-700 via-brand-500 to-brand-400 text-white p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-12 -right-12 w-40 h-40 bg-white/15 rounded-full blur-3xl" />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/80">Enquiry · #{enq.id}</div>
              <h1 className="text-xl md:text-2xl font-extrabold mt-1">
                {enq.product ? <>About {enq.product.name}</> : 'General enquiry'}
              </h1>
              {enq.product?.brand && <div className="text-sm text-white/85 mt-0.5">{enq.product.brand}</div>}
            </div>
            <span className={`badge ring-1 ${meta.tint} bg-white/90`}>
              <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} mr-1.5`} />
              {meta.label}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Your message */}
          <Bubble side="right" name="You" time={enq.created_at} body={enq.message} />

          {/* Admin reply (if any) */}
          {enq.admin_reply ? (
            <Bubble side="left" name="Fluro Tech" time={enq.replied_at} body={enq.admin_reply} accent />
          ) : (
            <div className="text-center text-sm text-gray-500 italic py-4">
              We've received your enquiry. We'll reply here as soon as we have an answer.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Bubble({ side, name, time, body, accent }) {
  return (
    <div className={`flex ${side === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
        accent
          ? 'bg-gradient-to-br from-brand-50 to-emerald-50 border border-brand-200'
          : side === 'right'
            ? 'bg-gray-100 border border-gray-200'
            : 'bg-white border border-gray-200'
      }`}>
        <div className={`text-[11px] font-semibold uppercase tracking-wider ${accent ? 'text-brand-700' : 'text-gray-500'}`}>
          {name} {time && <span className="font-normal normal-case text-gray-400">· {fmt(time)}</span>}
        </div>
        <p className="text-sm text-gray-800 mt-1 whitespace-pre-wrap">{body}</p>
      </div>
    </div>
  );
}
