// src/components/AddFarmer/CropForm.tsx
import React from 'react';

import { Button } from '@components';
import { Crop, Farm } from '@entities';

import {
  FloatingLabel,
  FormCard,
  FormGrid,
  InputGroup,
  RemoveButton,
  StyledInput,
  StyledSelect,
} from '../../../../../../styles';
import { CropCard, CropHeader, CropTypeIcon, CropValidation, ProductivityMeter } from './styles';

// Define a type for tempId
type TempId = { tempId: string };

// Define a type for CropValidation
export interface CropValidationType {
  [farmId: string]: {
    [cropId: string]: {
      typeValid: boolean;
      areaValid: boolean;
      datesValid: boolean;
      [key: string]: boolean;
    };
  };
}

interface CropFormProps {
  farms: (Farm & TempId)[];
  crops: Record<string, Crop[]>; // crops por farmId
  validation: { crops?: CropValidationType };
  onAddCrop: (farmId: string) => void;
  onRemoveCrop: (farmId: string, cropId: string) => void;
  onUpdateCrop: (farmId: string, cropId: string, updates: Partial<Crop>) => void;
  isDark: boolean;
}

export const CropForm: React.FC<CropFormProps> = ({
  farms,
  crops,
  validation,
  onAddCrop,
  onRemoveCrop,
  onUpdateCrop,
  isDark,
}) => {
  // 🌱 TIPOS DE CULTURAS COM ÍCONES
  const cropTypes = [
    { value: 'SOJA', label: 'Soja', icon: '🌾', color: '#F1C40F' },
    { value: 'MILHO', label: 'Milho', icon: '🌽', color: '#F39C12' },
    { value: 'ALGODAO', label: 'Algodão', icon: '☁️', color: '#ECF0F1' },
    { value: 'CANA_DE_ACUCAR', label: 'Cana-de-açúcar', icon: '🎋', color: '#27AE60' },
    { value: 'CAFE', label: 'Café', icon: '☕', color: '#8B4513' },
    { value: 'ARROZ', label: 'Arroz', icon: '🍚', color: '#F8F9FA' },
    { value: 'FEIJAO', label: 'Feijão', icon: '🫘', color: '#A0522D' },
    { value: 'TRIGO', label: 'Trigo', icon: '🌾', color: '#DAA520' },
    { value: 'SORGO', label: 'Sorgo', icon: '🌾', color: '#CD853F' },
    { value: 'GIRASSOL', label: 'Girassol', icon: '🌻', color: '#FFD700' },
    { value: 'AMENDOIM', label: 'Amendoim', icon: '🥜', color: '#DEB887' },
    { value: 'MANDIOCA', label: 'Mandioca', icon: '🍠', color: '#D2691E' },
  ];

  // 📅 CALCULAR DIAS PARA COLHEITA
  const getDaysToHarvest = (harvestDate: string | Date | null): number | null => {
    if (!harvestDate) return null;
    const harvest = new Date(harvestDate);
    const today = new Date();
    const diffTime = harvest.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // 🎯 STATUS DA CULTURA
  const getCropStatus = (plantingDate: string | Date | null, harvestDate: string | Date | null) => {
    const now = new Date();

    if (!plantingDate) return { status: 'planned', color: '#95A5A6', label: 'Planejada' };

    const planting = new Date(plantingDate);
    if (planting > now) return { status: 'planned', color: '#95A5A6', label: 'Planejada' };

    if (!harvestDate) return { status: 'growing', color: '#27AE60', label: 'Crescendo' };

    const harvest = new Date(harvestDate);
    if (harvest > now) return { status: 'growing', color: '#27AE60', label: 'Crescendo' };

    return { status: 'ready', color: '#F39C12', label: 'Pronta para Colheita' };
  };

  // 🎨 COMPONENTE DE MEDIDOR DE PRODUTIVIDADE
  const ProductivityIndicator: React.FC<{
    plantedArea: number;
    expectedYield: number;
    farmArea: number;
  }> = ({ plantedArea, expectedYield, farmArea }) => {
    const totalProduction = plantedArea * expectedYield;
    const utilizationPercentage = farmArea > 0 ? (plantedArea / farmArea) * 100 : 0;

    return (
      <ProductivityMeter isDark={isDark}>
        <div className="metric">
          <span className="label">Produção Estimada:</span>
          <span className="value">{totalProduction.toLocaleString()} ton</span>
        </div>
        <div className="metric">
          <span className="label">Utilização da Área:</span>
          <span className="value">{utilizationPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(utilizationPercentage, 100)}%`,
              background: utilizationPercentage > 100 ? '#E74C3C' : '#27AE60',
            }}
          />
        </div>
      </ProductivityMeter>
    );
  };

  return (
    <FormCard isDark={isDark}>
      <h2>🌱 Culturas Plantadas</h2>

      {farms.length === 0 && (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            background: isDark ? 'rgba(255, 193, 7, 0.05)' : 'rgba(255, 193, 7, 0.02)',
            borderRadius: '12px',
            border: `2px dashed ${isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)'}`,
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏭</div>
          <h3>Adicione fazendas primeiro</h3>
          <p>É necessário ter pelo menos uma fazenda para cadastrar culturas</p>
        </div>
      )}

      {farms.map((farm, farmIndex) => {
        const farmCrops = crops[farm.tempId] || [];

        const totalPlantedArea = farmCrops.reduce(
          (sum: number, crop: Crop) => sum + (crop.plantedArea || 0),
          0,
        );
        const availableArea = (farm.agriculturalArea || 0) - totalPlantedArea;

        return (
          <div key={farm.tempId} style={{ marginBottom: '3rem' }}>
            {/* 🏭 HEADER DA FAZENDA */}
            <div
              style={{
                background: isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)',
                border: isDark
                  ? '1px solid rgba(55, 203, 131, 0.3)'
                  : '1px solid rgba(55, 203, 131, 0.2)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div>
                  <h3
                    style={{
                      color: isDark ? '#37cb83' : '#27ae60',
                      margin: '0 0 0.5rem 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    🏭 {farm.name || `Fazenda ${farmIndex + 1}`}
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      ({farmCrops.length} cultura{farmCrops.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                  <div
                    style={{
                      fontSize: '0.9rem',
                      color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                      display: 'flex',
                      gap: '2rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <span>📏 Total: {(farm.agriculturalArea || 0).toLocaleString()} ha</span>
                    <span>🌱 Plantada: {totalPlantedArea.toLocaleString()} ha</span>
                    <span
                      style={{
                        color: availableArea < 0 ? '#E74C3C' : '#27AE60',
                        fontWeight: 'bold',
                      }}
                    >
                      💚 Disponível: {availableArea.toLocaleString()} ha
                    </span>
                  </div>
                </div>

                <Button
                  isDark={isDark}
                  onClick={() => onAddCrop(farm.tempId)}
                  disabled={availableArea <= 0}
                  style={{
                    background:
                      availableArea <= 0
                        ? 'rgba(149, 165, 166, 0.5)'
                        : 'linear-gradient(135deg, #27ae60, #229954)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: availableArea <= 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                  }}
                >
                  🌱 Adicionar Cultura
                </Button>
              </div>

              {/* ⚠️ ALERTA DE ÁREA EXCEDIDA */}
              {availableArea < 0 && (
                <CropValidation isDark={isDark} type="error">
                  ⚠️ Área plantada excede área agricultável em{' '}
                  {Math.abs(availableArea).toLocaleString()} ha
                </CropValidation>
              )}
            </div>

            {/* 🌱 CULTURAS DA FAZENDA */}
            {farmCrops.length === 0 ? (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                  background: isDark ? 'rgba(45, 52, 64, 0.3)' : 'rgba(248, 250, 252, 0.5)',
                  borderRadius: '12px',
                  border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌱</div>
                <p>Nenhuma cultura plantada nesta fazenda</p>
              </div>
            ) : (
              farmCrops.map((crop: Crop, cropIndex: number) => {
                // Use CropValidationType for cropValidation, fallback to default values
                const cropValidation = validation.crops?.[farm.tempId]?.[crop.id] ?? {
                  typeValid: false,
                  areaValid: false,
                  datesValid: false,
                };
                const isValid =
                  typeof cropValidation === 'object' &&
                  cropValidation !== null &&
                  Object.values(cropValidation).length > 0
                    ? Object.values(cropValidation).every(Boolean)
                    : false;
                const cropTypeInfo = cropTypes.find((ct) => ct.value === crop.type);

                const status = getCropStatus(crop.plantingDate ?? null, crop.harvestDate ?? null);

                const daysToHarvest = getDaysToHarvest(crop.harvestDate ?? null);

                return (
                  <CropCard
                    key={crop.id}
                    isDark={isDark}
                    isValid={isValid}
                    style={{ marginBottom: '1.5rem' }}
                  >
                    <CropHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <CropTypeIcon color={cropTypeInfo?.color || '#95A5A6'}>
                          {cropTypeInfo?.icon || '🌱'}
                        </CropTypeIcon>
                        <div>
                          <h4
                            style={{
                              margin: 0,
                              color: isDark ? '#fff' : '#2c3e50',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                            }}
                          >
                            Cultura #{cropIndex + 1}
                            {isValid && <span>✅</span>}
                          </h4>
                          <div
                            style={{
                              fontSize: '0.8rem',
                              color: status.color,
                              fontWeight: 'bold',
                              marginTop: '0.2rem',
                            }}
                          >
                            {status.label}
                            {daysToHarvest !== null && daysToHarvest > 0 && (
                              <span style={{ marginLeft: '0.5rem' }}>
                                ({daysToHarvest} dias para colheita)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <RemoveButton
                        isDark={isDark}
                        onClick={() => onRemoveCrop(farm.tempId, crop.id)}
                      >
                        🗑️
                      </RemoveButton>
                    </CropHeader>

                    <FormGrid
                      style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
                    >
                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!crop.type}
                          valid={!!cropValidation.typeValid}
                        >
                          Tipo de Cultura *
                        </FloatingLabel>
                        <StyledSelect
                          isDark={isDark}
                          value={crop.type || ''}
                          valid={!!cropValidation.typeValid}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, {
                              type:
                                e.target.value === ''
                                  ? undefined
                                  : (e.target.value as Crop['type']),
                            })
                          }
                        >
                          <option value="">Selecione</option>
                          {cropTypes.map((cropType) => (
                            <option key={cropType.value} value={cropType.value}>
                              {cropType.icon} {cropType.label}
                            </option>
                          ))}
                        </StyledSelect>
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel isDark={isDark} active={!!crop.harvestYear} valid={true}>
                          Ano da Safra *
                        </FloatingLabel>
                        <StyledSelect
                          isDark={isDark}
                          value={crop.harvestYear || ''}
                          valid={true}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, { harvestYear: e.target.value })
                          }
                        >
                          <option value="">Selecione</option>
                          {[2024, 2025, 2026, 2027].map((year) => (
                            <option key={year} value={year.toString()}>
                              {year}
                            </option>
                          ))}
                        </StyledSelect>
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!crop.plantedArea && crop.plantedArea > 0}
                          valid={!!cropValidation.areaValid}
                        >
                          Área Plantada (hectares) *
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="number"
                          value={crop.plantedArea ?? ''}
                          valid={!!cropValidation.areaValid}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, {
                              plantedArea:
                                e.target.value === '' ? undefined : Number(e.target.value),
                            })
                          }
                          placeholder=" "
                          min="0"
                          step="0.01"
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!crop.expectedYield && crop.expectedYield > 0}
                          valid={true}
                        >
                          Produtividade (ton/ha)
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="number"
                          value={crop.expectedYield ?? ''}
                          valid={true}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, {
                              expectedYield:
                                e.target.value === '' ? undefined : Number(e.target.value),
                            })
                          }
                          placeholder=" "
                          min="0"
                          step="0.1"
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!crop.plantingDate}
                          valid={!!cropValidation.datesValid}
                        >
                          Data de Plantio
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="date"
                          value={
                            crop.plantingDate
                              ? new Date(crop.plantingDate).toISOString().split('T')[0]
                              : ''
                          }
                          valid={!!cropValidation.datesValid}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, {
                              plantingDate: e.target.value ? new Date(e.target.value) : undefined,
                            })
                          }
                          placeholder=" "
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!crop.harvestDate}
                          valid={!!cropValidation.datesValid}
                        >
                          Data de Colheita
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="date"
                          value={
                            crop.harvestDate
                              ? new Date(crop.harvestDate).toISOString().split('T')[0]
                              : ''
                          }
                          valid={!!cropValidation.datesValid}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, {
                              harvestDate: e.target.value ? new Date(e.target.value) : undefined,
                            })
                          }
                          placeholder=" "
                        />
                      </InputGroup>

                      <InputGroup style={{ gridColumn: '1 / -1' }}>
                        <FloatingLabel isDark={isDark} active={!!crop.cropPhoto} valid={true}>
                          URL da Foto da Cultura
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          value={crop.cropPhoto || ''}
                          valid={true}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, { cropPhoto: e.target.value })
                          }
                          placeholder=" "
                        />
                      </InputGroup>

                      <InputGroup style={{ gridColumn: '1 / -1' }}>
                        <FloatingLabel isDark={isDark} active={!!crop.notes} valid={true}>
                          Observações
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          value={crop.notes || ''}
                          valid={true}
                          onChange={(e) =>
                            onUpdateCrop(farm.tempId, crop.id, { notes: e.target.value })
                          }
                          placeholder=" "
                          style={{ minHeight: '60px' }}
                        />
                      </InputGroup>
                    </FormGrid>

                    {/* 📊 INDICADOR DE PRODUTIVIDADE */}
                    {crop.plantedArea &&
                      crop.plantedArea > 0 &&
                      crop.expectedYield &&
                      crop.expectedYield > 0 && (
                        <ProductivityIndicator
                          plantedArea={crop.plantedArea}
                          expectedYield={crop.expectedYield}
                          farmArea={farm.agriculturalArea || 0}
                        />
                      )}

                    {/* ⚠️ VALIDAÇÃO DE DATAS */}
                    {crop.plantingDate &&
                      crop.harvestDate &&
                      new Date(crop.harvestDate) <= new Date(crop.plantingDate) && (
                        <CropValidation isDark={isDark} type="error">
                          ⚠️ Data de colheita deve ser posterior à data de plantio
                        </CropValidation>
                      )}
                  </CropCard>
                );
              })
            )}
          </div>
        );
      })}
    </FormCard>
  );
};
