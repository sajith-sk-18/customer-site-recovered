import { useEffect, useState } from 'react';
import { getUser, isAuthed, subscribe } from '../auth';

/**
 * Hook that returns { user, authed } and re-renders whenever auth state changes.
 */
export function useAuth() {
  const [snap, setSnap] = useState(() => ({
    user:   getUser(),
    authed: isAuthed(),
  }));

  useEffect(() => subscribe(() => {
    setSnap({ user: getUser(), authed: isAuthed() });
  }), []);

  return snap;
}
