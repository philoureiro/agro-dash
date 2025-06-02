import { useCallback, useMemo, useState } from 'react';

import { DocumentType } from '@enums';
import { useToast } from '@hooks';
import { validateDocument, validatePhone } from '@validations';

const DRAFT_KEY = 'addFarmer_draft_v1';

// 🌱 INTERFACE PARA CULTURA
interface Crop {
  id: string;
  type?: string;
  harvestYear?: string;
  plantedArea?: number;
  expectedYield?: number;
  plantingDate?: Date;
  harvestDate?: Date;
  cropPhoto?: string;
  notes?: string;
}

export const useAddFarmer = () => {
  const { toast } = useToast();

  const [form, setForm] = useState({
    producer: {
      document: '',
      name: '',
      documentType: DocumentType.CPF,
      email: '',
      phone: '',
      profilePhoto: '',
    },
    farms: [] as any[],
    crops: {} as Record<string, Crop[]>, // 🔥 CULTURAS POR FARM ID
    isLoading: false,
    currentStep: 'producer' as 'producer' | 'farms' | 'crops' | 'review',
    errors: {},
    hasUnsavedChanges: false,
  });

  // 🎯 VALIDAÇÕES COMPLETAS
  const validation = useMemo(() => {
    // VALIDAÇÃO DO PRODUTOR
    const producer = {
      nameValid: form.producer.name.trim().length >= 3,
      documentValid: validateDocument(form.producer.document, form.producer.documentType),
      emailValid: !form.producer.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.producer.email),
      phoneValid: !form.producer.phone || validatePhone(form.producer.phone),
      photoValid:
        !form.producer.profilePhoto ||
        /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(form.producer.profilePhoto),
    };

    // VALIDAÇÃO DAS FAZENDAS
    const farms: Record<string, any> = {};
    form.farms.forEach((farm: any) => {
      const isValidImageUrl = (url: string): boolean => {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
      };

      const validateAreas = (f: any): boolean => {
        return f.totalArea > 0 && f.agriculturalArea + f.vegetationArea <= f.totalArea;
      };

      farms[farm.tempId] = {
        nameValid: farm.name && farm.name.trim().length >= 3,
        locationValid: farm.city && farm.city.trim().length >= 2 && farm.state,
        photoValid: !farm.farmPhoto || isValidImageUrl(farm.farmPhoto),
        areasValid:
          farm.totalArea > 0 &&
          farm.agriculturalArea >= 0 &&
          farm.vegetationArea >= 0 &&
          validateAreas(farm),
      };
    });

    // 🌱 VALIDAÇÃO DAS CULTURAS
    const crops: Record<string, Record<string, any>> = {};
    Object.entries(form.crops).forEach(([farmId, farmCrops]) => {
      crops[farmId] = {};
      farmCrops.forEach((crop: Crop) => {
        crops[farmId][crop.id] = {
          typeValid: !!crop.type,
          areaValid: crop.plantedArea && crop.plantedArea > 0,
          datesValid:
            !crop.plantingDate ||
            !crop.harvestDate ||
            new Date(crop.harvestDate) > new Date(crop.plantingDate),
        };
      });
    });

    return {
      producer,
      farms,
      crops,
    };
  }, [form.producer, form.farms, form.crops]);

  // 📊 PROGRESSO DINÂMICO
  const progress = useMemo(() => {
    let validFields = 0;
    let totalFields = 0;

    // CAMPOS OBRIGATÓRIOS DO PRODUTOR (2 campos)
    totalFields += 2;
    if (validation.producer.nameValid) validFields++;
    if (validation.producer.documentValid) validFields++;

    // FAZENDAS: pelo menos 1 fazenda válida
    if (form.farms.length > 0) {
      const validFarms = form.farms.filter((farm: any) => {
        const farmValidation = validation.farms[farm.tempId];
        return (
          farmValidation?.nameValid && farmValidation?.locationValid && farmValidation?.areasValid
        );
      });

      totalFields += form.farms.length * 3;
      validFarms.forEach((farm: any) => {
        const farmValidation = validation.farms[farm.tempId];
        if (farmValidation?.nameValid) validFields++;
        if (farmValidation?.locationValid) validFields++;
        if (farmValidation?.areasValid) validFields++;
      });
    } else {
      totalFields += 1;
    }

    return totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;
  }, [validation.producer, validation.farms, form.farms.length]);

  // 📊 ESTATÍSTICAS ATUALIZADAS
  const stats = useMemo(() => {
    const totalCrops = Object.values(form.crops).reduce(
      (sum, farmCrops) => sum + farmCrops.length,
      0,
    );
    const totalPlantedArea = Object.values(form.crops).reduce((sum, farmCrops) => {
      return sum + farmCrops.reduce((farmSum, crop) => farmSum + (crop.plantedArea || 0), 0);
    }, 0);

    return {
      totalFarms: form.farms.length,
      totalArea: form.farms.reduce((sum: number, f: any) => sum + (f.totalArea || 0), 0),
      totalCrops,
      totalPlantedArea,
      averageFarmSize:
        form.farms.length > 0
          ? form.farms.reduce((sum: number, f: any) => sum + (f.totalArea || 0), 0) /
            form.farms.length
          : 0,
      utilizationRate: 0,
    };
  }, [form.farms, form.crops]);

  // 👤 ATUALIZAR PRODUTOR
  const updateProducer = useCallback((updates: any) => {
    setForm((prev) => ({
      ...prev,
      producer: { ...prev.producer, ...updates },
      hasUnsavedChanges: true,
    }));
  }, []);

  // 🎯 NAVEGAÇÃO
  const nextStep = useCallback(() => {
    const steps = ['producer', 'farms', 'crops', 'review'];
    const currentIndex = steps.indexOf(form.currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStepName = steps[currentIndex + 1];
      setForm((prev) => ({
        ...prev,
        currentStep: nextStepName as any,
      }));
    }
  }, [form.currentStep]);

  const prevStep = useCallback(() => {
    const steps = ['producer', 'farms', 'crops', 'review'];
    const currentIndex = steps.indexOf(form.currentStep);
    if (currentIndex > 0) {
      setForm((prev) => ({
        ...prev,
        currentStep: steps[currentIndex - 1] as any,
      }));
    }
  }, [form.currentStep]);

  // 🏭 FAZENDAS
  const addFarm = useCallback(() => {
    const newFarm = {
      tempId: `temp_${Date.now()}`,
      name: '',
      city: '',
      state: '',
      totalArea: 0,
      agriculturalArea: 0,
      vegetationArea: 0,
      productivity: 50,
      sustainability: 50,
      technology: 50,
    };

    setForm((prev) => ({
      ...prev,
      farms: [...prev.farms, newFarm],
      hasUnsavedChanges: true,
    }));
  }, []);

  const removeFarm = useCallback((tempId: string) => {
    setForm((prev) => {
      // 🔥 REMOVER CULTURAS DA FAZENDA TAMBÉM
      const newCrops = { ...prev.crops };
      delete newCrops[tempId];

      return {
        ...prev,
        farms: prev.farms.filter((f: any) => f.tempId !== tempId),
        crops: newCrops,
        hasUnsavedChanges: true,
      };
    });
  }, []);

  const updateFarm = useCallback((tempId: string, updates: any) => {
    setForm((prev) => ({
      ...prev,
      farms: prev.farms.map((f: any) => (f.tempId === tempId ? { ...f, ...updates } : f)),
      hasUnsavedChanges: true,
    }));
  }, []);

  // 🌱 CULTURAS - IMPLEMENTAÇÃO COMPLETA
  const addCrop = useCallback(
    (farmId: string) => {
      const newCrop: Crop = {
        id: `crop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: undefined,
        harvestYear: new Date().getFullYear().toString(),
        plantedArea: undefined,
        expectedYield: undefined,
        plantingDate: undefined,
        harvestDate: undefined,
        cropPhoto: '',
        notes: '',
      };

      setForm((prev) => ({
        ...prev,
        crops: {
          ...prev.crops,
          [farmId]: [...(prev.crops[farmId] || []), newCrop],
        },
        hasUnsavedChanges: true,
      }));

      toast.success('Sucesso!', '🌱 Nova cultura adicionada!');
    },
    [toast],
  );

  const removeCrop = useCallback(
    (farmId: string, cropId: string) => {
      setForm((prev) => ({
        ...prev,
        crops: {
          ...prev.crops,
          [farmId]: (prev.crops[farmId] || []).filter((crop: Crop) => crop.id !== cropId),
        },
        hasUnsavedChanges: true,
      }));

      toast.success('Sucesso!', '🗑️ Cultura removida!');
    },
    [toast],
  );

  const updateCrop = useCallback((farmId: string, cropId: string, updates: Partial<Crop>) => {
    setForm((prev) => ({
      ...prev,
      crops: {
        ...prev.crops,
        [farmId]: (prev.crops[farmId] || []).map((crop: Crop) =>
          crop.id === cropId ? { ...crop, ...updates } : crop,
        ),
      },
      hasUnsavedChanges: true,
    }));
  }, []);

  // 💾 RASCUNHO
  const saveDraft = useCallback(() => {
    try {
      const draftData = {
        producer: form.producer,
        farms: form.farms,
        crops: form.crops, // 🔥 INCLUIR CULTURAS
        currentStep: form.currentStep,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      toast.success('Sucesso!', '💾 Rascunho salvo!');

      setForm((prev) => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      toast.error('Erro!', 'Falha ao salvar rascunho');
    }
  }, [form, toast]);

  const autoLoadDraft = useCallback(() => {
    try {
      const draftData = localStorage.getItem(DRAFT_KEY);
      if (draftData) {
        const parsed = JSON.parse(draftData);

        setForm((prev) => ({
          ...prev,
          producer: parsed.producer || prev.producer,
          farms: parsed.farms || prev.farms,
          crops: parsed.crops || {}, // 🔥 CARREGAR CULTURAS
          currentStep: parsed.currentStep || prev.currentStep,
          hasUnsavedChanges: false,
        }));

        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error auto-loading draft:', error);
      return false;
    }
  }, []);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    toast.success('Sucesso!', '🗑️ Rascunho removido!');

    setForm({
      producer: {
        document: '',
        name: '',
        documentType: DocumentType.CPF,
        email: '',
        phone: '',
        profilePhoto: '',
      },
      farms: [],
      crops: {}, // 🔥 LIMPAR CULTURAS
      isLoading: false,
      currentStep: 'producer',
      errors: {},
      hasUnsavedChanges: false,
    });
  }, [toast]);

  // 📤 SUBMISSÃO
  const submitForm = useCallback(async () => {
    setForm((prev) => ({ ...prev, isLoading: true }));

    // 🔥 DADOS COMPLETOS PARA API
    const formData = {
      producer: form.producer,
      farms: form.farms,
      crops: form.crops,
      stats,
      submittedAt: new Date().toISOString(),
    };

    console.log('📤 Submitting complete form data:', formData);

    // Simular API
    setTimeout(() => {
      toast.success('Sucesso!', '✅ Produtor cadastrado com culturas!');
      clearDraft();
    }, 2000);
  }, [form, stats, toast, clearDraft]);

  return {
    form,
    setForm,
    validation,
    progress,
    stats,
    updateProducer,
    addFarm,
    removeFarm,
    updateFarm,
    addCrop, // 🔥 FUNÇÕES DE CULTURAS
    removeCrop,
    updateCrop,
    saveDraft,
    autoLoadDraft,
    clearDraft,
    submitForm,
    nextStep,
    prevStep,
  };
};
