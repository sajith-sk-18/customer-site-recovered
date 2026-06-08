/**
 * Per-browser "recently viewed" product memory.
 * Stored as a localStorage ring buffer of up to MAX product objects, newest first.
 */
const KEY = 'ft.recently_viewed';
const MAX = 8;

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function write(list) {
  try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
}

/**
 * Record a viewing. Stores only the lightweight fields we actually display:
 * id, name, brand, price, primary image url.
 */
export function trackView(product) {
  if (!product || !product.id) return;
  const slim = {
    id:    product.id,
    name:  product.name,
    brand: product.brand,
    price: product.price,
    image: product.images?.[0]?.url || null,
    category: product.category?.name || null,
    viewedAt: Date.now(),
  };
  const next = [slim, ...read().filter((p) => p.id !== product.id)].slice(0, MAX);
  write(next);
}

/** Most-recent first, optionally excluding a product id. */
export function getRecent(excludeId = null) {
  const list = read();
  return excludeId != null ? list.filter((p) => p.id !== excludeId) : list;
}

export function clearRecent() { write([]); }
