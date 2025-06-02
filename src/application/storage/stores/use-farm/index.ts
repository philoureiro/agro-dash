import { Farm } from '@entities';
import { States } from '@enums';
import { mockFarms } from '@mocks';
import { FarmState, isFirstTime } from '@storage';
import { generateFarmId, validateFarmAreas } from '@validations';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export * from './helpers';
// Interface das actions do store
interface FarmActions {
  // CRUD Operations
  addFarm: (farm: Omit<Farm, 'id' | 'createdAt' | 'updatedAt' | 'crops'>) => void;
  updateFarm: (id: string, farm: Partial<Farm>) => void;
  deleteFarm: (id: string) => void;
  getFarmById: (id: string) => Farm | undefined;

  // Business Logic
  validateAreas: (totalArea: number, agriculturalArea: number, vegetationArea: number) => boolean;
  searchFarms: (searchTerm: string) => Farm[];
  getFarmsByProducer: (producerId: string) => Farm[];
  getFarmsByState: (state: States) => Farm[];
  getActiveFarms: () => Farm[];

  // State Management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetFarms: () => void;

  // Utility
  getTotalFarms: () => number;
  getTotalArea: () => number;
  getFarmStats: () => {
    total: number;
    totalArea: number;
    averageArea: number;
    totalAgricultural: number;
    totalVegetation: number;
    averageProductivity: number;
    averageSustainability: number;
    averageTechnology: number;
  };
  getFarmsBySize: () => {
    small: Farm[];
    medium: Farm[];
    large: Farm[];
  };
}

// Estado completo do store
type FarmStore = FarmState & FarmActions;

// Estado inicial
const initialState: FarmState = {
  farms: isFirstTime() ? mockFarms : [],
  loading: false,
  error: null,
};

// 🔥 STORE PRINCIPAL
export const useFarmStore = create<FarmStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // ============= CRUD OPERATIONS =============
      addFarm: (farmData) => {
        set((state) => {
          const newFarm: Farm = {
            ...farmData,
            id: generateFarmId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
            crops: [], // Inicializa sem culturas
          };

          return {
            farms: [...state.farms, newFarm],
            error: null,
          };
        });
      },

      updateFarm: (id, updates) => {
        set((state) => ({
          farms: state.farms.map((farm) =>
            farm.id === id ? { ...farm, ...updates, updatedAt: new Date() } : farm,
          ),
          error: null,
        }));
      },

      deleteFarm: (id) => {
        set((state) => ({
          farms: state.farms.map((farm) =>
            farm.id === id ? { ...farm, active: false, updatedAt: new Date() } : farm,
          ),
          error: null,
        }));
      },

      getFarmById: (id) => {
        const { farms } = get();
        return farms.find((farm) => farm.id === id);
      },

      // ============= BUSINESS LOGIC =============
      validateAreas: validateFarmAreas,

      searchFarms: (searchTerm) => {
        const { farms } = get();
        const term = searchTerm.toLowerCase();

        return farms.filter(
          (farm) =>
            farm.active &&
            (farm.name.toLowerCase().includes(term) ||
              farm.city.toLowerCase().includes(term) ||
              farm.state.toLowerCase().includes(term)),
        );
      },

      getFarmsByProducer: (producerId) => {
        const { farms } = get();
        return farms.filter((farm) => farm.active && farm.producerId === producerId);
      },

      getFarmsByState: (state) => {
        const { farms } = get();
        return farms.filter((farm) => farm.active && farm.state === state);
      },

      getActiveFarms: () => {
        const { farms } = get();
        return farms.filter((farm) => farm.active);
      },

      // ============= STATE MANAGEMENT =============
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      resetFarms: () => {
        set({
          farms: mockFarms,
          loading: false,
          error: null,
        });
      },

      // ============= UTILITY =============
      getTotalFarms: () => {
        const { farms } = get();
        return farms.filter((farm) => farm.active).length;
      },

      getTotalArea: () => {
        const { farms } = get();
        return farms
          .filter((farm) => farm.active)
          .reduce((total, farm) => total + farm.totalArea, 0);
      },

      getFarmStats: () => {
        const { farms } = get();
        const activeFarms = farms.filter((farm) => farm.active);
        const totalArea = activeFarms.reduce((sum, farm) => sum + farm.totalArea, 0);
        const totalAgricultural = activeFarms.reduce((sum, farm) => sum + farm.agriculturalArea, 0);
        const totalVegetation = activeFarms.reduce((sum, farm) => sum + farm.vegetationArea, 0);
        const totalProductivity = activeFarms.reduce((sum, farm) => sum + farm.productivity, 0);
        const totalSustainability = activeFarms.reduce((sum, farm) => sum + farm.sustainability, 0);
        const totalTechnology = activeFarms.reduce((sum, farm) => sum + farm.technology, 0);

        return {
          total: activeFarms.length,
          totalArea,
          averageArea: activeFarms.length > 0 ? totalArea / activeFarms.length : 0,
          totalAgricultural,
          totalVegetation,
          averageProductivity: activeFarms.length > 0 ? totalProductivity / activeFarms.length : 0,
          averageSustainability:
            activeFarms.length > 0 ? totalSustainability / activeFarms.length : 0,
          averageTechnology: activeFarms.length > 0 ? totalTechnology / activeFarms.length : 0,
        };
      },

      getFarmsBySize: () => {
        const { farms } = get();
        const activeFarms = farms.filter((farm) => farm.active);

        return {
          small: activeFarms.filter((farm) => farm.totalArea < 50),
          medium: activeFarms.filter((farm) => farm.totalArea >= 50 && farm.totalArea <= 500),
          large: activeFarms.filter((farm) => farm.totalArea > 500),
        };
      },
    }),
    {
      name: 'agro-dash-farms',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: FarmStore) => ({
        farms: state.farms,
      }),
    },
  ),
);
