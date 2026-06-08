/**
 * Tiny localStorage-backed auth store for the customer site.
 * - getToken / setAuth / clearAuth — the bearer token + cached user
 * - getUser / isAuthed             — synchronous reads for UI gating
 * - subscribe                      — components re-render when state changes
 */
const TOKEN_KEY = 'ft.token';
const USER_KEY  = 'ft.user';

const listeners = new Set();
function notify() { listeners.forEach((fn) => { try { fn(); } catch {} }); }

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || null;
}
export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
export function isAuthed() {
  return !!getToken();
}

export function setAuth(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user)  localStorage.setItem(USER_KEY, JSON.stringify(user));
  notify();
}
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  notify();
}

/**
 * React hook helper:
 *   useEffect(() => subscribe(() => setState(getUser())), []);
 */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
