import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type ThemeId = 'dark' | 'light' | 'daltonism' | 'high-contrast';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  swatch: string; // Color representativo para preview
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'dark', label: 'Oscuro', description: 'Tema predefinido', swatch: '#021526' },
  { id: 'light', label: 'Claro', description: 'Fondos claros', swatch: '#f5f5f7' },
  { id: 'daltonism', label: 'Daltónico', description: 'Deuteranopía', swatch: '#EE7733' },
  { id: 'high-contrast', label: 'Alto contraste', description: 'Máxima legibilidad', swatch: '#FFFF00' },
];

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
}

const STORAGE_KEY = 'brm_theme';

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
});

function applyThemeToDOM(theme: ThemeId) {
  document.documentElement.setAttribute('data-theme', theme);
}

function getStoredTheme(): ThemeId {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['dark', 'light', 'daltonism', 'high-contrast'].includes(stored)) {
      return stored as ThemeId;
    }
  } catch {}
  return 'dark';
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(getStoredTheme);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
  }, []);

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  return useContext(ThemeContext);
}
