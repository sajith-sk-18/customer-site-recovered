// Brand → Simple Icons slug map for logos (free, hotlink-friendly CDN). null = no icon (text only).
export const BRAND_SLUGS = {
  Dell: 'dell',
  Apple: 'apple',
  Lenovo: 'lenovo',
  ASUS: 'asus',
  HP: 'hp',
  Acer: 'acer',
  MSI: 'msibusiness',
  Razer: 'razer',
  Samsung: 'samsung',
  Sony: 'sony',
  LG: 'lg',
  'TP-Link': 'tplink',
  JBL: 'jbl',
  BenQ: 'benq',
  'Western Digital': 'westerndigital',
  Logitech: null,
  Anker: null,
  Keychron: null,
  SanDisk: null,
  Bose: null,
  Crucial: null,
};

/** Returns a logo URL for a brand, or null when there's no icon (caller shows text). */
export function brandLogo(name, color = '64748b') {
  const slug = BRAND_SLUGS[name];
  return slug ? `https://cdn.simpleicons.org/${slug}/${color}` : null;
}
