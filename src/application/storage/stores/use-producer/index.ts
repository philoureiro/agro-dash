import { Producer } from '@entities';
import { DocumentType } from '@enums';
import { mockProducers } from '@mocks';
import { ProducerState, isFirstTime, storeConfigs } from '@storage';
import { generateProducerId, validateDocument } from '@validations';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export * from './helpers';

// 🔥 ADICIONADO createJSONStorage

// Interface das actions do store
interface ProducerActions {
  // CRUD Operations
  addProducer: (producer: Omit<Producer, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProducer: (id: string, producer: Partial<Producer>) => void;
  deleteProducer: (id: string) => void;
  getProducerById: (id: string) => Producer | undefined;

  // Business Logic
  validateDocument: (document: string, type: DocumentType) => boolean;
  searchProducers: (searchTerm: string) => Producer[];
  getProducersByDocumentType: (type: DocumentType) => Producer[];
  getActiveProducers: () => Producer[];

  // State Management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  resetProducers: () => void;

  // Utility
  getTotalProducers: () => number;
  getProducerStats: () => {
    total: number;
    active: number;
    cpf: number;
    cnpj: number;
  };
}

// Estado completo do store
type ProducerStore = ProducerState & ProducerActions;

// Estado inicial
const initialState: ProducerState = {
  producers: isFirstTime() ? mockProducers : [],
  loading: false,
  error: null,
};

// 🔥 STORE PRINCIPAL
export const useProducerStore = create<ProducerStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      ...initialState,

      // ============= CRUD OPERATIONS =============
      addProducer: (producerData) => {
        set((state) => {
          const newProducer: Producer = {
            ...producerData,
            id: generateProducerId(),
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
          };

          return {
            producers: [...state.producers, newProducer],
            error: null,
          };
        });
      },

      updateProducer: (id, updates) => {
        set((state) => ({
          producers: state.producers.map((producer) =>
            producer.id === id ? { ...producer, ...updates, updatedAt: new Date() } : producer,
          ),
          error: null,
        }));
      },

      deleteProducer: (id) => {
        set((state) => ({
          producers: state.producers.map((producer) =>
            producer.id === id ? { ...producer, active: false, updatedAt: new Date() } : producer,
          ),
          error: null,
        }));
      },

      getProducerById: (id) => {
        const { producers } = get();
        return producers.find((producer) => producer.id === id);
      },

      // ============= BUSINESS LOGIC =============
      validateDocument: (document: string, type: DocumentType) => validateDocument(document, type),

      searchProducers: (searchTerm) => {
        const { producers } = get();
        const term = searchTerm.toLowerCase();

        return producers.filter(
          (producer) =>
            producer.active &&
            (producer.name.toLowerCase().includes(term) ||
              producer.document.includes(term) ||
              producer.email?.toLowerCase().includes(term)),
        );
      },

      getProducersByDocumentType: (type: DocumentType) => {
        const { producers } = get();
        return producers.filter((producer) => producer.active && producer.documentType === type);
      },

      getActiveProducers: () => {
        const { producers } = get();
        return producers.filter((producer) => producer.active);
      },

      // ============= STATE MANAGEMENT =============
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      resetProducers: () => {
        set({
          producers: mockProducers,
          loading: false,
          error: null,
        });
      },

      // ============= UTILITY =============
      getTotalProducers: () => {
        const { producers } = get();
        return producers.filter((producer) => producer.active).length;
      },

      getProducerStats: () => {
        const { producers } = get();
        const activeProducers = producers.filter((producer) => producer.active);

        return {
          total: activeProducers.length,
          active: activeProducers.length,
          cpf: activeProducers.filter((p) => p.documentType === DocumentType.CPF).length,
          cnpj: activeProducers.filter((p) => p.documentType === DocumentType.CNPJ).length,
        };
      },
    }),
    {
      name: storeConfigs.producers.name, // 🔥 SIMPLIFICADO
      storage: createJSONStorage(() => localStorage), // 🔥 CORRIGIDO
      partialize: (state: ProducerStore) => ({
        producers: state.producers,
        // Não persistir loading e error
      }),
    },
  ),
);
