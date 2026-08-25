import { useEffect } from 'react';

/**
 * Per-page SEO without any head library: imperatively upserts <title>, meta description,
 * canonical, Open Graph + Twitter tags and JSON-LD structured data into <head> on each render.
 * Reliable under React 18 / StrictMode (effects are idempotent — same elements are reused and
 * overwritten per route, so there are never duplicates).
 *
 * Props: title, description, path, image, type ('website'|'product'|'article'), noindex, jsonLd.
 */
const SITE_NAME = 'Fluro Tech';
const SITE_URL = (import.meta.env.VITE_SITE_URL || 'http://localhost:5175').replace(/\/$/, '');
// Local intent: the winnable searches are "used laptop Marthandam",
// "second hand laptop Melpuram", "cctv Marthandam" — not the national generics,
// which belong to Amazon and Flipkart. The town names and the words customers
// actually type ("second hand", "used", "CCTV") have to appear in the copy, or
// there is nothing for Google to match.
const DEFAULT_DESC =
  'Fluro Tech in Marthandam and Melpuram — new and second hand laptops, accessories, ' +
  'and CCTV installation. Compare specs, check stock and enquire instantly on WhatsApp.';

function abs(u) {
  if (!u) return `${SITE_URL}/logo.jpg`;
  return /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`;
}
function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, path, image, type = 'website', noindex = false, jsonLd }) {
  useEffect(() => {
    const fullTitle = title
      ? `${title} · ${SITE_NAME}`
      : `${SITE_NAME} — Laptops, Used Laptops & CCTV in Marthandam`;
    const desc = description || DEFAULT_DESC;
    const canonical = `${SITE_URL}${path ?? window.location.pathname}`;
    const ogImage = abs(image);

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : 'index,follow');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);

    // JSON-LD: replace any app-managed blocks with the current page's.
    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    for (const b of blocks) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.setAttribute('data-seo-jsonld', '');
      s.textContent = JSON.stringify(b);
      document.head.appendChild(s);
    }
  }, [title, description, path, image, type, noindex, JSON.stringify(jsonLd)]);

  return null;
}

export { SITE_URL, SITE_NAME };
