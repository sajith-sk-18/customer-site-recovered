import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { isAuthed, setAuth } from '../auth';

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/';

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    password: '', password_confirmation: '',
  });
  const [busy, setBusy] = useState(false);
  const [err,  setErr]  = useState(null);

  if (isAuthed()) return <Navigate to={next} replace />;

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password_confirmation) {
      setErr("Passwords don't match.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await api.post('/auth/register', form);
      setAuth(r.data.token, r.data.user);
      navigate(next, { replace: true });
    } catch (e) {
      const errs = e?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setErr(first || e?.response?.data?.message || 'Could not create your account.');
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
            Join <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">Fluro Tech</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Create a free account to ask questions and leave reviews.</p>
        </div>

        <form onSubmit={submit} className="card p-6 md:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-brand-100 rounded-full blur-3xl" />
          <div className="relative">
            {err && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200 animate-fade-in">
                {err}
              </div>
            )}

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Full name</label>
            <input className="input" required value={form.name}
                   onChange={(e) => setForm({ ...form, name: e.target.value })}
                   placeholder="Your name" autoComplete="name" />

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1 mt-4">Email</label>
            <input className="input" type="email" required value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   placeholder="you@example.com" autoComplete="email" />

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1 mt-4">Phone (optional)</label>
            <input className="input" type="tel" value={form.phone}
                   onChange={(e) => setForm({ ...form, phone: e.target.value })}
                   placeholder="+91 …" autoComplete="tel" />

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Password</label>
                <input className="input" type="password" required minLength={6} value={form.password}
                       onChange={(e) => setForm({ ...form, password: e.target.value })}
                       placeholder="At least 6 characters" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Confirm</label>
                <input className="input" type="password" required value={form.password_confirmation}
                       onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                       placeholder="Repeat password" autoComplete="new-password" />
              </div>
            </div>

            <button
              className="btn mt-6 w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white
                         hover:from-brand-500 hover:to-brand-700 px-6 py-3 font-semibold
                         shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={busy}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account →'}
            </button>

            <p className="text-sm text-gray-600 text-center mt-5">
              Already have an account?{' '}
              <Link to={`/login${location.search}`} className="text-brand-700 font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
