import { createContext, useCallback, useContext, useState } from 'react';
import api from './api';

/**
 * Global enquiry flow. Any component can call useEnquiry().open(product) to pop the
 * enquiry modal. The form collects name / email / phone / WhatsApp / message (all required),
 * submits to POST /enquiries, shows a success confirmation, and also offers a direct
 * "WhatsApp Enquiry" button that opens the admin's WhatsApp with the details prefilled.
 */
const ADMIN_WHATSAPP = (import.meta.env.VITE_ADMIN_WHATSAPP || '').replace(/\D/g, '');

const EnquiryCtx = createContext(null);
export const useEnquiry = () => useContext(EnquiryCtx);

const EMPTY = { name: '', email: '', phone: '', whatsapp: '', message: '' };

export function EnquiryProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState('idle'); // idle | submitting | success
  const [error, setError] = useState('');

  const openEnquiry = useCallback((p = null) => {
    setProduct(p);
    setForm(EMPTY);
    setStatus('idle');
    setError('');
    setOpen(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');
    try {
      await api.post('/enquiries', {
        ...(product ? { product_id: product.id } : {}),
        name: form.name,
        email: form.email,
        phone: form.phone,
        whatsapp: form.whatsapp,
        message: form.message,
      });
      setStatus('success');
    } catch (err) {
      const errs = err?.response?.data?.errors;
      const first = errs ? Object.values(errs)[0]?.[0] : null;
      setError(first || err?.response?.data?.message || 'Could not send your enquiry. Please try again.');
      setStatus('idle');
    }
  };

  const whatsappText = () => {
    const lines = [
      'Hello, I would like to enquire' + (product ? ` about: ${product.name}` : '') + '.',
      '',
      `Name: ${form.name || '-'}`,
      `Email: ${form.email || '-'}`,
      `Phone: ${form.phone || '-'}`,
      `WhatsApp: ${form.whatsapp || '-'}`,
      form.message ? `Message: ${form.message}` : '',
    ].filter(Boolean);
    return encodeURIComponent(lines.join('\n'));
  };

  const sendWhatsApp = () => {
    if (!ADMIN_WHATSAPP) {
      setError('WhatsApp is not configured. Set VITE_ADMIN_WHATSAPP in the .env file.');
      return;
    }
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${whatsappText()}`, '_blank', 'noopener');
  };

  return (
    <EnquiryCtx.Provider value={{ open: openEnquiry }}>
      {children}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-fade-in" onClick={close} />

          {/* dialog */}
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto animate-fade-up">
            {/* header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 text-white text-base flex items-center justify-center shadow shadow-brand-500/30">📩</span>
                <div>
                  <h3 className="font-bold text-gray-900 leading-tight">Enquiry Now</h3>
                  {product && <div className="text-xs text-gray-500 truncate max-w-[18rem]">{product.name}</div>}
                </div>
              </div>
              <button onClick={close} aria-label="Close" className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-500">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" strokeLinecap="round"/></svg>
              </button>
            </div>

            {status === 'success' ? (
              /* ---- success confirmation ---- */
              <div className="px-6 py-10 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4 animate-fade-in">
                  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                </div>
                <h4 className="text-xl font-extrabold text-gray-900">Your enquiry has been submitted successfully</h4>
                <p className="text-sm text-gray-500 mt-2">Thanks {form.name?.split(' ')[0] || ''}! Our team will get back to you shortly.</p>
                <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                  <button onClick={sendWhatsApp} className="btn bg-[#25D366] hover:bg-[#1fb959] text-white px-5 py-2 font-semibold inline-flex items-center gap-2">
                    <WaIcon /> Also message on WhatsApp
                  </button>
                  <button onClick={close} className="btn-secondary px-5 py-2">Done</button>
                </div>
              </div>
            ) : (
              /* ---- form ---- */
              <form onSubmit={submit} className="px-5 py-4">
                <p className="text-xs text-gray-500 mb-3">All fields are required. We'll reply by email/phone, or message us instantly on WhatsApp.</p>

                {error && (
                  <div className="text-sm mb-3 p-2.5 rounded-lg border bg-rose-50 text-rose-700 border-rose-200">
                    <span className="mr-1">⚠</span>{error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="Name *">
                    <input className="input" required maxLength={120} value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Your full name" />
                  </Field>
                  <Field label="Email *">
                    <input className="input" type="email" required maxLength={190} value={form.email} onChange={(e) => set('email', e.target.value)} placeholder="you@example.com" />
                  </Field>
                  <Field label="Phone number *">
                    <input className="input" type="tel" required maxLength={30} value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+91 90000 00000" />
                  </Field>
                  <Field label="WhatsApp number *">
                    <input className="input" type="tel" required maxLength={30} value={form.whatsapp} onChange={(e) => set('whatsapp', e.target.value)} placeholder="+91 90000 00000" />
                  </Field>
                </div>

                <div className="mt-3">
                  <Field label="Message *">
                    <textarea className="input" rows="4" required minLength={5} maxLength={2000} value={form.message}
                      onChange={(e) => set('message', e.target.value)}
                      placeholder={product ? `e.g. Is the ${product.brand || 'unit'} available? Best price & delivery?` : 'How can we help you?'} />
                  </Field>
                </div>

                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                  <button type="submit" disabled={status === 'submitting'}
                    className="btn bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 px-5 py-2.5 font-semibold shadow shadow-brand-500/30 disabled:opacity-60 flex-1 justify-center">
                    {status === 'submitting'
                      ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Submitting…</span>
                      : 'Submit enquiry'}
                  </button>
                  <button type="button" onClick={sendWhatsApp}
                    className="btn bg-[#25D366] hover:bg-[#1fb959] text-white px-5 py-2.5 font-semibold inline-flex items-center justify-center gap-2">
                    <WaIcon /> WhatsApp Enquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </EnquiryCtx.Provider>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-600 mb-1">{label}</span>
      {children}
    </label>
  );
}

function WaIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.05-.97.24-3.27-.68-2.77-1.09-4.53-3.92-4.67-4.1-.14-.18-1.12-1.49-1.12-2.84 0-1.35.71-2.01.96-2.29.24-.27.53-.34.71-.34.18 0 .36 0 .51.01.16.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.24.09 1.55.73 1.82.87.27.14.45.2.51.31.07.11.07.64-.17 1.32z" />
    </svg>
  );
}
