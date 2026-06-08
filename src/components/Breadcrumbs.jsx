import { Link } from 'react-router-dom';

/**
 * Compact breadcrumb. Pass an array of { label, to? } items.
 * The last item is rendered as plain text (the current page).
 */
export default function Breadcrumbs({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((it, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="inline-flex items-center gap-1">
              {i > 0 && (
                <svg viewBox="0 0 24 24" className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              )}
              {isLast || !it.to ? (
                <span className="text-gray-700 font-medium">{it.label}</span>
              ) : (
                <Link to={it.to} className="hover:text-brand-700 transition">{it.label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
