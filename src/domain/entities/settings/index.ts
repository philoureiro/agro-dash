// 🎯 ENTIDADES DE CONFIGURAÇÕES
export interface AppSettings {
  id: string;
  theme: 'light' | 'dark';
  compactMode: boolean;
  animations: boolean;
  autoSave: boolean;
  notifications: boolean;
  language: 'pt-BR' | 'en-US';
  currency: 'BRL' | 'USD';
  createdAt: Date;
  updatedAt: Date;
}

export interface AppStats {
  id: string;
  totalSessions: number;
  totalTimeSpent: number; // em minutos
  lastAccess: Date;
  activeSettings: number;
  sessionsThisWeek: number;
  averageSessionTime: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BackupData {
  id: string;
  type: 'complete' | 'settings-only';
  timestamp: Date;
  version: string;
  settings: AppSettings;
  stats?: AppStats;
  dashboardData?: unknown;
  size: number; // em bytes
}

export interface UserPreferences {
  id: string;
  userId?: string;
  favoriteFeatures: string[];
  customColors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  shortcuts: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}
