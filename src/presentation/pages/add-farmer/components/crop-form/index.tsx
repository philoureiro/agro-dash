import React, { useState } from 'react';
import { BsFillClipboard2PlusFill } from 'react-icons/bs';

import { Button, Input } from '@components';
import { Crop, Farm } from '@entities';
import { useAutoFill } from '@hooks';

import { RemoveButton } from '../farm-form/styles';
import { FormCard, FormGrid } from '../producer-form/styles';
import {
  AreaUtilizationBar,
  CropCard,
  CropHeader,
  CropStatusBadge,
  CropTypeIcon,
  CropValidation,
  FarmSelector,
  ProductivityMeter,
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
  const [loadingFills, setLoadingFills] = useState<Record<string, boolean>>({});

  // 🔥 AUTO-FILL SUPREMO
  const { autoFill } = useAutoFill();

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

  // 🔥 AUTO-FILL SUPREMO PARA CULTURA
  const handleAutoFillCrop = async (farmId: string, cropId: string, crop: Crop) => {
    const fillKey = `${farmId}-${cropId}`;
    setLoadingFills((prev) => ({ ...prev, [fillKey]: true }));

    try {
      // 🎯 SCHEMA SUPREMO PARA CULTURAS
      const cropSchema = {
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
          max: 500,
        },
        expectedYield: {
          type: 'number' as const,
          min: 1,
          max: 20,
        },
        plantingDate: {
          type: 'date' as const,
        },
        harvestDate: {
          type: 'date' as const,
        },
        cropPhoto: {
          type: 'url' as const,
        },
        notes: {
          type: 'textarea' as const,
        },
      };

      // 🎯 DADOS ATUAIS DA CULTURA
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

      // 🚀 EXECUTA AUTO-FILL SUPREMO
      autoFill(
        cropSchema,
        (path: string, value: string | number) => {
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
              updates.plantingDate = new Date(value as string);
              break;
            case 'harvestDate':
              // 🎯 GERA DATA DE COLHEITA 3-6 MESES APÓS PLANTIO
              if (crop.plantingDate || updates.plantingDate) {
                const plantDate = updates.plantingDate || crop.plantingDate!;
                const harvestDate = new Date(plantDate);
                harvestDate.setMonth(harvestDate.getMonth() + Math.floor(Math.random() * 4) + 3);
                updates.harvestDate = harvestDate;
              } else {
                updates.harvestDate = new Date(value as string);
              }
              break;
            case 'cropPhoto':
              updates.cropPhoto = value as string;
              break;
            case 'notes':
              updates.notes = value as string;
              break;
          }

          onUpdateCrop(farmId, cropId, updates);
        },
        {
          currentData: currentCropData,
          fillOnlyEmpty: true,
          imageContext: 'crop',
          cropType: crop.type,
        },
      );

      // 🎉 EXPANDE AUTOMATICAMENTE APÓS PREENCHER
      setExpandedCrops((prev) => ({ ...prev, [cropId]: true }));
    } catch (error) {
      console.error('Erro no auto-fill:', error);
    } finally {
      // ⏱️ DELAY PARA UX
      setTimeout(() => {
        setLoadingFills((prev) => ({ ...prev, [fillKey]: false }));
      }, 1000);
    }
  };

  // 🎯 CALCULA STATUS DA CULTURA
  const getCropStatus = (crop: Crop): 'planned' | 'growing' | 'ready' | 'harvested' => {
    const now = new Date();

    if (!crop.plantingDate) return 'planned';
    if (!crop.harvestDate) return 'growing';

    const plantDate = new Date(crop.plantingDate);
    const harvestDate = new Date(crop.harvestDate);

    if (now < plantDate) return 'planned';
    if (now >= plantDate && now < harvestDate) return 'growing';
    if (now >= harvestDate) return 'harvested';

    return 'ready';
  };

  // 🎯 VERIFICA SE CULTURA ESTÁ VÁLIDA
  const isCropValid = (farmId: string, cropId: string): boolean => {
    const cropValidation = validation.crops[farmId]?.[cropId];
    return cropValidation?.typeValid && cropValidation?.areaValid && cropValidation?.datesValid;
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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

        {/* 🎯 CONTROLES GLOBAIS */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
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
            }}
          >
            {Object.values(expandedFarms).every(Boolean) ? (
              <>
                <BsFillClipboard2PlusFill size={14} /> Recolher Tudo
              </>
            ) : (
              <>
                <BsFillClipboard2PlusFill size={14} /> Expandir Tudo
              </>
            )}
          </Button>
        </div>
      </div>

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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '1rem',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div className="farm-title">
                    🏭 {farm.name || `Fazenda ${farmIndex + 1}`}
                    <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      ({farmCrops.length} cultura{farmCrops.length !== 1 ? 's' : ''})
                    </span>
                    {isExpanded ? (
                      <BsFillClipboard2PlusFill size={20} />
                    ) : (
                      <BsFillClipboard2PlusFill size={20} />
                    )}
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
                      <span style={{ color: availableArea < 0 ? '#E74C3C' : '#27AE60' }}>
                        💚 Disponível:{' '}
                        <span className="value">{availableArea.toLocaleString()} ha</span>
                      </span>
                    </div>
                  </div>

                  {/* 📊 BARRA DE UTILIZAÇÃO */}
                  <AreaUtilizationBar isDark={isDark} percentage={utilizationPercent} />
                </div>

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
                    minWidth: '160px',
                    justifyContent: 'center',
                  }}
                >
                  <BsFillClipboard2PlusFill size={16} /> Adicionar Cultura
                </Button>
              </div>

              {/* ⚠️ ALERTA DE ÁREA EXCEDIDA */}
              {availableArea < 0 && (
                <CropValidation isDark={isDark} type="error" style={{ marginTop: '1rem' }}>
                  ⚠️ Área plantada excede área agricultável em{' '}
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
                    const cropStatus = getCropStatus(crop);
                    const fillKey = `${farm.tempId}-${crop.id}`;
                    const isAutoFilling = loadingFills[fillKey];

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
                                <CropStatusBadge status={cropStatus} isDark={isDark}>
                                  {cropStatus}
                                </CropStatusBadge>
                                {isValid && <BsFillClipboard2PlusFill size={16} color="#27ae60" />}
                                {!isValid && crop.type && (
                                  <BsFillClipboard2PlusFill size={16} color="#E74C3C" />
                                )}
                                {isCropExpanded ? (
                                  <BsFillClipboard2PlusFill size={16} />
                                ) : (
                                  <BsFillClipboard2PlusFill size={16} />
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
                            <Button
                              isDark={isDark}
                              onClick={() => handleAutoFillCrop(farm.tempId, crop.id, crop)}
                              disabled={isAutoFilling}
                              style={{
                                background: isAutoFilling
                                  ? 'rgba(52, 152, 219, 0.3)'
                                  : 'linear-gradient(135deg, #3498db, #2980b9)',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 12px',
                                color: 'white',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                                cursor: isAutoFilling ? 'not-allowed' : 'pointer',
                                opacity: isAutoFilling ? 0.7 : 1,
                              }}
                            >
                              <BsFillClipboard2PlusFill
                                size={12}
                                className={isAutoFilling ? 'animate-spin' : ''}
                              />
                              {isAutoFilling ? 'Preenchendo...' : 'Auto-Fill'}
                            </Button>

                            <RemoveButton
                              isDark={isDark}
                              onClick={() => onRemoveCrop(farm.tempId, crop.id)}
                              style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                            >
                              <BsFillClipboard2PlusFill size={12} /> Remover
                            </RemoveButton>
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

                            {/* 📊 MÉTRICAS DE PRODUTIVIDADE */}
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
                                        ? (
                                            (crop.plantedArea / farm.agriculturalArea) *
                                            100
                                          ).toFixed(1)
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

                            {/* 🎯 PREVIEW DA IMAGEM */}
                            {crop.cropPhoto && isValidImageUrl(crop.cropPhoto) && (
                              <div
                                style={{
                                  marginTop: '1rem',
                                  textAlign: 'center',
                                  background: isDark
                                    ? 'rgba(45, 52, 64, 0.3)'
                                    : 'rgba(248, 250, 252, 0.5)',
                                  borderRadius: '8px',
                                  padding: '1rem',
                                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                }}
                              >
                                <img
                                  src={crop.cropPhoto}
                                  alt={`Preview de ${cropTypeInfo?.label || 'cultura'}`}
                                  style={{
                                    maxWidth: '200px',
                                    maxHeight: '150px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    border: `2px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                                <p
                                  style={{
                                    fontSize: '0.8rem',
                                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)',
                                    margin: '0.5rem 0 0 0',
                                  }}
                                >
                                  📸 Preview da cultura
                                </p>
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
    </FormCard>
  );
};
