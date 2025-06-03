import React, { useEffect, useState } from 'react';
import { FcOpenedFolder } from 'react-icons/fc';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import { IoArrowBackOutline, IoArrowForwardOutline } from 'react-icons/io5';
import { TbTrashXFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { Button, ConfirmModal, DraftBadge, LoadingOverlay, StatsHeader } from '@components';
import { Text } from '@components';
import { useAddFarmer } from '@hooks';
import { useThemeMode } from '@theme';

import { CropForm } from './components/crop-form';
import { FarmForm } from './components/farm-form';
import { ProducerForm } from './components/producer-form';
import { AddFarmerContainer } from './components/producer-form/styles';
import { ActionsBox, FormActions } from './styles';

export const AddFarmer: React.FC = () => {
  const navigate = useNavigate();
  const { themeMode: theme } = useThemeMode();

  const [showDraftBadge, setShowDraftBadge] = useState<{
    isVisible: boolean;
    message: string;
    icon: string;
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    duration: number;
  }>({
    isVisible: false,
    message: '',
    icon: '',
    position: 'top-right',
    duration: 3000,
  });

  // 🗑️ ESTADO DO MODAL DE CONFIRMAÇÃO
  const [confirmModal, setConfirmModal] = useState<{
    isVisible: boolean;
    type: 'clearDraft' | 'submit';
  } | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const {
    form,
    validation,
    progress,
    stats,
    updateProducer,
    addFarm,
    removeFarm,
    updateFarm,
    addCrop,
    removeCrop,
    updateCrop,
    saveDraft,
    autoLoadDraft,
    clearDraft,
    submitForm,
    nextStep,
    prevStep,
  } = useAddFarmer();

  // 🔥 AUTO-CARREGAR RASCUNHO AO ENTRAR NA PÁGINA (SEM TOAST)
  useEffect(() => {
    const autoLoad = autoLoadDraft();

    if (!autoLoad) return;

    setShowDraftBadge((prev) => ({
      ...prev,
      message: 'Rascunho carregado automaticamente',
      icon: '📂',
      isVisible: true,
    }));
  }, [autoLoadDraft]);

  // 🔥 AUTO-SALVAR RASCUNHO QUANDO HOUVER MUDANÇAS
  useEffect(() => {
    if (form.hasUnsavedChanges) {
      const timer = setTimeout(() => {
        setShowDraftBadge((prev) => ({
          ...prev,
          message: 'Rascunho salvo automaticamente',
          icon: '💾',
          isVisible: true,
        }));
        saveDraft();
      }, 3000); // Auto-salva após 3 segundos de inatividade

      return () => clearTimeout(timer);
    }
  }, [form.hasUnsavedChanges, saveDraft]);

  // 🎯 VERIFICAR SE PODE AVANÇAR
  const canProceedToNext = () => {
    switch (form.currentStep) {
      case 'producer':
        return validation.producer.nameValid && validation.producer.documentValid;
      case 'farms':
        return form.farms.length > 0;
      case 'crops':
        return true; // Culturas são opcionais
      default:
        return false;
    }
  };

  // 🚀 FUNÇÃO PARA FINALIZAR E NAVEGAR
  const handleSubmitForm = async () => {
    if (progress < 100) {
      return; // Não permite submeter se não estiver 100%
    }

    setConfirmModal({
      isVisible: true,
      type: 'submit',
    });
  };

  // 🗑️ FUNÇÃO PARA LIMPAR RASCUNHO COM CONFIRMAÇÃO
  const handleClearDraft = () => {
    setConfirmModal({
      isVisible: true,
      type: 'clearDraft',
    });
  };

  // 🎯 CONFIRMAR AÇÕES DO MODAL
  const handleConfirmAction = async () => {
    if (!confirmModal) return;

    if (confirmModal.type === 'submit') {
      setIsSubmitting(true);

      try {
        await submitForm();

        setShowDraftBadge({
          isVisible: true,
          message: 'Cadastro finalizado com sucesso!',
          icon: '🎉',
          position: 'top-right',
          duration: 2000,
        });
      } catch (error) {
        console.error('Erro ao finalizar cadastro:', error);

        setShowDraftBadge({
          isVisible: true,
          message: 'Erro ao finalizar cadastro. Tente novamente.',
          icon: '❌',
          position: 'top-right',
          duration: 4000,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else if (confirmModal.type === 'clearDraft') {
      clearDraft();

      setShowDraftBadge({
        isVisible: true,
        message: 'Rascunho limpo com sucesso',
        icon: '🗑️',
        position: 'top-right',
        duration: 3000,
      });
    }

    setConfirmModal(null);
  };

  // 🎯 CONTEÚDO DOS MODAIS
  const getModalContent = () => {
    if (!confirmModal) return {};

    switch (confirmModal.type) {
      case 'submit':
        return {
          icon: '🚀',
          title: 'Finalizar Cadastro',
          subtitle: 'Confirmar dados e finalizar',
          type: 'confirm',
          message: `Você está prestes a finalizar o cadastro do produtor "${form.producer.name}" com ${stats.totalFarms} fazenda(s) e ${stats.totalCrops} cultura(s). Todos os dados serão salvos permanentemente.`,
          confirmText: 'Sim, Finalizar Cadastro',
          cancelText: 'Cancelar',
        };

      case 'clearDraft':
        return {
          icon: '🗑️',
          title: 'Limpar Rascunho',
          subtitle: 'Remover dados salvos temporariamente',
          type: 'danger',
          message:
            'Tem certeza que deseja limpar o rascunho? Todos os dados não salvos permanentemente serão perdidos.',
          confirmText: 'Sim, Limpar Rascunho',
          cancelText: 'Cancelar',
        };

      default:
        return {};
    }
  };

  const modalContent = getModalContent();

  // 🎨 RENDERIZAR CONTEÚDO BASEADO NO STEP
  const renderStepContent = () => {
    switch (form.currentStep) {
      case 'producer':
        return (
          <ProducerForm
            producer={form.producer}
            validation={validation}
            onUpdate={updateProducer}
            isDark={isDark}
          />
        );

      case 'farms':
        return (
          <FarmForm
            farms={form.farms}
            validation={validation}
            onAddFarm={addFarm}
            onRemoveFarm={removeFarm}
            onUpdateFarm={updateFarm}
            isDark={isDark}
          />
        );

      case 'crops':
        return (
          <CropForm
            farms={form.farms}
            crops={form.crops}
            validation={validation}
            onAddCrop={addCrop}
            onRemoveCrop={removeCrop}
            onUpdateCrop={updateCrop}
            isDark={isDark}
          />
        );

      default:
        return (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: isDark ? '#fff' : '#2c3e50',
            }}
          >
            <h2>📋 Revisão Final</h2>
            <p>Revise todos os dados antes de finalizar o cadastro.</p>
            <div
              style={{
                marginTop: '2rem',
                background: isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)',
                padding: '1.5rem',
                borderRadius: '12px',
                border: isDark
                  ? '1px solid rgba(55, 203, 131, 0.3)'
                  : '1px solid rgba(55, 203, 131, 0.2)',
              }}
            >
              <h3>📊 Resumo do Cadastro</h3>
              <div
                style={{
                  display: 'flex',
                  gap: '2rem',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  marginTop: '1rem',
                }}
              >
                <div>
                  <strong>👨‍🌾 Produtor:</strong>
                  <br />
                  {form.producer.name || 'Não informado'}
                </div>
                <div>
                  <strong>🏭 Fazendas:</strong>
                  <br />
                  {stats.totalFarms} fazenda{stats.totalFarms !== 1 ? 's' : ''}
                </div>
                <div>
                  <strong>📏 Área Total:</strong>
                  <br />
                  {stats.totalArea.toLocaleString()} ha
                </div>
                <div>
                  <strong>🌱 Culturas:</strong>
                  <br />
                  {stats.totalCrops} cultura{stats.totalCrops !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
      <DraftBadge
        isVisible={showDraftBadge?.isVisible}
        isDark={isDark}
        message={showDraftBadge?.message}
        icon={showDraftBadge?.icon}
        position={showDraftBadge?.position}
        duration={showDraftBadge?.duration}
        onHide={() =>
          setShowDraftBadge((prev) => ({
            ...prev,
            isVisible: false,
          }))
        }
      />

      <LoadingOverlay
        isVisible={form.isLoading || isSubmitting}
        isDark={isDark}
        type="farms"
        variant="wave"
        title={isSubmitting ? '🚀 Finalizando Cadastro' : '🚜 Cadastrando Produtor'}
        subtitle={isSubmitting ? 'Salvando dados permanentemente' : 'Sincronizando dados do campo'}
        loadingText={isSubmitting ? 'Processando cadastro...' : 'Salvando informações...'}
        stats={[
          { label: 'Total de Fazendas', value: stats.totalFarms.toString() },
          { label: 'Total de Hectares', value: `${stats.totalArea.toLocaleString()} ha` },
          { label: 'Culturas Plantadas', value: stats.totalCrops.toString() },
        ]}
        spinnerColor="#27ae60"
        spinnerSize="large"
      />

      <AddFarmerContainer $isDark={isDark}>
        <Text
          variant="h3"
          style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 30 }}
        >
          📝 Cadastrar
        </Text>

        <StatsHeader
          progress={progress}
          isDark={isDark}
          textStyle={{ color: 'white' }}
          backgroundImage={
            form.producer.profilePhoto &&
            /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(form.producer.profilePhoto)
              ? form.producer.profilePhoto
              : 'https://www.10wallpaper.com/wallpaper/1920x1080/1405/Farm_vast_landscape-Landscape_HD_Wallpaper_1920x1080.jpg'
          }
          progressLabel="Progresso do cadastro"
          stats={[
            { label: 'Fazendas', value: stats.totalFarms },
            { label: 'Hectares', value: stats.totalArea.toLocaleString() },
            { label: 'Culturas', value: stats.totalCrops },
          ]}
        />

        {/* 📝 CONTEÚDO DO FORMULÁRIO */}
        {renderStepContent()}

        {/* 🎯 AÇÕES DO FORMULÁRIO */}
        <FormActions>
          {/* Linha para Voltar e Limpar Rascunho */}
          <ActionsBox isDark={isDark}>
            {/* Botão Voltar */}
            {form.currentStep !== 'producer' && (
              <Button
                isDark={isDark}
                onClick={prevStep}
                disabled={isSubmitting}
                style={{
                  background: 'transparent',
                  border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  width: '150px',
                  height: '50px',
                  boxShadow: 'none',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  opacity: isSubmitting ? 0.5 : 1,
                }}
              >
                <IoArrowBackOutline size={20} /> Voltar
              </Button>
            )}

            {/* 🔥 BOTÃO LIMPAR RASCUNHO */}
            <Button
              isDark={isDark}
              onClick={handleClearDraft}
              disabled={isSubmitting}
              style={{
                background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
                border: `1px solid ${isDark ? '#ef4444' : '#dc2626'}`,
                color: isDark ? 'white' : '#5d5d5d',
                padding: '12px 24px',
                borderRadius: '8px',
                width: '210px',
                height: '50px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: 'none',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              <TbTrashXFilled size={20} /> Limpar Rascunho
            </Button>
          </ActionsBox>

          {/* Botão Principal */}
          {form.currentStep === 'review' ? (
            <Button
              isDark={isDark}
              onClick={handleSubmitForm}
              disabled={form.isLoading || progress < 100 || isSubmitting}
              style={{
                background:
                  progress === 100 && !isSubmitting
                    ? 'linear-gradient(135deg, #37cb83, #27ae60)'
                    : 'rgba(149, 165, 166, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                padding: '18px 48px',
                minWidth: '250px',
                borderRadius: '8px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: progress === 100 && !isSubmitting ? 1 : 0.7,
                cursor: progress === 100 && !isSubmitting ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              {isSubmitting ? (
                <>
                  <div
                    style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                  Finalizando...
                </>
              ) : progress === 100 ? (
                <>
                  <IoIosCheckmarkCircle size={20} />
                  Finalizar Cadastro
                </>
              ) : (
                <>
                  <FcOpenedFolder size={20} />
                  Complete o formulário ({progress}%)
                </>
              )}
            </Button>
          ) : (
            <Button
              isDark={isDark}
              onClick={nextStep}
              disabled={!canProceedToNext() || isSubmitting}
              style={{
                background:
                  canProceedToNext() && !isSubmitting
                    ? 'linear-gradient(135deg, #37cb83, #27ae60)'
                    : 'rgba(149, 165, 166, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                padding: '18px 48px',
                minWidth: '200px',
                maxWidth: '350px',
                borderRadius: '8px',
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: canProceedToNext() && !isSubmitting ? 1 : 0.7,
                cursor: canProceedToNext() && !isSubmitting ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              {form.currentStep === 'producer' && 'Próximo: Fazendas'}
              {form.currentStep === 'farms' && 'Próximo: Culturas'}
              {form.currentStep === 'crops' && 'Finalizar'}
              <IoArrowForwardOutline size={20} />
            </Button>
          )}
        </FormActions>
      </AddFarmerContainer>

      {/* 🚀 MODAL DE CONFIRMAÇÃO SUPREMO */}
      <ConfirmModal
        isVisible={!!confirmModal?.isVisible}
        isDark={isDark}
        type={modalContent.type}
        title={modalContent.icon ? `${modalContent.icon} ${modalContent.title}` : ''}
        subtitle={modalContent.subtitle || ''}
        message={modalContent.message || ''}
        confirmText={modalContent.confirmText || 'Confirmar'}
        cancelText={modalContent.cancelText || 'Cancelar'}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirmModal(null)}
        loading={isSubmitting && confirmModal?.type === 'submit'}
      />

      {/* 🎨 ESTILOS PARA ANIMAÇÃO DE LOADING */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};
