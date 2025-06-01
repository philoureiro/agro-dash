// ============= HOOKS AUXILIARES DO APP =============
import { useAppStore as useAppStoreBase } from './index';

// Hook para obter todas as configurações
export const useAppSettings = () =>
  useAppStoreBase((state) => ({
    settings: state.settings,
    updateSettings: state.updateSettings,
  }));

// Hook para navegação
export const useAppNavigation = () =>
  useAppStoreBase((state) => ({
    selectedProducerId: state.selectedProducerId,
    selectedFarmId: state.selectedFarmId,
    setSelectedProducer: state.setSelectedProducer,
    setSelectedFarm: state.setSelectedFarm,
  }));

// Hook para estado global
export const useAppStatus = () =>
  useAppStoreBase((state) => ({
    globalLoading: state.globalLoading,
    globalError: state.globalError,
    setGlobalLoading: state.setGlobalLoading,
    setGlobalError: state.setGlobalError,
  }));

// Hook para dados unificados
export const useAllData = () => useAppStoreBase((state) => state.getAllData());

// Hook para stats globais
export const useGlobalStats = () => useAppStoreBase((state) => state.getGlobalStats());

// Hook para actions de reset
export const useAppActions = () =>
  useAppStoreBase((state) => ({
    resetAllData: state.resetAllData,
    clearAllData: state.clearAllData,
    syncFarmCrops: state.syncFarmCrops,
    syncProducerFarms: state.syncProducerFarms,
  }));

// Hook para tema
export const useTheme = () =>
  useAppStoreBase((state) => ({
    theme: state.settings.theme,
    setTheme: (theme: 'light' | 'dark') => state.updateSettings({ theme }),
  }));
