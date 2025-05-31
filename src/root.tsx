import { ComponentType, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { CustomThemeProvider } from '@theme';
import { ThemeGate } from '@theme';
import { NotificationsProvider } from '@toolpad/core/useNotifications';
import { Provider as JotaiProvider } from 'jotai';

// ajuste o path conforme seu projeto

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);

function render(App: ComponentType) {
  root.render(
    <StrictMode>
      <JotaiProvider>
        <CustomThemeProvider>
          <NotificationsProvider>
            <ThemeGate>
              <App />
            </ThemeGate>
          </NotificationsProvider>
        </CustomThemeProvider>
      </JotaiProvider>
    </StrictMode>,
  );
}

export default render;
