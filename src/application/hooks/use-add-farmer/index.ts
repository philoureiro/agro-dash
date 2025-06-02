// src/hooks/useAddFarmer.ts - VERSÃO COM RASCUNHO FUNCIONAL
import { useCallback, useEffect, useMemo, useState } from 'react';

import { DocumentType } from '@enums';
import { useToast } from '@hooks';
import { validateDocument, validatePhone } from '@validations';

const DRAFT_KEY = 'addFarmer_draft_v1';

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
    crops: {} as Record<string, any[]>,
    isLoading: false,
    currentStep: 'producer' as 'producer' | 'farms' | 'crops' | 'review',
    errors: {},
    hasUnsavedChanges: false,
  });

  // 🎯 VALIDAÇÕES REAIS
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

  // 📊 PROGRESSO CORRETO
  const progress = useMemo(() => {
    let validFields = 0;
    let totalFields = 0;

    // Campos obrigatórios do produtor
    totalFields += 2; // nome + documento
    if (validation.producer.nameValid) validFields++;
    if (validation.producer.documentValid) validFields++;

    // Fazendas (pelo menos 1)
    totalFields += 1;
    if (form.farms.length > 0) validFields++;

    const calculated = Math.round((validFields / totalFields) * 100);
    console.log('📊 Progress calculated:', { validFields, totalFields, calculated });
    return calculated;
  }, [validation.producer, form.farms.length]);

  // 📊 ESTATÍSTICAS
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

  // 👤 ATUALIZAR PRODUTOR
  const updateProducer = useCallback((updates: any) => {
    console.log('📝 Updating producer:', updates);
    setForm((prev) => {
      const newForm = {
        ...prev,
        producer: { ...prev.producer, ...updates },
        hasUnsavedChanges: true,
      };
      console.log('📝 New producer state:', newForm.producer);
      return newForm;
    });
  }, []);

  // 🎯 NAVEGAÇÃO COM LOGS
  const nextStep = useCallback(() => {
    console.log('➡️ Next step called, current:', form.currentStep);
    console.log('📋 Current form data:', form);

    const steps = ['producer', 'farms', 'crops', 'review'];
    const currentIndex = steps.indexOf(form.currentStep);

    if (currentIndex < steps.length - 1) {
      const nextStepName = steps[currentIndex + 1];
      console.log('➡️ Moving to step:', nextStepName);

      setForm((prev) => ({
        ...prev,
        currentStep: nextStepName as any,
      }));

      toast.success('Sucesso!', `✅ Avançando para: ${nextStepName}`);
    }
  }, [form, toast]);

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

    toast.success('Sucesso!', '🏭 Nova fazenda adicionada!');
  }, [toast]);

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

  // 🌱 CULTURAS (stubs)
  const addCrop = useCallback(() => {}, []);
  const removeCrop = useCallback(() => {}, []);
  const updateCrop = useCallback(() => {}, []);

  // 💾 RASCUNHO COM FUNCIONALIDADE REAL
  const saveDraft = useCallback(() => {
    try {
      const draftData = {
        ...form,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
      console.log('💾 Draft saved:', draftData);

      toast.success('Sucesso!', '💾 Rascunho salvo!');
      setForm((prev) => ({ ...prev, hasUnsavedChanges: false }));
    } catch (error) {
      console.error('❌ Error saving draft:', error);
      toast.error('Erro!', 'Falha ao salvar rascunho');
    }
  }, [form, toast]);

  const loadDraft = useCallback(() => {
    try {
      const draftData = localStorage.getItem(DRAFT_KEY);
      if (draftData) {
        const parsed = JSON.parse(draftData);
        console.log('📂 Loading draft:', parsed);

        // Remover dados de controle antes de aplicar
        const { savedAt, hasUnsavedChanges, isLoading, errors, ...formData } = parsed;

        setForm((prev) => ({
          ...prev,
          ...formData,
          hasUnsavedChanges: false,
        }));

        toast.success(
          'Sucesso!',
          `📂 Rascunho carregado! (Salvo em: ${new Date(savedAt).toLocaleString()})`,
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error loading draft:', error);
      toast.error('Erro!', 'Falha ao carregar rascunho');
      return false;
    }
  }, [toast]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    console.log('🗑️ Draft cleared');
  }, []);

  // 📂 CARREGAR RASCUNHO AO INICIALIZAR
  useEffect(() => {
    const hasLoaded = loadDraft();
    if (hasLoaded) {
      console.log('🚀 Draft loaded on mount');
    }
  }, [loadDraft]);

  // 📤 SUBMISSÃO
  const submitForm = useCallback(async () => {
    console.log('📤 Submitting form:', form);

    setForm((prev) => ({ ...prev, isLoading: true }));

    setTimeout(() => {
      toast.success('Sucesso!', '✅ Produtor cadastrado com sucesso!');
      clearDraft();

      // Reset completo
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
  }, [form, toast, clearDraft]);

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
