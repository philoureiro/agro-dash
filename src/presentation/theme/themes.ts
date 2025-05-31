import { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { colors } from './colors';
import { ThemeMode } from './types';

// Caminho da fonte customizada
const featherFontFamily = "'Feather Bold', Arial, Helvetica, sans-serif";

const sharedTheme = {
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiDivider: {
      styleOverrides: {
        vertical: {
          marginRight: 10,
          marginLeft: 10,
        },
      },
    },
    // Importa Feather Bold para TODO o app, inclusive baseline
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Feather Bold';
          src: url('/assets/fonts/Feather-Bold.ttf') format('truetype');
          font-weight: 700;
          font-style: normal;
          font-display: swap;
        }
        html, body, #root {
          font-family: 'Feather Bold', Arial, Helvetica, sans-serif !important;
        }
        *, *::before, *::after {
          font-family: inherit !important;
        }
      `,
    },
  },
};

const themes: Record<ThemeMode, ThemeOptions> = {
  light: deepmerge(sharedTheme, {
    palette: {
      mode: 'light',
      primary: {
        main: colors.activeGreen,
        contrastText: colors.white,
      },
      secondary: {
        main: colors.secondary,
      },
      background: {
        default: colors.gray100,
        paper: colors.white,
      },
      text: {
        primary: colors.textPrimaryLight,
        secondary: colors.textSecondaryLight,
      },
    },
    typography: {
      fontFamily: featherFontFamily,
      h1: { fontFamily: featherFontFamily },
      h2: { fontFamily: featherFontFamily },
      h3: { fontFamily: featherFontFamily },
      h4: { fontFamily: featherFontFamily },
      h5: { fontFamily: featherFontFamily },
      h6: { fontFamily: featherFontFamily },
      subtitle1: { fontFamily: featherFontFamily },
      subtitle2: { fontFamily: featherFontFamily },
      body1: { fontFamily: featherFontFamily },
      body2: { fontFamily: featherFontFamily },
      button: { fontFamily: featherFontFamily },
      caption: { fontFamily: featherFontFamily },
      overline: { fontFamily: featherFontFamily },
    },
  }),

  dark: deepmerge(sharedTheme, {
    palette: {
      mode: 'dark',
      primary: {
        main: colors.activeGreen,
        contrastText: colors.black,
      },
      secondary: {
        main: colors.secondaryDark,
      },
      background: {
        default: colors.black,
        paper: colors.darkPaper,
      },
      text: {
        primary: colors.textPrimaryDark,
        secondary: colors.textSecondaryDark,
      },
    },
    typography: {
      fontFamily: featherFontFamily,
      h1: { fontFamily: featherFontFamily },
      h2: { fontFamily: featherFontFamily },
      h3: { fontFamily: featherFontFamily },
      h4: { fontFamily: featherFontFamily },
      h5: { fontFamily: featherFontFamily },
      h6: { fontFamily: featherFontFamily },
      subtitle1: { fontFamily: featherFontFamily },
      subtitle2: { fontFamily: featherFontFamily },
      body1: { fontFamily: featherFontFamily },
      body2: { fontFamily: featherFontFamily },
      button: { fontFamily: featherFontFamily },
      caption: { fontFamily: featherFontFamily },
      overline: { fontFamily: featherFontFamily },
    },
  }),
};

export default themes;
