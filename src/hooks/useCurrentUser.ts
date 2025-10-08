import { useEffect, useState } from 'react';

export interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  coordinatorName?: string;
  role?: string;
  avatarUrl?: string | null;
  initials: string;
}

const MOCK_USER: CurrentUser = {
   id: 'me',
   firstName: 'Pepito',
   lastName: 'Pérez',
   displayName: 'Pepito Pérez',
   coordinatorName: 'Andriu Orduz',
   role: 'Asesor',
   avatarUrl: null,
   initials: 'PP',
};

/**
 * Hook de usuario actual con fallback a mock. Intentará /api/me.
 * TODO back: sustituir por servicio real de sesión cuando esté disponible.
 */
export function useCurrentUser() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const resp = await fetch('/api/me', { method: 'GET' });
        if (!resp.ok) throw new Error('No /api/me');
        const data = await resp.json();
        const firstName = data.firstName || data.givenName || MOCK_USER.firstName;
        const lastName = data.lastName || data.familyName || MOCK_USER.lastName;
        const displayName = data.displayName || `${firstName} ${lastName}`.trim();
        const initials = `${(firstName?.[0] || '').toUpperCase()}${(lastName?.[0] || '').toUpperCase()}` || MOCK_USER.initials;
        const mapped: CurrentUser = {
          id: data.id || MOCK_USER.id,
          firstName,
          lastName,
          displayName,
          coordinatorName: data.coordinatorName || MOCK_USER.coordinatorName,
          role: data.role || MOCK_USER.role,
          avatarUrl: data.avatarUrl || null,
          initials,
        };
        if (!cancelled) setUser(mapped);
      } catch (e) {
        if (!cancelled) {
          console.warn('useCurrentUser: falling back to mock user', e);
          setUser(MOCK_USER);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return { user, loading, error } as const;
}


