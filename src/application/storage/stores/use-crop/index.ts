import { Crop } from '@entities';
import { CropType } from '@enums';
import { mockCrops } from '@mocks';
import { CropState, isFirstTime } from '@storage';
import { generateCropId, validatePlantedArea } from '@validations';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export * from './helpers';
// Interface das actions do store
interface CropActions {
  // CRUD Operations
  addCrop: (crop: Omit<Crop, 'id'>) => void;
  updateCrop: (id: string, crop: Partial<Crop>) => void;
  deleteCrop: (id: string) => void;
  getCropById: (id: string) => Crop | undefined;

  // Business Logic
  validatePlantedArea: (plantedArea: number, agriculturalArea: number) => boolean;
  searchCrops: (searchTerm: string) => Crop[];
  getCropsByFarm: (farmId: string) => Crop[];
  getCropsByType: (type: CropType) => Crop[];
  getCropsByYear: (harvestYear: string) => Crop[];
  getActiveCrops: () => Crop[];

  // State Management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetCrops: () => void;

  // Utility
  getTotalCrops: () => number;
  getTotalPlantedArea: () => number;
  getCropStats: () => {
    total: number;
    totalPlantedArea: number;
    averageYield: number;
    byType: { [key: string]: number };
    byYear: { [key: string]: number };
  };
  getCropsByTypeDistribution: () => {
    type: CropType;
    count: number;
    totalArea: number;
    percentage: number;
  }[];
}

// Estado completo do store
type CropStore = CropState & CropActions;

// Estado inicial
const initialState: CropState = {
  crops: isFirstTime() ? mockCrops : [],
  loading: false,
  error: null,
};

// 🔥 STORE PRINCIPAL
export const useCropStore = create<CropStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // ============= CRUD OPERATIONS =============
      addCrop: (cropData) => {
        set((state) => {
          const newCrop: Crop = {
            ...cropData,
            id: generateCropId(),
            active: true,
          };

          return {
            crops: [...state.crops, newCrop],
            error: null,
          };
        });
      },

      updateCrop: (id, updates) => {
        set((state) => ({
          crops: state.crops.map((crop) => (crop.id === id ? { ...crop, ...updates } : crop)),
          error: null,
        }));
      },

      deleteCrop: (id) => {
        set((state) => ({
          crops: state.crops.map((crop) => (crop.id === id ? { ...crop, active: false } : crop)),
          error: null,
        }));
      },

      getCropById: (id) => {
        const { crops } = get();
        return crops.find((crop) => crop.id === id);
      },

      // ============= BUSINESS LOGIC =============
      validatePlantedArea,

      searchCrops: (searchTerm) => {
        const { crops } = get();
        const term = searchTerm.toLowerCase();

        return crops.filter(
          (crop) =>
            crop.active &&
            (crop.type.toLowerCase().includes(term) ||
              crop.harvestYear.includes(term) ||
              crop.notes?.toLowerCase().includes(term)),
        );
      },

      getCropsByFarm: (farmId) => {
        const { crops } = get();
        return crops.filter((crop) => crop.active && crop.farmId === farmId);
      },

      getCropsByType: (type) => {
        const { crops } = get();
        return crops.filter((crop) => crop.active && crop.type === type);
      },

      getCropsByYear: (harvestYear) => {
        const { crops } = get();
        return crops.filter((crop) => crop.active && crop.harvestYear === harvestYear);
      },

      getActiveCrops: () => {
        const { crops } = get();
        return crops.filter((crop) => crop.active);
      },

      // ============= STATE MANAGEMENT =============
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      resetCrops: () => {
        set({
          crops: mockCrops,
          loading: false,
          error: null,
        });
      },

      // ============= UTILITY =============
      getTotalCrops: () => {
        const { crops } = get();
        return crops.filter((crop) => crop.active).length;
      },

      getTotalPlantedArea: () => {
        const { crops } = get();
        return crops
          .filter((crop) => crop.active)
          .reduce((total, crop) => total + crop.plantedArea, 0);
      },

      getCropStats: () => {
        const { crops } = get();
        const activeCrops = crops.filter((crop) => crop.active);
        const totalPlantedArea = activeCrops.reduce((sum, crop) => sum + crop.plantedArea, 0);
        const cropsWithYield = activeCrops.filter((crop) => crop.expectedYield);
        const totalYield = cropsWithYield.reduce((sum, crop) => sum + (crop.expectedYield || 0), 0);

        // Distribuição por tipo
        const byType: { [key: string]: number } = {};
        activeCrops.forEach((crop) => {
          byType[crop.type] = (byType[crop.type] || 0) + 1;
        });

        // Distribuição por ano
        const byYear: { [key: string]: number } = {};
        activeCrops.forEach((crop) => {
          byYear[crop.harvestYear] = (byYear[crop.harvestYear] || 0) + 1;
        });

        return {
          total: activeCrops.length,
          totalPlantedArea,
          averageYield: cropsWithYield.length > 0 ? totalYield / cropsWithYield.length : 0,
          byType,
          byYear,
        };
      },

      getCropsByTypeDistribution: () => {
        const { crops } = get();
        const activeCrops = crops.filter((crop) => crop.active);
        const totalArea = activeCrops.reduce((sum, crop) => sum + crop.plantedArea, 0);

        // Agrupar por tipo
        const distribution: { [key: string]: { count: number; totalArea: number } } = {};

        activeCrops.forEach((crop) => {
          if (!distribution[crop.type]) {
            distribution[crop.type] = { count: 0, totalArea: 0 };
          }
          distribution[crop.type].count++;
          distribution[crop.type].totalArea += crop.plantedArea;
        });

        // Converter para array com percentuais
        return Object.entries(distribution).map(([type, data]) => ({
          type: type as CropType,
          count: data.count,
          totalArea: data.totalArea,
          percentage: totalArea > 0 ? (data.totalArea / totalArea) * 100 : 0,
        }));
      },
    }),
    {
      name: 'agro-dash-crops',
      storage: createJSONStorage(() => localStorage),
      partialize: (state: CropStore) => ({
        crops: state.crops,
      }),
    },
  ),
);
