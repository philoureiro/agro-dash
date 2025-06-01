import { Crop, Farm, Producer } from '@entities';
import { mockCrops, mockFarms, mockProducers } from '@mocks';

export interface SeedData {
  producers: Producer[];
  farms: Farm[];
  crops: Crop[];
}

// Função que popula as fazendas com suas culturas
const populateFarmsWithCrops = (): Farm[] => {
  return mockFarms.map((farm) => ({
    ...farm,
    crops: mockCrops.filter((crop) => crop.farmId === farm.id),
  }));
};

// Dados completos para inicialização
export const seedData: SeedData = {
  producers: mockProducers,
  farms: populateFarmsWithCrops(),
  crops: mockCrops,
};

// Função para obter dados iniciais
export const getInitialData = (): SeedData => {
  return {
    producers: [...mockProducers],
    farms: [...populateFarmsWithCrops()],
    crops: [...mockCrops],
  };
};

// Função para resetar dados (útil para testes)
export const resetToInitialData = (): SeedData => {
  return getInitialData();
};

// Estatísticas dos dados mockados
export const mockDataStats = {
  totalProducers: mockProducers.length,
  totalFarms: mockFarms.length,
  totalCrops: mockCrops.length,
  totalArea: mockFarms.reduce((sum, farm) => sum + farm.totalArea, 0),
  totalAgriculturalArea: mockFarms.reduce((sum, farm) => sum + farm.agriculturalArea, 0),
  totalVegetationArea: mockFarms.reduce((sum, farm) => sum + farm.vegetationArea, 0),
  averageProductivity:
    mockFarms.reduce((sum, farm) => sum + farm.productivity, 0) / mockFarms.length,
  averageSustainability:
    mockFarms.reduce((sum, farm) => sum + farm.sustainability, 0) / mockFarms.length,
  averageTechnology: mockFarms.reduce((sum, farm) => sum + farm.technology, 0) / mockFarms.length,
};

console.log('📊 Mock Data Statistics:', mockDataStats);
