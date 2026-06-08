import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { isAuthed, setAuth } from '../auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState(null);

  if (isAuthed()) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const r = await api.post('/auth/login', form);
      setAuth(r.data.token, r.data.user);
      navigate(next, { replace: true });
    } catch (e) {
      const errs = e?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setErr(first || e?.response?.data?.message || 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.jpg" alt="Fluro Tech" className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-400/50 shadow-md shadow-brand-500/30" />
          </Link>
          <h1 className="text-3xl font-extrabold mt-4">
            Welcome <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">back</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to write reviews, send enquiries and track your activity.</p>
        </div>

        <form onSubmit={submit} className="card p-6 md:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-brand-100 rounded-full blur-3xl" />
          <div className="relative">
            {err && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200 animate-fade-in">
                {err}
              </div>
            )}

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email</label>
            <input className="input" type="email" required value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   placeholder="you@example.com" autoComplete="email" />

            <div className="flex items-end justify-between mt-4 mb-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">Password</label>
              <Link to={`/forgot-password${location.search}`}
                    className="text-[11px] font-semibold text-brand-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <input className="input" type="password" required value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                   placeholder="••••••••" autoComplete="current-password" />

            <button
              className="btn mt-6 w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white
                         hover:from-brand-500 hover:to-brand-700 px-6 py-3 font-semibold
                         shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={busy}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : 'Sign in →'}
            </button>

            <p className="text-sm text-gray-600 text-center mt-5">
              New to Fluro Tech?{' '}
              <Link to={`/register${location.search}`} className="text-brand-700 font-semibold hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
