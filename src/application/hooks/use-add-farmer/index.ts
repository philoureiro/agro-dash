// src/hooks/useAddFarmer.ts - VERSÃO MAIS SIMPLES DO UNIVERSO
import { useCallback, useMemo, useState } from 'react';

import { DocumentType } from '@enums';
import { useToast } from '@hooks';
import { validateDocument, validatePhone } from '@validations';

export const useAddFarmer = () => {
  const { toast } = useToast();

  // 📝 STATE BÁSICO - SEM FIRULA
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
    crops: {} as Record<string, any[]>,
    isLoading: false,
    currentStep: 'producer' as 'producer' | 'farms' | 'crops' | 'review',
    errors: {},
    hasUnsavedChanges: false,
  });

  // 🎯 VALIDAÇÕES SIMPLES
  const validation = useMemo(
    () => ({
      producer: {
        nameValid: form.producer.name.trim().length >= 3,
        documentValid: validateDocument(form.producer.document, form.producer.documentType),
        emailValid: !form.producer.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.producer.email),
        phoneValid: !form.producer.phone || validatePhone(form.producer.phone),
        photoValid:
          !form.producer.profilePhoto ||
          /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(form.producer.profilePhoto),
      },
      farms: {},
      crops: {},
    }),
    [form.producer],
  );

  // 📊 PROGRESSO SIMPLES
  const progress = useMemo(() => {
    let validFields = 0;
    const totalFields = 3;

    if (validation.producer.nameValid) validFields++;
    if (validation.producer.documentValid) validFields++;
    if (form.farms.length > 0) validFields++;

    return Math.round((validFields / totalFields) * 100);
  }, [validation.producer, form.farms.length]);

  // 📊 STATS SIMPLES
  const stats = useMemo(
    () => ({
      totalFarms: form.farms.length,
      totalArea: form.farms.reduce((sum: number, f: any) => sum + (f.totalArea || 0), 0),
      totalCrops: Object.values(form.crops).reduce((sum, crops) => sum + crops.length, 0),
      totalPlantedArea: 0,
      averageFarmSize: 0,
      utilizationRate: 0,
    }),
    [form.farms, form.crops],
  );

  // 👤 ATUALIZAR PRODUTOR - SIMPLES
  const updateProducer = useCallback((updates: any) => {
    setForm((prev) => ({
      ...prev,
      producer: { ...prev.producer, ...updates },
      hasUnsavedChanges: true,
    }));
  }, []);

  // 🎯 NAVEGAÇÃO SIMPLES
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

  // 🏭 FAZENDAS SIMPLES
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
    setForm((prev) => ({
      ...prev,
      farms: prev.farms.filter((f: any) => f.tempId !== tempId),
      hasUnsavedChanges: true,
    }));
  }, []);

  const updateFarm = useCallback((tempId: string, updates: any) => {
    setForm((prev) => ({
      ...prev,
      farms: prev.farms.map((f: any) => (f.tempId === tempId ? { ...f, ...updates } : f)),
      hasUnsavedChanges: true,
    }));
  }, []);

  // 🌱 CULTURAS VAZIAS (para não dar erro)
  const addCrop = useCallback(() => {}, []);
  const removeCrop = useCallback(() => {}, []);
  const updateCrop = useCallback(() => {}, []);

  // 💾 RASCUNHO SIMPLES - SEM LOOP
  const saveDraft = useCallback(() => {
    try {
      const draftData = {
        producer: form.producer,
        farms: form.farms,
        crops: form.crops,
        currentStep: form.currentStep,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem('addFarmer_draft', JSON.stringify(draftData));
      toast.success('Sucesso!', '💾 Rascunho salvo!');

      setForm((prev) => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      toast.error('Erro!', 'Falha ao salvar rascunho');
    }
  }, [form, toast]);

  // 📂 CARREGAR RASCUNHO SIMPLES
  const loadDraft = useCallback(() => {
    try {
      const draftData = localStorage.getItem('addFarmer_draft');
      if (draftData) {
        const parsed = JSON.parse(draftData);

        setForm((prev) => ({
          ...prev,
          producer: parsed.producer || prev.producer,
          farms: parsed.farms || prev.farms,
          crops: parsed.crops || prev.crops,
          currentStep: parsed.currentStep || prev.currentStep,
          hasUnsavedChanges: false,
        }));

        toast.success('Sucesso!', '📂 Rascunho carregado!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error('Erro!', 'Falha ao carregar rascunho');
      return false;
    }
  }, [toast]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem('addFarmer_draft');
  }, []);

  // 📤 SUBMISSÃO SIMPLES
  const submitForm = useCallback(async () => {
    setForm((prev) => ({ ...prev, isLoading: true }));

    // Simular API
    setTimeout(() => {
      toast.success('Sucesso!', '✅ Produtor cadastrado!');
      clearDraft();

      // Reset total
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
        crops: {},
        isLoading: false,
        currentStep: 'producer',
        errors: {},
        hasUnsavedChanges: false,
      });
    }, 2000);
  }, [toast, clearDraft]);

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
    addCrop,
    removeCrop,
    updateCrop,
    saveDraft,
    loadDraft,
    clearDraft,
    submitForm,
    nextStep,
    prevStep,
  };
};
