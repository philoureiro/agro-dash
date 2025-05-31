export const updateStatusBarColor = (isDark: boolean) => {
  // Atualiza o theme-color para Android/Chrome e cia.
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.setAttribute('content', isDark ? '#111' : '#fafafa');

  // Para iOS PWA: barra preta sólida (black) ou clara padrão (default)
  let metaAppleStatusBar = document.querySelector(
    'meta[name="apple-mobile-web-app-status-bar-style"]',
  );
  if (!metaAppleStatusBar) {
    metaAppleStatusBar = document.createElement('meta');
    metaAppleStatusBar.setAttribute('name', 'apple-mobile-web-app-status-bar-style');
    document.head.appendChild(metaAppleStatusBar);
  }
  metaAppleStatusBar.setAttribute('content', isDark ? 'black' : 'default');
};
