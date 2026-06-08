import { useState, useEffect } from 'react';
import api from '../../api';
import { setAuth } from '../../auth';
import { useAuth } from '../../hooks/useAuth';

export default function MyProfile() {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', current_password: '', password: '', password_confirmation: '' });
  const [busy, setBusy] = useState(false);
  const [msg,  setMsg]  = useState(null);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, name: user.name || '', phone: user.phone || '' }));
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const payload = { name: form.name, phone: form.phone || null };
      if (form.password) {
        if (form.password !== form.password_confirmation) {
          setMsg({ type: 'err', text: "New passwords don't match." });
          setBusy(false);
          return;
        }
        payload.current_password      = form.current_password;
        payload.password              = form.password;
        payload.password_confirmation = form.password_confirmation;
      }
      const r = await api.put('/me', payload);
      // Refresh cached user so navbar updates immediately.
      const token = (await import('../../auth')).getToken();
      setAuth(token, r.data);
      setForm((f) => ({ ...f, current_password: '', password: '', password_confirmation: '' }));
      setMsg({ type: 'ok', text: 'Profile updated.' });
    } catch (e) {
      const errs = e?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setMsg({ type: 'err', text: first || e?.response?.data?.message || 'Could not save.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-up">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your contact details and password.</p>
      </div>

      <form onSubmit={submit} className="card p-6 md:p-7 max-w-2xl relative overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-44 h-44 bg-brand-100 rounded-full blur-3xl" />
        <div className="relative">
          {msg && (
            <div className={`mb-4 p-3 rounded-lg text-sm border animate-fade-in ${
              msg.type === 'ok' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
            }`}>
              <span className="mr-1">{msg.type === 'ok' ? '✓' : '⚠'}</span>{msg.text}
            </div>
          )}

          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Your details</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Name</span>
              <input className="input mt-1" value={form.name} required
                     onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Email (read-only)</span>
              <input className="input mt-1 bg-gray-50 text-gray-500" value={user?.email || ''} readOnly />
            </label>
          </div>
          <label className="block mt-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Phone</span>
            <input className="input mt-1" value={form.phone}
                   onChange={(e) => setForm({ ...form, phone: e.target.value })}
                   placeholder="+91 …" />
          </label>

          <hr className="my-6 border-gray-200" />

          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">Change password <span className="text-gray-400 normal-case">— optional</span></h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Current password</span>
              <input className="input mt-1" type="password" autoComplete="current-password"
                     value={form.current_password}
                     onChange={(e) => setForm({ ...form, current_password: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">New password</span>
              <input className="input mt-1" type="password" autoComplete="new-password" minLength={6}
                     value={form.password}
                     onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Confirm new password</span>
              <input className="input mt-1" type="password" autoComplete="new-password"
                     value={form.password_confirmation}
                     onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })} />
            </label>
          </div>

          <button type="submit" disabled={busy}
                  className="btn mt-6 bg-gradient-to-r from-brand-400 to-brand-600 text-white hover:from-brand-500 hover:to-brand-700 px-6 py-2.5 font-semibold shadow shadow-brand-500/30 disabled:opacity-60">
            {busy
              ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</span>
              : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
