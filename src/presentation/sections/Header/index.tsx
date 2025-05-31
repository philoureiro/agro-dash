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
  const currentTheme = propThemeMode || themeMode;
  const notifications = useNotifications();

  function handleShowNotification(e: React.MouseEvent) {
    e.stopPropagation();
    notifications.show(getRandomJoke(), {
      autoHideDuration: 5000,
    });
  }

  function handleToggleTheme(e: React.MouseEvent) {
    e.stopPropagation();
    toggleThemeMode();
  }

  return (
    <GlassHeader themeMode={currentTheme} data-pw={`theme-${currentTheme}`}>
      <HeaderContent>
        <LeftSection>
          <TitleButton onClick={handleShowNotification} themeMode={currentTheme}>
            {title}
          </TitleButton>
        </LeftSection>

        <RightSection>
          <Divider themeMode={currentTheme} />

          {/* Botão de Docs com MenuBook */}
          <Tooltip data-tooltip="Docs">
            <ActionButton
              as="a"
              href="/docs"
              themeMode={currentTheme}
              data-pw="docs-button"
              onClick={(e) => e.stopPropagation()} // só por via das dúvidas
            >
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
              tabIndex={0}
              onClick={(e) => e.stopPropagation()} // Não é obrigatório, mas só por via das dúvidas
            >
              <GitHubIcon />
            </ActionButton>
          </Tooltip>

          <Divider themeMode={currentTheme} />

          {/* SÓ UM BOTÃO DE THEME! */}
          <Tooltip data-tooltip="Switch theme">
            <ActionButton
              onClick={handleToggleTheme}
              themeMode={currentTheme}
              data-pw="theme-toggle"
            >
              <ThemeIcon />
            </ActionButton>
          </Tooltip>
        </RightSection>
      </HeaderContent>
    </GlassHeader>
  );
}
