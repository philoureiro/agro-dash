import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';
import { PiPlusBold } from 'react-icons/pi';
import { TbTrashXFilled } from 'react-icons/tb';

import { AutoFillButton, Button, Input, RangeSlider } from '@components';
import { Farm } from '@entities';
import { States } from '@enums';

import { FormCard, FormGrid, HeaderContainer } from '../producer-form/styles';
import { estados, farmImages } from './images';
import {
  AreaValidation,
  FarmAccordion,
  FarmContent,
  FarmHeader,
  FarmSummary,
  PreviewContainer,
  PreviewImage,
  PreviewInfo,
  RemoveButton,
  StatusIndicator,
} from './styles';
import {
  createFarmAutoFillSchema,
  getCurrentFarmData,
  handleAutoFillUpdate,
  isFarmValid,
  isValidImageUrl,
  isValidZipCode,
  validateAgricultureArea,
  validateAreas,
  validateCity,
  validateFarmName,
  validateState,
  validateTotalArea,
  validateVegetationArea,
} from './utils';

interface FarmFormProps {
  farms: (Farm & { tempId: string })[];
  validation: {
    farms: {
      [tempId: string]: {
        nameValid?: boolean;
        locationValid?: boolean;
        photoValid?: boolean;
        areasValid?: boolean;
        [key: string]: boolean | undefined;
      };
    };
  };
  onAddFarm: () => void;
  onRemoveFarm: (tempId: string) => void;
  onUpdateFarm: (tempId: string, updates: Partial<Farm>) => void;
  isDark: boolean;
}

