import { Farm } from '@entities';

// 🎯 VALIDAÇÕES
export const validateAreas = (farm: Farm): boolean => {
  return (
    farm.totalArea > 0 &&
    (farm.agriculturalArea || 0) + (farm.vegetationArea || 0) <= farm.totalArea
  );
};

export const isValidZipCode = (zipCode: string): boolean => {
  return /^\d{5}-?\d{3}$/.test(zipCode);
};

export const isValidImageUrl = (url: string): boolean => {
  return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
};

export const validateFarmName = (name: string): boolean => {
  return name && name.trim().length >= 3;
};

export const validateCity = (city: string): boolean => {
  return city && city.trim().length >= 2;
};

export const validateState = (state: string): boolean => {
  return state && state !== '';
};

export const validateTotalArea = (area: number): boolean => {
  return area && area > 0;
};

export const validateAgricultureArea = (area: number): boolean => {
  return area !== undefined && area >= 0;
};

export const validateVegetationArea = (area: number): boolean => {
  return area !== undefined && area >= 0;
};

// 🎯 DADOS ATUAIS DO FORMULÁRIO DE FAZENDA
export const getCurrentFarmData = (farm: Farm) => ({
  name: farm.name || '',
  city: farm.city || '',
  state: farm.state || '',
  zipCode: farm.zipCode || '',
  farmPhoto: farm.farmPhoto || '',
  totalArea: farm.totalArea || 0,
  agriculturalArea: farm.agriculturalArea || 0,
  vegetationArea: farm.vegetationArea || 0,
  productivity: farm.productivity || 0,
  sustainability: farm.sustainability || 0,
  technology: farm.technology || 0,
});

export const createFarmAutoFillSchema = (estados: { value: string }[]) => ({
  name: { type: 'text' as const },
  city: { type: 'text' as const },
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

// 🎯 VERIFICAR SE FAZENDA É VÁLIDA
export const isFarmValid = (farm: Farm): boolean => {
  return (
    validateFarmName(farm.name || '') &&
    validateCity(farm.city || '') &&
    validateState(farm.state || '') &&
    validateTotalArea(farm.totalArea || 0) &&
    validateAreas(farm) &&
    isValidZipCode(farm.zipCode || '') &&
    isValidImageUrl(farm.farmPhoto || '')
  );
};

// 🎯 FUNÇÃO PARA ATUALIZAR CAMPOS VIA AUTO-FILL

export const handleAutoFillUpdate =
  (tempId: string, onUpdateFarm: (tempId: string, updates: Partial<Farm>) => void) =>
  (path: string, value: string | number) => {
    console.log(`🎯 AutoFill atualizando fazenda ${tempId} - ${path} com valor:`, value);

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

      if (path === 'zipCode' && typeof value === 'string') {
        processedValue = value.replace(/(\d{5})(\d)/, '$1-$2');
      }

      const updates: Partial<Farm> = { [farmField]: processedValue };
      onUpdateFarm(tempId, updates);
    }
  };
