import { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

import { colors } from './colors';
import { ThemeMode } from './types';

// <-- Importa o arquivo de cores

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
  }),
};

export default themes;
