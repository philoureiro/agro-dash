import { Fragment } from 'react';
import PullToRefresh from 'react-pull-to-refresh';
import { BrowserRouter } from 'react-router-dom';

import { CssBaseline } from '@mui/material';

import { AppErrorBoundaryFallback, BottomBar, InstallBanner, WithErrorHandler } from '@components';
import { Header } from '@sections';
import { useThemeMode } from '@theme';

import './global.css';
import { AppRoutes } from './presentation/routes';

function App() {
  const { themeModeString } = useThemeMode();

  async function handleRefresh() {
    if (typeof window === 'undefined') return;
    await new Promise((resolve) => setTimeout(resolve, 300));
    window.location.reload();
  }

  return (
    <Fragment>
      <PullToRefresh onRefresh={handleRefresh} resistance={2.5} distanceToRefresh={80}>
        <Header themeMode={themeModeString} />
        <InstallBanner />
      </PullToRefresh>

      <BrowserRouter>
        <AppRoutes />
        <BottomBar themeMode={themeModeString} />
      </BrowserRouter>

      <CssBaseline />
    </Fragment>
  );
}

const AppWithErrorHandler = WithErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
