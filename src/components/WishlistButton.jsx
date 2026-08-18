import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { isAuthed } from '../auth';

/**
 * In-memory cache of wishlist product IDs for the current session, populated
 * lazily on first mount. Avoids hitting the server for every product card.
 */
let wishlistCache = null;
const listeners = new Set();

async function ensureCache() {
  if (wishlistCache !== null) return wishlistCache;
  // Wishlist is a per-user, auth-only endpoint. Guests have no wishlist, so
  // skip the request entirely — otherwise every product card fires an
  // /me/wishlist/ids call that 401s with "Unauthenticated."
  if (!isAuthed()) {
    wishlistCache = new Set();
    notify();
    return wishlistCache;
  }
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

// Wishlist is an authenticated-only feature. The public storefront has no customer login,
// so the wishlist control is disabled (renders nothing). The exports above are kept as
// harmless no-ops so existing imports continue to resolve.
export default function WishlistButton() {
  return null;
}
