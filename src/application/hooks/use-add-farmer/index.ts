// src/hooks/useAddFarmer.ts
import { useCallback, useMemo, useState } from 'react';

import { Farm, Producer } from '@entities';
import { DocumentType, States } from '@enums';
import { useToast } from '@hooks';
import { FarmService, ProducerService } from '@services';

interface AddFarmerForm {
  producer: Partial<Producer> & { document: string; name: string };
  farms: (Partial<Farm> & { tempId: string })[];
  isLoading: boolean;
  currentStep: 'producer' | 'farms' | 'crops' | 'review';
  errors: Record<string, string>;
}

interface ValidationState {
  producer: {
    nameValid: boolean;
    documentValid: boolean;
    emailValid: boolean;
    photoValid: boolean;
  };
  farms: Record<
    string,
    {
      nameValid: boolean;
      locationValid: boolean;
      areasValid: boolean;
      photoValid: boolean;
    }
  >;
  crops: Record<
    string,
    Record<
      string,
      {
        typeValid: boolean;
        areaValid: boolean;
        datesValid: boolean;
      }
    >
  >;
}

export const useAddFarmer = () => {
  const { toast } = useToast();

  const [form, setForm] = useState<AddFarmerForm>({
    producer: { document: '', name: '', documentType: DocumentType.CPF },
    farms: [],
    isLoading: false,
    currentStep: 'producer',
    errors: {},
  });

  // 🎯 VALIDAÇÕES INTELIGENTES
  const validation = useMemo((): ValidationState => {
    const producerValid = {
      nameValid: form.producer.name.trim().length >= 3,
      documentValid: ProducerService.validateProducerDocument(
        form.producer.document,
        form.producer.documentType!,
      ),
      emailValid: !form.producer.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.producer.email),
      photoValid: !form.producer.profilePhoto || /^https?:\/\/.+/.test(form.producer.profilePhoto),
    };

    const farmsValid: Record<
      string,
      {
        nameValid: boolean;
        locationValid: boolean;
        areasValid: boolean;
        photoValid: boolean;
      }
    > = {};
    form.farms.forEach((farm) => {
      farmsValid[farm.tempId] = {
        nameValid: typeof farm.name === 'string' && farm.name.trim().length >= 3,
        locationValid:
          typeof farm.city === 'string' &&
          typeof farm.state === 'string' &&
          farm.city.trim().length >= 2,
        areasValid:
          typeof farm.totalArea === 'number' &&
          typeof farm.agriculturalArea === 'number' &&
          typeof farm.vegetationArea === 'number' &&
          Boolean(
            FarmService.validateFarmAreas(
              farm.totalArea,
              farm.agriculturalArea,
              farm.vegetationArea,
            ),
          ),
        photoValid: !farm.farmPhoto || /^https?:\/\/.+/.test(farm.farmPhoto),
      };
    });

    return {
      producer: producerValid,
      farms: farmsValid,
      crops: {}, // Implementar quando chegar nas culturas
    };
  }, [form.producer, form.farms]);

  // 📊 PROGRESSO CALCULADO DINAMICAMENTE
  const progress = useMemo(() => {
    let totalFields = 0;
    let validFields = 0;

    // Campos do produtor
    const prodFields = Object.values(validation.producer);
    totalFields += prodFields.length;
    validFields += prodFields.filter(Boolean).length;

    // Campos das fazendas
    Object.values(validation.farms).forEach((farmValid) => {
      const farmFields = Object.values(farmValid);
      totalFields += farmFields.length;
      validFields += farmFields.filter(Boolean).length;
    });

    return totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;
  }, [validation]);

  // 🏭 GERENCIAMENTO DE FAZENDAS
  const addFarm = useCallback(() => {
    const tempId = `temp_${Date.now()}`;
    setForm((prev) => ({
      ...prev,
      farms: [
        ...prev.farms,
        {
          tempId,
          name: '',
          city: '',
          state: States.SP,
          totalArea: 0,
          agriculturalArea: 0,
          vegetationArea: 0,
          productivity: 50,
          sustainability: 50,
          technology: 50,
          crops: [],
        },
      ],
    }));
  }, []);

  const removeFarm = useCallback((tempId: string) => {
    setForm((prev) => ({
      ...prev,
      farms: prev.farms.filter((f) => f.tempId !== tempId),
    }));
  }, []);

  const updateFarm = useCallback((tempId: string, updates: Partial<Farm>) => {
    setForm((prev) => ({
      ...prev,
      farms: prev.farms.map((f) => (f.tempId === tempId ? { ...f, ...updates } : f)),
    }));
  }, []);

  // 💾 SUBMISSÃO FINAL
  const submitForm = useCallback(async () => {
    if (progress < 100) {
      toast.error('Erro!', 'Complete todos os campos obrigatórios');
      return;
    }

    setForm((prev) => ({ ...prev, isLoading: true }));

    try {
      // 1. Criar produtor
      const producer = await ProducerService.createProducer({
        ...form.producer,
        documentType: form.producer.documentType!,
        active: true,
      } as Omit<Producer, 'id' | 'createdAt' | 'updatedAt' | 'farmsIds'>);

      if (!producer) throw new Error('Erro ao criar produtor');

      // 2. Criar fazendas
      const createdFarms: Farm[] = [];
      for (const farmData of form.farms) {
        const farm = await FarmService.createFarm({
          ...farmData,
          producerId: producer.id,
          active: true,
        } as Omit<Farm, 'id' | 'createdAt' | 'updatedAt' | 'crops'>);

        if (farm) createdFarms.push(farm);
      }

      toast.success(
        'Sucesso!',
        `✅ Produtor ${producer.name} cadastrado com ${createdFarms.length} fazenda(s)!`,
      );

      // Reset form
      setForm({
        producer: { document: '', name: '', documentType: DocumentType.CPF },
        farms: [],
        isLoading: false,
        currentStep: 'producer',
        errors: {},
      });
    } catch (error) {
      toast.error('Erro!', error instanceof Error ? error.message : 'Erro inesperado');
    } finally {
      setForm((prev) => ({ ...prev, isLoading: false }));
    }
  }, [form, progress, toast]);

  return {
    form,
    setForm,
    validation,
    progress,
    addFarm,
    removeFarm,
    updateFarm,
    submitForm,
  };
};
