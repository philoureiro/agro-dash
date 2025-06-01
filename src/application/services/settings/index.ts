import { AppSettings, AppStats } from '@entities';
import { BackupType } from '@enums';
import { useSettingsStore } from '@storage';

// 🔥 SERVIÇO DE CONFIGURAÇÕES
export class SettingsService {
  // ============= CONFIGURAÇÕES =============
  static updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    const store = useSettingsStore.getState();
    store.updateSetting(key, value);

    // Aplica mudanças CSS se necessário
    this.applyCSSChanges(store.settings);
  }

  static toggleBooleanSetting(
    key: keyof Pick<AppSettings, 'compactMode' | 'animations' | 'autoSave' | 'notifications'>,
  ): void {
    const store = useSettingsStore.getState();
    store.toggleBooleanSetting(key);

    // Aplica mudanças CSS
    this.applyCSSChanges(store.settings);
  }

  static switchTheme(): void {
    const store = useSettingsStore.getState();
    store.switchTheme();

    // Aplica mudança de tema
    this.applyCSSChanges(store.settings);
  }

  // ============= BACKUP E EXPORT =============
  static async exportBackup(type: BackupType): Promise<void> {
    try {
      const store = useSettingsStore.getState();
      const exportData = store.getExportData(type);

      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = this.generateFileName(type);
      link.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar backup:', error);
      throw new Error('Falha ao criar backup');
    }
  }

  static async importBackup(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);

          if (!data.settings || !data.timestamp) {
            throw new Error('Arquivo de backup inválido');
          }

          const store = useSettingsStore.getState();
          store.importData(data);

          // Aplica configurações importadas
          this.applyCSSChanges(store.settings);

          resolve();
        } catch {
          reject(new Error('Arquivo de backup inválido'));
        }
      };

      reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
      reader.readAsText(file);
    });
  }

  // ============= RESET =============
  static async resetAllData(): Promise<void> {
    try {
      const store = useSettingsStore.getState();
      store.clearAllData();

      // Remove estilos CSS customizados
      this.resetCSSChanges();
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      throw new Error('Falha ao resetar dados');
    }
  }

  // ============= ESTATÍSTICAS =============
  static startSession(): void {
    const store = useSettingsStore.getState();
    store.startSession();
  }

  static endSession(): void {
    const store = useSettingsStore.getState();
    store.endSession();
  }

  static incrementSession(): void {
    const store = useSettingsStore.getState();
    store.incrementSession();
  }

  // ============= VALIDAÇÕES =============
  static validateSettings(settings: Partial<AppSettings>): boolean {
    try {
      // Validações básicas
      if (settings.theme && !['light', 'dark'].includes(settings.theme)) {
        return false;
      }

      if (settings.language && !['pt-BR', 'en-US'].includes(settings.language)) {
        return false;
      }

      if (settings.currency && !['BRL', 'USD'].includes(settings.currency)) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro na validação:', error);
      return false;
    }
  }

  static validateBackupFile(data: unknown): boolean {
    try {
      if (
        typeof data === 'object' &&
        data !== null &&
        'settings' in data &&
        'timestamp' in data &&
        'version' in data &&
        typeof (data as { settings: unknown }).settings === 'object'
      ) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  // ============= HELPERS PRIVADOS =============
  private static applyCSSChanges(settings: AppSettings): void {
    try {
      // Aplica animações globais
      document.documentElement.style.setProperty(
        '--animations-enabled',
        settings.animations ? '1' : '0',
      );

      // Aplica modo compacto
      document.documentElement.classList.toggle('compact-mode', settings.compactMode);

      // Aplica tema (se necessário integrar com outro sistema de tema)
      document.documentElement.setAttribute('data-theme', settings.theme);
    } catch (error) {
      console.error('Erro ao aplicar mudanças CSS:', error);
    }
  }

  private static resetCSSChanges(): void {
    try {
      // Remove classes e propriedades customizadas
      document.documentElement.classList.remove('compact-mode');
      document.documentElement.style.removeProperty('--animations-enabled');
      document.documentElement.removeAttribute('data-theme');
    } catch (error) {
      console.error('Erro ao resetar CSS:', error);
    }
  }

  private static generateFileName(type: BackupType): string {
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5).replace(':', '');
    const typeName = type === BackupType.COMPLETE ? 'completo' : 'configuracoes';

    return `agrodash-${typeName}-${date}-${time}.json`;
  }

  // ============= UTILITÁRIOS PÚBLICOS =============
  static getCurrentSettings(): AppSettings {
    return useSettingsStore.getState().settings;
  }

  static getCurrentStats(): AppStats {
    return useSettingsStore.getState().stats;
  }

  static isLoading(): boolean {
    return useSettingsStore.getState().isLoading;
  }

  static getError(): string | null {
    return useSettingsStore.getState().error;
  }

  static formatTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  }

  static formatDate(date: Date): string {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
