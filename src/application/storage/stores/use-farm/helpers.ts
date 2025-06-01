import { useFarmStore as useFarmStoreBase } from '..';

// ============= HOOKS AUXILIARES =============

// Hook para obter apenas as fazendas
export const useFarms = () => useFarmStoreBase((state) => state.farms);

// Hook para obter apenas as actions CRUD
export const useFarmActions = () =>
  useFarmStoreBase((state) => ({
    addFarm: state.addFarm,
    updateFarm: state.updateFarm,
    deleteFarm: state.deleteFarm,
    resetFarms: state.resetFarms,
  }));

// Hook para obter actions de busca
export const useFarmSearch = () =>
  useFarmStoreBase((state) => ({
    searchFarms: state.searchFarms,
    getFarmsByProducer: state.getFarmsByProducer,
    getFarmsByState: state.getFarmsByState,
    getActiveFarms: state.getActiveFarms,
    getFarmById: state.getFarmById,
  }));

// Hook para obter stats
export const useFarmStats = () => useFarmStoreBase((state) => state.getFarmStats());

// Hook para obter fazendas por tamanho
export const useFarmsBySize = () => useFarmStoreBase((state) => state.getFarmsBySize());

// Hook para obter estado de loading/error
export const useFarmStatus = () =>
  useFarmStoreBase((state) => ({
    loading: state.loading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

// Hook para validação
export const useFarmValidation = () =>
  useFarmStoreBase((state) => ({
    validateAreas: state.validateAreas,
  }));

// Hook para métricas rápidas
export const useFarmMetrics = () =>
  useFarmStoreBase((state) => ({
    totalFarms: state.getTotalFarms(),
    totalArea: state.getTotalArea(),
  }));

// Hook completo (quando precisar de tudo)
export const useFarmStore = () => useFarmStoreBase();
