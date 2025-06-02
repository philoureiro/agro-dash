import React, { useEffect } from 'react';

import { Button, LoadingOverlay, StatsHeader } from '@components';
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
    autoLoadDraft,
    clearDraft,
    submitForm,
    nextStep,
    prevStep,
  } = useAddFarmer();

  // 🔥 AUTO-CARREGAR RASCUNHO AO ENTRAR NA PÁGINA (SEM TOAST)
  useEffect(() => {
    autoLoadDraft();
  }, [autoLoadDraft]);

  // 🔥 AUTO-SALVAR RASCUNHO QUANDO HOUVER MUDANÇAS
  useEffect(() => {
    if (form.hasUnsavedChanges) {
      const timer = setTimeout(() => {
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
          // 🔥 USAR IMAGEM DO FORM OU PADRÃO
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

          {/* 🔥 BOTÃO LIMPAR RASCUNHO */}
          <Button
            isDark={isDark}
            onClick={clearDraft}
            style={{
              background: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              border: `2px solid ${isDark ? '#ef4444' : '#dc2626'}`,
              color: isDark ? 'white' : '#5d5d5d',
              padding: '12px 24px',
              borderRadius: '8px',
              maxWidth: '200px',
              maxHeight: '38px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: 'none',
            }}
          >
            🗑️ Limpar Rascunho
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
                maxWidth: '350px',
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
