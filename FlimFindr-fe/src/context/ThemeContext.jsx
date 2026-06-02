import React, { createContext, useEffect, useState } from 'react';

export const ThemeContext = createContext();

const THEME_STORAGE_KEY = 'flimfindr.theme';
const VALID_THEMES = ['light', 'dark', 'system'];

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const resolveTheme = (mode) => (mode === 'system' ? getSystemTheme() : mode);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      return VALID_THEMES.includes(stored) ? stored : 'dark';
    } catch {
      return 'dark';
    }
  });

  // Apply the resolved theme to the document root and react to system changes
  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(theme);
      document.documentElement.setAttribute('data-theme', resolved);
    };
    apply();

    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: light)');
      media.addEventListener('change', apply);
      return () => media.removeEventListener('change', apply);
    }
  }, [theme]);

  const setTheme = (next) => {
    if (!VALID_THEMES.includes(next)) return;
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* ignore storage errors */
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme: resolveTheme(theme),
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
