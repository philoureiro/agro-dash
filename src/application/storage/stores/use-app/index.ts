// Imports de entidades e stores secundários
import { AppSettings, AppStats, Crop, Farm, Producer } from '@entities';
import { useCropStore, useFarmStore, useProducerStore, useSettingsStore } from '@storage';
// Imports do Zustand
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============================================================================
// interfaces
// ============================================================================

// Interface das actions do App Store Master
interface AppActions {
  // ============= GETTERS UNIFICADOS =============
  getAllData: () => {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
  };

  // Stats gerais
  getGlobalStats: () => {
    totalProducers: number;
    totalFarms: number;
    totalCrops: number;
    totalArea: number;
    totalPlantedArea: number;
  };

  // ============= GETTERS DE CONFIGURAÇÃO (DO NOVO STORE) =============
  getSystemSettings: () => AppSettings;
  getSystemStats: () => AppStats;

  // ============= ACTIONS GLOBAIS =============
  resetAllData: () => void;
  clearAllData: () => void;

  // Sincronização entre stores
  syncFarmCrops: (farmId: string) => void;
  syncProducerFarms: (producerId: string) => void;

  // ============= CONFIGURAÇÕES GLOBAIS (AGORA DELEGADAS) =============
  updateSettings: (settings: Partial<AppSettings>) => void;

  // ============= NAVEGAÇÃO =============
  setSelectedProducer: (id: string | null) => void;
  setSelectedFarm: (id: string | null) => void;

  // ============= ESTADO GLOBAL =============
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

// O estado do App Store agora foca na navegação e estado global,
// pois as configurações são gerenciadas pelo useSettingsStore.
interface AppStoreState {
  // Navegação
  selectedProducerId: string | null;
  selectedFarmId: string | null;

  // Estado global
  globalLoading: boolean;
  globalError: string | null;
}

// Estado completo do App Store
type AppStore = AppStoreState & AppActions;

// ============================================================================
// Estado Inicial
// ============================================================================
const initialState: AppStoreState = {
  selectedProducerId: null,
  selectedFarmId: null,
  globalLoading: false,
  globalError: null,
};

// ============================================================================
// 🔥 STORE MASTER PRINCIPAL
// ============================================================================
export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      // Estado inicial
      ...initialState,

      // ============= GETTERS UNIFICADOS =============
      getAllData: () => {
        const producers = useProducerStore.getState().producers;
        const farms = useFarmStore.getState().farms;
        const crops = useCropStore.getState().crops;
        return { producers, farms, crops };
      },

      getGlobalStats: () => {
        const producerStats = useProducerStore.getState().getProducerStats();
        const farmStats = useFarmStore.getState().getFarmStats();
        const cropStats = useCropStore.getState().getCropStats();
        return {
          totalProducers: producerStats.total,
          totalFarms: farmStats.total,
          totalCrops: cropStats.total,
          totalArea: farmStats.totalArea,
          totalPlantedArea: cropStats.totalPlantedArea,
        };
      },

      // ============= GETTERS DE CONFIGURAÇÃO =============
      getSystemSettings: () => {
        return useSettingsStore.getState().settings;
      },

      getSystemStats: () => {
        return useSettingsStore.getState().stats;
      },

      // ============= ACTIONS GLOBAIS =============
      resetAllData: () => {
        // Reseta os dados das entidades
        useProducerStore.getState().resetProducers();
        useFarmStore.getState().resetFarms();
        useCropStore.getState().resetCrops();

        // Reseta as configurações para o padrão
        useSettingsStore.getState().resetToDefaults();

        // Reseta o estado local do AppStore
        set({
          ...initialState,
        });
      },

      clearAllData: () => {
        // A action do settings store é mais completa e já limpa o localStorage de tudo
        useSettingsStore.getState().clearAllData();

        // Apenas garantimos que o estado em memória seja resetado também
        useProducerStore.getState().resetProducers();
        useFarmStore.getState().resetFarms();
        useCropStore.getState().resetCrops();

        // Reseta o estado local do AppStore
        set({ ...initialState });
      },

