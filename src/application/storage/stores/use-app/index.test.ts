import { beforeEach, describe, expect, it, vi } from 'vitest';

// ====== IMPORTA AGORA o AppStore =====
import { useAppStore } from './index';

// ==== MOCK UNIVERSAL ==== (antes de importar a store master!)
vi.mock('@mocks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mockProducers: [
      {
        id: 'prod-001',
        name: 'Produtor Um',
        document: '111',
        documentType: 'CPF',
        email: 'um@email.com',
        active: true,
        farmsIds: ['farm-001'],
        profilePhoto: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    mockFarms: [
      {
        id: 'farm-001',
        name: 'Fazenda 1',
        producerId: 'prod-001',
        city: 'Uberlândia',
        state: 'MG',
        totalArea: 100,
        agriculturalArea: 70,
        vegetationArea: 30,
        productivity: 60,
        sustainability: 70,
        technology: 60,
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        crops: [],
      },
    ],
    mockCrops: [
      {
        id: 'crop-001',
        farmId: 'farm-001',
        type: 'SOJA',
        harvestYear: '2025',
        plantedArea: 50,
        expectedYield: 3.2,
        plantingDate: new Date('2024-10-01'),
        harvestDate: new Date('2025-03-01'),
        cropPhoto: '',
        notes: 'Teste',
        active: true,
      },
    ],
  };
});
vi.mock('@validations', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateProducerId: () => 'prod-id-mock',
    generateFarmId: () => 'farm-id-mock',
    generateCropId: () => 'crop-id-mock',
    validateDocument: () => true,
    validateFarmAreas: () => true,
    validatePlantedArea: () => true,
  };
});
vi.mock('@entities', async (importOriginal) => ({ ...(await importOriginal()) }));
vi.mock('@enums', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    States: { MG: 'MG', SP: 'SP' },
    CropType: { SOJA: 'SOJA', MILHO: 'MILHO' },
    DocumentType: { CPF: 'CPF', CNPJ: 'CNPJ' },
  };
});
vi.mock('@storage', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isFirstTime: () => true,
    storeConfigs: { producers: { name: 'mock-producers' } },
    // Mocka stores secundários como funções normais para garantir isolamento nos testes
    useProducerStore: {
      getState: () => ({
        producers: [
          {
            id: 'prod-001',
            name: 'Produtor Um',
            document: '111',
            documentType: 'CPF',
            email: 'um@email.com',
            active: true,
            farmsIds: ['farm-001'],
            profilePhoto: '',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        getProducerStats: () => ({ total: 1, active: 1, cpf: 1, cnpj: 0 }),
        setLoading: vi.fn(),
        setError: vi.fn(),
        resetProducers: vi.fn(),
        updateProducer: vi.fn(),
      }),
    },
    useFarmStore: {
      getState: () => ({
        farms: [
          {
            id: 'farm-001',
            name: 'Fazenda 1',
            producerId: 'prod-001',
            city: 'Uberlândia',
            state: 'MG',
            totalArea: 100,
            agriculturalArea: 70,
            vegetationArea: 30,
            productivity: 60,
            sustainability: 70,
            technology: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
            crops: [],
          },
        ],
        getFarmStats: () => ({
          total: 1,
          totalArea: 100,
          averageArea: 100,
          totalAgricultural: 70,
          totalVegetation: 30,
          averageProductivity: 60,
          averageSustainability: 70,
          averageTechnology: 60,
        }),
        setLoading: vi.fn(),
        setError: vi.fn(),
        resetFarms: vi.fn(),
        updateFarm: vi.fn(),
        getFarmsByProducer: () => [{ id: 'farm-001' }],
        getFarmById: () => ({ id: 'farm-001', crops: [] }),
      }),
    },
    useCropStore: {
      getState: () => ({
        crops: [
          {
            id: 'crop-001',
            farmId: 'farm-001',
            type: 'SOJA',
            harvestYear: '2025',
            plantedArea: 50,
            expectedYield: 3.2,
            plantingDate: new Date('2024-10-01'),
            harvestDate: new Date('2025-03-01'),
            cropPhoto: '',
            notes: 'Teste',
            active: true,
          },
        ],
        getCropStats: () => ({
          total: 1,
          totalPlantedArea: 50,
          averageYield: 3.2,
          byType: { SOJA: 1 },
          byYear: { '2025': 1 },
        }),
        setLoading: vi.fn(),
        setError: vi.fn(),
        resetCrops: vi.fn(),
        getCropsByFarm: () => [{ id: 'crop-001' }],
      }),
    },
    useSettingsStore: {
      getState: () => ({
        settings: {
          theme: 'dark',
          compactMode: false,
          animations: true,
          autoSave: true,
          notifications: true,
          language: 'pt',
          updatedAt: new Date(),
        },
        stats: {
          totalSessions: 2,
          totalTimeSpent: 123,
          averageSessionTime: 61,
          lastAccess: new Date(),
          activeSettings: 4,
          sessionsThisWeek: 2,
        },
        resetToDefaults: vi.fn(),
        clearAllData: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        updateAllSettings: vi.fn(),
      }),
    },
  };
});

