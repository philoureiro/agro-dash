import React, { useEffect, useState } from 'react';

import { useAppStore } from '@storage';
import { useThemeMode } from '@theme';

import {
  ActionButton,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
  Modal,
  ModalActions,
  ModalContent,
  ModalText,
  ModalTitle,
  OptionInfo,
  OptionLabel,
  OptionSubtext,
  SettingOption,
  SettingsCard,
  SettingsContainer,
  SettingsGrid,
  SettingsHeader,
  SettingsSubtitle,
  SettingsTitle,
  StatItem,
  StatLabel,
  StatValue,
  StatsSection,
  ToggleSwitch,
} from './styles';

// 📊 COMPONENTE PRINCIPAL
export const Settings: React.FC = () => {
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();
  const isDark = themeMode === 'dark';

  // 🎯 HOOKS DO APP STORE
  const { getAllData, clearAllData } = useAppStore();

  // 🎯 ESTADOS LOCAIS
  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem('agrodash-compact-mode') === 'true';
  });

  const [animations, setAnimations] = useState(() => {
    return localStorage.getItem('agrodash-animations') !== 'false';
  });

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem('agrodash-auto-save') !== 'false';
  });

  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('agrodash-notifications') !== 'false';
  });

  // Estados de controle
  const [showResetSystemModal, setShowResetSystemModal] = useState(false);
  const [showResetDataModal, setShowResetDataModal] = useState(false);
  const [showResetConfigModal, setShowResetConfigModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Stats mock
  const [totalSessions] = useState(47);
  const [totalTimeSpent] = useState('2h 34m');
  const [activeSettings, setActiveSettings] = useState(3);
  const [lastAccess] = useState('Hoje, 15:42');

  // 📊 CALCULA CONFIGURAÇÕES ATIVAS
  useEffect(() => {
    const count = [
      isDark ? 1 : 0,
      compactMode ? 1 : 0,
      animations ? 1 : 0,
      autoSave ? 1 : 0,
      notifications ? 1 : 0,
    ].reduce((sum, val) => sum + val, 0);

    setActiveSettings(count);
  }, [isDark, compactMode, animations, autoSave, notifications]);

  // 🎨 APLICA MUDANÇAS CSS
  useEffect(() => {
    // Animações globais
    document.documentElement.style.setProperty('--animations-enabled', animations ? '1' : '0');

    // Salva no localStorage
    localStorage.setItem('agrodash-animations', animations.toString());
  }, [animations]);

  // 🎯 APLICA MODO COMPACTO
  useEffect(() => {
    document.documentElement.classList.toggle('compact-mode', compactMode);
    localStorage.setItem('agrodash-compact-mode', compactMode.toString());
  }, [compactMode]);

  // 💾 SALVA OUTRAS CONFIGURAÇÕES
  useEffect(() => {
    localStorage.setItem('agrodash-auto-save', autoSave.toString());
  }, [autoSave]);

  useEffect(() => {
    localStorage.setItem('agrodash-notifications', notifications.toString());
  }, [notifications]);

  // 🎨 HANDLERS DE TOGGLE
  const handleThemeToggle = () => {
    toggleThemeMode();
  };

  const handleAutoSaveToggle = () => {
    setAutoSave((prev) => !prev);
  };

  const handleNotificationsToggle = () => {
    setNotifications((prev) => !prev);
  };

  // 📤 BACKUP COMPLETO DOS DADOS (FAZENDAS/PRODUTORES/CULTURAS)
  const handleExportData = async () => {
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

      alert('✅ Backup completo dos dados exportado com sucesso!');
    } catch (error) {
      console.error('Erro no export:', error);
      setError('Erro ao exportar dados completos');
    } finally {
      setIsExporting(false);
    }
  };

  // ⚙️ BACKUP APENAS DAS CONFIGURAÇÕES
  const handleExportSettings = async () => {
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

      alert('✅ Configurações exportadas com sucesso!');
    } catch (error) {
      console.error('Erro no export:', error);
      setError('Erro ao exportar configurações');
    } finally {
      setIsExporting(false);
    }
  };

  // 🔄 RESET COMPLETO DO SISTEMA (TUDO)
  const handleResetSystem = async () => {
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

      alert('✅ Sistema completamente restaurado!\nTudo foi removido e resetado.');

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
  const handleResetData = async () => {
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

      alert('✅ Dados do sistema removidos!\nFazendas, produtores e culturas foram resetados.');
    } catch (error) {
      console.error('Erro ao resetar dados:', error);
      setError('Erro ao restaurar dados');
      setIsResetting(false);
    }
  };

  // ⚙️ RESET APENAS DAS CONFIGURAÇÕES
  const handleResetConfig = async () => {
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

      alert('✅ Configurações restauradas!\nTodas as preferências voltaram ao padrão.');
    } catch (error) {
      console.error('Erro ao resetar configurações:', error);
      setError('Erro ao restaurar configurações');
      setIsResetting(false);
    }
  };

  // 🚨 HANDLER DE ERRO
  const handleErrorDismiss = () => {
    setError(null);
  };

  return (
    <SettingsContainer isDark={isDark}>
      {/* ⚠️ ALERTA DE ERRO */}
      {error && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: '#ef4444',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span>❌ {error}</span>
          <button
            onClick={handleErrorDismiss}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 🏆 HEADER */}
      <SettingsHeader>
        <SettingsTitle isDark={isDark}>⚙️ Configurações</SettingsTitle>
        <SettingsSubtitle isDark={isDark}>
          Personalize sua experiência no AgroDash e gerencie suas preferências
        </SettingsSubtitle>
      </SettingsHeader>

      {/* 🎨 GRID DE CONFIGURAÇÕES */}
      <SettingsGrid>
        {/* 🎨 APARÊNCIA */}
        <SettingsCard isDark={isDark} delay={0}>
          <CardHeader>
            <CardIcon isDark={isDark}>🎨</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Aparência</CardTitle>
              <CardDescription isDark={isDark}>
                Customize a interface visual do sistema
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>{`Tema ${isDark ? 'Escuro' : 'Claro'}`}</OptionLabel>
              <OptionSubtext isDark={isDark}>
                {`Voltar para o modo ${isDark ? 'Claro' : 'Escuro'} para facilitar leitura`}
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch isActive={isDark} isDark={isDark} onClick={handleThemeToggle} />
          </SettingOption>
        </SettingsCard>

        {/* 🔔 SISTEMA */}
        <SettingsCard isDark={isDark} delay={100}>
          <CardHeader>
            <CardIcon isDark={isDark}>🔔</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Sistema</CardTitle>
              <CardDescription isDark={isDark}>
                Configurações de funcionamento e performance
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Salvamento Automático</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Salva alterações automaticamente conforme você trabalha
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch isActive={autoSave} isDark={isDark} onClick={handleAutoSaveToggle} />
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Notificações</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Receba alertas sobre atualizações importantes
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch
              isActive={notifications}
              isDark={isDark}
              onClick={handleNotificationsToggle}
            />
          </SettingOption>
        </SettingsCard>

        {/* 📊 ESTATÍSTICAS */}
        <SettingsCard isDark={isDark} delay={200}>
          <CardHeader>
            <CardIcon isDark={isDark}>📊</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Estatísticas de Uso</CardTitle>
              <CardDescription isDark={isDark}>Acompanhe seu uso do AgroDash</CardDescription>
            </div>
          </CardHeader>

          <StatsSection>
            <StatItem isDark={isDark} delay={100}>
              <StatValue isDark={isDark}>{totalSessions}</StatValue>
              <StatLabel isDark={isDark}>Sessões</StatLabel>
            </StatItem>

            <StatItem isDark={isDark} delay={200}>
              <StatValue isDark={isDark}>{totalTimeSpent}</StatValue>
              <StatLabel isDark={isDark}>Tempo Total</StatLabel>
            </StatItem>

            <StatItem isDark={isDark} delay={300}>
              <StatValue isDark={isDark}>{activeSettings}</StatValue>
              <StatLabel isDark={isDark}>Config. Ativas</StatLabel>
            </StatItem>
          </StatsSection>

          <SettingOption delay={400}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Último Acesso</OptionLabel>
              <OptionSubtext isDark={isDark}>{lastAccess}</OptionSubtext>
            </OptionInfo>
          </SettingOption>
        </SettingsCard>

        {/* 📦 BACKUP DE DADOS */}
        <SettingsCard isDark={isDark} delay={300}>
          <CardHeader>
            <CardIcon isDark={isDark}>📦</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Backup dos Dados</CardTitle>
              <CardDescription isDark={isDark}>
                Exporta fazendas, produtores, culturas e dados do sistema
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Dados Completos</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Fazendas, produtores, culturas e cache do sistema
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              size="small"
              onClick={handleExportData}
              disabled={isExporting}
            >
              📦 Exportar Dados
            </ActionButton>
          </SettingOption>
        </SettingsCard>

        {/* ⚙️ BACKUP DE CONFIGURAÇÕES */}
        <SettingsCard isDark={isDark} delay={400}>
          <CardHeader>
            <CardIcon isDark={isDark}>⚙️</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Backup das Configurações</CardTitle>
              <CardDescription isDark={isDark}>
                Exporta apenas tema, preferências e estatísticas
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Configurações e Stats</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Tema, modo compacto, animações e estatísticas
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              size="small"
              onClick={handleExportSettings}
              disabled={isExporting}
            >
              ⚙️ Exportar Config
            </ActionButton>
          </SettingOption>
        </SettingsCard>

        {/* 🔄 RESTAURAR SISTEMA */}
        <SettingsCard isDark={isDark} delay={500}>
          <CardHeader>
            <CardIcon isDark={isDark}>🔄</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Restaurar Sistema</CardTitle>
              <CardDescription isDark={isDark}>
                Opções de reset individuais ou completo
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Reset Completo</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Remove TUDO: dados + configurações + cache
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setShowResetSystemModal(true)}
              disabled={isResetting}
            >
              🗑️ Reset Total
            </ActionButton>
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Reset dos Dados</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Remove apenas fazendas, produtores e culturas
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setShowResetDataModal(true)}
              disabled={isResetting}
            >
              📊 Reset Dados
            </ActionButton>
          </SettingOption>

          <SettingOption delay={300}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Reset das Configurações</OptionLabel>
              <OptionSubtext isDark={isDark}>Volta apenas as preferências ao padrão</OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setShowResetConfigModal(true)}
              disabled={isResetting}
            >
              ⚙️ Reset Config
            </ActionButton>
          </SettingOption>
        </SettingsCard>
      </SettingsGrid>

      {/* 🎯 MODAL RESET SISTEMA COMPLETO */}
      <Modal isOpen={showResetSystemModal} data-open={showResetSystemModal}>
        <ModalContent isDark={isDark}>
          <ModalTitle isDark={isDark}>🗑️ Reset Completo do Sistema</ModalTitle>
          <ModalText isDark={isDark}>
            Esta ação irá remover <strong>ABSOLUTAMENTE TUDO</strong>:
            <br />
            <br />
            • 📊 Todas as fazendas, produtores e culturas
            <br />
            • ⚙️ Todas as configurações e preferências
            <br />
            • 📈 Todas as estatísticas de uso
            <br />
            • 🗂️ Todo o cache e dados temporários
            <br />
            <br />
            <strong>⚠️ O sistema será completamente reiniciado!</strong>
          </ModalText>
          <ModalActions>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              onClick={() => setShowResetSystemModal(false)}
              disabled={isResetting}
            >
              ❌ Cancelar
            </ActionButton>
            <ActionButton
              variant="danger"
              isDark={isDark}
              onClick={handleResetSystem}
              disabled={isResetting}
            >
              {isResetting ? '🔄 Resetando...' : '✅ Reset Total'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* 📊 MODAL RESET DADOS */}
      <Modal isOpen={showResetDataModal} data-open={showResetDataModal}>
        <ModalContent isDark={isDark}>
          <ModalTitle isDark={isDark}>📊 Reset dos Dados</ModalTitle>
          <ModalText isDark={isDark}>
            Esta ação irá remover apenas os <strong>dados do negócio</strong>:
            <br />
            <br />
            • 🏡 Todas as fazendas cadastradas
            <br />
            • 👥 Todos os produtores
            <br />
            • 🌾 Todas as culturas
            <br />
            • 📋 Cache do dashboard
            <br />
            <br />
            <strong>✅ Suas configurações serão mantidas!</strong>
          </ModalText>
          <ModalActions>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              onClick={() => setShowResetDataModal(false)}
              disabled={isResetting}
            >
              ❌ Cancelar
            </ActionButton>
            <ActionButton
              variant="danger"
              isDark={isDark}
              onClick={handleResetData}
              disabled={isResetting}
            >
              {isResetting ? '🔄 Removendo...' : '✅ Reset Dados'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* ⚙️ MODAL RESET CONFIGURAÇÕES */}
      <Modal isOpen={showResetConfigModal} data-open={showResetConfigModal}>
        <ModalContent isDark={isDark}>
          <ModalTitle isDark={isDark}>⚙️ Reset das Configurações</ModalTitle>
          <ModalText isDark={isDark}>
            Esta ação irá resetar apenas as <strong>configurações</strong>:
            <br />
            <br />
            • 🎨 Tema volta para o padrão do dispositivo
            <br />
            • 📱 Modo compacto desativado
            <br />
            • ✨ Animações ativadas
            <br />
            • 💾 Auto-save ativado
            <br />
            • 🔔 Notificações ativadas
            <br />
            <br />
            <strong>✅ Seus dados serão mantidos!</strong>
          </ModalText>
          <ModalActions>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              onClick={() => setShowResetConfigModal(false)}
              disabled={isResetting}
            >
              ❌ Cancelar
            </ActionButton>
            <ActionButton
              variant="danger"
              isDark={isDark}
              onClick={handleResetConfig}
              disabled={isResetting}
            >
              {isResetting ? '🔄 Resetando...' : '✅ Reset Config'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>

      {/* 🔄 OVERLAY DE LOADING */}
      {(isExporting || isResetting) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>
              {isResetting ? '🔄' : '📤'}
            </div>
            <div>{isResetting ? 'Processando reset...' : 'Exportando dados...'}</div>
          </div>
        </div>
      )}
    </SettingsContainer>
  );
};
