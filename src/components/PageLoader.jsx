import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Branded full-screen loader shown briefly on first load and on every route change.
 * Uses the site logo with a pulsing animation + spinning ring (a "logo loader").
 * Drop a /loader.gif in public/ and it will be used automatically if present.
 */
export default function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="page-loader" role="status" aria-label="Loading">
      <div className="page-loader-inner">
        <span className="pl-ring" />
        <img
          src="/loader.gif"
          alt="Loading"
          className="pl-logo"
          onError={(e) => { e.currentTarget.src = '/logo.jpg'; }}
        />
      </div>
      <div className="pl-text">Loading…</div>
    </div>
  );
}