export const FarmForm: React.FC<FarmFormProps> = ({
  farms,
  // validation,
  onAddFarm,
  onRemoveFarm,
  onUpdateFarm,
  isDark,
}) => {
  // 🎯 ESTADO PARA CONTROLAR QUAIS FORMS ESTÃO ABERTOS
  const [openFarms, setOpenFarms] = useState<Set<string>>(new Set());

  // 🎯 ABRIR/FECHAR FORM ESPECÍFICO
  const toggleFarm = (tempId: string) => {
    setOpenFarms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tempId)) {
        newSet.delete(tempId);
      } else {
        newSet.add(tempId);
      }
      return newSet;
    });
  };

  // 🎯 ADICIONAR NOVA FAZENDA E MANTER APENAS ELA ABERTA
  const handleAddFarm = () => {
    // Primeiro, fecha todas as fazendas existentes
    setOpenFarms(new Set());

    // Adiciona a nova fazenda
    onAddFarm();

    // Aguarda um frame para garantir que a fazenda foi adicionada
    setTimeout(() => {
      // Abre apenas a última fazenda (mais recente)
      if (farms.length >= 0) {
        setOpenFarms(new Set(['new-farm'])); // Temporário até ter o ID real
      }
    }, 100);

    if (farms.length > 0) {
      const lastFarm = farms[farms.length - 1];
      setOpenFarms(new Set([lastFarm.tempId]));
    }
  };

  // 🎯 EFEITO PARA ABRIR AUTOMATICAMENTE A ÚLTIMA FAZENDA

  React.useEffect(() => {
    if (farms.length > 0) {
      const lastFarm = farms[farms.length - 1];
      setOpenFarms(new Set([lastFarm.tempId]));
    }
  }, [farms.length]);

  return (
    <FormCard isDark={isDark}>
      {/* 🎯 HEADER COM TÍTULO E BOTÃO ADICIONAR */}
      <HeaderContainer>
        <h2>🌾 Fazendas ({farms.length})</h2>
        <Button
          isDark={isDark}
          onClick={handleAddFarm}
          style={{
            background: 'linear-gradient(135deg, #37cb83, #27ae60)',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '160px',
            transition: 'all 0.3s ease',
          }}
        >
          <FaPlus size={25} /> Adicionar Fazenda
        </Button>
      </HeaderContainer>

      {farms.length === 0 && (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            background: isDark ? 'rgba(55, 203, 131, 0.05)' : 'rgba(55, 203, 131, 0.02)',
            borderRadius: '12px',
            border: `2px dashed ${isDark ? 'rgba(55, 203, 131, 0.3)' : 'rgba(55, 203, 131, 0.2)'}`,
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
          <h3>Nenhuma fazenda adicionada</h3>
          <p>Clique em "Adicionar Fazenda" para começar</p>
        </div>
      )}

      {farms.map((farm, index) => {
        // const farmValidation = validation.farms[farm.tempId] || {};
        const autoFillSchema = createFarmAutoFillSchema(estados);
        const currentFarmData = getCurrentFarmData(farm);
        const isOpen = openFarms.has(farm.tempId);
        const isValid = isFarmValid(farm);

        return (
          <FarmAccordion
            key={farm.tempId}
            isDark={isDark}
            isOpen={isOpen}
            isValid={isValid}
            style={{ marginBottom: '1rem' }}
          >
            {/* 🎯 HEADER CLICÁVEL PARA ABRIR/FECHAR */}
            <FarmHeader onClick={() => toggleFarm(farm.tempId)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                {/* Status Visual */}
                <StatusIndicator isValid={isValid}>
                  {isValid ? (
                    <IoIosCheckmarkCircle size={25} color="#27ae60" />
                  ) : (
                    <IoIosCloseCircle size={25} color="#e92d2d" />
                  )}
                </StatusIndicator>

                {/* Título */}
                <div
                  style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  🏭 Fazenda #{index + 1}
                </div>

                {/* Resumo quando fechado */}
                {!isOpen && (
                  <FarmSummary isDark={isDark}>
                    <span>{farm.name || 'Sem nome'}</span>
                    <span>•</span>
                    <span>
                      {farm.city || 'Cidade'}, {farm.state || 'UF'}
                    </span>
                    <span>•</span>
                    <span>{farm.totalArea?.toLocaleString() || '0'} ha</span>
                  </FarmSummary>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Botão de remover */}
                <div onClick={(e) => e.stopPropagation()}>
                  <AutoFillButton
                    schema={autoFillSchema}
                    onUpdate={handleAutoFillUpdate(farm.tempId, onUpdateFarm)}
                    currentData={currentFarmData}
                    isDark={isDark}
                    tooltipPosition="left"
                    size="small"
                    fillOnlyEmpty={true}
                    imageContext="farm"
                  />
                </div>
                {farms.length > 1 && (
                  <RemoveButton
                    isDark={isDark}
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveFarm(farm.tempId);
                    }}
                  >
                    <TbTrashXFilled size={24} color="#e92d2d" />
                  </RemoveButton>
                )}
              </div>
            </FarmHeader>

            {/* 🎯 CONTEÚDO EXPANSÍVEL */}
            <FarmContent isOpen={isOpen}>
              <div style={{ padding: '0 1rem 1rem 1rem', marginTop: '1rem' }}>
                {/* AutoFill Button */}

                {/* 🖼️ PREVIEW DA FAZENDA */}
                <PreviewContainer isDark={isDark}>
                  <PreviewImage
                    src={farm.farmPhoto || farmImages[index % farmImages.length]}
                    alt={`Fazenda ${index + 1}`}
                    onError={(e) => {
                      e.currentTarget.src = farmImages[index % farmImages.length];
                    }}
                  />
                  <PreviewInfo>
                    <h4>{farm.name || `Fazenda ${index + 1}`}</h4>
                    <p>
                      📍 {farm.city || 'Cidade'}, {farm.state || 'Estado'}
                    </p>
                    <p>📏 {farm.totalArea?.toLocaleString() || '0'} hectares</p>
                    <p>🌱 {farm.agriculturalArea?.toLocaleString() || '0'} ha agricultável</p>
                  </PreviewInfo>
                </PreviewContainer>

                {/* 📝 FORMULÁRIO */}
                <FormGrid>
                  <Input
                    maxLength={50}
                    label="Nome da Fazenda *"
                    value={farm.name || ''}
                    onChange={(value) => onUpdateFarm(farm.tempId, { name: value })}
                    isDark={isDark}
                    valid={farm.name ? validateFarmName(farm.name) : undefined}
                    validationMessage={
                      farm.name
                        ? validateFarmName(farm.name)
                          ? 'Nome válido!'
                          : 'Nome deve ter pelo menos 3 caracteres'
                        : 'Nome é obrigatório'
                    }
                    validationType={farm.name && validateFarmName(farm.name) ? 'success' : 'error'}
                    placeholder="Ex: Fazenda São João"
                  />

                  <Input
                    label="Cidade *"
                    value={farm.city || ''}
                    onChange={(value) => onUpdateFarm(farm.tempId, { city: value })}
                    isDark={isDark}
                    valid={farm.city ? validateCity(farm.city) : undefined}
                    validationMessage={
                      farm.city
                        ? validateCity(farm.city)
                          ? 'Cidade válida!'
                          : 'Nome da cidade muito curto'
                        : 'Cidade é obrigatória'
                    }
                    validationType={farm.city && validateCity(farm.city) ? 'success' : 'error'}
                    placeholder="Ex: São Paulo"
                  />

                  <Input
                    label="Estado *"
                    value={farm.state || ''}
                    onChange={(value) => onUpdateFarm(farm.tempId, { state: value as States })}
                    isDark={isDark}
                    valid={farm.state ? validateState(farm.state) : undefined}
                    validationMessage={farm.state ? 'Estado selecionado!' : 'Estado é obrigatório'}
                    validationType={farm.state && validateState(farm.state) ? 'success' : 'error'}
                    options={[
                      { value: '', label: 'Selecione o estado' },
                      ...estados.map((estado) => ({ value: estado.value, label: estado.label })),
                    ]}
                  />

                  <Input
                    label="CEP *"
                    value={farm.zipCode || ''}
                    onChange={(value) => {
                      const zipCode = value.replace(/\D/g, '').slice(0, 8);
                      const formatted = zipCode.replace(/(\d{5})(\d)/, '$1-$2');
                      onUpdateFarm(farm.tempId, { zipCode: formatted });
                    }}
                    isDark={isDark}
                    valid={farm.zipCode ? isValidZipCode(farm.zipCode) : undefined}
                    validationMessage={
                      farm.zipCode
                        ? isValidZipCode(farm.zipCode)
                          ? 'CEP válido!'
                          : 'CEP deve ter 8 dígitos (12345-678)'
                        : 'CEP é obrigatório'
                    }
                    validationType={
                      farm.zipCode && isValidZipCode(farm.zipCode) ? 'success' : 'error'
                    }
                    placeholder="12345-678"
                  />

                  <div style={{ gridColumn: '1 / -1' }}>
                    <Input
                      label="URL da Foto da Fazenda *"
                      value={farm.farmPhoto || ''}
                      onChange={(value) => onUpdateFarm(farm.tempId, { farmPhoto: value })}
                      isDark={isDark}
                      valid={farm.farmPhoto ? isValidImageUrl(farm.farmPhoto) : undefined}
                      validationMessage={
                        farm.farmPhoto
                          ? isValidImageUrl(farm.farmPhoto)
                            ? 'URL de imagem válida!'
                            : 'URL deve ser uma imagem válida (.jpg, .png, .gif, .webp)'
                          : 'URL da foto é obrigatória'
                      }
                      validationType={
                        farm.farmPhoto
                          ? isValidImageUrl(farm.farmPhoto)
                            ? 'success'
                            : 'error'
                          : 'error'
                      }
                      placeholder="https://exemplo.com/fazenda.jpg"
                    />
                  </div>
                </FormGrid>

                {/* 📏 SEÇÃO DE ÁREAS */}
                <div style={{ marginTop: '2rem' }}>
                  <h3
                    style={{
                      color: isDark ? '#fff' : '#2c3e50',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    📏 Áreas da Propriedade
                  </h3>

                  <FormGrid>
                    <Input
                      label="Área Total (hectares) *"
                      type="number"
                      value={farm.totalArea ? farm.totalArea.toString() : ''}
                      onChange={(value) => {
                        const numValue = Number(value);
                        onUpdateFarm(farm.tempId, {
                          totalArea: numValue > 0 ? numValue : undefined,
                        });
                      }}
                      isDark={isDark}
                      valid={farm.totalArea ? validateTotalArea(farm.totalArea) : undefined}
                      validationMessage={
                        farm.totalArea
                          ? validateTotalArea(farm.totalArea)
                            ? 'Área válida!'
                            : 'Área deve ser maior que 0'
                          : 'Área total é obrigatória'
                      }
                      validationType={
                        farm.totalArea && validateTotalArea(farm.totalArea) ? 'success' : 'error'
                      }
                      placeholder="Ex: 150.00"
                    />

                    <Input
                      label="Área Agricultável (hectares) *"
                      type="number"
                      value={farm.agriculturalArea?.toString() || ''}
                      onChange={(value) =>
                        onUpdateFarm(farm.tempId, { agriculturalArea: Number(value) || 0 })
                      }
                      isDark={isDark}
                      valid={
                        farm.agriculturalArea !== undefined
                          ? validateAgricultureArea(farm.agriculturalArea)
                          : undefined
                      }
                      validationMessage={
                        farm.agriculturalArea !== undefined
                          ? validateAgricultureArea(farm.agriculturalArea)
                            ? 'Área válida!'
                            : 'Área não pode ser negativa'
                          : 'Área agricultável é obrigatória'
                      }
                      validationType={
                        farm.agriculturalArea !== undefined &&
                        validateAgricultureArea(farm.agriculturalArea)
                          ? 'success'
                          : 'error'
                      }
                      placeholder="0.00"
                    />

                    <Input
                      label="Área de Vegetação (hectares) *"
                      type="number"
                      value={farm.vegetationArea?.toString() || ''}
                      onChange={(value) =>
                        onUpdateFarm(farm.tempId, { vegetationArea: Number(value) || 0 })
                      }
                      isDark={isDark}
                      valid={
                        farm.vegetationArea !== undefined
                          ? validateVegetationArea(farm.vegetationArea)
                          : undefined
                      }
                      validationMessage={
                        farm.vegetationArea !== undefined
                          ? validateVegetationArea(farm.vegetationArea)
                            ? 'Área válida!'
                            : 'Área não pode ser negativa'
                          : 'Área de vegetação é obrigatória'
                      }
                      validationType={
                        farm.vegetationArea !== undefined &&
                        validateVegetationArea(farm.vegetationArea)
                          ? 'success'
                          : 'error'
                      }
                      placeholder="0.00"
                    />
                  </FormGrid>

                  {/* ⚠️ VALIDAÇÃO DE ÁREAS */}
                  {farm.totalArea > 0 && !validateAreas(farm) && (
                    <AreaValidation isDark={isDark}>
                      ⚠️ A soma das áreas (
                      {((farm.agriculturalArea || 0) + (farm.vegetationArea || 0)).toLocaleString()}{' '}
                      ha) não pode exceder a área total ({farm.totalArea.toLocaleString()} ha)
                    </AreaValidation>
                  )}
                </div>

                {/* 📊 SCORES DE PERFORMANCE */}
                <div style={{ marginTop: '2rem' }}>
                  <h3
                    style={{
                      color: isDark ? '#fff' : '#2c3e50',
                      marginBottom: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '19px',
                    }}
                  >
                    📊 Scores de Performance
                  </h3>

                  <div style={{ display: 'grid', gap: '1.5rem' }}>
                    <RangeSlider
                      label="Produtividade"
                      icon="🚜"
                      value={farm.productivity || 0}
                      onChange={(value) => onUpdateFarm(farm.tempId, { productivity: value })}
                      color="#37cb83"
                      isDark={isDark}
                      min={0}
                      max={100}
                    />

                    <RangeSlider
                      label="Sustentabilidade"
                      icon="🌱"
                      value={farm.sustainability || 0}
                      onChange={(value) => onUpdateFarm(farm.tempId, { sustainability: value })}
                      color="#27ae60"
                      isDark={isDark}
                      min={0}
                      max={100}
                    />

                    <RangeSlider
                      label="Tecnologia"
                      icon="🔬"
                      value={farm.technology || 0}
                      onChange={(value) => onUpdateFarm(farm.tempId, { technology: value })}
                      color="#3498db"
                      isDark={isDark}
                      min={0}
                      max={100}
                    />
                  </div>
                </div>
              </div>
            </FarmContent>
          </FarmAccordion>
        );
      })}
    </FormCard>
  );
};
