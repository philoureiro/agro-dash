import { AppState, Crop, Farm, Producer } from '@entities';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

  // ============= ACTIONS GLOBAIS =============
  resetAllData: () => void;
  clearAllData: () => void;

  // Sincronização entre stores
  syncFarmCrops: (farmId: string) => void;
  syncProducerFarms: (producerId: string) => void;

  // ============= CONFIGURAÇÕES GLOBAIS =============
  updateSettings: (settings: Partial<AppState['settings']>) => void;

  // ============= NAVEGAÇÃO =============
  setSelectedProducer: (id: string | null) => void;
  setSelectedFarm: (id: string | null) => void;

  // ============= ESTADO GLOBAL =============
  setGlobalLoading: (loading: boolean) => void;
  setGlobalError: (error: string | null) => void;
}

// Estado do App Store Master
interface AppStoreState {
  // Configurações
  settings: {
    theme: 'light' | 'dark';
    language: 'pt-BR';
    currency: 'BRL';
  };

  // Navegação
  selectedProducerId: string | null;
  selectedFarmId: string | null;

  // Estado global
  globalLoading: boolean;
  globalError: string | null;
}

// Estado completo do App Store
type AppStore = AppStoreState & AppActions;

// Estado inicial
const initialState: AppStoreState = {
  settings: {
    theme: 'light',
    language: 'pt-BR',
    currency: 'BRL',
  },
  selectedProducerId: null,
  selectedFarmId: null,
  globalLoading: false,
  globalError: null,
};

// 🔥 STORE MASTER PRINCIPAL
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

      // ============= ACTIONS GLOBAIS =============
      resetAllData: () => {
        useProducerStore.getState().resetProducers();
        useFarmStore.getState().resetFarms();
        useCropStore.getState().resetCrops();

        set({
          selectedProducerId: null,
          selectedFarmId: null,
          globalError: null,
        });
      },

      clearAllData: () => {
        // Limpar todos os stores
        useProducerStore.getState().resetProducers();
        useFarmStore.getState().resetFarms();
        useCropStore.getState().resetCrops();

        // Limpar localStorage
        localStorage.removeItem('agro-dash-producers');
        localStorage.removeItem('agro-dash-farms');
        localStorage.removeItem('agro-dash-crops');
        localStorage.removeItem('agro-dash-app');

        set({
          selectedProducerId: null,
          selectedFarmId: null,
          globalError: null,
        });
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

      // ============= CONFIGURAÇÕES =============
      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      // ============= NAVEGAÇÃO =============
      setSelectedProducer: (id) => {
        set({ selectedProducerId: id });
      },

      setSelectedFarm: (id) => {
        set({ selectedFarmId: id });
      },

      // ============= ESTADO GLOBAL =============
      setGlobalLoading: (loading) => {
        set({ globalLoading: loading });

        // Sincronizar com todos os stores
        useProducerStore.getState().setLoading(loading);
        useFarmStore.getState().setLoading(loading);
        useCropStore.getState().setLoading(loading);
      },

      setGlobalError: (error) => {
        set({ globalError: error });

        // Sincronizar com todos os stores
        useProducerStore.getState().setError(error);
        useFarmStore.getState().setError(error);
        useCropStore.getState().setError(error);
      },
    }),
    {
      name: 'agro-dash-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: AppStore) => ({
        settings: state.settings,
        selectedProducerId: state.selectedProducerId,
        selectedFarmId: state.selectedFarmId,
      }),
    },
  ),
);
