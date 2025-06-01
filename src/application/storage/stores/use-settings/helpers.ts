import { AppSettings } from '@entities';

import { useSettingsStore } from './index';

// ============= HOOK PRINCIPAL =============
export const useSettings = () => {
  return useSettingsStore((state) => ({
    // Dados
    settings: state.settings,
    stats: state.stats,

    // Estado
    isLoading: state.isLoading,
    error: state.error,

    // Actions principais
    updateSetting: state.updateSetting,
    toggleBooleanSetting: state.toggleBooleanSetting,
    switchTheme: state.switchTheme,
  }));
};

// ============= HOOKS ESPECÍFICOS =============

// 🎨 Hook para aparência
export const useAppearanceSettings = () => {
  return useSettingsStore((state) => ({
    theme: state.settings.theme,
    compactMode: state.settings.compactMode,
    animations: state.settings.animations,

    switchTheme: state.switchTheme,
    toggleCompactMode: () => state.toggleBooleanSetting('compactMode'),
    toggleAnimations: () => state.toggleBooleanSetting('animations'),
  }));
};

// 🔔 Hook para sistema
export const useSystemSettings = () => {
  return useSettingsStore((state) => ({
    autoSave: state.settings.autoSave,
    notifications: state.settings.notifications,
    language: state.settings.language,

    toggleAutoSave: () => state.toggleBooleanSetting('autoSave'),
    toggleNotifications: () => state.toggleBooleanSetting('notifications'),
    setLanguage: (language: AppSettings['language']) => state.updateSetting('language', language),
  }));
};

// 📊 Hook para estatísticas
export const useSettingsStats = () => {
  return useSettingsStore((state) => ({
    stats: state.stats,

    // Stats formatadas
    formattedStats: {
      totalSessions: state.stats.totalSessions,
      totalTimeSpent: formatTime(state.stats.totalTimeSpent),
      averageSessionTime: formatTime(state.stats.averageSessionTime),
      lastAccess: formatDate(state.stats.lastAccess),
      activeSettings: state.stats.activeSettings,
      sessionsThisWeek: state.stats.sessionsThisWeek,
    },

    // Actions
    incrementSession: state.incrementSession,
    startSession: state.startSession,
    endSession: state.endSession,
    resetStats: state.resetStats,
  }));
};

// 💾 Hook para backup e persistência
export const useSettingsBackup = () => {
  return useSettingsStore((state) => ({
    // Export
    getExportData: state.getExportData,

    // Import
    importData: state.importData,

    // Reset
    resetToDefaults: state.resetToDefaults,
    clearAllData: state.clearAllData,

    // Estado
    isLoading: state.isLoading,
    error: state.error,
  }));
};

// 🎯 Hook para controle de estado
export const useSettingsStatus = () => {
  return useSettingsStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,

    setLoading: state.setLoading,
    setError: state.setError,
    clearError: state.clearError,
  }));
};

// 🚀 Hook para inicialização
export const useSettingsInit = () => {
  return useSettingsStore((state) => ({
    isFirstLoad: state.isFirstLoad,
    sessionStartTime: state.sessionStartTime,

    initializeStore: state.initializeStore,
    loadFromStorage: state.loadFromStorage,
  }));
};

// ============= HOOK COMPLETO PARA A PÁGINA =============
export const useSettingsPage = () => {
  const settings = useSettings();
  const appearance = useAppearanceSettings();
  const system = useSystemSettings();
  const stats = useSettingsStats();
  const backup = useSettingsBackup();
  const status = useSettingsStatus();
  const init = useSettingsInit();

  return {
    // Dados principais
    settings: settings.settings,
    stats: stats.stats,
    formattedStats: stats.formattedStats,

    // Estado
    isLoading: status.isLoading,
    error: status.error,

    // Aparência
    theme: appearance.theme,
    compactMode: appearance.compactMode,
    animations: appearance.animations,
    switchTheme: appearance.switchTheme,
    toggleCompactMode: appearance.toggleCompactMode,
    toggleAnimations: appearance.toggleAnimations,

    // Sistema
    autoSave: system.autoSave,
    notifications: system.notifications,
    toggleAutoSave: system.toggleAutoSave,
    toggleNotifications: system.toggleNotifications,

    // Backup
    getExportData: backup.getExportData,
    importData: backup.importData,
    resetToDefaults: backup.resetToDefaults,
    clearAllData: backup.clearAllData,

    // Controle
    clearError: status.clearError,
    initializeStore: init.initializeStore,
  };
};

// ============= HELPERS =============
function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
