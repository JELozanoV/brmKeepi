import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

export interface AuthUser {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  coordinatorName?: string;
  avatarUrl?: string | null;
}

export interface SessionToken { token: string; expiresAt: number; }
export interface AuthResponse { user: AuthUser; token: SessionToken; }

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  lockSeconds: number;
  error: string | null;
  loading: boolean;
  isLoggingOut: boolean;
}

export const AuthContext = createContext<AuthContextValue>({} as any);

const STORAGE_KEY = 'brm_session_v1';
const PEPPER = 'brm_pepper_v1';
const MOCK_USERNAME = '001';
const MOCK_PASSWORD_HASH = '78d242d5b572b051f04c87ad61f003e6b3fa293a3476aafd251ac580fb121613'; // sha256('contraseña'+PEPPER)

async function sha256(text: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  const len = Math.max(a.length, b.length);
  let res = 0;
  for (let i = 0; i < len; i++) {
    const ca = a.charCodeAt(i) || 0;
    const cb = b.charCodeAt(i) || 0;
    res |= ca ^ cb;
  }
  return res === 0;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lockUntil, setLockUntil] = useState<number>(0);
  const [attempts, setAttempts] = useState<number>(0);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const lockSeconds = Math.max(0, Math.ceil((lockUntil - Date.now()) / 1000));

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { user: AuthUser; token: SessionToken };
        if (parsed?.token?.expiresAt > Date.now()) {
          setUser(parsed.user);
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {}
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (attempts >= 5 && lockUntil === 0) {
      setLockUntil(Date.now() + 30_000);
      setAttempts(0);
    }
  }, [attempts, lockUntil]);

  useEffect(() => {
    if (lockSeconds === 0 && lockUntil !== 0) {
      setLockUntil(0);
    }
  }, [lockSeconds, lockUntil]);

  const login = useCallback(async (username: string, password: string) => {
    setError(null);
    if (Date.now() < lockUntil) {
      setError('Demasiados intentos. Vuelve a intentarlo en unos segundos.');
      return;
    }

    // TODO back: Reemplazar por POST /api/auth/login y gestión de cookies httpOnly + CSRF
    // Mock local con hash
    const u = username.trim();
    const p = password.trim();
    const inputHash = await sha256(p + PEPPER);
    const ok = u === MOCK_USERNAME && constantTimeEqual(inputHash, MOCK_PASSWORD_HASH);
    await new Promise(r => setTimeout(r, 350)); // tiempo constante

    if (!ok) {
      setAttempts(a => a + 1);
      setError('Usuario o contraseña no válidos.');
      return;
    }

    const session: AuthResponse = {
      user: { id: 'me', firstName: 'Pepito', lastName: 'Pérez', displayName: 'Pepito Pérez', coordinatorName: 'María Gómez', avatarUrl: null },
      token: { token: 'mock-token', expiresAt: Date.now() + 8 * 60 * 60 * 1000 },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    setUser(session.user);
    setAttempts(0);
  }, [lockUntil]);

  const logout = useCallback(() => {
    setIsLoggingOut(true);
    try {
      // TODO back: POST /api/auth/logout (invalidar server-side; cookie httpOnly/CSRF)
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('authUser');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('sessionExpiresAt');
      setUser(null);
      setAttempts(0);
      setLockUntil(0);
      window.dispatchEvent(new CustomEvent('brm-logout'));
    } finally {
      setIsLoggingOut(false);
    }
  }, []);

  const value = useMemo(() => ({ user, isAuthenticated: !!user, login, logout, lockSeconds, error, loading, isLoggingOut }), [user, login, logout, lockSeconds, error, loading, isLoggingOut]);

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export function useAuth() {
  return React.useContext(AuthContext);
}


