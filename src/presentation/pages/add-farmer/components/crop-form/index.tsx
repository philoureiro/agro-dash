import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { MdDeleteOutline } from 'react-icons/md';
import { TiArrowDownThick, TiArrowUpThick } from 'react-icons/ti';
import { useNavigate } from 'react-router-dom';

import {
  AutoFillButton,
  Button,
  ConfirmModal,
  Input,
  PhotoPreview,
  ProgressBar,
} from '@components';
import { Crop, Farm } from '@entities';
import { useAutoFill } from '@hooks';

import { FormCard, FormGrid } from '../producer-form/styles';
import {
  CropCard,
  CropFormContainer,
  CropFormHeader,
  CropHeader,
  CropTypeIcon,
  CropValidation,
  DeleteCropButton,
  FarmSelector,
  HeaderBox,
} from './styles';

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
  // 🎯 ESTADOS SUPREMOS
  const [expandedFarms, setExpandedFarms] = useState<Record<string, boolean>>({});
  const [expandedCrops, setExpandedCrops] = useState<Record<string, boolean>>({});
  const [confirmModal, setConfirmModal] = useState<{
    isVisible: boolean;
    farmId: string;
    cropId: string;
    cropName: string;
  } | null>(null);

  // 🌱 TIPOS DE CULTURAS SUPREMOS
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

  // 🎯 UTILITÁRIOS SUPREMOS
  const isValidImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  const formatDate = (date: Date | undefined): string => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // 🎮 CONTROLES DE EXPANSÃO
  const toggleFarmExpansion = (farmId: string) => {
    setExpandedFarms((prev) => ({
      ...prev,
      [farmId]: !prev[farmId],
    }));
  };

  const toggleCropExpansion = (cropId: string) => {
    setExpandedCrops((prev) => ({
      ...prev,
      [cropId]: !prev[cropId],
    }));
  };

  // 🎯 SCHEMA PARA AUTO-FILL
  const getAutoFillSchema = (availableArea: number, isFirstCrop: boolean) => ({
    type: {
      type: 'select' as const,
      options: cropTypes.map((ct) => ct.value),
    },
    harvestYear: {
      type: 'year' as const,
      min: 2025,
      max: 2028,
    },
    plantedArea: {
      type: 'number' as const,
      min: 1,
      max: Math.max(availableArea, 50),
    },
    expectedYield: {
      type: 'smartYield' as const,
    },
    plantingDate: {
      type: 'smartPlantingDate' as const,
    },
    harvestDate: {
      type: 'smartHarvestDate' as const,
    },
    cropPhoto: {
      type: 'url' as const,
    },
    notes: {
      type: 'smartCropNotes' as const,
    },
  });

  // 🔥 HANDLER PARA AUTO-FILL UPDATE
  const handleAutoFillUpdate =
    (farmId: string, cropId: string, availableArea: number, isFirstCrop: boolean) =>
    (path: string, value: string | number | Date) => {
      const updates: Partial<Crop> = {};

      switch (path) {
        case 'type':
          updates.type = value as string;
          break;
        case 'harvestYear':
          updates.harvestYear = value as string;
          break;
        case 'plantedArea':
          updates.plantedArea = value as number;
          break;
        case 'expectedYield':
          updates.expectedYield = value as number;
          break;
        case 'plantingDate':
          updates.plantingDate = value instanceof Date ? value : new Date(value as string);
          break;
        case 'harvestDate':
          updates.harvestDate = value instanceof Date ? value : new Date(value as string);
          break;
        case 'cropPhoto':
          updates.cropPhoto = value as string;
          break;
        case 'notes':
          updates.notes = value as string;
          break;
      }

      onUpdateCrop(farmId, cropId, updates);
    };

  // 🎯 VERIFICA SE CULTURA ESTÁ VÁLIDA
  const isCropValid = (farmId: string, cropId: string): boolean => {
    const cropValidation = validation.crops[farmId]?.[cropId];
    return cropValidation?.typeValid && cropValidation?.areaValid && cropValidation?.datesValid;
  };

  // 🗑️ HANDLER PARA DELETAR CULTURA
  const handleDeleteCrop = (farmId: string, cropId: string, cropName: string) => {
    setConfirmModal({
      isVisible: true,
      farmId,
      cropId,
      cropName,
    });
  };

  const confirmDeleteCrop = () => {
    if (confirmModal) {
      onRemoveCrop(confirmModal.farmId, confirmModal.cropId);
      setConfirmModal(null);
    }
  };

  // 🎯 SE NÃO HÁ FAZENDAS
  if (farms.length === 0) {
    return (
      <FormCard isDark={isDark}>
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
            background: isDark ? 'rgba(255, 193, 7, 0.05)' : 'rgba(255, 193, 7, 0.02)',
            borderRadius: '16px',
            border: `2px dashed ${isDark ? 'rgba(255, 193, 7, 0.3)' : 'rgba(255, 193, 7, 0.2)'}`,
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏭</div>
          <h2 style={{ margin: '0 0 1rem 0', color: isDark ? '#FFC107' : '#F57C00' }}>
            Adicione fazendas primeiro
          </h2>
          <p style={{ fontSize: '1.1rem', maxWidth: '400px', margin: '0 auto' }}>
            É necessário ter pelo menos uma fazenda cadastrada para poder adicionar culturas
          </p>
        </div>
      </FormCard>
    );
  }

  return (
    <FormCard isDark={isDark}>
      <HeaderBox isDark={isDark}>
        <h2
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
          }}
        >
          🌱 Culturas Plantadas
          <span
            style={{
              fontSize: '0.9rem',
              opacity: 0.7,
              background: isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)',
              padding: '0.3rem 0.6rem',
              borderRadius: '12px',
              border: isDark
                ? '1px solid rgba(55, 203, 131, 0.3)'
                : '1px solid rgba(55, 203, 131, 0.2)',
            }}
          >
            {Object.values(crops).flat().length} cultura
            {Object.values(crops).flat().length !== 1 ? 's' : ''}
          </span>
        </h2>

        <Button
          isDark={isDark}
          onClick={() => {
            const allExpanded = Object.values(expandedFarms).every(Boolean);
            const newState = farms.reduce(
              (acc, farm) => {
                acc[farm.tempId] = !allExpanded;
                return acc;
              },
              {} as Record<string, boolean>,
            );
            setExpandedFarms(newState);
          }}
          style={{
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}`,
            color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            boxShadow: 'none',
            height: '40px',
            width: 140,
            justifyContent: 'center',
          }}
        >
          {Object.values(expandedFarms).every(Boolean) ? (
            <>
              <TiArrowUpThick size={18} /> Recolher Tudo
            </>
          ) : (
            <>
              <TiArrowDownThick size={18} /> Expandir Tudo
            </>
          )}
        </Button>
      </HeaderBox>

      {/* 🏭 FAZENDAS COM CULTURAS */}
      {farms.map((farm, farmIndex) => {
        const farmCrops = crops[farm.tempId] || [];
        const totalPlantedArea = farmCrops.reduce((sum, crop) => sum + (crop.plantedArea || 0), 0);
        const availableArea = (farm.agriculturalArea || 0) - totalPlantedArea;
        const isExpanded = expandedFarms[farm.tempId] ?? true;
        const utilizationPercent =
          farm.agriculturalArea > 0 ? (totalPlantedArea / farm.agriculturalArea) * 100 : 0;

        return (
          <FarmSelector key={farm.tempId} isDark={isDark} style={{ marginBottom: '2rem' }}>
            {/* 🏭 HEADER DA FAZENDA - CLICÁVEL */}
            <div
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => toggleFarmExpansion(farm.tempId)}
            >
              <CropFormContainer isDark={isDark}>
                <CropFormHeader isDark={isDark}>
                  <div className="farm-title">
                    {farm.name || `Fazenda ${farmIndex + 1}`}
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      ({farmCrops.length} cultura{farmCrops.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  <div className="farm-stats">
                    <div className="stat">
                      📏 Total:{' '}
                      <span className="value">
                        {(farm.agriculturalArea || 0).toLocaleString()} ha
                      </span>
                    </div>
                    <div className="stat">
                      🌱 Plantada:{' '}
                      <span className="value">{totalPlantedArea.toLocaleString()} ha</span>
                    </div>
                    <div className="stat">
                      <span>
                        💚 Disponível:{' '}
                        <span className="value">{availableArea.toLocaleString()} ha</span>
                      </span>
                    </div>
                  </div>

                  <ProgressBar
                    progress={utilizationPercent}
                    isDark={isDark}
                    label={'Utilização da área'}
                    showPercentage={true}
                    style={{ marginTop: 10 }}
                    textStyle={{ fontSize: '12px' }}
                    color="#27ae60"
                    emptyColor="#e0e0e0"
                  />
                </CropFormHeader>

                <Button
                  isDark={isDark}
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddCrop(farm.tempId);
                    setExpandedFarms((prev) => ({ ...prev, [farm.tempId]: true }));
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #27ae60, #229954)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 20px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.9rem',
                    minWidth: '200px',
                    height: '60px',
                    justifyContent: 'center',
                    boxShadow: 'none',
                  }}
                >
                  <FaPlus size={16} /> Adicionar Cultura
                </Button>
              </CropFormContainer>

              {/* ⚠️ ALERTA DE ÁREA EXCEDIDA */}
              {availableArea < 0 && (
                <CropValidation isDark={isDark} type="error" style={{ marginTop: '1rem' }}>
                  Área plantada excede área agricultável em{' '}
                  {Math.abs(availableArea).toLocaleString()} ha
                </CropValidation>
              )}
            </div>

            {/* 🌱 CULTURAS DA FAZENDA - COLAPSÁVEIS */}
            {isExpanded && (
              <div style={{ marginTop: '1.5rem' }}>
                {farmCrops.length === 0 ? (
                  <div
                    style={{
                      padding: '3rem 2rem',
                      textAlign: 'center',
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)',
                      background: isDark ? 'rgba(45, 52, 64, 0.3)' : 'rgba(248, 250, 252, 0.5)',
                      borderRadius: '12px',
                      border: `2px dashed ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                    }}
                  >
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
                    <h3>Nenhuma cultura plantada</h3>
                    <p>Clique em "Adicionar Cultura" para começar</p>
                  </div>
                ) : (
                  farmCrops.map((crop, cropIndex) => {
                    const cropValidation = validation.crops[farm.tempId]?.[crop.id] || {
                      typeValid: false,
                      areaValid: false,
                      datesValid: false,
                    };

                    const isValid = isCropValid(farm.tempId, crop.id);
                    const cropTypeInfo = cropTypes.find((ct) => ct.value === crop.type);
                    const isCropExpanded = expandedCrops[crop.id] ?? false;
                    const isFirstCrop = cropIndex === 0;

                    // 🎯 DADOS ATUAIS PARA AUTO-FILL
                    const currentCropData = {
                      type: crop.type,
                      harvestYear: crop.harvestYear,
                      plantedArea: crop.plantedArea,
                      expectedYield: crop.expectedYield,
                      plantingDate: crop.plantingDate,
                      harvestDate: crop.harvestDate,
                      cropPhoto: crop.cropPhoto,
                      notes: crop.notes,
                    };

                    return (
                      <CropCard
                        key={crop.id}
                        isDark={isDark}
                        isValid={isValid}
                        style={{ marginBottom: '1.5rem' }}
                      >
                        {/* 🎯 HEADER DA CULTURA - CLICÁVEL */}
                        <CropHeader>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '1rem',
                              flex: 1,
                              cursor: 'pointer',
                            }}
                            onClick={() => toggleCropExpansion(crop.id)}
                          >
                            <CropTypeIcon color={cropTypeInfo?.color || '#95A5A6'}>
                              {cropTypeInfo?.icon || '🌱'}
                            </CropTypeIcon>
                            <div style={{ flex: 1 }}>
                              <h4
                                style={{
                                  margin: 0,
                                  color: isDark ? '#fff' : '#2c3e50',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  flexWrap: 'wrap',
                                }}
                              >
                                {cropTypeInfo?.label || `Cultura #${cropIndex + 1}`}
                                {isCropExpanded ? (
                                  <TiArrowUpThick size={16} />
                                ) : (
                                  <TiArrowDownThick size={16} />
                                )}
                              </h4>

                              {/* 🎯 PREVIEW RÁPIDO */}
                              {!isCropExpanded && (
                                <div
                                  style={{
                                    fontSize: '0.8rem',
                                    color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)',
                                    display: 'flex',
                                    gap: '1rem',
                                    flexWrap: 'wrap',
                                    marginTop: '0.3rem',
                                  }}
                                >
                                  {crop.plantedArea && (
                                    <span>📏 {crop.plantedArea.toLocaleString()} ha</span>
                                  )}
                                  {crop.expectedYield && (
                                    <span>📊 {crop.expectedYield} ton/ha</span>
                                  )}
                                  {crop.harvestYear && <span>📅 {crop.harvestYear}</span>}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* 🎯 BOTÕES DE AÇÃO */}
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <AutoFillButton
                              schema={getAutoFillSchema(availableArea, isFirstCrop)}
                              onUpdate={handleAutoFillUpdate(
                                farm.tempId,
                                crop.id,
                                availableArea,
                                isFirstCrop,
                              )}
                              currentData={currentCropData}
                              isDark={isDark}
                              tooltipPosition="left"
                              size="small"
                              fillOnlyEmpty={true}
                              imageContext="crop"
                              cropType={crop.type}
                              availableArea={availableArea}
                              isFirstCrop={isFirstCrop}
                            />

                            <DeleteCropButton
                              isDark={isDark}
                              onClick={() =>
                                handleDeleteCrop(
                                  farm.tempId,
                                  crop.id,
                                  cropTypeInfo?.label || 'Cultura',
                                )
                              }
                            >
                              <MdDeleteOutline size={16} />
                            </DeleteCropButton>
                          </div>
                        </CropHeader>

                        {/* 📝 FORMULÁRIO EXPANDIDO */}
                        {isCropExpanded && (
                          <>
                            <FormGrid>
                              <Input
                                label="Tipo de Cultura *"
                                value={crop.type || ''}
                                onChange={(value) =>
                                  onUpdateCrop(farm.tempId, crop.id, {
                                    type: value as Crop['type'],
                                  })
                                }
                                isDark={isDark}
                                valid={cropValidation.typeValid}
                                validationMessage={
                                  crop.type
                                    ? cropValidation.typeValid
                                      ? 'Tipo válido!'
                                      : 'Selecione um tipo de cultura'
                                    : undefined
                                }
                                validationType={
                                  crop.type && cropValidation.typeValid ? 'success' : 'error'
                                }
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
                                  onUpdateCrop(farm.tempId, crop.id, {
                                    plantedArea: Number(value) || 0,
                                  })
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
                                  onUpdateCrop(farm.tempId, crop.id, {
                                    expectedYield: Number(value) || 0,
                                  })
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
                                  valid={
                                    crop.cropPhoto ? isValidImageUrl(crop.cropPhoto) : undefined
                                  }
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
                                  onChange={(value) =>
                                    onUpdateCrop(farm.tempId, crop.id, { notes: value })
                                  }
                                  isDark={isDark}
                                  valid={crop.notes ? true : undefined}
                                  validationMessage={
                                    crop.notes ? 'Observações adicionadas!' : undefined
                                  }
                                  validationType={crop.notes ? 'success' : 'info'}
                                  placeholder="Observações sobre a cultura..."
                                  multiline
                                  rows={3}
                                />
                              </div>
                            </FormGrid>

                            {/* ⚠️ VALIDAÇÕES VISUAIS */}
                            {crop.plantingDate &&
                              crop.harvestDate &&
                              !cropValidation.datesValid && (
                                <CropValidation isDark={isDark} type="error">
                                  Data de colheita deve ser posterior à data de plantio
                                </CropValidation>
                              )}

                            {crop.plantedArea &&
                              farm.agriculturalArea &&
                              crop.plantedArea > farm.agriculturalArea && (
                                <CropValidation isDark={isDark} type="warning">
                                  ⚠️ Área plantada ({crop.plantedArea.toLocaleString()} ha) excede
                                  área agricultável da fazenda (
                                  {farm.agriculturalArea.toLocaleString()} ha)
                                </CropValidation>
                              )}

                            {/* 🎯 PREVIEW DA IMAGEM COM COMPONENTE PhotoPreview */}
                            {crop.cropPhoto && (
                              <div style={{ marginTop: '1rem' }}>
                                <PhotoPreview
                                  photoUrl={crop.cropPhoto}
                                  isDark={isDark}
                                  type="crop"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </CropCard>
                    );
                  })
                )}
              </div>
            )}
          </FarmSelector>
        );
      })}

      {/* 📊 RESUMO GERAL DAS CULTURAS */}
      {Object.values(crops).flat().length > 0 && (
        <div
          style={{
            marginTop: '2rem',
            background: isDark ? 'rgba(52, 152, 219, 0.1)' : 'rgba(52, 152, 219, 0.05)',
            border: `1px solid ${isDark ? 'rgba(52, 152, 219, 0.3)' : 'rgba(52, 152, 219, 0.2)'}`,
            borderRadius: '12px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h3
            style={{
              margin: '0 0 1rem 0',
              color: isDark ? '#3498DB' : '#2980B9',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            📊 Resumo Geral das Culturas
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.9rem',
            }}
          >
            <div className="stat">
              <strong>Total de Culturas:</strong>
              <br />
              <span
                style={{
                  color: isDark ? '#3498DB' : '#2980B9',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                }}
              >
                {Object.values(crops).flat().length}
              </span>
            </div>

            <div className="stat">
              <strong>Área Total Plantada:</strong>
              <br />
              <span
                style={{
                  color: isDark ? '#27AE60' : '#229954',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                }}
              >
                {Object.values(crops)
                  .flat()
                  .reduce((sum, crop) => sum + (crop.plantedArea || 0), 0)
                  .toLocaleString()}{' '}
                ha
              </span>
            </div>

            <div className="stat">
              <strong>Produção Estimada:</strong>
              <br />
              <span
                style={{
                  color: isDark ? '#F39C12' : '#E67E22',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                }}
              >
                {Object.values(crops)
                  .flat()
                  .reduce((sum, crop) => {
                    return sum + (crop.plantedArea || 0) * (crop.expectedYield || 0);
                  }, 0)
                  .toLocaleString()}{' '}
                ton
              </span>
            </div>

            <div className="stat">
              <strong>Culturas Válidas:</strong>
              <br />
              <span
                style={{
                  color:
                    Object.values(crops)
                      .flat()
                      .filter((crop, index, array) => {
                        const farmId = Object.keys(crops).find((fId) => crops[fId].includes(crop));
                        return farmId && isCropValid(farmId, crop.id);
                      }).length === Object.values(crops).flat().length
                      ? '#27AE60'
                      : '#E74C3C',
                  fontSize: '1.2em',
                  fontWeight: 'bold',
                }}
              >
                {
                  Object.values(crops)
                    .flat()
                    .filter((crop, index, array) => {
                      const farmId = Object.keys(crops).find((fId) => crops[fId].includes(crop));
                      return farmId && isCropValid(farmId, crop.id);
                    }).length
                }{' '}
                / {Object.values(crops).flat().length}
              </span>
            </div>
          </div>

          {/* 🌾 TIPOS DE CULTURAS RESUMO */}
          {Object.values(crops).flat().length > 0 && (
            <div style={{ marginTop: '1.5rem' }}>
              <h4
                style={{
                  margin: '0 0 1rem 0',
                  color: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)',
                  fontSize: '1rem',
                }}
              >
                🌾 Tipos de Culturas:
              </h4>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                {[
                  ...new Set(
                    Object.values(crops)
                      .flat()
                      .map((crop) => crop.type)
                      .filter(Boolean),
                  ),
                ].map((type) => {
                  const typeInfo = cropTypes.find((ct) => ct.value === type);
                  const count = Object.values(crops)
                    .flat()
                    .filter((crop) => crop.type === type).length;

                  return (
                    <div
                      key={type}
                      style={{
                        background: isDark ? `${typeInfo?.color}20` : `${typeInfo?.color}15`,
                        border: `1px solid ${typeInfo?.color}50`,
                        borderRadius: '16px',
                        padding: '0.4rem 0.8rem',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: isDark ? '#fff' : '#2c3e50',
                      }}
                    >
                      <span>{typeInfo?.icon}</span>
                      <span>{typeInfo?.label}</span>
                      <span
                        style={{
                          background: `${typeInfo?.color}30`,
                          borderRadius: '10px',
                          padding: '0.1rem 0.4rem',
                          fontSize: '0.7rem',
                          fontWeight: 'bold',
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 🗑️ MODAL DE CONFIRMAÇÃO PARA DELETAR */}
      <ConfirmModal
        isVisible={!!confirmModal?.isVisible}
        isDark={isDark}
        type="danger"
        title="🗑️ Remover Cultura"
        subtitle={`Tem certeza que deseja remover a cultura "${confirmModal?.cropName}"?`}
        message="Esta ação não pode ser desfeita. Todos os dados desta cultura serão perdidos permanentemente."
        confirmText="Sim, Remover"
        cancelText="Cancelar"
        onConfirm={confirmDeleteCrop}
        onCancel={() => setConfirmModal(null)}
        loading={false}
      />
    </FormCard>
  );
};
