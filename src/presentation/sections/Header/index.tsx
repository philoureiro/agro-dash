import GitHubIcon from '@mui/icons-material/GitHub';
import DocsIcon from '@mui/icons-material/MenuBook';

import { repository, title } from '@config';
import { useThemeMode } from '@theme';

import {
  ActionButton,
  Divider,
  GlassHeader,
  HeaderContent,
  Image,
  LeftSection,
  RightSection,
  TitleButton,
  Tooltip,
} from './styles';
import favicon from '/favicon.svg';

interface HeaderProps {
  themeMode?: string;
}

export default function Header({ themeMode: propThemeMode }: HeaderProps) {
  const { themeMode } = useThemeMode();
  const currentTheme = propThemeMode || themeMode;

  return (
    <GlassHeader themeMode={currentTheme} data-pw={`theme-${currentTheme}`}>
      <HeaderContent>
        <LeftSection>
          <TitleButton
            onClick={() => {
              window.location.href = '/';
            }}
            themeMode={currentTheme}
          >
            <Image src={favicon} alt="Agro Dash ícone" />
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
              onClick={(e) => e.stopPropagation()}
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
              onClick={(e) => e.stopPropagation()}
            >
              <GitHubIcon />
            </ActionButton>
          </Tooltip>
        </RightSection>
      </HeaderContent>
    </GlassHeader>
  );
}
