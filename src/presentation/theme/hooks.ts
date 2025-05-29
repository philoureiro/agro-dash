import { useCallback, useEffect } from 'react';

import { useAtom } from 'jotai';

import { themeModeState } from './atoms';
import { updateStatusBarColor } from './statusBar';
import { ThemeMode } from './types';

function useThemeMode() {
  const [themeMode, setThemeMode] = useAtom(themeModeState);

  const toggle = useCallback(
    () =>
      setThemeMode((themeMode) =>
        themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK,
      ),
    [setThemeMode],
  );

  // Atualiza a barra de status sempre que o tema mudar
  useEffect(() => {
    updateStatusBarColor(themeMode === ThemeMode.DARK);
  }, [themeMode]);

  // Escuta mudanças no tema do sistema
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches ? ThemeMode.DARK : ThemeMode.LIGHT);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [setThemeMode]);

  return {
    themeMode,
    toggle,
    setThemeMode,
    isDarkMode: themeMode === ThemeMode.DARK,
  };
}

export { useThemeMode };
