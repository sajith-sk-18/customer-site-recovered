import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

/**
 * In-memory cache of wishlist product IDs for the current session, populated
 * lazily on first mount. Avoids hitting the server for every product card.
 */
let wishlistCache = null;
const listeners = new Set();

async function ensureCache() {
  if (wishlistCache !== null) return wishlistCache;
  try {
    const r = await api.get('/me/wishlist/ids');
    wishlistCache = new Set(r.data || []);
  } catch {
    wishlistCache = new Set();
  }
  notify();
  return wishlistCache;
}

function setCached(id, on) {
  if (wishlistCache === null) wishlistCache = new Set();
  if (on) wishlistCache.add(id);
  else    wishlistCache.delete(id);
  notify();
}

function notify() { listeners.forEach((fn) => { try { fn(); } catch {} }); }

/** Public hook for any component that wants live wishlist membership. */
export function useWishlistMembership(productId) {
  const [on, setOn] = useState(() => wishlistCache?.has(productId) || false);
  useEffect(() => {
    let alive = true;
    ensureCache().then(() => { if (alive) setOn(wishlistCache?.has(productId) || false); });
    const tick = () => setOn(wishlistCache?.has(productId) || false);
    listeners.add(tick);
    return () => { alive = false; listeners.delete(tick); };
  }, [productId]);
  return on;
}

export function clearWishlistCache() {
  wishlistCache = null;
  notify();
}

export default function WishlistButton({ productId, size = 'md', className = '' }) {
  const { authed } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const on = useWishlistMembership(productId);
  const [busy, setBusy] = useState(false);

  const dims = size === 'sm'
    ? 'w-8 h-8 [&_svg]:w-4 [&_svg]:h-4'
    : 'w-10 h-10 [&_svg]:w-5 [&_svg]:h-5';

  const toggle = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!authed) {
      navigate(`/login?next=${encodeURIComponent(location.pathname)}`);
      return;
    }
    if (busy) return;
    setBusy(true);
    setCached(productId, !on); // optimistic
    try {
      if (on) await api.delete(`/me/wishlist/${productId}`);
      else     await api.post(`/me/wishlist/${productId}`);
    } catch {
      setCached(productId, on); // revert
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={on ? 'Remove from wishlist' : 'Add to wishlist'}
      title={on ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${dims} rounded-full bg-white/90 hover:bg-white border border-gray-200 hover:border-rose-300 backdrop-blur shadow-sm flex items-center justify-center transition active:scale-90 ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={on ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`${on ? 'text-rose-500' : 'text-gray-500'} transition-all duration-200 ${busy ? 'animate-pulse' : ''} ${on ? 'scale-110' : 'scale-100'}`}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
}
