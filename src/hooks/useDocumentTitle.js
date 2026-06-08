import { useEffect } from 'react';

const BASE = 'Fluro Tech';

/**
 * Set document.title to "{page} · Fluro Tech" while the calling component is mounted,
 * restoring the previous title on unmount.
 */
export function useDocumentTitle(title) {
  useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = `${title} · ${BASE}`;
    return () => { document.title = prev; };
  }, [title]);
}
