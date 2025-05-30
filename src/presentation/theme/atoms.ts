import { atomWithStorage } from 'jotai/utils';

import { ThemeMode } from './types';

// Detecta o tema preferido do sistema
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemeMode.DARK
      : ThemeMode.LIGHT;
  }
  return ThemeMode.LIGHT;
};

// Usa atomWithStorage para persistir no localStorage
export const themeModeState = atomWithStorage<ThemeMode>(
  'theme-mode', // chave no localStorage
  getSystemTheme(), // valor inicial baseado no sistema
);
