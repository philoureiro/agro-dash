import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import { BottomBar, withErrorHandler } from '@components';

import { AppErrorBoundaryFallback } from './presentation/components/error-handling/fallbacks';
import Header from './presentation/sections/Header';
import { useThemeMode } from './presentation/theme';

function App() {
  const { themeModeString } = useThemeMode();
  return (
    <Fragment>
      <CssBaseline />

      <Header themeMode={themeModeString} />

      <BrowserRouter>
        <BottomBar themeMode={themeModeString} />
      </BrowserRouter>
    </Fragment>
  );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
