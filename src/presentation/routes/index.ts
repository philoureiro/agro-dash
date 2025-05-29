import AddTaskIcon from '@mui/icons-material/AddTask';
import BugReportIcon from '@mui/icons-material/BugReport';
import GitHubIcon from '@mui/icons-material/GitHub';
import HomeIcon from '@mui/icons-material/Home';
import TerrainIcon from '@mui/icons-material/Terrain';

import asyncComponentLoader from '@/application/utils/loader';

import { Routes } from './types';

const routes: Routes = [
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/Welcome')),
    path: '/',
    title: 'Welcome',
    icon: HomeIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/Page1')),
    path: '/page-1',
    title: 'Page 1',
    icon: GitHubIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/Page2')),
    path: '/page-2',
    title: 'Page 2',
    icon: AddTaskIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/Page3')),
    path: '/page-3',
    title: 'Page 3',
    icon: TerrainIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/Page4')),
    path: '/page-4',
    title: 'Page 4',
    icon: BugReportIcon,
  },
  {
    component: asyncComponentLoader(() => import('@/presentation/pages/NotFound')),
    path: '*',
  },
];

export default routes;
