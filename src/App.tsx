import { Fragment } from 'react';
import { BrowserRouter } from 'react-router';

import { CssBaseline } from '@mui/material';

import { withErrorHandler } from '@/error-handling';
import AppErrorBoundaryFallback from '@/error-handling/fallbacks/App';

import Pages from './presentation/routes/Pages';
import Header from './presentation/sections/Header';
import HotKeys from './presentation/sections/HotKeys';
import Sidebar from './presentation/sections/Sidebar';

function App() {
  return (
    <Fragment>
      <CssBaseline />
      <HotKeys />
      <BrowserRouter>
        <Header />
        <Sidebar />
        <Pages />
      </BrowserRouter>
    </Fragment>
  );
}

const AppWithErrorHandler = withErrorHandler(App, AppErrorBoundaryFallback);
export default AppWithErrorHandler;
