import { atomWithStorage } from 'jotai/utils';

import { ThemeMode } from './types';

// Detecta o tema preferido do sistema só na primeira vez
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.DARK
      : ThemeMode.LIGHT;
  }
  return ThemeMode.LIGHT;
};

// Átomo persistente no localStorage, valor inicial só para primeira vez
export const themeModeState = atomWithStorage<ThemeMode>(
  'theme-mode', // chave no localStorage
  getSystemTheme(), // valor inicial (só é usado se nunca tiver salvo nada!)
);
