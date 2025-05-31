import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import { AppErrorBoundaryFallback, BottomBar, WithErrorHandler } from '@components';
import { Header } from '@sections';
import { useThemeMode } from '@theme';

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

const AppWithErrorHandler = WithErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
