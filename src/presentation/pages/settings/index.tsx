import React, { useEffect, useState } from 'react';

import { Text } from '@components';
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

// 🎯 TIPOS
interface AppStats {
  totalSessions: number;
  totalTimeSpent: string;
  lastAccess: string;
  settingsChanged: number;
}

interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  autoSave: boolean;
  notifications: boolean;
  analytics: boolean;
  compactMode: boolean;
  animations: boolean;
}

// 📊 COMPONENTE PRINCIPAL
export const Settings: React.FC = () => {
  const { themeMode, toggle: toggleThemeMode } = useThemeMode();
  const isDark = themeMode === 'dark';

  // 🎯 ESTADOS
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'auto',
    autoSave: true,
    notifications: true,
    analytics: false,
    compactMode: false,
    animations: true,
  });

  const [stats, setStats] = useState<AppStats>({
    totalSessions: 47,
    totalTimeSpent: '2h 34m',
    lastAccess: 'Hoje, 15:42',
    settingsChanged: 12,
  });

  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // 💾 CARREGA CONFIGURAÇÕES SALVAS
  useEffect(() => {
    const savedSettings = localStorage.getItem('agrodash-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erro ao carregar configurações:', error);
      }
    }

    // 📊 SIMULA ESTATÍSTICAS
    const savedStats = localStorage.getItem('agrodash-stats');
    if (savedStats) {
      try {
        const parsed = JSON.parse(savedStats);
        setStats((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Erro ao carregar estatísticas:', error);
      }
    }
  }, []);

  // 💾 SALVA CONFIGURAÇÕES
  const saveSettings = (newSettings: SettingsState) => {
    setSettings(newSettings);
    localStorage.setItem('agrodash-settings', JSON.stringify(newSettings));

    // 📊 Atualiza stats
    const newStats = {
      ...stats,
      settingsChanged: stats.settingsChanged + 1,
      lastAccess: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
    setStats(newStats);
    localStorage.setItem('agrodash-stats', JSON.stringify(newStats));
  };

  // 🎨 ALTERNA CONFIGURAÇÃO
  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = {
      ...settings,
      [key]: !settings[key],
    };
    saveSettings(newSettings);

    // 🎯 APLICA TEMA IMEDIATAMENTE
    if (key === 'theme') {
      toggleThemeMode();
    }
  };

  // 🔄 RESET COMPLETO
  const handleReset = async () => {
    setIsResetting(true);

    // 🎭 SIMULA PROCESSO
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 🗑️ LIMPA TUDO
    localStorage.removeItem('agrodash-settings');
    localStorage.removeItem('agrodash-stats');
    localStorage.removeItem('agrodash-dashboard-data');
    localStorage.removeItem('agrodash-user-preferences');

    // 🔄 RESET ESTADOS
    const defaultSettings: SettingsState = {
      theme: 'auto',
      autoSave: true,
      notifications: true,
      analytics: false,
      compactMode: false,
      animations: true,
    };

    const defaultStats: AppStats = {
      totalSessions: 1,
      totalTimeSpent: '0m',
      lastAccess: 'Agora',
      settingsChanged: 0,
    };

    setSettings(defaultSettings);
    setStats(defaultStats);
    setIsResetting(false);
    setShowResetModal(false);

    // 🎉 FEEDBACK
    alert('✅ Dados restaurados com sucesso!\nTodas as configurações foram redefinidas.');
  };

  return (
    <SettingsContainer isDark={isDark}>
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
              <OptionLabel isDark={isDark}>Tema Escuro</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Ativa o modo escuro para reduzir o cansaço visual
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch isActive={isDark} isDark={isDark} onClick={() => toggleThemeMode()} />
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Modo Compacto</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Reduz espaçamentos para mostrar mais conteúdo
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch
              isActive={settings.compactMode}
              isDark={isDark}
              onClick={() => toggleSetting('compactMode')}
            />
          </SettingOption>

          <SettingOption delay={300}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Animações</OptionLabel>
              <OptionSubtext isDark={isDark}>Habilita animações suaves na interface</OptionSubtext>
            </OptionInfo>
            <ToggleSwitch
              isActive={settings.animations}
              isDark={isDark}
              onClick={() => toggleSetting('animations')}
            />
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
            <ToggleSwitch
              isActive={settings.autoSave}
              isDark={isDark}
              onClick={() => toggleSetting('autoSave')}
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
              <StatValue isDark={isDark}>{stats.totalSessions}</StatValue>
              <StatLabel isDark={isDark}>Sessões</StatLabel>
            </StatItem>

            <StatItem isDark={isDark} delay={200}>
              <StatValue isDark={isDark}>{stats.totalTimeSpent}</StatValue>
              <StatLabel isDark={isDark}>Tempo Total</StatLabel>
            </StatItem>

            <StatItem isDark={isDark} delay={300}>
              <StatValue isDark={isDark}>{stats.settingsChanged}</StatValue>
              <StatLabel isDark={isDark}>Configurações</StatLabel>
            </StatItem>
          </StatsSection>

          <SettingOption delay={400}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Último Acesso</OptionLabel>
              <OptionSubtext isDark={isDark}>{stats.lastAccess}</OptionSubtext>
            </OptionInfo>
          </SettingOption>
        </SettingsCard>

        {/* 🔄 AÇÕES */}
        <SettingsCard isDark={isDark} delay={300}>
          <CardHeader>
            <CardIcon isDark={isDark}>🔄</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Gerenciamento de Dados</CardTitle>
              <CardDescription isDark={isDark}>Restaure ou exporte seus dados</CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Backup de dados</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Exporte todos os seus dados para um arquivo
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              size="small"
              onClick={() => {
                const dataStr = JSON.stringify({ settings, stats }, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `agrodash-backup-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              📥 Exportar
            </ActionButton>
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Restaurar Dados</OptionLabel>
              <OptionSubtext isDark={isDark}>Restaura todos os dados salvos</OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setShowResetModal(true)}
            >
              🗑️ Restaurar
            </ActionButton>
          </SettingOption>
        </SettingsCard>

        <SettingsCard isDark={isDark} delay={300}>
          <CardHeader>
            <CardIcon isDark={isDark}>⚙️</CardIcon>
            <div>
              <CardTitle isDark={isDark}>Gerenciamento de Configuração</CardTitle>
              <CardDescription isDark={isDark}>
                Restaure ou exporte suas configurações
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Backup de Configurações</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Exporte suas preferências para um arquivo
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              size="small"
              onClick={() => {
                const dataStr = JSON.stringify({ settings, stats }, null, 2);
                const dataBlob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `agrodash-backup-${new Date().toISOString().slice(0, 10)}.json`;
                link.click();
                URL.revokeObjectURL(url);
              }}
            >
              📥 Exportar
            </ActionButton>
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Restaurar Dados</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Remove todas as configurações e dados salvos
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setShowResetModal(true)}
            >
              🗑️ Restaurar
            </ActionButton>
          </SettingOption>
        </SettingsCard>
      </SettingsGrid>

      {/* 🎯 MODAL DE CONFIRMAÇÃO */}
      <Modal isOpen={showResetModal} data-open={showResetModal}>
        <ModalContent isDark={isDark}>
          <ModalTitle isDark={isDark}>⚙️ Restaurar Dados</ModalTitle>
          <ModalText isDark={isDark}>
            Esta ação irá remover <strong>todas</strong> as suas configurações, preferências e dados
            salvos. Esta operação não pode ser desfeita.
            <br />
            <br />
            Tem certeza que deseja continuar?
          </ModalText>
          <ModalActions>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              onClick={() => setShowResetModal(false)}
              disabled={isResetting}
            >
              ❌ Cancelar
            </ActionButton>
            <ActionButton
              variant="danger"
              isDark={isDark}
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? '🔄 Restaurando...' : '✅ Confirmar'}
            </ActionButton>
          </ModalActions>
        </ModalContent>
      </Modal>
    </SettingsContainer>
  );
};
