import { AppSettings, AppStats } from '@entities';
import { Currency, Language, Theme } from '@enums';

// 🎯 MOCK DE CONFIGURAÇÕES
export const mockSettings: AppSettings = {
  id: 'mock-settings-001',
  theme: Theme.LIGHT,
  compactMode: false,
  animations: true,
  autoSave: false,
  notifications: false,
  language: Language.PT_BR,
  currency: Currency.BRL,
  createdAt: new Date('2024-01-15T10:30:00'),
  updatedAt: new Date(),
};

// 📊 MOCK DE ESTATÍSTICAS
export const mockStats: AppStats = {
  id: 'mock-stats-001',
  totalSessions: 47,
  totalTimeSpent: 154, // 2h 34m
  lastAccess: new Date(),
  activeSettings: 4,
  sessionsThisWeek: 12,
  averageSessionTime: 18, // 18 minutos
  createdAt: new Date('2024-01-15T10:30:00'),
  updatedAt: new Date(),
};

// 🗂️ MOCK DE DADOS HISTÓRICOS
export const mockSessionHistory = [
  { date: '2024-06-01', sessions: 3, timeSpent: 45 },
  { date: '2024-05-31', sessions: 2, timeSpent: 32 },
  { date: '2024-05-30', sessions: 4, timeSpent: 67 },
  { date: '2024-05-29', sessions: 1, timeSpent: 15 },
  { date: '2024-05-28', sessions: 2, timeSpent: 28 },
];

// 🎨 MOCK DE PREFERÊNCIAS AVANÇADAS
export const mockAdvancedSettings = {
  shortcuts: {
    'toggle-theme': 'Ctrl+Shift+T',
    'export-data': 'Ctrl+E',
    'open-settings': 'Ctrl+,',
    'reset-data': 'Ctrl+Shift+R',
  },
  customColors: {
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
  },
  favoriteFeatures: ['dashboard', 'analytics', 'reports', 'export'],
};

// 🔄 FUNÇÃO PARA RESETAR PARA DEFAULTS
export const getDefaultSettings = (): AppSettings => ({
  id: `settings-${Date.now()}`,
  theme: Theme.LIGHT,
  compactMode: false,
  animations: true,
  autoSave: true,
  notifications: true,
  language: Language.PT_BR,
  currency: Currency.BRL,
  createdAt: new Date(),
  updatedAt: new Date(),
});

export const getDefaultStats = (): AppStats => ({
  id: `stats-${Date.now()}`,
  totalSessions: 1,
  totalTimeSpent: 0,
  lastAccess: new Date(),
  activeSettings: 3, // tema + animações + auto-save
  sessionsThisWeek: 1,
  averageSessionTime: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
});
