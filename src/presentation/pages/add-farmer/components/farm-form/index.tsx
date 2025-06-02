import React from 'react';

import { Button, Input, RangeSlider } from '@components';
import { Farm } from '@entities';
import { States } from '@enums';

import { FormCard, FormGrid } from '../producer-form/styles';
import { estados, farmImages } from './images';
import {
  AreaValidation,
  FarmCard,
  FarmHeader,
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
  // 🎯 VALIDAR ÁREAS
  const validateAreas = (farm: Farm): boolean => {
    return farm.totalArea > 0 && farm.agriculturalArea + farm.vegetationArea <= farm.totalArea;
  };

  // 🎯 VALIDAR CEP
  const isValidZipCode = (zipCode: string): boolean => {
    return /^\d{5}-?\d{3}$/.test(zipCode);
  };

  // 🎯 VALIDAR URL DE IMAGEM
  const isValidImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  return (
    <FormCard isDark={isDark}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
        }}
      >
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
            transition: 'all 0.3s ease',
          }}
        >
          ➕ Adicionar Fazenda
        </Button>
      </div>

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

        return (
          <FarmCard
            key={farm.tempId}
            isDark={isDark}
            isValid={
              farmValidation.nameValid && farmValidation.locationValid && farmValidation.areasValid
            }
            style={{ marginBottom: '2rem' }}
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
                {farmValidation.nameValid &&
                  farmValidation.locationValid &&
                  farmValidation.areasValid && <span style={{ fontSize: '1rem' }}>✅</span>}
              </div>

              {farms.length > 1 && (
                <RemoveButton isDark={isDark} onClick={() => onRemoveFarm(farm.tempId)}>
                  🗑️ Remover
                </RemoveButton>
              )}
            </FarmHeader>

            {/* 🖼️ PREVIEW DA FAZENDA */}
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                padding: '1rem',
                background: isDark ? 'rgba(45, 52, 64, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                borderRadius: '12px',
                border: isDark
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : '1px solid rgba(0, 0, 0, 0.03)',
              }}
            >
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
            </div>

            {/* 📝 FORMULÁRIO COM COMPONENTE INPUT PADRÃO */}
            <FormGrid>
              <Input
                label="Nome da Fazenda *"
                value={farm.name || ''}
                onChange={(value) => onUpdateFarm(farm.tempId, { name: value })}
                isDark={isDark}
                valid={farm.name ? farm.name.trim().length >= 3 : undefined}
                validationMessage={
                  farm.name
                    ? farm.name.trim().length >= 3
                      ? 'Nome válido!'
                      : 'Nome deve ter pelo menos 3 caracteres'
                    : undefined
                }
                validationType={farm.name && farm.name.trim().length >= 3 ? 'success' : 'error'}
                placeholder="Ex: Fazenda São João"
              />

              <Input
                label="Cidade *"
                value={farm.city || ''}
                onChange={(value) => onUpdateFarm(farm.tempId, { city: value })}
                isDark={isDark}
                valid={farm.city ? farm.city.trim().length >= 2 : undefined}
                validationMessage={
                  farm.city
                    ? farm.city.trim().length >= 2
                      ? 'Cidade válida!'
                      : 'Nome da cidade muito curto'
                    : undefined
                }
                validationType={farm.city && farm.city.trim().length >= 2 ? 'success' : 'error'}
                placeholder="Ex: São Paulo"
              />

              <Input
                label="Estado *"
                value={farm.state || ''}
                onChange={(value) => onUpdateFarm(farm.tempId, { state: value as States })}
                isDark={isDark}
                valid={!!farm.state}
                validationMessage={farm.state ? 'Estado selecionado!' : undefined}
                validationType={farm.state ? 'success' : 'error'}
                options={[
                  { value: '', label: 'Selecione o estado' },
                  ...estados.map((estado) => ({ value: estado.value, label: estado.label })),
                ]}
              />

              <Input
                label="CEP"
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
                    : undefined
                }
                validationType={farm.zipCode && isValidZipCode(farm.zipCode) ? 'success' : 'error'}
                placeholder="12345-678"
              />

              <div style={{ gridColumn: '1 / -1' }}>
                <Input
                  label="URL da Foto da Fazenda"
                  value={farm.farmPhoto || ''}
                  onChange={(value) => onUpdateFarm(farm.tempId, { farmPhoto: value })}
                  isDark={isDark}
                  valid={farm.farmPhoto ? isValidImageUrl(farm.farmPhoto) : undefined}
                  validationMessage={
                    farm.farmPhoto
                      ? isValidImageUrl(farm.farmPhoto)
                        ? 'URL de imagem válida!'
                        : 'URL deve ser uma imagem válida (.jpg, .png, .gif, .webp)'
                      : 'Cole uma URL de imagem para ver o preview'
                  }
                  validationType={
                    farm.farmPhoto
                      ? isValidImageUrl(farm.farmPhoto)
                        ? 'success'
                        : 'error'
                      : 'info'
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
                  value={farm.totalArea?.toString() || ''}
                  onChange={(value) => onUpdateFarm(farm.tempId, { totalArea: Number(value) || 0 })}
                  isDark={isDark}
                  valid={farm.totalArea ? farm.totalArea > 0 : undefined}
                  validationMessage={
                    farm.totalArea
                      ? farm.totalArea > 0
                        ? 'Área válida!'
                        : 'Área deve ser maior que 0'
                      : undefined
                  }
                  validationType={farm.totalArea && farm.totalArea > 0 ? 'success' : 'error'}
                  placeholder="0.00"
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
                    farm.agriculturalArea !== undefined ? farm.agriculturalArea >= 0 : undefined
                  }
                  validationMessage={
                    farm.agriculturalArea !== undefined
                      ? farm.agriculturalArea >= 0
                        ? 'Área válida!'
                        : 'Área não pode ser negativa'
                      : undefined
                  }
                  validationType={
                    farm.agriculturalArea !== undefined && farm.agriculturalArea >= 0
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
                  valid={farm.vegetationArea !== undefined ? farm.vegetationArea >= 0 : undefined}
                  validationMessage={
                    farm.vegetationArea !== undefined
                      ? farm.vegetationArea >= 0
                        ? 'Área válida!'
                        : 'Área não pode ser negativa'
                      : undefined
                  }
                  validationType={
                    farm.vegetationArea !== undefined && farm.vegetationArea >= 0
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

            {/* 📊 SCORES DE PERFORMANCE COM NOVO SLIDER */}
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
                📊 Scores de Performance
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <RangeSlider
                  label="Produtividade"
                  icon="🚜"
                  value={farm.productivity || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { productivity: value })}
                  color="#37cb83"
                  isDark={isDark}
                />

                <RangeSlider
                  label="Sustentabilidade"
                  icon="🌱"
                  value={farm.sustainability || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { sustainability: value })}
                  color="#27ae60"
                  isDark={isDark}
                />

                <RangeSlider
                  label="Tecnologia"
                  icon="🔬"
                  value={farm.technology || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { technology: value })}
                  color="#3498db"
                  isDark={isDark}
                />
              </div>
            </div>
          </FarmCard>
        );
      })}
    </FormCard>
  );
};
