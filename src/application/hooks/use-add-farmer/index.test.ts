import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useAddFarmer } from './index';

// Mocks dos módulos externos
vi.mock('@enums', () => ({
  DocumentType: { CPF: 'CPF', CNPJ: 'CNPJ' },
}));

vi.mock('@hooks', () => ({
  useToast: () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
  }),
}));

vi.mock('@validations', () => ({
  validateDocument: vi.fn(() => true),
  validatePhone: vi.fn(() => true),
}));

describe('useAddFarmer', () => {
  beforeEach(() => {
    // Limpa rascunho entre os testes
    localStorage.clear?.();
  });

  it('deve adicionar uma fazenda', () => {
    const { result } = renderHook(() => useAddFarmer());

    act(() => {
      result.current.addFarm();
    });

    expect(result.current.form.farms.length).toBe(1);
    expect(result.current.form.farms[0].name).toBe('');
  });

  it('deve atualizar o produtor', () => {
    const { result } = renderHook(() => useAddFarmer());

    act(() => {
      result.current.updateProducer({ name: 'João Produtor', document: '12345678900' });
    });

    expect(result.current.form.producer.name).toBe('João Produtor');
    expect(result.current.form.producer.document).toBe('12345678900');
  });

  it('deve adicionar cultura a uma fazenda', () => {
    const { result } = renderHook(() => useAddFarmer());

    act(() => {
      result.current.addFarm();
    });
    const farmId = result.current.form.farms[0].tempId;

    act(() => {
      result.current.addCrop(farmId);
    });

    expect(result.current.form.crops[farmId]).toHaveLength(1);
  });

  it('deve remover uma fazenda', () => {
    const { result } = renderHook(() => useAddFarmer());

    act(() => {
      result.current.addFarm();
    });
    const farmId = result.current.form.farms[0].tempId;

    act(() => {
      result.current.removeFarm(farmId);
    });

    expect(result.current.form.farms.length).toBe(0);
    expect(result.current.form.crops[farmId]).toBeUndefined();
  });
});
