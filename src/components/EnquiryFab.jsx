// Pure WhatsApp chat-style floating button — visible on every page, bottom-right.
// Clicking opens a WhatsApp chat with the admin (wa.me) with a default greeting.
// The admin number comes from VITE_ADMIN_WHATSAPP (digits only).
const ADMIN_WHATSAPP = (import.meta.env.VITE_ADMIN_WHATSAPP || '').replace(/\D/g, '');
const DEFAULT_TEXT = encodeURIComponent('Hello! I have an enquiry about your laptops.');

export default function EnquiryFab() {
  const open = () => {
    if (!ADMIN_WHATSAPP) {
      alert('WhatsApp is not configured. Set VITE_ADMIN_WHATSAPP in the .env file.');
      return;
    }
    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${DEFAULT_TEXT}`, '_blank', 'noopener');
  };

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Chat on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1ebe57]
                 text-white shadow-lg shadow-[#25D366]/40 hover:shadow-xl active:scale-95 transition
                 flex items-center justify-center"
    >
      {/* pulsing ring */}
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/50 animate-ping opacity-60 group-hover:opacity-0" />

      {/* hover label */}
      <span className="pointer-events-none absolute right-16 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 shadow-lg
                       opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition hidden sm:block">
        Chat on WhatsApp
      </span>

      {/* WhatsApp glyph */}
      <svg viewBox="0 0 24 24" className="relative w-7 h-7" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.42 1.32-1.95 1.36-.5.05-.97.24-3.27-.68-2.77-1.09-4.53-3.92-4.67-4.1-.14-.18-1.12-1.49-1.12-2.84 0-1.35.71-2.01.96-2.29.24-.27.53-.34.71-.34.18 0 .36 0 .51.01.16.01.39-.06.61.47.24.55.81 1.9.88 2.04.07.14.12.3.02.48-.09.18-.14.3-.27.46-.14.16-.29.36-.41.48-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.61-.14.24.09 1.55.73 1.82.87.27.14.45.2.51.31.07.11.07.64-.17 1.32z" />
      </svg>
    </button>
  );
}
