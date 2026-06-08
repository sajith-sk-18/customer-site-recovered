import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Smooth-scroll the window back to the top whenever the route path changes
 * (so navigating from a scrolled position on /products to /about lands at the
 * top of the new page instead of mid-scroll).
 *
 * - Respects `prefers-reduced-motion`: users who've opted out of motion get an
 *   instant jump to the top rather than the smooth animation.
 * - Skips the same-pathname case (e.g. hash-only navigation, search-param
 *   changes on the same page) so in-page anchor links keep working.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: reduceMotion ? 'auto' : 'smooth',
    });
  }, [pathname]);

  return null;
}