      // ============= SINCRONIZAÇÃO =============
      syncFarmCrops: (farmId) => {
        const crops = useCropStore.getState().getCropsByFarm(farmId);
        const farm = useFarmStore.getState().getFarmById(farmId);
        if (farm) {
          useFarmStore.getState().updateFarm(farmId, { crops });
        }
      },

      syncProducerFarms: (producerId) => {
        const farms = useFarmStore.getState().getFarmsByProducer(producerId);
        const farmIds = farms.map((farm: Farm) => farm.id);
        useProducerStore.getState().updateProducer(producerId, { farmsIds: farmIds });
      },

      // ============= CONFIGURAÇÕES (DELEGADO) =============
      updateSettings: (newSettings) => {
        // Delega a atualização para o store de configurações
        useSettingsStore.getState().updateAllSettings(newSettings);
      },

      // ============= NAVEGAÇÃO =============
      setSelectedProducer: (id) => {
        set({ selectedProducerId: id });
      },

      setSelectedFarm: (id) => {
        set({ selectedFarmId: id });
      },

      // ============= ESTADO GLOBAL (SINCRONIZADO) =============
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });

        // Sincronizar com todos os stores
        useProducerStore.getState().setLoading(loading);
        useFarmStore.getState().setLoading(loading);
        useCropStore.getState().setLoading(loading);
        useSettingsStore.getState().setLoading(loading); // Sincroniza com o store de settings
      },

      setGlobalError: (error) => {
        set({ globalError: error });

        // Sincronizar com todos os stores
        useProducerStore.getState().setError(error);
        useFarmStore.getState().setError(error);
        useCropStore.getState().setError(error);
        useSettingsStore.getState().setError(error); // Sincroniza com o store de settings
      },
    }),
    {
      name: 'agro-dash-app',
      storage: createJSONStorage(() => localStorage),
      // Persistimos apenas o estado de navegação, pois as configurações
      // já são persistidas pelo seu próprio store.
      partialize: (state: AppStore) => ({
        selectedProducerId: state.selectedProducerId,
        selectedFarmId: state.selectedFarmId,
      }),
    },
  ),
);

// ============================================================================
// HOOKS AUXILIARES DO APP (Atualizados)
// ============================================================================

// Hook para obter as configurações e estatísticas do sistema
export const useSystemData = () =>
  useAppStore((state) => ({
    settings: state.getSystemSettings(),
    stats: state.getSystemStats(),
    updateSettings: state.updateSettings,
  }));

// Hook para navegação (sem alterações)
export const useAppNavigation = () =>
  useAppStore((state) => ({
    selectedProducerId: state.selectedProducerId,
    selectedFarmId: state.selectedFarmId,
    setSelectedProducer: state.setSelectedProducer,
    setSelectedFarm: state.setSelectedFarm,
  }));

// Hook para estado global (sem alterações)
export const useAppStatus = () =>
  useAppStore((state) => ({
    globalLoading: state.globalLoading,
    globalError: state.globalError,
    setGlobalLoading: state.setGlobalLoading,
    setGlobalError: state.setGlobalError,
  }));

// Hook para dados unificados (sem alterações)
export const useAllData = () => useAppStore((state) => state.getAllData());

// Hook para stats globais (sem alterações)
export const useGlobalStats = () => useAppStore((state) => state.getGlobalStats());

// Hook para actions globais (sem alterações)
export const useAppActions = () =>
  useAppStore((state) => ({
    resetAllData: state.resetAllData,
    clearAllData: state.clearAllData,
    syncFarmCrops: state.syncFarmCrops,
    syncProducerFarms: state.syncProducerFarms,
  }));

// Hook para tema (agora busca do store de configurações via facade)
export const useTheme = () => {
  const settings = useAppStore((state) => state.getSystemSettings());
  const updateSettings = useAppStore((state) => state.updateSettings);

  return {
    theme: settings.theme,
    setTheme: (theme: 'light' | 'dark') => updateSettings({ theme }),
  };
};
