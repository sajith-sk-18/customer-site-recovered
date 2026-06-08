import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function ForgotPassword() {
  useDocumentTitle('Forgot password');
  const [email, setEmail] = useState('');
  const [busy,  setBusy]  = useState(false);
  const [msg,   setMsg]   = useState(null);
  const [devUrl, setDevUrl] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    setDevUrl(null);
    try {
      const r = await api.post('/auth/forgot-password', { email });
      setMsg({
        type: 'ok',
        text: r.data?.message || "If an account exists for that email, a reset link has been sent.",
      });
      // Dev convenience — in local mode the API echoes a usable reset URL.
      if (r.data?.dev_reset_url) setDevUrl(r.data.dev_reset_url);
    } catch (e) {
      const status = e?.response?.status;
      const errs = e?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setMsg({
        type: 'err',
        text: status === 429
          ? 'Too many attempts. Please wait a minute and try again.'
          : first || e?.response?.data?.message || 'Could not send the reset link.',
      });
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
            Forgot your <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">password?</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter your account email and we'll send a reset link.
          </p>
        </div>

        <form onSubmit={submit} className="card p-6 md:p-7 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-brand-100 rounded-full blur-3xl" />
          <div className="relative">
            {msg && (
              <div className={`mb-4 p-3 rounded-lg text-sm border animate-fade-in ${
                msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                <span className="mr-1">{msg.type === 'ok' ? '✓' : '⚠'}</span>{msg.text}
              </div>
            )}

            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">Email</label>
            <input className="input" type="email" required value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="you@example.com" autoComplete="email" />

            <button
              className="btn mt-6 w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white
                         hover:from-brand-500 hover:to-brand-700 px-6 py-3 font-semibold
                         shadow-lg shadow-brand-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={busy}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </span>
              ) : 'Send reset link →'}
            </button>

            {devUrl && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                <div className="font-bold uppercase tracking-wider mb-1">Dev shortcut</div>
                <p className="mb-1">No SMTP is wired up locally — use this link directly:</p>
                <a href={devUrl} className="break-all underline font-mono hover:text-amber-700">{devUrl}</a>
              </div>
            )}

            <div className="text-sm text-gray-600 text-center mt-5 space-y-1">
              <p>
                Remembered it?{' '}
                <Link to="/login" className="text-brand-700 font-semibold hover:underline">Sign in</Link>
              </p>
              <p className="text-xs text-gray-500">
                No account?{' '}
                <Link to="/register" className="text-brand-700 hover:underline">Create one</Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
