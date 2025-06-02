// src/components/AddFarmer/AddFarmerMain.tsx - VERSÃO COMPLETA FUNCIONAL
import React from 'react';

import { Button, LoadingOverlay, StatsHeader } from '@components';
import { ProgressBar } from '@components';
import { Text } from '@components';
import { useAddFarmer } from '@hooks';
import { useThemeMode } from '@theme';

import { CropForm } from './components/crop-form';
import { FarmForm } from './components/farm-form';
import { ProducerForm } from './components/producer-form';
import { AddFarmerContainer } from './components/producer-form/styles';
import { FormActions } from './styles';

export const AddFarmer: React.FC = () => {
  const { themeMode: theme } = useThemeMode();
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
    loadDraft,
    submitForm,
    nextStep,
    prevStep,
  } = useAddFarmer();

  // 🎯 STEPS CONFIGURATION
  const steps = [
    { id: 'producer', label: 'Produtor', icon: '👨‍🌾', required: true },
    { id: 'farms', label: 'Fazendas', icon: '🏭', required: true },
    { id: 'crops', label: 'Culturas', icon: '🌱', required: false },
    { id: 'review', label: 'Revisão', icon: '📋', required: false },
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === form.currentStep);
  };

  const getStepStatus = (stepId: string) => {
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    const currentIndex = getCurrentStepIndex();

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

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
    <>
      <LoadingOverlay
        isVisible={form.isLoading}
        isDark={isDark}
        type="farms"
        variant="wave"
        title="🚜 Cadastrando Produtor"
        subtitle="Sincronizando dados do campo"
        loadingText="Salvando informações..."
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
          backgroundImage="https://www.10wallpaper.com/wallpaper/1920x1080/1405/Farm_vast_landscape-Landscape_HD_Wallpaper_1920x1080.jpg" // Opcional
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
          {/* Botão Voltar */}
          {form.currentStep !== 'producer' && (
            <Button
              isDark={isDark}
              onClick={prevStep}
              style={{
                background: 'transparent',
                border: `2px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              ← Voltar
            </Button>
          )}

          {/* Botão Rascunho */}
          <Button
            isDark={isDark}
            onClick={saveDraft}
            disabled={!form.hasUnsavedChanges}
            style={{
              background: isDark ? 'rgba(90, 208, 255, 0.1)' : 'rgba(90, 208, 255, 0.05)',
              border: `2px solid ${isDark ? '#5ad0ff' : '#3b82f6'}`,
              color: isDark ? '#5ad0ff' : '#3b82f6',
              opacity: form.hasUnsavedChanges ? 1 : 0.5,
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: form.hasUnsavedChanges ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
            }}
          >
            💾 Salvar Rascunho
          </Button>

          {/* Botão Principal */}
          {form.currentStep === 'review' ? (
            <Button
              isDark={isDark}
              onClick={submitForm}
              disabled={form.isLoading || progress < 100}
              style={{
                background:
                  progress === 100
                    ? 'linear-gradient(135deg, #37cb83, #27ae60)'
                    : 'rgba(149, 165, 166, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                padding: '18px 48px',
                minWidth: '250px',
                borderRadius: '8px',
                opacity: progress === 100 ? 1 : 0.7,
                cursor: progress === 100 ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              {progress === 100
                ? '✅ Finalizar Cadastro'
                : `📋 Complete o formulário (${progress}%)`}
            </Button>
          ) : (
            <Button
              isDark={isDark}
              onClick={nextStep}
              disabled={!canProceedToNext()}
              style={{
                background: canProceedToNext()
                  ? 'linear-gradient(135deg, #37cb83, #27ae60)'
                  : 'rgba(149, 165, 166, 0.5)',
                border: 'none',
                color: 'white',
                fontSize: '1.1rem',
                padding: '18px 48px',
                minWidth: '200px',
                borderRadius: '8px',
                opacity: canProceedToNext() ? 1 : 0.7,
                cursor: canProceedToNext() ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
              }}
            >
              {form.currentStep === 'producer' && 'Próximo: Fazendas →'}
              {form.currentStep === 'farms' && 'Próximo: Culturas →'}
              {form.currentStep === 'crops' && 'Finalizar →'}
            </Button>
          )}
        </FormActions>
      </AddFarmerContainer>
    </>
  );
};
