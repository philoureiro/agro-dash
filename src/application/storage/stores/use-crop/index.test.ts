import { beforeEach, describe, expect, it, vi } from 'vitest';

// Agora importa o store real
import { useCropStore } from './index';

// MOCK UNIVERSAL usando importOriginal
vi.mock('@mocks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mockCrops: actual.mockCrops ?? [
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
        notes: 'Lavoura experimental.',
        active: true,
      },
      {
        id: 'crop-002',
        farmId: 'farm-002',
        type: 'MILHO',
        harvestYear: '2025',
        plantedArea: 120,
        expectedYield: 8.5,
        plantingDate: new Date('2024-11-01'),
        harvestDate: new Date('2025-04-01'),
        cropPhoto: '',
        notes: 'Solo corrigido com calcário.',
        active: true,
      },
    ],
  };
});

vi.mock('@validations', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    generateCropId: () => `crop-${Math.floor(Math.random() * 999999)}`,
    validatePlantedArea: () => true,
  };
});

vi.mock('@entities', async (importOriginal) => ({ ...(await importOriginal()) }));
vi.mock('@enums', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    CropType: actual.CropType ?? { SOJA: 'SOJA', MILHO: 'MILHO' },
  };
});
vi.mock('@storage', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    isFirstTime: () => true,
  };
});

describe('useCropStore', () => {
  beforeEach(() => {
    useCropStore.setState({
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
          notes: 'Lavoura experimental.',
          active: true,
        },
        {
          id: 'crop-002',
          farmId: 'farm-002',
          type: 'MILHO',
          harvestYear: '2025',
          plantedArea: 120,
          expectedYield: 8.5,
          plantingDate: new Date('2024-11-01'),
          harvestDate: new Date('2025-04-01'),
          cropPhoto: '',
          notes: 'Solo corrigido com calcário.',
          active: true,
        },
      ],
      loading: false,
      error: null,
    });
  });

  it('adiciona uma nova cultura', () => {
    useCropStore.getState().addCrop({
      farmId: 'farm-003',
      type: 'SOJA',
      harvestYear: '2026',
      plantedArea: 70,
      expectedYield: 4.1,
      plantingDate: new Date('2025-09-01'),
      harvestDate: new Date('2026-02-01'),
      cropPhoto: '',
      notes: 'Teste de safra.',
      active: true,
    });
    const found = useCropStore.getState().crops.find((c) => c.farmId === 'farm-003');
    expect(found).toBeDefined();
    expect(found!.plantedArea).toBe(70);
  });

  it('atualiza uma cultura existente', () => {
    useCropStore.getState().updateCrop('crop-001', { notes: 'Atualizado!' });
    const updated = useCropStore.getState().crops.find((c) => c.id === 'crop-001');
    expect(updated!.notes).toBe('Atualizado!');
  });

  it('marca cultura como inativa ao remover', () => {
    useCropStore.getState().deleteCrop('crop-002');
    const removed = useCropStore.getState().crops.find((c) => c.id === 'crop-002');
    expect(removed!.active).toBe(false);
  });

  it('busca cultura pelo id', () => {
    const crop = useCropStore.getState().getCropById('crop-001');
    expect(crop!.type).toBe('SOJA');
  });

  it('valida área plantada usando função externa', () => {
    const valid = useCropStore.getState().validatePlantedArea(100, 120);
    expect(valid).toBe(true);
  });

  it('pesquisa culturas por termo', () => {
    const result = useCropStore.getState().searchCrops('milho');
    expect(result.length).toBe(1);
    expect(result[0].type).toBe('MILHO');
  });

  it('retorna culturas por fazenda', () => {
    const crops = useCropStore.getState().getCropsByFarm('farm-001');
    expect(crops.length).toBe(1);
    expect(crops[0].type).toBe('SOJA');
  });

  it('retorna culturas por tipo', () => {
    const crops = useCropStore.getState().getCropsByType('MILHO');
    expect(crops.length).toBe(1);
    expect(crops[0].type).toBe('MILHO');
  });

  it('retorna culturas por ano', () => {
    const crops = useCropStore.getState().getCropsByYear('2025');
    expect(crops.length).toBe(2);
  });

  it('retorna apenas culturas ativas', () => {
    useCropStore.getState().deleteCrop('crop-002');
    const ativos = useCropStore.getState().getActiveCrops();
    expect(ativos.length).toBe(1);
    expect(ativos[0].active).toBe(true);
  });

  it('seta e reseta loading', () => {
    useCropStore.getState().setLoading(true);
    expect(useCropStore.getState().loading).toBe(true);
    useCropStore.getState().setLoading(false);
    expect(useCropStore.getState().loading).toBe(false);
  });

  it('seta e limpa erro', () => {
    useCropStore.getState().setError('Falha');
    expect(useCropStore.getState().error).toBe('Falha');
    useCropStore.getState().setError(null);
    expect(useCropStore.getState().error).toBeNull();
  });

  it('conta total de culturas ativas', () => {
    useCropStore.getState().deleteCrop('crop-002');
    const total = useCropStore.getState().getTotalCrops();
    expect(total).toBe(1);
  });

  it('retorna stats corretas', () => {
    useCropStore.getState().deleteCrop('crop-002');
    const stats = useCropStore.getState().getCropStats();
    expect(stats.total).toBe(1);
    expect(stats.totalPlantedArea).toBe(50);
    expect(stats.byType.SOJA).toBe(1);
  });

  it('retorna distribuição de tipos', () => {
    const result = useCropStore.getState().getCropsByTypeDistribution();
    const soja = result.find((r) => r.type === 'SOJA');
    expect(soja).toBeDefined();
    expect(soja!.count).toBe(1);
  });
});
