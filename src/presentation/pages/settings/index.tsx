import React, { useEffect, useState } from 'react';

import { ConfirmModal, LoadingOverlay } from '@components';
import { useToast } from '@hooks';
import { useAppStore } from '@storage';
import { useThemeMode } from '@theme';

import {
  ActionButton,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
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
import {
  handleExportData,
  handleExportSettings,
  handleResetConfig,
  handleResetData,
  handleResetSystem,
} from './utils';
import { MODAL_CONTENT } from './utils/modalContent';

// Tipos para o modal unificado
type ModalType = 'resetSystem' | 'resetData' | 'resetConfig' | null;

// 📊 COMPONENTE PRINCIPAL
export const Settings: React.FC = () => {
  const { toast } = useToast();

  const { themeMode, toggle: toggleThemeMode } = useThemeMode();
  const isDark = themeMode === 'dark';

  // 🎯 HOOKS DO APP STORE
  const { getAllData } = useAppStore();

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
  const [activeModal, setActiveModal] = useState<ModalType>(null);
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

  // 💾 SALVA OUTRAS CONFIGURAÇÕES
  useEffect(() => {
    localStorage.setItem('agrodash-auto-save', autoSave.toString());
  }, [autoSave]);

  useEffect(() => {
    localStorage.setItem('agrodash-notifications', notifications.toString());
  }, [notifications]);

  useEffect(() => {
    if (error) {
      toast.error('Erro!', error);
      setError(null);
    }
  }, [error, toast]);

  // 🎨 HANDLERS DE TOGGLE
  const handleThemeToggle = () => {
    toggleThemeMode();
  };

  // Função para fechar modal antes de executar ação
  const handleConfirm = async () => {
    if (!activeModal) return;
    setActiveModal(null);

    // Aguarda o modal fechar antes de mostrar o loading
    setTimeout(async () => {
      if (activeModal === 'resetSystem') {
        setIsResetting(true);
        await handleResetSystem(setIsResetting, () => {}, setAutoSave, setNotifications, setError);
        setIsResetting(false);
      }
      if (activeModal === 'resetData') {
        setIsResetting(true);
        await handleResetData(setIsResetting, () => {}, setError);
        setIsResetting(false);
      }
      if (activeModal === 'resetConfig') {
        setIsResetting(true);
        await handleResetConfig(
          setIsResetting,
          () => {},
          setCompactMode,
          setAnimations,
          setAutoSave,
          setNotifications,
          setError,
        );
        setIsResetting(false);
      }
    }, 200); // tempo para animação do modal fechar
  };

  return (
    <SettingsContainer isDark={isDark}>
      {(isExporting || isResetting) && (
        <LoadingOverlay
          isVisible={isExporting || isResetting}
          isDark={isDark}
          type={isExporting ? 'generating' : 'deleting'}
          variant="dots"
          title={isExporting ? '📦 Exportando Dados do Sistema' : '🗑️ Deletando Dados do Sistema'}
          subtitle="Sincronizando dados do campo"
          loadingText={isResetting ? 'Processando reset...' : 'Exportando dados...'}
          spinnerColor="#27ae60"
          spinnerSize="large"
        />
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
              <CardDescription isDark={isDark}>Configurações de funcionamento</CardDescription>
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
              isActive={false}
              isDark={isDark}
              onClick={() =>
                toast.info('Guentaê!', `Ainda estamos trabalhando nessa funcionalidade.`)
              }
            />
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Notificações</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Receba alertas sobre atualizações importantes
              </OptionSubtext>
            </OptionInfo>
            <ToggleSwitch
              isActive={false}
              isDark={isDark}
              onClick={() =>
                toast.info('Guentaê!', `Ainda estamos trabalhando nessa funcionalidade.`)
              }
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
              onClick={() => handleExportData(setIsExporting, getAllData, setError)}
              disabled={isExporting}
            >
              📦 Exportar Dados
            </ActionButton>
          </SettingOption>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Gerar relatório completo do sistema</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Relatório completo para tomada de decisões
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="secondary"
              isDark={isDark}
              size="small"
              onClick={() =>
                toast.info('Guentaê!', `Ainda estamos trabalhando nessa funcionalidade.`)
              }
              disabled={isExporting}
            >
              📑 Exportar Relatório
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
                Exporta tema, preferências e estatísticas
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
              onClick={() =>
                handleExportSettings(
                  setIsExporting,
                  isDark,
                  compactMode,
                  animations,
                  autoSave,
                  notifications,
                  totalSessions,
                  Number(totalTimeSpent),
                  activeSettings,
                  lastAccess,
                  setError,
                )
              }
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
                Opções de restaurações individuais ou completas
              </CardDescription>
            </div>
          </CardHeader>

          <SettingOption delay={100}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Restaurar tudo</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Remove TUDO: dados + configurações + cache
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setActiveModal('resetSystem')}
              disabled={isResetting}
            >
              🗑️ Restaurar tudo
            </ActionButton>
          </SettingOption>

          <SettingOption delay={200}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Restaurar dos Dados</OptionLabel>
              <OptionSubtext isDark={isDark}>
                Remove apenas fazendas, produtores e culturas
              </OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setActiveModal('resetData')}
              disabled={isResetting}
            >
              📊 Restaurar Dados
            </ActionButton>
          </SettingOption>

          <SettingOption delay={300}>
            <OptionInfo>
              <OptionLabel isDark={isDark}>Resetar as configurações iniciais</OptionLabel>
              <OptionSubtext isDark={isDark}>Volta apenas as preferências ao padrão</OptionSubtext>
            </OptionInfo>
            <ActionButton
              variant="danger"
              isDark={isDark}
              size="small"
              onClick={() => setActiveModal('resetConfig')}
              disabled={isResetting}
            >
              ⚙️ Restaurar config
            </ActionButton>
          </SettingOption>
        </SettingsCard>
      </SettingsGrid>

      {/* MODAL ÚNICO DE CONFIRMAÇÃO */}
      <ConfirmModal
        isVisible={!!activeModal}
        isDark={isDark}
        type="danger"
        title={
          activeModal
            ? `${MODAL_CONTENT[activeModal].icon} ${MODAL_CONTENT[activeModal].title}`
            : ''
        }
        subtitle={activeModal ? MODAL_CONTENT[activeModal].subtitle : ''}
        message={activeModal ? MODAL_CONTENT[activeModal].message : ''}
        confirmText={activeModal ? MODAL_CONTENT[activeModal].confirmText : ''}
        cancelText={activeModal ? MODAL_CONTENT[activeModal].cancelText : ''}
        onConfirm={handleConfirm}
        onCancel={() => setActiveModal(null)}
        loading={isResetting}
      />
    </SettingsContainer>
  );
};
