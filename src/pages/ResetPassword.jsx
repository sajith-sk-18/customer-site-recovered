import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../api';
import { setAuth, isAuthed } from '../auth';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ResetPassword() {
  useDocumentTitle('Reset password');
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [email, setEmail]   = useState(params.get('email') || '');
  const [token, setToken]   = useState(params.get('token') || '');
  const [pw,    setPw]      = useState('');
  const [pw2,   setPw2]     = useState('');
  const [busy,  setBusy]    = useState(false);
  const [err,   setErr]     = useState(null);
  const [done,  setDone]    = useState(false);

  // If the URL changes, keep state in sync.
  useEffect(() => {
    setEmail(params.get('email') || '');
    setToken(params.get('token') || '');
  }, [params]);

  const submit = async (e) => {
    e.preventDefault();
    if (pw !== pw2) {
      setErr("Passwords don't match.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const r = await api.post('/auth/reset-password', {
        email, token, password: pw, password_confirmation: pw2,
      });
      // Backend issues a fresh token on success — auto-sign-in.
      if (r.data?.token && r.data?.user) {
        setAuth(r.data.token, r.data.user);
      }
      setDone(true);
      // Short pause, then redirect to dashboard.
      setTimeout(() => navigate(isAuthed() ? '/dashboard' : '/login', { replace: true }), 1500);
    } catch (e) {
      const errs = e?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setErr(first || e?.response?.data?.message || 'Could not reset password.');
    } finally {
      setBusy(false);
    }
  };

  // Missing the token entirely?
  if (!token || !email) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="card p-8 max-w-md text-center">
          <div className="text-5xl">🔗</div>
          <h1 className="text-xl font-bold mt-3">Missing or invalid reset link</h1>
          <p className="text-sm text-gray-500 mt-2">
            This page needs a token and email from the reset email. Request a new link below.
          </p>
          <Link to="/forgot-password" className="btn-primary mt-5 inline-flex">Request a reset link</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.jpg" alt="Fluro Tech" className="h-12 w-12 rounded-full object-cover ring-2 ring-brand-400/50 shadow-md shadow-brand-500/30" />
          </Link>
          <h1 className="text-3xl font-extrabold mt-4">
            Set a <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">new password</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            For <span className="font-semibold text-gray-700 break-all">{email}</span>
          </p>
        </div>

        <form onSubmit={submit} className="card p-6 md:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-brand-100 rounded-full blur-3xl" />
          <div className="relative">
            {err && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 text-rose-700 text-sm border border-rose-200 animate-fade-in">
                <span className="mr-1">⚠</span>{err}
              </div>
            )}
            {done && (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50 text-emerald-800 text-sm border border-emerald-200 animate-fade-in">
                <span className="mr-1">✓</span> Password updated. Redirecting…
              </div>
            )}

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">New password</label>
            <input className="input" type="password" required minLength={6} value={pw}
                   onChange={(e) => setPw(e.target.value)}
                   placeholder="At least 6 characters" autoComplete="new-password" />

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1 mt-4">Confirm new password</label>
            <input className="input" type="password" required value={pw2}
                   onChange={(e) => setPw2(e.target.value)}
                   placeholder="Repeat password" autoComplete="new-password" />

            <button
              className="btn mt-6 w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white
                         hover:from-brand-500 hover:to-brand-700 px-6 py-3 font-semibold
                         shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={busy || done}
            >
              {busy
                ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating…</span>
                : done ? 'Updated ✓' : 'Reset password →'}
            </button>

            <p className="text-sm text-gray-600 text-center mt-5">
              Changed your mind?{' '}
              <Link to="/login" className="text-brand-700 font-semibold hover:underline">Back to sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
