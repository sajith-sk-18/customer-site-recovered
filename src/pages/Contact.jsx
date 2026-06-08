import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

export default function Contact() {
  const location = useLocation();
  const { authed, user } = useAuth();
  const [form, setForm] = useState({ phone: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await api.post('/enquiries', form);
      setMsg({ type: 'ok', text: r.data.message || "Thanks — we'll be in touch within 24 hours." });
      setForm({ phone: '', message: '' });
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        setMsg({ type: 'err', text: 'Please sign in to send an enquiry.' });
        return;
      }
      const errs = err?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setMsg({ type: 'err', text: first || 'Could not send. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      {/* ---------- Header ---------- */}
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 via-brand-700 to-brand-500 animate-gradient-x" />
        <div className="pointer-events-none absolute -top-20 -right-20 w-96 h-96 bg-lime-300/30 rounded-full blur-3xl animate-blob" />
        <div className="pointer-events-none absolute bottom-0 -left-20 w-96 h-96 bg-emerald-300/30 rounded-full blur-3xl animate-blob delay-300" />

        <div className="relative container mx-auto px-4 py-14 md:py-20 text-center">
          <div className="text-xs uppercase tracking-widest text-white/70 animate-fade-up">Talk to us</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-2 animate-fade-up delay-100">
            Get in <span className="bg-gradient-to-r from-lime-200 via-emerald-100 to-white bg-clip-text text-transparent">touch</span>
          </h1>
          <p className="mt-3 text-white/85 max-w-xl mx-auto animate-fade-up delay-200">
            Product questions, custom builds, bulk orders — drop a note and we'll reply within 24 hours.
          </p>
        </div>

        <svg className="relative block w-full" viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path fill="rgb(249 250 251)" d="M0,30 C360,80 1080,-10 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </section>

      <div className="container mx-auto px-4 py-12 grid md:grid-cols-[1fr_1.3fr] gap-8 max-w-5xl">
        {/* ---------- Info column ---------- */}
        <aside className="space-y-4">
          <InfoCard
            icon={<IconPhone />}
            title="Call us"
            lines={[
              <a key="p" href="tel:+919677409009" className="hover:text-brand-700">+91 96774 09009</a>,
              'Mon–Sat · 10am – 8pm IST',
            ]}
            accent="from-emerald-500 to-teal-500"
          />
          <InfoCard
            icon={<IconMail />}
            title="Email"
            lines={[
              <a key="e" href="mailto:Flurotech46@gmail.com" className="hover:text-brand-700">Flurotech46@gmail.com</a>,
              'Reply within 24 hours',
            ]}
            accent="from-brand-400 to-brand-600"
          />
          <InfoCard
            icon={<IconMap />}
            title="Visit"
            lines={[
              'Fluro Tech, Melpuram Junction',
              'Near Bharath Petroleum Bunk',
              'Pacode (P.O), Kanniyakumari District',
              'Tamil Nadu - 629168',
            ]}
            accent="from-lime-500 to-emerald-600"
          />

          <div className="card p-5 animate-fade-up delay-300">
            <div className="text-sm font-semibold mb-2">Follow us</div>
            <div className="flex gap-2">
              <a
                href="https://www.instagram.com/fluro_tech_"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full bg-gray-100 text-xs font-medium text-gray-700
                           hover:bg-brand-600 hover:text-white cursor-pointer transition"
              >
                @fluro_tech_
              </a>
            </div>
          </div>
        </aside>

        {/* ---------- Form column ---------- */}
        {authed ? (
          <form
            onSubmit={submit}
            className="relative card p-6 md:p-8 overflow-hidden animate-fade-up delay-100"
          >
            <div className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 bg-brand-100 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-60 h-60 bg-lime-100 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl font-bold">Send us a message</h2>
              <p className="text-sm text-gray-500 mt-1">
                Signed in as <span className="font-semibold text-gray-700">{user?.name}</span> · {user?.email}
              </p>

              {msg && (
                <div
                  className={`mt-5 p-3 rounded-lg text-sm border flex items-start gap-2 animate-fade-in ${
                    msg.type === 'ok'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  <span className="text-lg leading-none">{msg.type === 'ok' ? '✓' : '⚠'}</span>
                  <span>{msg.text}</span>
                </div>
              )}

              <Field label="Phone (optional)" className="mt-5">
                <input
                  className="input"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder={user?.phone || '+91 …'}
                />
              </Field>

              <Field label="Message *" className="mt-4">
                <textarea
                  className="input"
                  rows="6"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us what you're looking for…"
                />
              </Field>

              <button
                className="btn mt-6 w-full bg-gradient-to-r from-brand-400 to-brand-600 text-white
                           hover:from-brand-500 hover:to-brand-700 px-6 py-3 font-semibold
                           shadow-lg shadow-brand-600/20 hover-lift disabled:opacity-60 disabled:cursor-not-allowed
                           disabled:transform-none"
                disabled={busy}
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending…
                  </span>
                ) : (
                  'Send enquiry →'
                )}
              </button>

              <p className="text-[11px] text-gray-400 text-center mt-3">
                We'll never share your details. By submitting you agree to our privacy policy.
              </p>
            </div>
          </form>
        ) : (
          <div className="relative card p-8 md:p-10 overflow-hidden animate-fade-up delay-100 text-center">
            <div className="pointer-events-none absolute -top-16 -right-16 w-60 h-60 bg-brand-100 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 w-60 h-60 bg-lime-100 rounded-full blur-3xl" />
            <div className="relative">
              <div className="text-5xl">🔐</div>
              <h2 className="text-2xl font-extrabold mt-3">
                Sign in to send an <span className="bg-gradient-to-r from-brand-500 to-brand-700 bg-clip-text text-transparent">enquiry</span>
              </h2>
              <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
                We require a free account so we can reply to you and so you can track your conversation history.
              </p>
              <div className="mt-6 flex gap-2 justify-center">
                <Link to={`/login?next=${encodeURIComponent(location.pathname)}`}
                      className="btn bg-gradient-to-r from-brand-500 to-brand-600 text-white px-6 py-2.5 font-semibold shadow shadow-brand-500/30 hover:from-brand-600 hover:to-brand-700">
                  Sign in
                </Link>
                <Link to={`/register?next=${encodeURIComponent(location.pathname)}`}
                      className="btn-secondary px-6 py-2.5">
                  Create account
                </Link>
              </div>
              <p className="text-[11px] text-gray-400 mt-4">It takes 30 seconds — name, email, password.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1">
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({ icon, title, lines, accent }) {
  return (
    <div className="card p-5 hover-lift animate-fade-up flex items-start gap-4">
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accent} text-white flex items-center justify-center shadow-md`}>
        {icon}
      </div>
      <div>
        <div className="font-semibold">{title}</div>
        {lines.map((l, i) => (
          <div key={i} className={`text-sm ${i === 0 ? 'text-gray-800' : 'text-gray-500'} mt-0.5`}>{l}</div>
        ))}
      </div>
    </div>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function IconMap() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13z" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  );
}
