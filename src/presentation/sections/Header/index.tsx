import GitHubIcon from '@mui/icons-material/GitHub';
import ThemeIcon from '@mui/icons-material/InvertColors';
import { AppBar, Button, Divider, IconButton, Stack, Toolbar, Tooltip } from '@mui/material';

import { useNotifications } from '@toolpad/core/useNotifications';

import { repository, title } from '../../../config';
import { useThemeMode } from '../../theme/hooks';
import { getRandomJoke } from './utils';

export default function Header() {
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();

  const notifications = useNotifications();

  function showNotification() {
    notifications.show(getRandomJoke(), {
      autoHideDuration: 5000,
    });
  }

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={2}
      data-pw={`theme-${themeMode}`}
      enableColorOnDark
    >
      <Toolbar>
        <Stack direction="row" justifyContent="space-between" alignItems="center" flex={1}>
          <Stack direction="row" gap={1} alignItems="center">
            <Button onClick={showNotification} color="info">
              {title}
            </Button>
          </Stack>
          <Stack direction="row" alignItems="center">
            <Divider orientation="vertical" flexItem />
            <Tooltip title="It's open source" arrow>
              <IconButton color="info" size="large" component="a" href={repository} target="_blank">
                <GitHubIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem />
            <Tooltip title="Switch theme" arrow>
              <IconButton
                color="info"
                edge="end"
                size="large"
                onClick={toggleThemeMode}
                data-pw="theme-toggle"
              >
                <ThemeIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
