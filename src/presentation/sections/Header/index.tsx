import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import DocsIcon from '@mui/icons-material/MenuBook';

// Ícone de documentação
import { repository, title } from '@config';
import { useThemeMode } from '@theme';
import { useNotifications } from '@toolpad/core/useNotifications';

import {
  ActionButton,
  Divider,
  GlassHeader,
  HeaderContent,
  LeftSection,
  RightSection,
  TitleButton,
  Tooltip,
} from './styles';
import { getRandomJoke } from './utils';

interface HeaderProps {
  themeMode?: string;
}

export default function Header({ themeMode: propThemeMode }: HeaderProps) {
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();

  // Usa a prop se fornecida, senão usa o hook
  const currentTheme = propThemeMode || themeMode;

  const notifications = useNotifications();

  function showNotification() {
    notifications.show(getRandomJoke(), {
      autoHideDuration: 5000,
    });
  }

  function handleDocsClick() {
    window.location.href = '/docs';
  }

  return (
    <GlassHeader themeMode={currentTheme} data-pw={`theme-${currentTheme}`}>
      <HeaderContent>
        <LeftSection>
          <TitleButton onClick={showNotification} themeMode={currentTheme}>
            {title}
          </TitleButton>
        </LeftSection>

        <RightSection>
          <Divider themeMode={currentTheme} />

          <Tooltip data-tooltip="Docs">
            <ActionButton onClick={handleDocsClick} themeMode={currentTheme} data-pw="docs-button">
              <DocsIcon />
            </ActionButton>
          </Tooltip>

          <Divider themeMode={currentTheme} />

          <Tooltip data-tooltip="It's open source">
            <ActionButton
              as="a"
              href={repository}
              target="_blank"
              rel="noopener noreferrer"
              themeMode={currentTheme}
            >
              <GitHubIcon />
            </ActionButton>
          </Tooltip>

          <Divider themeMode={currentTheme} />

          <Tooltip data-tooltip="Switch theme">
            <ActionButton onClick={toggleThemeMode} themeMode={currentTheme} data-pw="theme-toggle">
              <ThemeIcon />
            </ActionButton>
          </Tooltip>
        </RightSection>
      </HeaderContent>
    </GlassHeader>
  );
}
