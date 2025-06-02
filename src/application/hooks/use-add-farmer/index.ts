// src/hooks/useAddFarmer.ts - VERSÃO FUNCIONAL MÍNIMA
import { useCallback, useMemo, useState } from 'react';

import { DocumentType } from '@enums';
import { useToast } from '@hooks';

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
    farms: [],
    crops: {},
    isLoading: false,
    currentStep: 'producer' as 'producer' | 'farms' | 'crops' | 'review',
    errors: {},
    hasUnsavedChanges: false,
  });

  // 🎯 VALIDAÇÕES BÁSICAS
  const validation = useMemo(
    () => ({
      producer: {
        nameValid: form.producer.name.trim().length >= 3,
        documentValid: form.producer.document.replace(/\D/g, '').length >= 11,
        emailValid: !form.producer.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.producer.email),
        phoneValid: true,
        photoValid:
          !form.producer.profilePhoto || /^https?:\/\/.+/.test(form.producer.profilePhoto),
      },
      farms: {},
      crops: {},
    }),
    [form.producer],
  );

  // 📊 PROGRESSO SIMPLES
  const progress = useMemo(() => {
    const { nameValid, documentValid } = validation.producer;
    let validFields = 0;
    const totalFields = 2;

    if (nameValid) validFields++;
    if (documentValid) validFields++;

    return Math.round((validFields / totalFields) * 100);
  }, [validation.producer]);

  // 📊 ESTATÍSTICAS BÁSICAS
  const stats = useMemo(
    () => ({
      totalFarms: form.farms.length,
      totalArea: 0,
      totalCrops: 0,
      totalPlantedArea: 0,
      averageFarmSize: 0,
      utilizationRate: 0,
    }),
    [form.farms],
  );

  // 👤 ATUALIZAR PRODUTOR
  type ProducerUpdates = Partial<{
    document: string;
    name: string;
    documentType: DocumentType;
    email: string;
    phone: string;
    profilePhoto: string;
  }>;

  const updateProducer = useCallback((updates: ProducerUpdates) => {
    setForm((prev) => ({
      ...prev,
      producer: { ...prev.producer, ...updates },
      hasUnsavedChanges: true,
    }));
  }, []);

  // 🏭 FUNÇÕES BÁSICAS (STUBS)
  const addFarm = useCallback(() => {
    console.log('addFarm chamado');
    setForm((prev) => ({ ...prev, currentStep: 'farms' }));
  }, []);

  const removeFarm = useCallback(() => {}, []);
  const updateFarm = useCallback(() => {}, []);
  const addCrop = useCallback(() => {}, []);
  const removeCrop = useCallback(() => {}, []);
  const updateCrop = useCallback(() => {}, []);

  // 💾 RASCUNHO
  const saveDraft = useCallback(() => {
    toast.success('Sucesso!', '💾 Rascunho salvo!');
  }, [toast]);

  const loadDraft = useCallback(() => {
    console.log('Carregando rascunho...');
  }, []);

  // 📤 SUBMISSÃO
  const submitForm = useCallback(async () => {
    if (progress < 100) {
      toast.error('Erro!', 'Complete todos os campos obrigatórios');
      return;
    }

    setForm((prev) => ({ ...prev, isLoading: true }));

    // Simular API
    setTimeout(() => {
      toast.success('Sucesso!', '✅ Produtor cadastrado!');
      setForm((prev) => ({ ...prev, isLoading: false }));

      // Resetar form
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
  }, [progress, toast]);

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
    submitForm,
  };
};
