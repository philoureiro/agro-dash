// src/components/AddFarmer/FarmForm.tsx
import React from 'react';

import { Button } from '@components';
import { Farm } from '@entities';
import { States } from '@enums';

import {
  FloatingLabel,
  FormCard,
  FormGrid,
  InputGroup,
  StyledInput,
  StyledSelect,
} from '../../../../../../styles';
import {
  AreaValidation,
  FarmCard,
  FarmHeader,
  PreviewImage,
  PreviewInfo,
  RemoveButton,
  SliderContainer,
  SliderLabel,
  SliderThumb,
  SliderTrack,
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
  // 🌄 IMAGENS DE FAZENDAS PARA PREVIEW
  const farmImages = [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop',
  ];

  // 📍 ESTADOS BRASILEIROS
  const estados = [
    { value: States.AC, label: 'Acre' },
    { value: States.AL, label: 'Alagoas' },
    { value: States.AP, label: 'Amapá' },
    { value: States.AM, label: 'Amazonas' },
    { value: States.BA, label: 'Bahia' },
    { value: States.CE, label: 'Ceará' },
    { value: States.DF, label: 'Distrito Federal' },
    { value: States.ES, label: 'Espírito Santo' },
    { value: States.GO, label: 'Goiás' },
    { value: States.MA, label: 'Maranhão' },
    { value: States.MT, label: 'Mato Grosso' },
    { value: States.MS, label: 'Mato Grosso do Sul' },
    { value: States.MG, label: 'Minas Gerais' },
    { value: States.PA, label: 'Pará' },
    { value: States.PB, label: 'Paraíba' },
    { value: States.PR, label: 'Paraná' },
    { value: States.PE, label: 'Pernambuco' },
    { value: States.PI, label: 'Piauí' },
    { value: States.RJ, label: 'Rio de Janeiro' },
    { value: States.RN, label: 'Rio Grande do Norte' },
    { value: States.RS, label: 'Rio Grande do Sul' },
    { value: States.RO, label: 'Rondônia' },
    { value: States.RR, label: 'Roraima' },
    { value: States.SC, label: 'Santa Catarina' },
    { value: States.SP, label: 'São Paulo' },
    { value: States.SE, label: 'Sergipe' },
    { value: States.TO, label: 'Tocantins' },
  ];

  // 🎯 VALIDAR ÁREAS
  const validateAreas = (farm: Farm): boolean => {
    return farm.totalArea > 0 && farm.agriculturalArea + farm.vegetationArea <= farm.totalArea;
  };

  // 🎨 COMPONENTE DE SLIDER CUSTOMIZADO
  const ScoreInput: React.FC<{
    label: string;
    value: number;
    onChange: (value: number) => void;
    color: string;
  }> = ({ label, value, onChange, color }) => (
    <SliderContainer isDark={isDark}>
      <SliderLabel isDark={isDark}>
        {label}: <strong style={{ color }}>{value}%</strong>
      </SliderLabel>
      <SliderTrack isDark={isDark}>
        <SliderThumb isDark={isDark} position={(value / 100) * 100} color={color} />
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '100%',
            opacity: 0,
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      </SliderTrack>
    </SliderContainer>
  );

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
        const isValid = Object.values(farmValidation).every(Boolean);

        return (
          <FarmCard
            key={farm.tempId}
            isDark={isDark}
            isValid={isValid}
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
                {isValid && <span style={{ fontSize: '1rem' }}>✅</span>}
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

            {/* 📝 FORMULÁRIO BÁSICO */}
            <FormGrid>
              <InputGroup>
                <FloatingLabel
                  isDark={isDark}
                  active={!!farm.name}
                  valid={farmValidation.nameValid ?? false}
                >
                  Nome da Fazenda *
                </FloatingLabel>
                <StyledInput
                  isDark={isDark}
                  value={farm.name || ''}
                  valid={farmValidation.nameValid ?? false}
                  onChange={(e) => onUpdateFarm(farm.tempId, { name: e.target.value })}
                  placeholder=" "
                />
              </InputGroup>

              <InputGroup>
                <FloatingLabel
                  isDark={isDark}
                  active={!!farm.city}
                  valid={farmValidation.locationValid ?? false}
                >
                  Cidade *
                </FloatingLabel>
                <StyledInput
                  isDark={isDark}
                  value={farm.city || ''}
                  valid={farmValidation.locationValid ?? false}
                  onChange={(e) => onUpdateFarm(farm.tempId, { city: e.target.value })}
                  placeholder=" "
                />
              </InputGroup>

              <InputGroup>
                <FloatingLabel
                  isDark={isDark}
                  active={!!farm.state}
                  valid={farmValidation.locationValid ?? false}
                >
                  Estado *
                </FloatingLabel>
                <StyledSelect
                  isDark={isDark}
                  value={farm.state || ''}
                  valid={farmValidation.locationValid ?? false}
                  onChange={(e) => onUpdateFarm(farm.tempId, { state: e.target.value as States })}
                >
                  <option value="">Selecione</option>
                  {estados.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </StyledSelect>
              </InputGroup>

              <InputGroup>
                <FloatingLabel isDark={isDark} active={!!farm.zipCode} valid={true}>
                  CEP
                </FloatingLabel>
                <StyledInput
                  isDark={isDark}
                  value={farm.zipCode || ''}
                  valid={true}
                  onChange={(e) => {
                    const zipCode = e.target.value.replace(/\D/g, '').slice(0, 8);
                    const formatted = zipCode.replace(/(\d{5})(\d)/, '$1-$2');
                    onUpdateFarm(farm.tempId, { zipCode: formatted });
                  }}
                  placeholder=" "
                />
              </InputGroup>

              <InputGroup style={{ gridColumn: '1 / -1' }}>
                <FloatingLabel
                  isDark={isDark}
                  active={!!farm.farmPhoto}
                  valid={farmValidation.photoValid ?? false}
                >
                  URL da Foto da Fazenda
                </FloatingLabel>
                <StyledInput
                  isDark={isDark}
                  value={farm.farmPhoto || ''}
                  valid={farmValidation.photoValid ?? false}
                  onChange={(e) => onUpdateFarm(farm.tempId, { farmPhoto: e.target.value })}
                  placeholder=" "
                />
              </InputGroup>
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
                <InputGroup>
                  <FloatingLabel
                    isDark={isDark}
                    active={farm.totalArea > 0}
                    valid={farmValidation.areasValid ?? false}
                  >
                    Área Total (hectares) *
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="number"
                    value={farm.totalArea || ''}
                    valid={farmValidation.areasValid ?? false}
                    onChange={(e) =>
                      onUpdateFarm(farm.tempId, { totalArea: Number(e.target.value) })
                    }
                    placeholder=" "
                    min="0"
                    step="0.01"
                  />
                </InputGroup>

                <InputGroup>
                  <FloatingLabel
                    isDark={isDark}
                    active={farm.agriculturalArea > 0}
                    valid={farmValidation.areasValid ?? false}
                  >
                    Área Agricultável (hectares) *
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="number"
                    value={farm.agriculturalArea || ''}
                    valid={farmValidation.areasValid ?? false}
                    onChange={(e) =>
                      onUpdateFarm(farm.tempId, { agriculturalArea: Number(e.target.value) })
                    }
                    placeholder=" "
                    min="0"
                    step="0.01"
                  />
                </InputGroup>

                <InputGroup>
                  <FloatingLabel
                    isDark={isDark}
                    active={farm.vegetationArea > 0}
                    valid={farmValidation.areasValid ?? false}
                  >
                    Área de Vegetação (hectares) *
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="number"
                    value={farm.vegetationArea || ''}
                    valid={farmValidation.areasValid ?? false}
                    onChange={(e) =>
                      onUpdateFarm(farm.tempId, { vegetationArea: Number(e.target.value) })
                    }
                    placeholder=" "
                    min="0"
                    step="0.01"
                  />
                </InputGroup>
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

            {/* 📊 SCORES DE PERFORMANCE */}
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
                <ScoreInput
                  label="🚜 Produtividade"
                  value={farm.productivity || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { productivity: value })}
                  color="#37cb83"
                />

                <ScoreInput
                  label="🌱 Sustentabilidade"
                  value={farm.sustainability || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { sustainability: value })}
                  color="#27ae60"
                />

                <ScoreInput
                  label="🔬 Tecnologia"
                  value={farm.technology || 50}
                  onChange={(value) => onUpdateFarm(farm.tempId, { technology: value })}
                  color="#3498db"
                />
              </div>
            </div>
          </FarmCard>
        );
      })}
    </FormCard>
  );
};
