import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useToastStore } from './index';

// Mock tipagem de Toast
vi.mock('@components', () => ({
  // Tipos fakes para os testes
  ToastConfig: {},
  ToastData: {},
  ToastOptions: {},
}));

describe('useToastStore', () => {
  beforeEach(() => {
    // Limpa a store antes de cada teste!
    useToastStore.setState({ toasts: [], config: useToastStore.getState().config });
  });

  it('adiciona um toast', () => {
    const id = useToastStore.getState().addToast({ message: 'Oi' });
    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(1);
    expect(toasts[0].id).toBe(id);
    expect(toasts[0].message).toBe('Oi');
  });

  it('remove um toast pelo id', () => {
    const id = useToastStore.getState().addToast({ message: 'Para remover' });
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it('limpa todos os toasts', () => {
    useToastStore.getState().addToast({ message: 'Um' });
    useToastStore.getState().addToast({ message: 'Dois' });
    useToastStore.getState().clearAll();
    expect(useToastStore.getState().toasts.length).toBe(0);
  });

  it('atualiza a config', () => {
    useToastStore.getState().updateConfig({ position: 'bottom-left', maxToasts: 2 });
    const { position, maxToasts } = useToastStore.getState().config;
    expect(position).toBe('bottom-left');
    expect(maxToasts).toBe(2);
  });

  it('limita o número máximo de toasts', () => {
    useToastStore.getState().updateConfig({ maxToasts: 2 });
    useToastStore.getState().addToast({ message: 'Um' });
    useToastStore.getState().addToast({ message: 'Dois' });
    useToastStore.getState().addToast({ message: 'Três' });
    const toasts = useToastStore.getState().toasts;
    expect(toasts.length).toBe(2);
    // Toasts novos vêm primeiro
    expect(toasts[0].message).toBe('Três');
    expect(toasts[1].message).toBe('Dois');
  });

  it('remove automaticamente após a duração', async () => {
    vi.useFakeTimers();
    const id = useToastStore.getState().addToast({ message: 'Temp', duration: 1000 });
    expect(useToastStore.getState().toasts.length).toBe(1);
    // Avança o tempo fake
    vi.advanceTimersByTime(1001);
    // Aguarda o próximo tick do event loop
    await Promise.resolve();
    expect(useToastStore.getState().toasts.length).toBe(0);
    vi.useRealTimers();
  });
});
