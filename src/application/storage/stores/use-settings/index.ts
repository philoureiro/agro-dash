import { AppSettings, AppStats } from '@entities';
import { BackupType } from '@enums';
import { getDefaultSettings, getDefaultStats, mockSettings, mockStats } from '@mocks';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============= INTERFACE DO STORE =============
interface SettingsStoreState {
  // 📊 Dados
  settings: AppSettings;
  stats: AppStats;

  // 🎯 Estado da UI
  isLoading: boolean;
  error: string | null;

  // 🔄 Controles de sessão
  sessionStartTime: Date | null;
  isFirstLoad: boolean;
}

interface SettingsStoreActions {
  // ============= INICIALIZAÇÃO =============
  initializeStore: () => void;
  loadFromStorage: () => void;

  // ============= CONFIGURAÇÕES =============
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  toggleBooleanSetting: (
    key: keyof Pick<AppSettings, 'compactMode' | 'animations' | 'autoSave' | 'notifications'>,
  ) => void;
  switchTheme: () => void;
  updateAllSettings: (newSettings: Partial<AppSettings>) => void;

  // ============= ESTATÍSTICAS =============
  incrementSession: () => void;
  startSession: () => void;
  endSession: () => void;
  updateActiveSettingsCount: () => void;
  resetStats: () => void;

  // ============= PERSISTÊNCIA =============
  saveToStorage: () => void;
  getExportData: (type: BackupType) => unknown;
  importData: (data: unknown) => void;

  // ============= RESET =============
  resetToDefaults: () => void;
  clearAllData: () => void;

  // ============= ESTADO =============
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // ============= HELPERS INTERNOS =============
  getDashboardData: () => unknown;
}

type SettingsStore = SettingsStoreState & SettingsStoreActions;

// ============= STORAGE KEYS =============
const STORAGE_KEYS = {
  SETTINGS: 'agrodash-settings-v2',
  STATS: 'agrodash-stats-v2',
  SESSION: 'agrodash-session-v2',
} as const;

