import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { beforeAll } from 'vitest';

import { useAutoFill } from './index';

beforeAll(() => {
  // Nada, só força o vitest a avaliar o ambiente antes de rodar o hook
});

// MOCK de dados do brazilianData
vi.mock('./mocks', () => ({
  brazilianData: {
    names: ['Maria Silva', 'João Souza'],
    cities: ['Londrina', 'Curitiba'],
    states: ['PR', 'SP'],
    farmNames: ['Fazenda Esperança'],
    producerImages: ['https://img.com/produtor.png'],
    farmImages: ['https://img.com/fazenda.png'],
    cropImages: { SOJA: ['https://img.com/soja.png'] },
    observations: ['Ótima fazenda'],
    companies: ['AgroTech'],
  },
}));

describe('useAutoFill', () => {
  it('preenche campos básicos do schema', () => {
    const schema = {
      name: { type: 'text' },
      cpf: { type: 'cpf' },
      city: { type: 'text' },
      totalArea: { type: 'number', min: 100, max: 200 },
      agriculturalArea: { type: 'number' },
      vegetationArea: { type: 'number' },
    };

    const updates: Record<string, any> = {};

    const { result } = renderHook(() => useAutoFill());

    act(() => {
      result.current.autoFill(
        schema,
        (path, value) => {
          updates[path] = value;
        },
        {
          currentData: {}, // Tudo vazio, tudo deve ser preenchido
          fillOnlyEmpty: true,
        },
      );
    });

    // Testa se os campos foram preenchidos
    expect(updates.name).toBeDefined();
    expect(updates.cpf).toHaveLength(11); // CPF gerado tem 11 dígitos
    expect(updates.city).toBeDefined();
    expect(typeof updates.totalArea).toBe('number');
    expect(typeof updates.agriculturalArea).toBe('number');
    expect(typeof updates.vegetationArea).toBe('number');
    // Soma das áreas nunca pode passar do totalArea
    expect(updates.agriculturalArea + updates.vegetationArea).toBeLessThanOrEqual(
      updates.totalArea,
    );
  });
});
