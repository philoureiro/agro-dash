import React from 'react';

import { Button, Input } from '@components';
import { Crop, Farm } from '@entities';

import { RemoveButton } from '../farm-form/styles';
import { FormCard, FormGrid } from '../producer-form/styles';
import { CropCard, CropHeader, CropTypeIcon, CropValidation, ProductivityMeter } from './styles';

interface CropFormProps {
  farms: (Farm & { tempId: string })[];
  crops: Record<string, Crop[]>;
  validation: {
    crops: Record<
      string,
      Record<string, { typeValid: boolean; areaValid: boolean; datesValid: boolean }>
    >;
  };
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
  // 🌱 TIPOS DE CULTURAS
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

  // 🎯 VALIDAÇÕES
  const isValidImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
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
        const totalPlantedArea = farmCrops.reduce((sum, crop) => sum + (crop.plantedArea || 0), 0);
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
                  style={{
                    background: 'linear-gradient(135deg, #27ae60, #229954)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
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
              farmCrops.map((crop, cropIndex) => {
                const cropValidation = validation.crops[farm.tempId]?.[crop.id] || {
                  typeValid: false,
                  areaValid: false,
                  datesValid: false,
                };

                const isValid =
                  cropValidation.typeValid && cropValidation.areaValid && cropValidation.datesValid;
                const cropTypeInfo = cropTypes.find((ct) => ct.value === crop.type);

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
                        </div>
                      </div>

                      <RemoveButton
                        isDark={isDark}
                        onClick={() => onRemoveCrop(farm.tempId, crop.id)}
                      >
                        🗑️ Remover
                      </RemoveButton>
                    </CropHeader>

                    {/* 📝 FORMULÁRIO COM INPUTS PADRÃO */}
                    <FormGrid>
                      <Input
                        label="Tipo de Cultura *"
                        value={crop.type || ''}
                        onChange={(value) => onUpdateCrop(farm.tempId, crop.id, { type: value })}
                        isDark={isDark}
                        valid={cropValidation.typeValid}
                        validationMessage={
                          crop.type
                            ? cropValidation.typeValid
                              ? 'Tipo válido!'
                              : 'Selecione um tipo de cultura'
                            : undefined
                        }
                        validationType={crop.type && cropValidation.typeValid ? 'success' : 'error'}
                        options={[
                          { value: '', label: 'Selecione o tipo' },
                          ...cropTypes.map((type) => ({
                            value: type.value,
                            label: `${type.icon} ${type.label}`,
                          })),
                        ]}
                      />

                      <Input
                        label="Ano da Safra *"
                        value={crop.harvestYear || ''}
                        onChange={(value) =>
                          onUpdateCrop(farm.tempId, crop.id, { harvestYear: value })
                        }
                        isDark={isDark}
                        valid={!!crop.harvestYear}
                        validationMessage={crop.harvestYear ? 'Ano válido!' : undefined}
                        validationType={crop.harvestYear ? 'success' : 'error'}
                        options={[
                          { value: '', label: 'Selecione o ano' },
                          ...Array.from({ length: 4 }, (_, i) => {
                            const year = new Date().getFullYear() + i;
                            return { value: year.toString(), label: year.toString() };
                          }),
                        ]}
                      />

                      <Input
                        label="Área Plantada (hectares) *"
                        type="number"
                        value={crop.plantedArea?.toString() || ''}
                        onChange={(value) =>
                          onUpdateCrop(farm.tempId, crop.id, { plantedArea: Number(value) || 0 })
                        }
                        isDark={isDark}
                        valid={cropValidation.areaValid}
                        validationMessage={
                          crop.plantedArea
                            ? cropValidation.areaValid
                              ? 'Área válida!'
                              : 'Área deve ser maior que 0'
                            : undefined
                        }
                        validationType={
                          crop.plantedArea && cropValidation.areaValid ? 'success' : 'error'
                        }
                        placeholder="0.00"
                      />

                      <Input
                        label="Produtividade Esperada (ton/ha)"
                        type="number"
                        value={crop.expectedYield?.toString() || ''}
                        onChange={(value) =>
                          onUpdateCrop(farm.tempId, crop.id, { expectedYield: Number(value) || 0 })
                        }
                        isDark={isDark}
                        valid={crop.expectedYield ? crop.expectedYield > 0 : undefined}
                        validationMessage={
                          crop.expectedYield
                            ? crop.expectedYield > 0
                              ? 'Produtividade válida!'
                              : 'Deve ser maior que 0'
                            : undefined
                        }
                        validationType={
                          crop.expectedYield && crop.expectedYield > 0 ? 'success' : 'info'
                        }
                        placeholder="0.0"
                      />

                      <Input
                        label="Data de Plantio"
                        type="date"
                        value={formatDate(crop.plantingDate)}
                        onChange={(value) =>
                          onUpdateCrop(farm.tempId, crop.id, {
                            plantingDate: value ? new Date(value) : undefined,
                          })
                        }
                        isDark={isDark}
                        valid={crop.plantingDate ? true : undefined}
                        validationMessage={crop.plantingDate ? 'Data válida!' : undefined}
                        validationType={crop.plantingDate ? 'success' : 'info'}
                      />

                      <Input
                        label="Data de Colheita"
                        type="date"
                        value={formatDate(crop.harvestDate)}
                        onChange={(value) =>
                          onUpdateCrop(farm.tempId, crop.id, {
                            harvestDate: value ? new Date(value) : undefined,
                          })
                        }
                        isDark={isDark}
                        valid={cropValidation.datesValid}
                        validationMessage={
                          crop.harvestDate && crop.plantingDate
                            ? cropValidation.datesValid
                              ? 'Data válida!'
                              : 'Deve ser posterior ao plantio'
                            : undefined
                        }
                        validationType={
                          crop.harvestDate && crop.plantingDate && cropValidation.datesValid
                            ? 'success'
                            : 'error'
                        }
                      />

                      <div style={{ gridColumn: '1 / -1' }}>
                        <Input
                          label="URL da Foto da Cultura"
                          value={crop.cropPhoto || ''}
                          onChange={(value) =>
                            onUpdateCrop(farm.tempId, crop.id, { cropPhoto: value })
                          }
                          isDark={isDark}
                          valid={crop.cropPhoto ? isValidImageUrl(crop.cropPhoto) : undefined}
                          validationMessage={
                            crop.cropPhoto
                              ? isValidImageUrl(crop.cropPhoto)
                                ? 'URL válida!'
                                : 'URL deve ser uma imagem válida'
                              : 'Cole uma URL de imagem para preview'
                          }
                          validationType={
                            crop.cropPhoto
                              ? isValidImageUrl(crop.cropPhoto)
                                ? 'success'
                                : 'error'
                              : 'info'
                          }
                          placeholder="https://exemplo.com/cultura.jpg"
                        />
                      </div>

                      <div style={{ gridColumn: '1 / -1' }}>
                        <Input
                          label="Observações"
                          value={crop.notes || ''}
                          onChange={(value) => onUpdateCrop(farm.tempId, crop.id, { notes: value })}
                          isDark={isDark}
                          valid={crop.notes ? true : undefined}
                          validationMessage={crop.notes ? 'Observações adicionadas!' : undefined}
                          validationType={crop.notes ? 'success' : 'info'}
                          placeholder="Observações sobre a cultura..."
                          multiline
                          rows={3}
                        />
                      </div>
                    </FormGrid>

                    {/* 📊 INDICADOR DE PRODUTIVIDADE */}
                    {crop.plantedArea &&
                      crop.plantedArea > 0 &&
                      crop.expectedYield &&
                      crop.expectedYield > 0 && (
                        <ProductivityMeter isDark={isDark}>
                          <div className="metric">
                            <span className="label">Produção Estimada:</span>
                            <span className="value">
                              {(crop.plantedArea * crop.expectedYield).toLocaleString()} ton
                            </span>
                          </div>
                          <div className="metric">
                            <span className="label">Utilização da Fazenda:</span>
                            <span className="value">
                              {farm.agriculturalArea > 0
                                ? ((crop.plantedArea / farm.agriculturalArea) * 100).toFixed(1)
                                : 0}
                              %
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{
                                width: `${Math.min(farm.agriculturalArea > 0 ? (crop.plantedArea / farm.agriculturalArea) * 100 : 0, 100)}%`,
                                background:
                                  farm.agriculturalArea > 0 &&
                                  crop.plantedArea / farm.agriculturalArea > 1
                                    ? '#E74C3C'
                                    : '#27AE60',
                              }}
                            />
                          </div>
                        </ProductivityMeter>
                      )}

                    {/* ⚠️ VALIDAÇÃO DE DATAS */}
                    {crop.plantingDate && crop.harvestDate && !cropValidation.datesValid && (
                      <CropValidation isDark={isDark} type="error">
                        ⚠️ Data de colheita deve ser posterior à data de plantio
                      </CropValidation>
                    )}

                    {/* ⚠️ VALIDAÇÃO DE ÁREA */}
                    {crop.plantedArea &&
                      farm.agriculturalArea &&
                      crop.plantedArea > farm.agriculturalArea && (
                        <CropValidation isDark={isDark} type="warning">
                          ⚠️ Área plantada ({crop.plantedArea.toLocaleString()} ha) excede área
                          agricultável da fazenda ({farm.agriculturalArea.toLocaleString()} ha)
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
