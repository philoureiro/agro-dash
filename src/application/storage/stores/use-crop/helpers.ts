import { useCropStore as useCropStoreBase } from '..';

// ============= HOOKS AUXILIARES =============

// Hook para obter apenas as culturas
export const useCrops = () => useCropStoreBase((state) => state.crops);

// Hook para obter apenas as actions CRUD
export const useCropActions = () =>
  useCropStoreBase((state) => ({
    addCrop: state.addCrop,
    updateCrop: state.updateCrop,
    deleteCrop: state.deleteCrop,
    resetCrops: state.resetCrops,
  }));

// Hook para obter actions de busca
export const useCropSearch = () =>
  useCropStoreBase((state) => ({
    searchCrops: state.searchCrops,
    getCropsByFarm: state.getCropsByFarm,
    getCropsByType: state.getCropsByType,
    getCropsByYear: state.getCropsByYear,
    getActiveCrops: state.getActiveCrops,
    getCropById: state.getCropById,
  }));

// Hook para obter stats
export const useCropStats = () => useCropStoreBase((state) => state.getCropStats());

// Hook para obter distribuição por tipo
export const useCropDistribution = () =>
  useCropStoreBase((state) => state.getCropsByTypeDistribution());

// Hook para obter estado de loading/error
export const useCropStatus = () =>
  useCropStoreBase((state) => ({
    loading: state.loading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

// Hook para validação
export const useCropValidation = () =>
  useCropStoreBase((state) => ({
    validatePlantedArea: state.validatePlantedArea,
  }));

// Hook para métricas rápidas
export const useCropMetrics = () =>
  useCropStoreBase((state) => ({
    totalCrops: state.getTotalCrops(),
    totalPlantedArea: state.getTotalPlantedArea(),
  }));

// Hook para culturas por ano específico
export const useCropsByYear = (year: string) =>
  useCropStoreBase((state) => state.getCropsByYear(year));

// Hook para culturas de uma fazenda específica
export const useCropsByFarm = (farmId: string) =>
  useCropStoreBase((state) => state.getCropsByFarm(farmId));

// Hook completo (quando precisar de tudo)
export const useCropStore = () => useCropStoreBase();
