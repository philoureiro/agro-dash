import { ChartData, Crop, DashboardFilters, DashboardMetrics, Farm, Producer } from '@entities';
import { StateStorage } from 'zustand/middleware';

// Interfaces para os estados dos stores
interface ProducerState {
  producers: Producer[];
  loading: boolean;
  error: string | null;
}

interface FarmState {
  farms: Farm[];
  loading: boolean;
  error: string | null;
}

interface CropState {
  crops: Crop[];
  loading: boolean;
  error: string | null;
}

interface DashboardState {
  metrics: DashboardMetrics;
  chartData: ChartData;
  filters: DashboardFilters;
  loading: boolean;
  error: string | null;
}

interface SettingsState {
  theme: 'light' | 'dark';
  language: 'pt-BR';
  currency: 'BRL';
}

// Configuração customizada do localStorage
const customStorage: StateStorage = {
  getItem: (name: string): string | null => {
    try {
      const item = localStorage.getItem(name);
      return item;
    } catch (error) {
      console.warn(`Error reading localStorage key "${name}":`, error);
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      console.error(`Error setting localStorage key "${name}":`, error);
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error(`Error removing localStorage key "${name}":`, error);
    }
  },
};

// Configurações padrão para persistência
export const persistConfig = {
  name: 'agro-dash',
  storage: customStorage,
  version: 1,
  migrate: (persistedState: unknown, version: number) => {
    // Migração de versões futuras
    if (version === 0) {
      // Migração da v0 para v1
      return persistedState;
    }
    return persistedState;
  },
};

// Configurações específicas para cada store
export const storeConfigs = {
  producers: {
    ...persistConfig,
    name: 'agro-dash-producers',
    partialize: (state: ProducerState) => ({
      producers: state.producers,
      loading: false, // Não persistir loading
      error: null, // Não persistir errors
    }),
  },
  farms: {
    ...persistConfig,
    name: 'agro-dash-farms',
    partialize: (state: FarmState) => ({
      farms: state.farms,
      loading: false,
      error: null,
    }),
  },
  crops: {
    ...persistConfig,
    name: 'agro-dash-crops',
    partialize: (state: CropState) => ({
      crops: state.crops,
      loading: false,
      error: null,
    }),
  },
  dashboard: {
    ...persistConfig,
    name: 'agro-dash-dashboard',
    partialize: (state: DashboardState) => ({
      metrics: state.metrics,
      chartData: state.chartData,
      filters: state.filters,
      // Não persistir loading/error - dados calculados
    }),
  },
  settings: {
    ...persistConfig,
    name: 'agro-dash-settings',
    partialize: (state: SettingsState) => ({
      theme: state.theme,
      language: state.language,
      currency: state.currency,
    }),
  },
};

// Utilitário para verificar se é primeira vez do usuário
export const isFirstTime = (): boolean => {
  return !localStorage.getItem('agro-dash-producers');
};

// Utilitário para limpar todos os dados (reset)
export const clearAllData = (): void => {
  Object.values(storeConfigs).forEach((config) => {
    localStorage.removeItem(config.name);
  });
};

// Utilitário para exportar dados (backup)
export const exportData = (): string => {
  const data: Record<string, unknown> = {};
  Object.values(storeConfigs).forEach((config) => {
    const item = localStorage.getItem(config.name);
    if (item) {
      data[config.name] = JSON.parse(item);
    }
  });
  return JSON.stringify(data, null, 2);
};

// Utilitário para importar dados (restore)
export const importData = (jsonData: string): boolean => {
  try {
    const data = JSON.parse(jsonData);
    Object.entries(data).forEach(([key, value]) => {
      localStorage.setItem(key, JSON.stringify(value));
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

// Exportar tipos para usar nos stores
export type { ProducerState, FarmState, CropState, DashboardState, SettingsState };
