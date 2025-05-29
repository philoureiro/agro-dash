// src/theme/atoms.ts
import { atom } from 'jotai';

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

// Atom com valor inicial baseado no sistema
export const themeModeState = atom<ThemeMode>(getSystemTheme());
