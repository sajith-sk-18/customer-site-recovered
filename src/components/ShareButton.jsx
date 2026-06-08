import { useState } from 'react';

/**
 * Share button — uses Web Share API on mobile/modern browsers, falls back to
 * copy-to-clipboard with a brief "Copied!" toast.
 */
export default function ShareButton({ title, text, url, className = '' }) {
  const [toast, setToast] = useState(null);

  const share = async () => {
    const shareUrl = url || window.location.href;
    const payload = { title: title || document.title, text, url: shareUrl };

    try {
      if (navigator.share) {
        await navigator.share(payload);
        return;
      }
    } catch (e) {
      if (e?.name === 'AbortError') return; // user dismissed picker
    }

    // Fallback: copy URL
    try {
      await navigator.clipboard.writeText(shareUrl);
      setToast('Link copied!');
    } catch {
      // Final fallback — show a prompt
      window.prompt('Copy this link:', shareUrl);
      return;
    }
    setTimeout(() => setToast(null), 1800);
  };

  return (
    <button
      type="button"
      onClick={share}
      className={`relative inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:border-brand-300 hover:text-brand-700 transition ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5"  r="3"/>
        <circle cx="6"  cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      Share
      {toast && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-semibold bg-gray-900 text-white px-2.5 py-1 rounded-full shadow animate-fade-in">
          {toast}
        </span>
      )}
    </button>
  );
}
