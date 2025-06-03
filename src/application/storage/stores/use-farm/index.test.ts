import { beforeEach, describe, expect, it, vi } from 'vitest';

// ===== AQUI começa seu teste de verdade =====
import { useFarmStore } from './index';

// MOCK UNIVERSAL usando importOriginal
vi.mock('@mocks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mockFarms: actual.mockFarms ?? [
      {
        id: 'farm-001',
        name: 'Fazenda Santa Rita',
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
    mockProducers: actual.mockProducers ?? [],
    mockCrops: actual.mockCrops ?? [],
  };
});

vi.mock('@validations', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateFarmId: () => `farm-${Math.floor(Math.random() * 999999)}`,
    validateFarmAreas: () => true,
  };
});

vi.mock('@entities', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual };
});
vi.mock('@enums', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    States: actual.States ?? { MG: 'MG', SP: 'SP', MT: 'MT' },
  };
});
vi.mock('@storage', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isFirstTime: () => true,
  };
});

describe('useFarmStore', () => {
  beforeEach(() => {
    useFarmStore.setState({
      farms: [
        {
          id: 'farm-001',
          name: 'Fazenda Santa Rita',
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
        {
          id: 'farm-002',
          name: 'Fazenda Bela Vista',
          producerId: 'prod-002',
          city: 'Ribeirão Preto',
          state: 'SP',
          totalArea: 600,
          agriculturalArea: 400,
          vegetationArea: 200,
          productivity: 80,
          sustainability: 85,
          technology: 90,
          createdAt: new Date(),
          updatedAt: new Date(),
          active: true,
          crops: [],
        },
      ],
      loading: false,
      error: null,
    });
  });

  it('adiciona uma nova fazenda', () => {
    useFarmStore.getState().addFarm({
      name: 'Fazenda Nova',
      producerId: 'prod-003',
      city: 'Cuiabá',
      state: 'MT',
      totalArea: 75,
      agriculturalArea: 60,
      vegetationArea: 15,
      productivity: 75,
      sustainability: 77,
      technology: 70,
    });
    const found = useFarmStore.getState().farms.find((f) => f.name === 'Fazenda Nova');
    expect(found).toBeDefined();
    expect(found!.active).toBe(true);
    expect(found!.city).toBe('Cuiabá');
  });

  it('atualiza uma fazenda existente', () => {
    useFarmStore.getState().updateFarm('farm-001', { name: 'Santa Rita Atualizada' });
    const updated = useFarmStore.getState().farms.find((f) => f.id === 'farm-001');
    expect(updated!.name).toBe('Santa Rita Atualizada');
  });

  it('marca fazenda como inativa ao remover', () => {
    useFarmStore.getState().deleteFarm('farm-002');
    const removed = useFarmStore.getState().farms.find((f) => f.id === 'farm-002');
    expect(removed!.active).toBe(false);
  });

  it('busca fazenda pelo id', () => {
    const fazenda = useFarmStore.getState().getFarmById('farm-001');
    expect(fazenda!.name).toBe('Fazenda Santa Rita');
  });

  it('valida áreas usando função externa', () => {
    const valid = useFarmStore.getState().validateAreas(100, 70, 30);
    expect(valid).toBe(true);
  });

  it('pesquisa fazendas por termo', () => {
    const result = useFarmStore.getState().searchFarms('Bela');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Fazenda Bela Vista');
  });

  it('retorna fazendas por produtor', () => {
    const farms = useFarmStore.getState().getFarmsByProducer('prod-001');
    expect(farms.length).toBe(1);
    expect(farms[0].name).toBe('Fazenda Santa Rita');
  });

  it('retorna fazendas por estado', () => {
    const farms = useFarmStore.getState().getFarmsByState('SP');
    expect(farms.length).toBe(1);
    expect(farms[0].state).toBe('SP');
  });

  it('retorna apenas fazendas ativas', () => {
    useFarmStore.getState().deleteFarm('farm-002');
    const ativos = useFarmStore.getState().getActiveFarms();
    expect(ativos.length).toBe(1);
    expect(ativos[0].active).toBe(true);
  });

  it('seta e reseta loading', () => {
    useFarmStore.getState().setLoading(true);
    expect(useFarmStore.getState().loading).toBe(true);
    useFarmStore.getState().setLoading(false);
    expect(useFarmStore.getState().loading).toBe(false);
  });

  it('seta e limpa erro', () => {
    useFarmStore.getState().setError('Falha');
    expect(useFarmStore.getState().error).toBe('Falha');
    useFarmStore.getState().setError(null);
    expect(useFarmStore.getState().error).toBeNull();
  });

  it('conta total de fazendas ativas', () => {
    useFarmStore.getState().deleteFarm('farm-002');
    const total = useFarmStore.getState().getTotalFarms();
    expect(total).toBe(1);
  });

  it('retorna stats corretas', () => {
    useFarmStore.getState().deleteFarm('farm-002');
    const stats = useFarmStore.getState().getFarmStats();
    expect(stats.total).toBe(1);
    expect(stats.totalArea).toBe(100);
    expect(stats.averageArea).toBe(100);
  });

  it('retorna fazendas por tamanho', () => {
    const result = useFarmStore.getState().getFarmsBySize();
    expect(result.small.length).toBe(0);
    expect(result.medium.length).toBe(1); // Fazenda Santa Rita (100ha)
    expect(result.large.length).toBe(1); // Fazenda Bela Vista (600ha)
  });
});
