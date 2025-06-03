import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useProducerStore } from './index';

vi.mock('@mocks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    mockProducers: [
      {
        id: 'prod-001',
        document: '12345678901',
        documentType: 'CPF',
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        phone: '(11) 98765-4321',
        profilePhoto: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        active: true,
        farmsIds: ['farm-001'],
      },
      // ...adicione outros produtores fake se quiser
    ],
    mockFarms: actual.mockFarms ?? [],
    mockCrops: actual.mockCrops ?? [],
    // ...adicione outros mocks específicos que você quiser sobrescrever
  };
});

describe('useProducerStore', () => {
  beforeEach(() => {
    // Limpa estado antes de cada teste
    useProducerStore.setState({
      producers: [
        {
          id: '1',
          name: 'José',
          document: '111',
          documentType: 'CPF',
          email: 'jose@email.com',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Maria',
          document: '222',
          documentType: 'CNPJ',
          email: 'maria@email.com',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      loading: false,
      error: null,
    });
  });

  it('adiciona um novo produtor', () => {
    useProducerStore.getState().addProducer({
      name: 'Carlos',
      document: '333',
      documentType: 'CPF',
      email: 'carlos@email.com',
    });
    const found = useProducerStore.getState().producers.find((p) => p.name === 'Carlos');
    expect(found).toBeDefined();
    expect(found!.active).toBe(true);
    expect(found!.document).toBe('333');
  });

  it('atualiza um produtor existente', () => {
    useProducerStore.getState().updateProducer('1', { name: 'José Atualizado' });
    const updated = useProducerStore.getState().producers.find((p) => p.id === '1');
    expect(updated!.name).toBe('José Atualizado');
  });

  it('marca produtor como inativo ao remover', () => {
    useProducerStore.getState().deleteProducer('2');
    const removed = useProducerStore.getState().producers.find((p) => p.id === '2');
    expect(removed!.active).toBe(false);
  });

  it('busca produtor pelo id', () => {
    const jose = useProducerStore.getState().getProducerById('1');
    expect(jose!.name).toBe('José');
  });

  it('pesquisa produtores por termo', () => {
    const result = useProducerStore.getState().searchProducers('Maria');
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('Maria');
  });

  it('retorna produtores por tipo de documento', () => {
    const cpfs = useProducerStore.getState().getProducersByDocumentType('CPF');
    expect(cpfs.length).toBeGreaterThanOrEqual(1);
    expect(cpfs[0].documentType).toBe('CPF');
  });

  it('retorna apenas produtores ativos', () => {
    useProducerStore.getState().deleteProducer('2');
    const ativos = useProducerStore.getState().getActiveProducers();
    expect(ativos.length).toBe(1);
    expect(ativos[0].active).toBe(true);
  });

  it('seta e reseta loading', () => {
    useProducerStore.getState().setLoading(true);
    expect(useProducerStore.getState().loading).toBe(true);
    useProducerStore.getState().setLoading(false);
    expect(useProducerStore.getState().loading).toBe(false);
  });

  it('seta e limpa erro', () => {
    useProducerStore.getState().setError('Falha');
    expect(useProducerStore.getState().error).toBe('Falha');
    useProducerStore.getState().setError(null);
    expect(useProducerStore.getState().error).toBeNull();
  });

  it('conta total de produtores ativos', () => {
    useProducerStore.getState().deleteProducer('1');
    const total = useProducerStore.getState().getTotalProducers();
    expect(total).toBe(1);
  });

  it('retorna stats corretas', () => {
    useProducerStore.getState().deleteProducer('2');
    const stats = useProducerStore.getState().getProducerStats();
    expect(stats.total).toBe(1);
    expect(stats.cpf).toBe(1);
    expect(stats.cnpj).toBe(0);
  });
});
