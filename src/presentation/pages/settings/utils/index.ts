import { toast } from '@components';
import { Crop, Farm, Producer } from '@entities';
import { clearAllData } from '@storage';

// 📤 BACKUP COMPLETO DOS DADOS (FAZENDAS/PRODUTORES/CULTURAS)
export const handleExportData = async (
  setIsExporting: (value: boolean) => void,
  getAllData: () => {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
  },
  setError: (error: string) => void,
) => {
  try {
    setIsExporting(true);

    const allData = getAllData();

    const exportData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      type: 'complete-data',
      data: {
        producers: allData.producers,
        farms: allData.farms,
        crops: allData.crops,
        // Outros dados do sistema
        dashboardCache: localStorage.getItem('agrodash-dashboard-cache'),
        userPreferences: localStorage.getItem('agrodash-user-preferences'),
      },
      stats: {
        totalProducers: allData.producers.length,
        totalFarms: allData.farms.length,
        totalCrops: allData.crops.length,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `agrodash-dados-completos-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    toast.success('Sucesso!', ' Backup completo dos dados exportado com sucesso!');
  } catch (error) {
    console.error('Erro no export:', error);
    setError('Erro ao exportar dados completos');
  } finally {
    setIsExporting(false);
  }
};

// ⚙️ BACKUP APENAS DAS CONFIGURAÇÕES
export const handleExportSettings = async (
  setIsExporting: (value: boolean) => void,
  isDark: boolean,
  compactMode: boolean,
  animations: boolean,
  autoSave: boolean,
  notifications: boolean,
  totalSessions: number,
  totalTimeSpent: number,
  activeSettings: number,
  lastAccess: string,
  setError: (error: string) => void,
) => {
  try {
    setIsExporting(true);

    const exportData = {
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      type: 'settings-only',
      settings: {
        theme: isDark ? 'dark' : 'light',
        compactMode,
        animations,
        autoSave,
        notifications,
      },
      stats: {
        totalSessions,
        totalTimeSpent,
        activeSettings,
        lastAccess,
      },
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `agrodash-configuracoes-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);

    toast.success('Sucesso!', ' Configurações exportadas com sucesso!');
  } catch (error) {
    console.error('Erro no export:', error);
    setError('Erro ao exportar configurações');
  } finally {
    setIsExporting(false);
  }
};

// 🔄 RESET COMPLETO DO SISTEMA (TUDO)
export const handleResetSystem = async (
  setIsResetting: (value: boolean) => void,
  setShowResetSystemModal: (value: boolean) => void,
  setAutoSave: (value: boolean) => void,
  setNotifications: (value: boolean) => void,
  setError: (error: string) => void,
) => {
  setIsResetting(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Limpa TUDO
    localStorage.clear();
    clearAllData();

    // Reseta configurações visuais

    setAutoSave(true);
    setNotifications(true);

    setIsResetting(false);
    setShowResetSystemModal(false);
    toast.success('Sucesso!', ' Sistema completamente restaurado!');

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error('Erro ao resetar sistema:', error);
    setError('Erro ao restaurar sistema');
    setIsResetting(false);
  }
};

// 📊 RESET APENAS DOS DADOS (FAZENDAS/PRODUTORES/CULTURAS)
export const handleResetData = async (
  setIsResetting: (value: boolean) => void,
  setShowResetDataModal: (value: boolean) => void,
  setError: (error: string) => void,
) => {
  setIsResetting(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Limpa apenas dados do negócio
    clearAllData();

    // Remove dados específicos do localStorage
    const dataKeys = [
      'agro-dash-producers',
      'agro-dash-farms',
      'agro-dash-crops',
      'agro-dash-app',
      'agrodash-dashboard-cache',
      'agrodash-user-preferences',
    ];

    dataKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    setIsResetting(false);
    setShowResetDataModal(false);

    toast.success('Sucesso!', ' Dados do sistema removidos!');
    window.location.reload();
  } catch (error) {
    console.error('Erro ao resetar dados:', error);
    setError('Erro ao restaurar dados');
    setIsResetting(false);
  }
};

// ⚙️ RESET APENAS DAS CONFIGURAÇÕES
export const handleResetConfig = async (
  setIsResetting: (value: boolean) => void,
  setShowResetConfigModal: (value: boolean) => void,
  setCompactMode: (value: boolean) => void,
  setAnimations: (value: boolean) => void,
  setAutoSave: (value: boolean) => void,
  setNotifications: (value: boolean) => void,
  setError: (error: string) => void,
) => {
  setIsResetting(true);

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Remove apenas configurações
    const configKeys = [
      'agrodash-compact-mode',
      'agrodash-animations',
      'agrodash-auto-save',
      'agrodash-notifications',
      'agro-dash-app',
      'theme-mode',
    ];

    configKeys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Reseta configurações visuais
    setCompactMode(false);
    setAnimations(true);
    setAutoSave(true);
    setNotifications(true);

    // Remove classes CSS
    document.documentElement.classList.remove('compact-mode');
    document.documentElement.style.setProperty('--animations-enabled', '1');

    setIsResetting(false);
    setShowResetConfigModal(false);

    toast.success('Sucesso!', ' Configurações restauradas!');
  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    setError('Erro ao restaurar configurações');
    setIsResetting(false);
  }
};
