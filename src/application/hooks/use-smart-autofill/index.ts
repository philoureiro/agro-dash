import { useCallback, useMemo } from 'react';

import { brazilianData } from './mocks';

// 🎲 TIPOS DE CAMPO
interface FieldConfig {
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'number'
    | 'date'
    | 'select'
    | 'url'
    | 'textarea'
    | 'cpf'
    | 'cnpj'
    | 'cep'
    | 'percentage'
    | 'year';
  options?: string[];
  min?: number;
  max?: number;
  custom?: () => string | number;
}

interface FormSchema {
  [fieldPath: string]: FieldConfig;
}

interface CurrentFormData {
  [fieldPath: string]: string | number | undefined | null;
}

export const useAutoFill = () => {
  // 🎲 GERADORES SUPREMOS - CORRIGIDOS
  const generators = useMemo(
    () => ({
      // 👤 DADOS PESSOAIS
      text: () => getRandomItem(brazilianData.names),

      email: () => {
        const name = getRandomItem(brazilianData.names)
          .toLowerCase()
          .replace(/\s+/g, '.')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const domains = ['gmail.com', 'hotmail.com', 'yahoo.com.br', 'outlook.com'];
        return `${name}${getRandomNumber(1, 999)}@${getRandomItem(domains)}`;
      },

      phone: () => {
        // Gera celular brasileiro válido (11 dígitos)
        const ddd = getRandomNumber(11, 99);
        const firstDigit = 9; // Celulares começam com 9
        const restDigits = getRandomNumber(10000000, 99999999);
        return `${ddd}${firstDigit}${restDigits}`;
      },

      // 📄 DOCUMENTOS - GERADORES VÁLIDOS
      cpf: () => {
        const generateValidCPF = (): string => {
          const nums = Array.from({ length: 9 }, () => getRandomNumber(0, 9));

          // Calcula primeiro dígito verificador
          let sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += nums[i] * (10 - i);
          }
          const digit1 = 11 - (sum % 11);
          const firstCheck = digit1 >= 10 ? 0 : digit1;

          // Calcula segundo dígito verificador
          sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += nums[i] * (11 - i);
          }
          sum += firstCheck * 2;
          const digit2 = 11 - (sum % 11);
          const secondCheck = digit2 >= 10 ? 0 : digit2;

          return [...nums, firstCheck, secondCheck].join('');
        };

        return generateValidCPF();
      },

      cnpj: () => {
        const generateValidCNPJ = (): string => {
          const nums = Array.from({ length: 12 }, () => getRandomNumber(0, 9));

          // Primeiro dígito verificador
          const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
          let sum = nums.reduce((acc, num, i) => acc + num * weights1[i], 0);
          const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          // Segundo dígito verificador
          const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
          sum = nums.reduce((acc, num, i) => acc + num * weights2[i], 0);
          sum += digit1 * weights2[12];
          const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);

          return [...nums, digit1, digit2].join('');
        };

        return generateValidCNPJ();
      },

      // 🏡 ENDEREÇO
      city: () => getRandomItem(brazilianData.cities),
      state: () => getRandomItem(brazilianData.states),

      cep: () => {
        // Gera CEP brasileiro válido (8 dígitos)
        const firstPart = getRandomNumber(10000, 99999);
        const secondPart = getRandomNumber(100, 999);
        return `${firstPart}${secondPart}`;
      },

      // 🚜 FAZENDA - CORRIGIDO
      farmName: () => getRandomItem(brazilianData.farmNames),

      // 🌾 AGRICULTURA
      cropType: () => getRandomItem(brazilianData.cropTypes),

      // 📊 NÚMEROS - CORRIGIDOS
      number: (min = 1, max = 1000) => getRandomNumber(min, max),
      percentage: (min = 30, max = 100) => getRandomNumber(min, max),
      year: () => getRandomNumber(2024, 2028),

      // 📅 DATAS
      date: () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + getRandomNumber(1, 365));
        return futureDate.toISOString().split('T')[0];
      },

      // 🖼️ URLS - USANDO SUAS IMAGENS REAIS DO MOCK
      url: () => getRandomItem(brazilianData.producerImages),

      // 🎯 GERADORES ESPECÍFICOS PARA CADA TIPO DE IMAGEM
      producerImage: () => getRandomItem(brazilianData.producerImages),
      farmImage: () => getRandomItem(brazilianData.farmImages),
      cropImage: (cropType?: string) => {
        if (
          cropType &&
          brazilianData.cropImages[cropType as keyof typeof brazilianData.cropImages]
        ) {
          return getRandomItem(
            brazilianData.cropImages[cropType as keyof typeof brazilianData.cropImages],
          );
        }
        const randomCropType = getRandomItem(Object.keys(brazilianData.cropImages));
        return getRandomItem(
          brazilianData.cropImages[randomCropType as keyof typeof brazilianData.cropImages],
        );
      },

      // 📝 TEXTOS
      textarea: () => getRandomItem(brazilianData.observations),
      company: () => getRandomItem(brazilianData.companies),

      // 🔧 SELEÇÃO
      select: (options: string[]) => getRandomItem(options),
    }),
    [],
  );

  // 🛠️ FUNÇÕES AUXILIARES
  const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const getRandomNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // 🔍 VERIFICA SE CAMPO ESTÁ VAZIO - CORRIGIDO
  const isFieldEmpty = useCallback((value: string | number | undefined | null): boolean => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return value === 0; // 🎯 CORREÇÃO: 0 também é considerado vazio
    return true;
  }, []);

  // 🚀 FUNÇÃO PRINCIPAL DE AUTO-FILL - CORRIGIDA
  const autoFill = useCallback(
    (
      schema: FormSchema,
      updateFunction: (path: string, value: string | number) => void,
      options?: {
        excludeFields?: string[];
        customData?: Record<string, string | number>;
        currentData?: CurrentFormData;
        fillOnlyEmpty?: boolean;
        imageContext?: 'producer' | 'farm' | 'crop';
        cropType?: string;
      },
    ) => {
      const {
        excludeFields = [],
        customData = {},
        currentData = {},
        fillOnlyEmpty = true,
        imageContext = 'producer',
        cropType,
      } = options || {};

      let filledCount = 0;
      let skippedCount = 0;

      console.log('🎯 AutoFill iniciado com dados atuais:', currentData);
      console.log('🖼️ Contexto de imagem:', imageContext, cropType ? `- Tipo: ${cropType}` : '');

      Object.entries(schema).forEach(([fieldPath, config]) => {
        // ❌ Pular campos excluídos
        if (excludeFields.includes(fieldPath)) {
          skippedCount++;
          return;
        }

        // 🔍 VERIFICA SE CAMPO JÁ ESTÁ PREENCHIDO
        const currentValue = currentData[fieldPath];
        if (fillOnlyEmpty && !isFieldEmpty(currentValue)) {
          skippedCount++;
          console.log(`🔒 Campo '${fieldPath}' já preenchido com: '${currentValue}' - ignorando`);
          return;
        }

        let value: string | number;

        // 🎯 Usar dados customizados se fornecidos
        if (customData[fieldPath] !== undefined) {
          value = customData[fieldPath];
        }
        // 🎯 REMOVE a verificação de custom que estava retornando string vazia
        // else if (config.custom) {
        //   value = config.custom();
        // }
        // 🎯 Usar geradores padrão SEMPRE
        else {
          switch (config.type) {
            case 'select':
              value = config.options ? generators.select(config.options) : '';
              break;
            case 'text':
              // 🎯 CORREÇÃO: Usar gerador específico para nomes de fazenda
              if (
                fieldPath.toLowerCase().includes('name') ||
                fieldPath.toLowerCase().includes('nome')
              ) {
                value = generators.farmName();
              } else if (
                fieldPath.toLowerCase().includes('city') ||
                fieldPath.toLowerCase().includes('cidade')
              ) {
                value = generators.city();
              } else {
                value = generators.text();
              }
              break;
            case 'number':
              value = generators.number(config.min, config.max);
              break;
            case 'percentage':
              value = generators.percentage(config.min || 30, config.max || 100);
              break;
            case 'year':
              value = generators.year();
              break;
            case 'url':
              // 🎯 INTELIGÊNCIA PARA ESCOLHER TIPO DE IMAGEM
              if (
                fieldPath.toLowerCase().includes('farm') ||
                fieldPath.toLowerCase().includes('fazenda')
              ) {
                value = generators.farmImage();
              } else if (
                fieldPath.toLowerCase().includes('crop') ||
                fieldPath.toLowerCase().includes('cultura')
              ) {
                value = generators.cropImage(cropType);
              } else if (
                fieldPath.toLowerCase().includes('producer') ||
                fieldPath.toLowerCase().includes('profile')
              ) {
                value = generators.producerImage();
              } else {
                // Baseado no contexto geral
                switch (imageContext) {
                  case 'farm':
                    value = generators.farmImage();
                    break;
                  case 'crop':
                    value = generators.cropImage(cropType);
                    break;
                  default:
                    value = generators.producerImage();
                }
              }
              break;
            default: {
              const generator = generators[config.type] || generators.text;
              value = generator() as string;
              break;
            }
          }
        }

        // ✅ Atualizar campo apenas se gerou um valor válido
        if (value !== '' && value !== undefined && value !== null) {
          updateFunction(fieldPath, value);
          filledCount++;
          console.log(`✨ Campo '${fieldPath}' preenchido com: '${value}'`);
        }
      });
    },
    [generators, isFieldEmpty],
  );

  return { autoFill };
};