// ============= STORE PRINCIPAL =============
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      // ============= ESTADO INICIAL =============
      settings: mockSettings,
      stats: mockStats,
      isLoading: false,
      error: null,
      sessionStartTime: null,
      isFirstLoad: true,

      // ============= INICIALIZAÇÃO =============
      initializeStore: () => {
        const state = get();

        if (state.isFirstLoad) {
          // Primeira vez - carrega mocks ou storage
          state.loadFromStorage();
          state.startSession();
          set({ isFirstLoad: false });
        } else {
          // Sessão existente - apenas atualiza timestamp
          state.incrementSession();
        }
      },

      loadFromStorage: () => {
        try {
          set({ isLoading: true, error: null });

          // Tenta carregar do localStorage
          const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
          const savedStats = localStorage.getItem(STORAGE_KEYS.STATS);

          const settings = savedSettings
            ? { ...mockSettings, ...JSON.parse(savedSettings) }
            : mockSettings;

          const stats = savedStats ? { ...mockStats, ...JSON.parse(savedStats) } : mockStats;

          set({
            settings,
            stats,
            isLoading: false,
          });
        } catch (error) {
          console.error('Erro ao carregar do storage:', error);
          set({
            error: 'Erro ao carregar configurações',
            isLoading: false,
            settings: mockSettings,
            stats: mockStats,
          });
        }
      },

      // ============= CONFIGURAÇÕES =============
      updateSetting: (key, value) => {
        const currentSettings = get().settings;
        const updatedSettings = {
          ...currentSettings,
          [key]: value,
          updatedAt: new Date(),
        };

        set({ settings: updatedSettings });
        get().updateActiveSettingsCount();
        get().saveToStorage();
      },

      toggleBooleanSetting: (key) => {
        const currentValue = get().settings[key];
        get().updateSetting(key, !currentValue);
      },

      switchTheme: () => {
        const currentTheme = get().settings.theme;
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        get().updateSetting('theme', newTheme);
      },

      updateAllSettings: (newSettings) => {
        const currentSettings = get().settings;
        const updatedSettings = {
          ...currentSettings,
          ...newSettings,
          updatedAt: new Date(),
        };

        set({ settings: updatedSettings });
        get().updateActiveSettingsCount();
        get().saveToStorage();
      },

      // ============= ESTATÍSTICAS =============
      incrementSession: () => {
        const currentStats = get().stats;
        const updatedStats = {
          ...currentStats,
          totalSessions: currentStats.totalSessions + 1,
          lastAccess: new Date(),
          updatedAt: new Date(),
        };

        set({ stats: updatedStats });
        get().saveToStorage();
      },

      startSession: () => {
        set({ sessionStartTime: new Date() });
        get().incrementSession();
      },

      endSession: () => {
        const { sessionStartTime, stats } = get();

        if (sessionStartTime) {
          const sessionDuration = Math.floor(
            (new Date().getTime() - sessionStartTime.getTime()) / (1000 * 60),
          ); // em minutos

          const newTotalTime = stats.totalTimeSpent + sessionDuration;
          const newAverage =
            stats.totalSessions > 0 ? Math.round(newTotalTime / stats.totalSessions) : 0;

          const updatedStats = {
            ...stats,
            totalTimeSpent: newTotalTime,
            averageSessionTime: newAverage,
            lastAccess: new Date(),
            updatedAt: new Date(),
          };

          set({
            stats: updatedStats,
            sessionStartTime: null,
          });
          get().saveToStorage();
        }
      },

      updateActiveSettingsCount: () => {
        const { settings } = get();

        // Conta configurações ativas (booleanas = true + tema diferente do padrão)
        const activeCount = [
          settings.theme === 'dark' ? 1 : 0,
          settings.compactMode ? 1 : 0,
          settings.animations ? 1 : 0,
          settings.autoSave ? 1 : 0,
          settings.notifications ? 1 : 0,
        ].reduce((sum, val) => sum + val, 0);

        const currentStats = get().stats;
        const updatedStats = {
          ...currentStats,
          activeSettings: activeCount,
          updatedAt: new Date(),
        };

        set({ stats: updatedStats });
      },

      resetStats: () => {
        const defaultStats = getDefaultStats();
        set({ stats: defaultStats });
        get().saveToStorage();
      },

      // ============= PERSISTÊNCIA =============
      saveToStorage: () => {
        try {
          const { settings, stats } = get();

          localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
          localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
        } catch (error) {
          console.error('Erro ao salvar no storage:', error);
          set({ error: 'Erro ao salvar dados' });
        }
      },

      getExportData: (type) => {
        const { settings, stats } = get();

        const baseData = {
          timestamp: new Date().toISOString(),
          version: '2.0.0',
          type,
          settings,
        };

        if (type === BackupType.COMPLETE) {
          return {
            ...baseData,
            stats,
            dashboardData: get().getDashboardData(),
          };
        }

        return baseData;
      },

      importData: (data) => {
        try {
          set({ isLoading: true, error: null });

          // Type guard to ensure data is an object
          if (typeof data === 'object' && data !== null) {
            const d = data as { settings?: Partial<AppSettings>; stats?: Partial<AppStats> };

            if (d.settings) {
              const importedSettings = {
                ...getDefaultSettings(),
                ...d.settings,
                id: `imported-${Date.now()}`,
                updatedAt: new Date(),
              };
              set({ settings: importedSettings });
            }

            if (d.stats) {
              const importedStats = {
                ...getDefaultStats(),
                ...d.stats,
                id: `imported-${Date.now()}`,
                updatedAt: new Date(),
              };
              set({ stats: importedStats });
            }
          }

          get().updateActiveSettingsCount();
          get().saveToStorage();

          set({ isLoading: false });
        } catch (error) {
          console.error('Erro ao importar dados:', error);
          set({
            error: 'Erro ao importar dados',
            isLoading: false,
          });
        }
      },

      // ============= RESET =============
      resetToDefaults: () => {
        const defaultSettings = getDefaultSettings();
        const defaultStats = getDefaultStats();

        set({
          settings: defaultSettings,
          stats: defaultStats,
          error: null,
        });

        get().saveToStorage();
      },

      clearAllData: () => {
        try {
          // Remove do localStorage
          Object.values(STORAGE_KEYS).forEach((key) => {
            localStorage.removeItem(key);
          });

          // Remove dados relacionados
          const relatedKeys = [
            'agrodash-dashboard-data',
            'agrodash-cache',
            'agro-dash-producers',
            'agro-dash-farms',
            'agro-dash-crops',
            'agro-dash-app',
          ];

          relatedKeys.forEach((key) => {
            localStorage.removeItem(key);
          });

          // Volta aos defaults
          get().resetToDefaults();
        } catch (error) {
          console.error('Erro ao limpar dados:', error);
          set({ error: 'Erro ao limpar dados' });
        }
      },

      // ============= ESTADO =============
      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // ============= HELPERS INTERNOS =============
      getDashboardData: () => {
        try {
          return {
            dashboardData: localStorage.getItem('agrodash-dashboard-data'),
            cache: localStorage.getItem('agrodash-cache'),
            producers: localStorage.getItem('agro-dash-producers'),
            farms: localStorage.getItem('agro-dash-farms'),
            crops: localStorage.getItem('agro-dash-crops'),
          };
        } catch (error) {
          console.warn('Erro ao obter dados do dashboard:', error);
          return null;
        }
      },
    }),
    {
      name: 'agrodash-settings-store-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        settings: state.settings,
        stats: state.stats,
        isFirstLoad: state.isFirstLoad,
      }),
    },
  ),
);
