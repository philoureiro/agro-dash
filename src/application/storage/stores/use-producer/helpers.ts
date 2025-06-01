import { useProducerStore as useProducerStoreBase } from './index';

// ============= HOOKS AUXILIARES =============

// Hook para obter apenas os produtores
export const useProducers = () => useProducerStoreBase((state) => state.producers);

// Hook para obter apenas as actions CRUD
export const useProducerActions = () =>
  useProducerStoreBase((state) => ({
    addProducer: state.addProducer,
    updateProducer: state.updateProducer,
    deleteProducer: state.deleteProducer,
    resetProducers: state.resetProducers,
  }));

// Hook para obter actions de busca
export const useProducerSearch = () =>
  useProducerStoreBase((state) => ({
    searchProducers: state.searchProducers,
    getProducersByDocumentType: state.getProducersByDocumentType,
    getActiveProducers: state.getActiveProducers,
    getProducerById: state.getProducerById,
  }));

// Hook para obter stats
export const useProducerStats = () => useProducerStoreBase((state) => state.getProducerStats());

// Hook para obter estado de loading/error
export const useProducerStatus = () =>
  useProducerStoreBase((state) => ({
    loading: state.loading,
    error: state.error,
    setLoading: state.setLoading,
    setError: state.setError,
  }));

// Hook para validação
export const useProducerValidation = () =>
  useProducerStoreBase((state) => ({
    validateDocument: state.validateDocument,
  }));

// Hook completo (quando precisar de tudo)
export const useProducerStore = () => useProducerStoreBase();
