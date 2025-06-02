import { useCallback, useEffect } from 'react';

import { updateStatusBarColor } from '@theme';
import { useAtom } from 'jotai';

import { themeModeState } from './atoms';
import { ThemeMode } from './types';

function useThemeMode() {
  const [themeMode, setThemeMode] = useAtom(themeModeState);

  // Chama sempre que o tema mudar
  useEffect(() => {
    updateStatusBarColor(themeMode === ThemeMode.DARK);
  }, [themeMode]);

  const toggle = useCallback(
    () =>
      setThemeMode((themeMode) =>
        themeMode === ThemeMode.DARK ? ThemeMode.LIGHT : ThemeMode.DARK,
      ),
    [setThemeMode],
  );

  return {
    themeMode,
    toggle,
    setThemeMode,
    isDarkMode: themeMode === ThemeMode.DARK,
    isLightMode: themeMode === ThemeMode.LIGHT,
    themeModeString: themeMode.toString(),
  };
}

export { useThemeMode };
