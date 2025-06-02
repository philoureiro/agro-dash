// src/components/AddFarmer/AddFarmerMain.tsx - VERSÃO COMPLETA FUNCIONAL
import React, { useEffect } from 'react';

import { Button, LoadingOverlay } from '@components';
import { useAddFarmer } from '@hooks';
import { useThemeMode } from '@theme';

import {
  FormActions,
  ProgressBar,
  ProgressFill,
  StepDot,
  StepIndicator,
  StepLine,
} from '../../../../styles';
import { CropForm } from './components/crop-form';
import { FarmForm } from './components/farm-form';
import { ProducerForm } from './components/producer-form';
import {
  AddFarmerContainer,
  ProgressHeader,
  ProgressText,
  StatsContainer,
} from './components/producer-form/styles';

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

  // 📂 Carregar rascunho ao montar
  useEffect(() => {
    const draft = localStorage.getItem('addFarmer_draft');
    if (draft) {
      loadDraft();
    }
  }, [loadDraft]);

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
        {/* 📊 HEADER COM PROGRESSO */}
        <ProgressHeader $isDark={isDark}>
          <h1>
            🌾 Cadastrar Novo Produtor
            <span
              style={{
                fontSize: '0.7em',
                opacity: 0.7,
                marginLeft: '1rem',
                fontWeight: 'normal',
              }}
            >
              ({progress}% completo)
            </span>
          </h1>

          {/* 📈 BARRA DE PROGRESSO */}
          <ProgressBar $isDark={isDark}>
            <ProgressFill $progress={progress} $isDark={isDark} />
          </ProgressBar>

          <ProgressText $isDark={isDark}>
            <span>Progresso do cadastro</span>
            <span>{progress}% completo</span>
          </ProgressText>

          {/* 📊 ESTATÍSTICAS */}
          <StatsContainer $isDark={isDark}>
            <div className="stat">
              <span className="value">{stats.totalFarms}</span> Fazenda
              {stats.totalFarms !== 1 ? 's' : ''}
            </div>
            <div className="stat">
              <span className="value">{stats.totalArea.toLocaleString()}</span> Hectares
            </div>
            <div className="stat">
              <span className="value">{stats.totalCrops}</span> Cultura
              {stats.totalCrops !== 1 ? 's' : ''}
            </div>
            {stats.totalArea > 0 && (
              <div className="stat">
                <span className="value">{stats.utilizationRate.toFixed(1)}%</span> Utilização
              </div>
            )}
          </StatsContainer>

          {/* 🎯 INDICADOR DE ETAPAS */}
          <StepIndicator>
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <StepDot
                  $isDark={isDark}
                  $active={getStepStatus(step.id) === 'active'}
                  $completed={getStepStatus(step.id) === 'completed'}
                  title={step.label}
                >
                  <span style={{ fontSize: '1.2rem' }}>{step.icon}</span>
                </StepDot>
                {index < steps.length - 1 && (
                  <StepLine
                    $isDark={isDark}
                    $completed={getStepStatus(steps[index + 1].id) !== 'pending'}
                  />
                )}
              </React.Fragment>
            ))}
          </StepIndicator>
        </ProgressHeader>

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
                opacity: progress === 100 ? 1 : 0.7,
                cursor: progress === 100 ? 'pointer' : 'not-allowed',
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
                opacity: canProceedToNext() ? 1 : 0.7,
                cursor: canProceedToNext() ? 'pointer' : 'not-allowed',
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
