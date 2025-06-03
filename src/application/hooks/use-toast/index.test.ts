import { useToastStore } from '@storage';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useToast, useToastConfig } from './index';

vi.mock('@storage', () => {
  const addToast = vi.fn();
  const removeToast = vi.fn();
  const clearAll = vi.fn();
  const updateConfig = vi.fn();
  return {
    useToastStore: vi.fn(() => ({
      addToast,
      removeToast,
      clearAll,
      updateConfig,
      config: { position: 'top-right' },
    })),
  };
});

describe('useToast', () => {
  let toast: ReturnType<typeof useToast>['toast'];
  let updateConfig: ReturnType<typeof useToast>['updateConfig'];
  let store: ReturnType<typeof useToastStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = useToastStore();
    ({ toast, updateConfig } = useToast());
  });

  it('should call clearAll when toast.clear is called', () => {
    toast.clear();
    expect(store.clearAll).toHaveBeenCalled();
  });

  it('should call addToast with type success', () => {
    toast.success('Success', 'Message');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Success', message: 'Message' }),
    );
  });

  it('should call addToast with type error', () => {
    toast.error('Error', 'Message');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', title: 'Error', message: 'Message' }),
    );
  });

  it('should call addToast with type warning', () => {
    toast.warning('Warning', 'Message');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'warning', title: 'Warning', message: 'Message' }),
    );
  });

  it('should call addToast with type info', () => {
    toast.info('Info', 'Message');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', title: 'Info', message: 'Message' }),
    );
  });

  it('should call addToast with custom options', () => {
    const options = { type: 'custom', title: 'Custom', message: 'Custom message' };
    toast.custom(options as any);
    expect(store.addToast).toHaveBeenCalledWith(options);
  });

  it('should call removeToast when toast.remove is called', () => {
    toast.remove('id');
    expect(store.removeToast).toHaveBeenCalledWith('id');
  });

  it('should call updateConfig', () => {
    updateConfig({ position: 'bottom-left' });
    expect(store.updateConfig).toHaveBeenCalledWith({ position: 'bottom-left' });
  });

  it('toast.promise resolves and shows success toast', async () => {
    const promise = Promise.resolve('data');
    (store.addToast as any).mockReturnValue('loading-id');
    await expect(
      toast.promise(promise, { loading: 'Loading', success: 'Done', error: 'Failed' }),
    ).resolves.toBe('data');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', title: 'Loading' }),
    );
    expect(store.removeToast).toHaveBeenCalledWith('loading-id');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'success', title: 'Done' }),
    );
  });

  it('toast.promise rejects and shows error toast', async () => {
    const promise = Promise.reject(new Error('fail'));
    (store.addToast as any).mockReturnValue('loading-id');
    await expect(
      toast.promise(promise, { loading: 'Loading', success: 'Done', error: 'Failed' }),
    ).rejects.toThrow('fail');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'info', title: 'Loading' }),
    );
    expect(store.removeToast).toHaveBeenCalledWith('loading-id');
    expect(store.addToast).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'error', title: 'Failed' }),
    );
  });
});

describe('useToastConfig', () => {
  it('should return config and updateConfig', () => {
    const { config, updateConfig } = useToastConfig();
    expect(config).toEqual({ position: 'top-right' });
    expect(typeof updateConfig).toBe('function');
  });
});

// We recommend installing an extension to run vitest tests.
