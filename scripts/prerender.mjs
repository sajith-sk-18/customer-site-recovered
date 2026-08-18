/**
 * Post-build prerender: bakes per-route SEO (title, description, canonical, Open Graph, Twitter,
 * JSON-LD) into static HTML files under dist/, and generates a real sitemap.xml.
 *
 * This makes each page — especially every product — serve correct meta tags in the RAW HTML, so
 * social link-preview scrapers (WhatsApp/Facebook/Twitter) and non-JS crawlers see per-page titles,
 * descriptions and OG images. The body still hydrates client-side (Google renders JS for content).
 *
 * Run automatically after `vite build` (see package.json "postbuild"). The backend API must be
 * reachable so product routes can be enumerated; if it isn't, static routes are still prerendered.
 *
 * Usage: node scripts/prerender.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// ---- config (from .env, with fallbacks) ----
function readEnv(name, fallback) {
  if (process.env[name]) return process.env[name];
  try {
    const env = readFileSync(join(ROOT, '.env'), 'utf8');
    const m = env.match(new RegExp(`^${name}=(.*)$`, 'm'));
    if (m) return m[1].trim();
  } catch { /* ignore */ }
  return fallback;
}
const SITE_URL = readEnv('VITE_SITE_URL', 'http://localhost:5175').replace(/\/$/, '');
const API_URL = readEnv('VITE_API_URL', 'http://127.0.0.1:8001/api').replace(/\/$/, '');
const SITE_NAME = 'Fluro Tech';
const DEFAULT_DESC = 'Fluro Tech — shop the latest laptops, gaming notebooks and accessories at great prices. Browse specs, compare models and enquire instantly on WhatsApp.';

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const jsonLdSafe = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
const absImg = (u) => (!u ? `${SITE_URL}/logo.jpg` : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

// Build the <head> SEO block for a route.
function headBlock({ title, description, path, image, type = 'website', jsonLd = [] }) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Laptops & Accessories`;
  const desc = description || DEFAULT_DESC;
  const url = `${SITE_URL}${path}`;
  const img = absImg(image);
  const tags = [
    `<title>${esc(fullTitle)}</title>`,
    `<meta name="description" content="${esc(desc)}" />`,
    `<meta name="robots" content="index,follow" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:type" content="${esc(type)}" />`,
    `<meta property="og:title" content="${esc(fullTitle)}" />`,
    `<meta property="og:description" content="${esc(desc)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(img)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(fullTitle)}" />`,
    `<meta name="twitter:description" content="${esc(desc)}" />`,
    `<meta name="twitter:image" content="${esc(img)}" />`,
    ...jsonLd.map((b) => `<script type="application/ld+json" data-seo-jsonld>${jsonLdSafe(b)}</script>`),
  ];
  return tags.join('\n    ');
}

// Strip existing SEO tags from the template head, then inject the route's block.
function renderPage(template, head) {
  let html = template
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta[^>]+name="description"[^>]*>\s*/gi, '')
    .replace(/<meta[^>]+property="og:[^>]*>\s*/gi, '')
    .replace(/<meta[^>]+name="twitter:[^>]*>\s*/gi, '')
    .replace(/<link[^>]+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<script[^>]+data-seo-jsonld[^>]*>[\s\S]*?<\/script>\s*/gi, '');
  return html.replace(/<\/head>/i, `    ${head}\n  </head>`);
}

function writeRoute(path, html) {
  const out = path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_URL}/products?per_page=1000`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (e) {
    console.warn(`[prerender] Could not fetch products from ${API_URL} (${e.message}). Prerendering static routes only.`);
    return [];
  }
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }
  const template = readFileSync(join(DIST, 'index.html'), 'utf8');

  const routes = [
    { path: '/', seo: { title: 'Quality laptops & accessories', description: 'Discover featured laptops, gaming notebooks and accessories at Fluro Tech. Compare specs and enquire instantly on WhatsApp.', path: '/', jsonLd: [
      { '@context': 'https://schema.org', '@type': 'Organization', name: SITE_NAME, url: SITE_URL, logo: `${SITE_URL}/logo.jpg` },
      { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, url: SITE_URL, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/products?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
    ] } },
    { path: '/products', seo: { title: 'All laptops & accessories', description: 'Browse all laptops, gaming notebooks and accessories at Fluro Tech. Filter by brand, price and category, then enquire on WhatsApp.', path: '/products' } },
    { path: '/upcoming', seo: { title: 'Coming soon', description: 'See the upcoming laptops and tech launching soon at Fluro Tech. Get notified and enquire early on WhatsApp.', path: '/upcoming' } },
    { path: '/about', seo: { title: 'About us', description: 'Fluro Tech is your trusted store for laptops, gaming notebooks and accessories — quality products, honest advice and instant WhatsApp support.', path: '/about' } },
    { path: '/contact', seo: { title: 'Contact us', description: 'Get in touch with Fluro Tech for laptop enquiries, custom builds and bulk orders. Call, email, or message us on WhatsApp.', path: '/contact' } },
  ];

  const products = await fetchProducts();
  for (const p of products) {
    const path = `/products/${p.id}`;
    const desc = (p.description || `${p.brand || ''} ${p.name}`).slice(0, 160).trim();
    const productLd = {
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name,
      image: (p.images || []).map((i) => i.url),
      description: p.description || `${p.brand || ''} ${p.name}`.trim(),
      sku: String(p.id),
      brand: { '@type': 'Brand', name: p.brand || SITE_NAME },
      offers: {
        '@type': 'Offer', priceCurrency: 'INR', price: String(p.price),
        availability: (p.stock == null || p.stock > 0) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: `${SITE_URL}${path}`,
      },
    };
    if (p.approved_reviews_count) {
      productLd.aggregateRating = { '@type': 'AggregateRating', ratingValue: String(Number(p.approved_reviews_avg_rating || 0).toFixed(1)), reviewCount: String(p.approved_reviews_count) };
    }
    const breadcrumb = {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Products', item: `${SITE_URL}/products` },
        { '@type': 'ListItem', position: 3, name: p.name, item: `${SITE_URL}${path}` },
      ],
    };
    routes.push({ path, seo: { title: p.name, description: desc, path, image: p.images?.[0]?.url, type: 'product', jsonLd: [productLd, breadcrumb] } });
  }

  for (const r of routes) writeRoute(r.path, renderPage(template, headBlock(r.seo)));

  // sitemap.xml
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes.map((r) => {
    const pr = r.path === '/' ? '1.0' : r.path.startsWith('/products/') ? '0.8' : '0.7';
    const cf = r.path === '/' || r.path === '/products' ? 'daily' : 'weekly';
    return `  <url><loc>${SITE_URL}${r.path}</loc><lastmod>${today}</lastmod><changefreq>${cf}</changefreq><priority>${pr}</priority></url>`;
  }).join('\n');
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(DIST, 'sitemap.xml'), sitemap);
  writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

  console.log(`[prerender] Wrote ${routes.length} routes (${products.length} products) + sitemap.xml + robots.txt to dist/.`);
}

main();
