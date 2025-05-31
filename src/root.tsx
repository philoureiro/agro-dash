import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CustomThemeProvider } from '@theme';
// from MUI's toolpad we only use Notifications
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { Provider as JotaiProvider } from 'jotai';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <JotaiProvider>
        <CustomThemeProvider>
          <NotificationsProvider>
            <App />
          </NotificationsProvider>
        </CustomThemeProvider>
      </JotaiProvider>
    </StrictMode>,
  );
}

export default render;
