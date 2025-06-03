import React from 'react';

import { AutoFillButton, Button, Input, RangeSlider } from '@components';
import { Farm } from '@entities';
import { States } from '@enums';

import { FormCard, FormGrid, HeaderContainer } from '../producer-form/styles';
import { estados, farmImages } from './images';
import {
  AreaValidation,
  FarmCard,
  FarmHeader,
  PreviewContainer,
  PreviewImage,
  PreviewInfo,
  RemoveButton,
} from './styles';

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
  validation,
  onAddFarm,
  onRemoveFarm,
  onUpdateFarm,
  isDark,
}) => {
  // 🎯 SCHEMA PARA AUTO-FILL DA FAZENDA - CORRIGIDO
  const createFarmAutoFillSchema = () => ({
    name: { type: 'text' as const }, // 🎯 REMOVE custom completamente
    city: { type: 'text' as const }, // 🎯 REMOVE custom completamente
    state: {
      type: 'select' as const,
      options: estados.map((e) => e.value).filter((v) => v !== ''),
    },
    zipCode: { type: 'cep' as const },
    farmPhoto: { type: 'url' as const },
    totalArea: { type: 'number' as const, min: 50, max: 1000 },
    agriculturalArea: { type: 'number' as const, min: 20, max: 800 },
    vegetationArea: { type: 'number' as const, min: 10, max: 300 },
    productivity: { type: 'percentage' as const, min: 30, max: 100 },
    sustainability: { type: 'percentage' as const, min: 30, max: 100 },
    technology: { type: 'percentage' as const, min: 30, max: 100 },
  });

  // 🎯 FUNÇÃO PARA ATUALIZAR CAMPOS VIA AUTO-FILL - MELHORADA
  const handleAutoFillUpdate = (tempId: string) => (path: string, value: string | number) => {
    console.log(`🎯 AutoFill atualizando fazenda ${tempId} - ${path} com valor:`, value);

    // Mapeia os caminhos do schema para as propriedades do Farm
    const fieldMap: Record<string, keyof Farm> = {
      name: 'name',
      city: 'city',
      state: 'state',
      zipCode: 'zipCode',
      farmPhoto: 'farmPhoto',
      totalArea: 'totalArea',
      agriculturalArea: 'agriculturalArea',
      vegetationArea: 'vegetationArea',
      productivity: 'productivity',
      sustainability: 'sustainability',
      technology: 'technology',
    };

    const farmField = fieldMap[path];
    if (farmField) {
      let processedValue = value;

      // 🎯 PROCESSAMENTO ESPECÍFICO POR CAMPO
      if (path === 'zipCode' && typeof value === 'string') {
        // Formata CEP automaticamente
        processedValue = value.replace(/(\d{5})(\d)/, '$1-$2');
      } else if (path === 'agriculturalArea' || path === 'vegetationArea') {
        // 🎯 GARANTIR QUE ÁREAS SEJAM PROPORCIONAIS
        const farm = farms.find((f) => f.tempId === tempId);
        if (farm && farm.totalArea) {
          const currentTotal = farm.totalArea;
          const maxAllowed = currentTotal * 0.8; // Máximo 80% da área total
          processedValue = Math.min(Number(value), maxAllowed);
        }
      }

      const updates: Partial<Farm> = { [farmField]: processedValue };
      onUpdateFarm(tempId, updates);
    }
  };

  // 🎯 DADOS ATUAIS DO FORMULÁRIO DE FAZENDA
  const getCurrentFarmData = (farm: Farm) => ({
    name: farm.name || '', // String vazia para campos de texto
    city: farm.city || '', // String vazia para campos de texto
    state: farm.state || '',
    zipCode: farm.zipCode || '',
    farmPhoto: farm.farmPhoto || '',
    totalArea: farm.totalArea || 0, // 🎯 Zero para números
    agriculturalArea: farm.agriculturalArea || 0,
    vegetationArea: farm.vegetationArea || 0,
    productivity: farm.productivity || 0,
    sustainability: farm.sustainability || 0,
    technology: farm.technology || 0,
  });

  // 🎯 VALIDAR ÁREAS
  const validateAreas = (farm: Farm): boolean => {
    return (
      farm.totalArea > 0 &&
      (farm.agriculturalArea || 0) + (farm.vegetationArea || 0) <= farm.totalArea
    );
  };

  // 🎯 VALIDAR CEP
  const isValidZipCode = (zipCode: string): boolean => {
    return /^\d{5}-?\d{3}$/.test(zipCode);
  };

  // 🎯 VALIDAR URL DE IMAGEM
  const isValidImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  // 🎯 VALIDAÇÕES COMPLETAS PARA CADA CAMPO
  const validateFarmName = (name: string): boolean => {
    return name && name.trim().length >= 3;
  };

  const validateCity = (city: string): boolean => {
    return city && city.trim().length >= 2;
  };

  const validateState = (state: string): boolean => {
    return state && state !== '';
  };

  const validateTotalArea = (area: number): boolean => {
    return area && area > 0;
  };

  const validateAgricultureArea = (area: number): boolean => {
    return area !== undefined && area >= 0;
  };

  const validateVegetationArea = (area: number): boolean => {
    return area !== undefined && area >= 0;
  };

  return (
    <FormCard isDark={isDark}>
      {/* 🎯 HEADER COM TÍTULO E BOTÃO ADICIONAR */}
      <HeaderContainer>
        <h2>🏭 Fazendas ({farms.length})</h2>
        <Button
          isDark={isDark}
          onClick={onAddFarm}
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
            maxWidth: '180px',
            transition: 'all 0.3s ease',
          }}
        >
          ➕ Adicionar Fazenda
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
        const farmValidation = validation.farms[farm.tempId] || {};
        const autoFillSchema = createFarmAutoFillSchema();
        const currentFarmData = getCurrentFarmData(farm);

        return (
          <FarmCard
            key={farm.tempId}
            isDark={isDark}
            isValid={
              validateFarmName(farm.name || '') &&
              validateCity(farm.city || '') &&
              validateState(farm.state || '') &&
              validateTotalArea(farm.totalArea || 0) &&
              validateAreas(farm)
            }
            style={{ marginBottom: '2rem', position: 'relative' }}
          >
            <FarmHeader>
              <div
                style={{
                  color: isDark ? '#37cb83' : '#27ae60',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                🏭 Fazenda #{index + 1}
                {validateFarmName(farm.name || '') &&
                  validateCity(farm.city || '') &&
                  validateState(farm.state || '') &&
                  validateTotalArea(farm.totalArea || 0) &&
                  validateAreas(farm) && <span style={{ fontSize: '1rem' }}>✅</span>}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* 🚀 BOTÃO AUTO-FILL PARA CADA FAZENDA */}
                <AutoFillButton
                  schema={autoFillSchema}
                  onUpdate={handleAutoFillUpdate(farm.tempId)}
                  currentData={currentFarmData}
                  isDark={isDark}
                  tooltipPosition="left"
                  size="small"
                  fillOnlyEmpty={true}
                  imageContext="farm"
                />

                {farms.length > 1 && (
                  <RemoveButton isDark={isDark} onClick={() => onRemoveFarm(farm.tempId)}>
                    🗑️ Remover
                  </RemoveButton>
                )}
              </div>
            </FarmHeader>

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

            {/* 📝 FORMULÁRIO COM VALIDAÇÕES COMPLETAS */}
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
                validationType={farm.zipCode && isValidZipCode(farm.zipCode) ? 'success' : 'error'}
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

            {/* 📏 SEÇÃO DE ÁREAS COM VALIDAÇÕES COMPLETAS */}
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
                  value={farm.totalArea ? farm.totalArea.toString() : ''} // 🎯 CORREÇÃO: só mostra se > 0
                  onChange={(value) => {
                    const numValue = Number(value);
                    onUpdateFarm(farm.tempId, { totalArea: numValue > 0 ? numValue : undefined }); // 🎯 undefined se <= 0
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
                    farm.vegetationArea !== undefined && validateVegetationArea(farm.vegetationArea)
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
                  {((farm.agriculturalArea || 0) + (farm.vegetationArea || 0)).toLocaleString()} ha)
                  não pode exceder a área total ({farm.totalArea.toLocaleString()} ha)
                </AreaValidation>
              )}
            </div>

            {/* 📊 SCORES DE PERFORMANCE COM VALORES MÍNIMOS */}
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
                  value={farm.productivity || 0} // 🎯 Inicia em 0
                  onChange={(value) => onUpdateFarm(farm.tempId, { productivity: value })} // 🎯 Remove Math.max
                  color="#37cb83"
                  isDark={isDark}
                  min={0} // 🎯 Mínimo 0%
                  max={100}
                />

                <RangeSlider
                  label="Sustentabilidade"
                  icon="🌱"
                  value={farm.sustainability || 0} // 🎯 Inicia em 0
                  onChange={(value) => onUpdateFarm(farm.tempId, { sustainability: value })} // 🎯 Remove Math.max
                  color="#27ae60"
                  isDark={isDark}
                  min={0} // 🎯 Mínimo 0%
                  max={100}
                />

                <RangeSlider
                  label="Tecnologia"
                  icon="🔬"
                  value={farm.technology || 0} // 🎯 Inicia em 0
                  onChange={(value) => onUpdateFarm(farm.tempId, { technology: value })} // 🎯 Remove Math.max
                  color="#3498db"
                  isDark={isDark}
                  min={0} // 🎯 Mínimo 0%
                  max={100}
                />
              </div>
            </div>
          </FarmCard>
        );
      })}
    </FormCard>
  );
};