describe('useAppStore (Master)', () => {
  beforeEach(() => {
    // Reset o estado (navegação e status global)
    useAppStore.setState({
      selectedProducerId: null,
      selectedFarmId: null,
      globalLoading: false,
      globalError: null,
    });
  });

  it('retorna todos os dados unificados', () => {
    const { producers, farms, crops } = useAppStore.getState().getAllData();
    expect(producers.length).toBe(1);
    expect(farms.length).toBe(1);
    expect(crops.length).toBe(1);
  });

  it('retorna stats globais corretos', () => {
    const stats = useAppStore.getState().getGlobalStats();
    expect(stats.totalProducers).toBe(1);
    expect(stats.totalFarms).toBe(1);
    expect(stats.totalCrops).toBe(1);
    expect(stats.totalArea).toBe(100);
    expect(stats.totalPlantedArea).toBe(50);
  });

  it('acessa configurações globais do sistema', () => {
    const settings = useAppStore.getState().getSystemSettings();
    expect(settings.theme).toBe('dark');
    expect(settings.language).toBe('pt');
  });

  it('acessa estatísticas globais do sistema', () => {
    const sysStats = useAppStore.getState().getSystemStats();
    expect(sysStats.totalSessions).toBe(2);
  });

  it('altera produtor/fazenda selecionados', () => {
    useAppStore.getState().setSelectedProducer('prod-001');
    useAppStore.getState().setSelectedFarm('farm-001');
    expect(useAppStore.getState().selectedProducerId).toBe('prod-001');
    expect(useAppStore.getState().selectedFarmId).toBe('farm-001');
  });

  it('altera estado global de loading e erro', () => {
    useAppStore.getState().setGlobalLoading(true);
    expect(useAppStore.getState().globalLoading).toBe(true);
    useAppStore.getState().setGlobalError('erro');
    expect(useAppStore.getState().globalError).toBe('erro');
  });

  it('resetAllData reseta tudo para estado inicial', () => {
    useAppStore.getState().setSelectedProducer('prod-001');
    useAppStore.getState().setSelectedFarm('farm-001');
    useAppStore.getState().resetAllData();
    expect(useAppStore.getState().selectedProducerId).toBeNull();
    expect(useAppStore.getState().selectedFarmId).toBeNull();
  });

  it('clearAllData reseta tudo para estado inicial', () => {
    useAppStore.getState().setSelectedProducer('prod-001');
    useAppStore.getState().setSelectedFarm('farm-001');
    useAppStore.getState().clearAllData();
    expect(useAppStore.getState().selectedProducerId).toBeNull();
    expect(useAppStore.getState().selectedFarmId).toBeNull();
  });
});
