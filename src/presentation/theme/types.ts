import { JSX } from 'react';

enum ThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
}

type CustomThemeProviderProps = {
  children: JSX.Element;
};

export type { CustomThemeProviderProps };
export { ThemeMode };

export interface DefaultTheme {
  palette: {
    divider?: string;
    background: {
      paper: string;
    };
    text: {
      primary: string;
      secondary: string;
    };
    primary: {
      main: string;
    };
  };
}
