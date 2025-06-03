import { beforeEach, describe, expect, it, vi } from 'vitest';

import { clearAllData, exportData, importData, isFirstTime, storeConfigs } from './index';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
    _store: store,
  };
})();

Object.defineProperty(globalThis, 'localStorage', {
  value: localStorageMock,
  configurable: true,
});

beforeEach(() => {
  localStorageMock.clear();
  vi.clearAllMocks();
});

describe('storeConfigs', () => {
  it('should have correct store names', () => {
    expect(storeConfigs.producers.name).toBe('agro-dash-producers');
    expect(storeConfigs.farms.name).toBe('agro-dash-farms');
    expect(storeConfigs.crops.name).toBe('agro-dash-crops');
    expect(storeConfigs.dashboard.name).toBe('agro-dash-dashboard');
    expect(storeConfigs.settings.name).toBe('agro-dash-settings');
  });

  it('should partialize producer state correctly', () => {
    const state = {
      producers: [{ id: 1 }],
      loading: true,
      error: 'err',
    } as any;
    expect(storeConfigs.producers.partialize(state)).toEqual({
      producers: [{ id: 1 }],
      loading: false,
      error: null,
    });
  });

  it('should partialize farms, crops, dashboard, and settings state', () => {
    const farmState = { farms: [1], loading: true, error: 'err' } as any;
    expect(storeConfigs.farms.partialize(farmState)).toEqual({
      farms: [1],
      loading: false,
      error: null,
    });

    const cropState = { crops: [2], loading: true, error: 'err' } as any;
    expect(storeConfigs.crops.partialize(cropState)).toEqual({
      crops: [2],
      loading: false,
      error: null,
    });

    const dashboardState = {
      metrics: { a: 1 },
      chartData: { b: 2 },
      filters: { c: 3 },
      loading: true,
      error: 'err',
    } as any;
    expect(storeConfigs.dashboard.partialize(dashboardState)).toEqual({
      metrics: { a: 1 },
      chartData: { b: 2 },
      filters: { c: 3 },
    });

    const settingsState = {
      theme: 'dark',
      language: 'pt-BR',
      currency: 'BRL',
    };
    expect(storeConfigs.settings.partialize(settingsState)).toEqual({
      theme: 'dark',
      language: 'pt-BR',
      currency: 'BRL',
    });
  });
});

describe('isFirstTime', () => {
  it('should return true if no producers data', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);
    expect(isFirstTime()).toBe(true);
  });

  it('should return false if producers data exists', () => {
    localStorageMock.getItem.mockReturnValueOnce('some-data');
    expect(isFirstTime()).toBe(false);
  });
});

describe('clearAllData', () => {
  it('should remove all store keys from localStorage', () => {
    Object.values(storeConfigs).forEach((config) => {
      localStorage.setItem(config.name, 'test');
    });
    clearAllData();
    Object.values(storeConfigs).forEach((config) => {
      expect(localStorage.getItem(config.name)).toBeNull();
    });
  });
});

describe('exportData', () => {
  it('should export all store data as JSON string', () => {
    localStorage.setItem('agro-dash-producers', JSON.stringify({ foo: 1 }));
    localStorage.setItem('agro-dash-farms', JSON.stringify({ bar: 2 }));
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed['agro-dash-producers']).toEqual({ foo: 1 });
    expect(parsed['agro-dash-farms']).toEqual({ bar: 2 });
  });

  it('should skip keys with null values', () => {
    localStorage.setItem('agro-dash-producers', JSON.stringify({ foo: 1 }));
    // No value for 'agro-dash-crops'
    const exported = exportData();
    const parsed = JSON.parse(exported);
    expect(parsed['agro-dash-producers']).toEqual({ foo: 1 });
    expect(parsed['agro-dash-crops']).toBeUndefined();
  });
});

describe('importData', () => {
  it('should import data and set items in localStorage', () => {
    const data = {
      'agro-dash-producers': { foo: 1 },
      'agro-dash-farms': { bar: 2 },
    };
    const json = JSON.stringify(data);
    const result = importData(json);
    expect(result).toBe(true);
    expect(localStorage.getItem('agro-dash-producers')).toBe(JSON.stringify({ foo: 1 }));
    expect(localStorage.getItem('agro-dash-farms')).toBe(JSON.stringify({ bar: 2 }));
  });

  it('should return false and not throw on invalid JSON', () => {
    const result = importData('not-json');
    expect(result).toBe(false);
  });
});
