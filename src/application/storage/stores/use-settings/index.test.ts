import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useSettingsStore } from './index';

// Mock entidades e enums só pro import não quebrar
vi.mock('@entities', () => ({
  AppSettings: {},
  AppStats: {},
}));
vi.mock('@enums', () => ({
  BackupType: { COMPLETE: 'COMPLETE', SETTINGS: 'SETTINGS' },
}));
vi.mock('@mocks', () => ({
  getDefaultSettings: () => ({
    theme: 'light',
    compactMode: false,
    animations: true,
    autoSave: true,
    notifications: false,
    language: 'pt-BR',
  }),
  getDefaultStats: () => ({
    totalSessions: 0,
    totalTimeSpent: 0,
    averageSessionTime: 0,
    lastAccess: new Date(),
    activeSettings: 0,
    sessionsThisWeek: 0,
  }),
  mockSettings: {
    theme: 'light',
    compactMode: false,
    animations: true,
    autoSave: true,
    notifications: false,
    language: 'pt-BR',
  },
  mockStats: {
    totalSessions: 0,
    totalTimeSpent: 0,
    averageSessionTime: 0,
    lastAccess: new Date(),
    activeSettings: 0,
    sessionsThisWeek: 0,
  },
}));

describe('useSettingsStore', () => {
  beforeEach(() => {
    // Limpa localStorage e zera store
    localStorage.clear?.();
    useSettingsStore.setState({
      settings: {
        theme: 'light',
        compactMode: false,
        animations: true,
        autoSave: true,
        notifications: false,
        language: 'pt-BR',
      },
      stats: {
        totalSessions: 0,
        totalTimeSpent: 0,
        averageSessionTime: 0,
        lastAccess: new Date(),
        activeSettings: 0,
        sessionsThisWeek: 0,
      },
      isLoading: false,
      error: null,
      sessionStartTime: null,
      isFirstLoad: true,
    });
  });

  it('inicializa e atualiza um setting', () => {
    useSettingsStore.getState().updateSetting('theme', 'dark');
    expect(useSettingsStore.getState().settings.theme).toBe('dark');
  });

  it('faz toggle em setting booleano', () => {
    useSettingsStore.getState().toggleBooleanSetting('compactMode');
    expect(useSettingsStore.getState().settings.compactMode).toBe(true);
    useSettingsStore.getState().toggleBooleanSetting('compactMode');
    expect(useSettingsStore.getState().settings.compactMode).toBe(false);
  });

  it('switchTheme alterna entre light/dark', () => {
    useSettingsStore.getState().switchTheme();
    expect(useSettingsStore.getState().settings.theme).toBe('dark');
    useSettingsStore.getState().switchTheme();
    expect(useSettingsStore.getState().settings.theme).toBe('light');
  });

  it('atualiza várias configs ao mesmo tempo', () => {
    useSettingsStore.getState().updateAllSettings({ compactMode: true, language: 'en-US' });
    expect(useSettingsStore.getState().settings.compactMode).toBe(true);
    expect(useSettingsStore.getState().settings.language).toBe('en-US');
  });

  it('incrementa sessões e atualiza stats', () => {
    useSettingsStore.getState().incrementSession();
    expect(useSettingsStore.getState().stats.totalSessions).toBe(1);
  });

  it('startSession e endSession calculam tempo', () => {
    useSettingsStore.getState().startSession();
    const before = useSettingsStore.getState().stats.totalSessions;
    // simula uma sessão de 2 minutos
    useSettingsStore.setState({ sessionStartTime: new Date(Date.now() - 2 * 60 * 1000) });
    useSettingsStore.getState().endSession();
    expect(useSettingsStore.getState().stats.totalSessions).toBeGreaterThanOrEqual(before);
    expect(useSettingsStore.getState().sessionStartTime).toBeNull();
    expect(useSettingsStore.getState().stats.totalTimeSpent).toBeGreaterThanOrEqual(2);
  });

  it('resetStats reseta estatísticas', () => {
    useSettingsStore.getState().incrementSession();
    useSettingsStore.getState().resetStats();
    expect(useSettingsStore.getState().stats.totalSessions).toBe(0);
  });

  it('resetToDefaults volta para o mockSettings', () => {
    useSettingsStore.getState().updateSetting('theme', 'dark');
    useSettingsStore.getState().resetToDefaults();
    expect(useSettingsStore.getState().settings.theme).toBe('light');
  });

  it('clearAllData limpa tudo e reseta', () => {
    useSettingsStore.getState().updateSetting('theme', 'dark');
    useSettingsStore.getState().clearAllData();
    expect(useSettingsStore.getState().settings.theme).toBe('light');
  });

  it('seta e limpa erro', () => {
    useSettingsStore.getState().setError('deu ruim');
    expect(useSettingsStore.getState().error).toBe('deu ruim');
    useSettingsStore.getState().clearError();
    expect(useSettingsStore.getState().error).toBeNull();
  });

  it('getExportData retorna dados completos', () => {
    const data = useSettingsStore.getState().getExportData('COMPLETE');
    expect(data).toHaveProperty('settings');
    expect(data).toHaveProperty('stats');
    expect(data).toHaveProperty('dashboardData');
  });
});
