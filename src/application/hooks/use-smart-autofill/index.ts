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
    | 'year'
    | 'cropType'
    | 'smartYield'
    | 'smartPlantingDate'
    | 'smartHarvestDate'
    | 'smartCropNotes';
  options?: string[];
  min?: number;
  max?: number;
  custom?: () => string | number;
  cropType?: string;
  plantingDate?: Date;
}

interface FormSchema {
  [fieldPath: string]: FieldConfig;
}

interface CurrentFormData {
  [fieldPath: string]: string | number | Date | undefined | null;
}

export const useAutoFill = () => {
  // 🎲 GERADORES SUPREMOS - COM VALIDAÇÃO DE ÁREAS E CULTURAS
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

      // 🚜 FAZENDA
      farmName: () => getRandomItem(brazilianData.farmNames),

      // 🌾 AGRICULTURA BÁSICA
      cropType: () =>
        getRandomItem([
          'SOJA',
          'MILHO',
          'ALGODAO',
          'CANA_DE_ACUCAR',
          'CAFE',
          'ARROZ',
          'FEIJAO',
          'TRIGO',
          'SORGO',
          'GIRASSOL',
          'AMENDOIM',
          'MANDIOCA',
        ]),

      // 🎯 GERADORES SUPREMOS PARA CULTURAS

      // 📊 PRODUTIVIDADE INTELIGENTE POR TIPO DE CULTURA
      smartYield: (cropType?: string) => {
        const yieldRanges: Record<string, { min: number; max: number }> = {
          SOJA: { min: 2.5, max: 4.5 },
          MILHO: { min: 8, max: 15 },
          ALGODAO: { min: 1.5, max: 3 },
          CANA_DE_ACUCAR: { min: 60, max: 120 },
          CAFE: { min: 1.2, max: 3.5 },
          ARROZ: { min: 4, max: 8 },
          FEIJAO: { min: 1, max: 2.5 },
          TRIGO: { min: 2, max: 4 },
          SORGO: { min: 3, max: 6 },
          GIRASSOL: { min: 1.5, max: 3 },
          AMENDOIM: { min: 2, max: 4 },
          MANDIOCA: { min: 15, max: 35 },
        };

        const range =
          cropType && yieldRanges[cropType] ? yieldRanges[cropType] : { min: 1, max: 5 };

        return Math.round((Math.random() * (range.max - range.min) + range.min) * 10) / 10;
      },

      // 📅 DATAS INTELIGENTES DE PLANTIO
      smartPlantingDate: () => {
        const now = new Date();
        const seasonalMonths = [3, 4, 5, 9, 10, 11]; // Meses ideais de plantio no Brasil
        const randomMonth = getRandomItem(seasonalMonths);

        const plantingDate = new Date(now.getFullYear(), randomMonth, getRandomNumber(1, 28));

        // Se a data já passou, usa o próximo ano
        if (plantingDate < now) {
          plantingDate.setFullYear(now.getFullYear() + 1);
        }

        return plantingDate;
      },

      // 🌾 DATAS INTELIGENTES DE COLHEITA (BASEADA NO PLANTIO E TIPO)
      smartHarvestDate: (plantingDate?: Date, cropType?: string) => {
        if (!plantingDate) {
          // Se não tem data de plantio, gera uma data futura aleatória
          const futureDate = new Date();
          futureDate.setMonth(futureDate.getMonth() + getRandomNumber(3, 8));
          return futureDate;
        }

        const growthPeriods: Record<string, { min: number; max: number }> = {
          SOJA: { min: 90, max: 130 },
          MILHO: { min: 120, max: 180 },
          ALGODAO: { min: 180, max: 240 },
          CANA_DE_ACUCAR: { min: 360, max: 540 },
          CAFE: { min: 180, max: 270 },
          ARROZ: { min: 90, max: 150 },
          FEIJAO: { min: 70, max: 100 },
          TRIGO: { min: 90, max: 140 },
          SORGO: { min: 90, max: 130 },
          GIRASSOL: { min: 90, max: 130 },
          AMENDOIM: { min: 90, max: 140 },
          MANDIOCA: { min: 180, max: 360 },
        };

        const period =
          cropType && growthPeriods[cropType] ? growthPeriods[cropType] : { min: 90, max: 180 };

        const days = Math.floor(Math.random() * (period.max - period.min) + period.min);

        const harvestDate = new Date(plantingDate);
        harvestDate.setDate(harvestDate.getDate() + days);
        return harvestDate;
      },

      // 📝 OBSERVAÇÕES ESPECÍFICAS POR CULTURA
      smartCropNotes: (cropType?: string) => {
        const notesByType: Record<string, string[]> = {
          SOJA: [
            'Variedade adaptada ao clima da região com alta resistência',
            'Plantio em sistema de plantio direto sobre palhada',
            'Controle integrado de pragas com monitoramento semanal',
            'Aplicação de inoculante específico no plantio',
            'Cultivar precoce para escape da ferrugem asiática',
          ],
          MILHO: [
            'Híbrido de alta produtividade para grão',
            'Sistema de irrigação por pivô central instalado',
            'Adubação baseada em análise de solo recente',
            'Controle preventivo de lagarta-do-cartucho',
            'Variedade transgênica resistente a herbicidas',
          ],
          ALGODAO: [
            'Variedade resistente ao bicudo-do-algodoeiro',
            'Sistema de cultivo convencional com preparo do solo',
            'Colheita mecanizada programada para janeiro',
            'Monitoramento quinzenal de pragas e doenças',
            'Cultivar adaptada às condições do cerrado',
          ],
          CANA_DE_ACUCAR: [
            'Variedade de alta produtividade e rico em sacarose',
            'Sistema de plantio mecanizado em fileiras duplas',
            'Colheita programada para período seco',
            'Aplicação de vinhaça como fertilizante orgânico',
            'Renovação do canavial programada para 5 anos',
          ],
          CAFE: [
            'Variedade arábica de alta qualidade para exportação',
            'Sistema de cultivo adensado com espaçamento reduzido',
            'Colheita seletiva para grãos especiais',
            'Controle biológico da broca-do-café',
            'Certificação orgânica em processo de obtenção',
          ],
          ARROZ: [
            'Variedade de sequeiro adaptada ao cerrado',
            'Sistema de irrigação por aspersão implementado',
            'Controle integrado de plantas daninhas',
            'Beneficiamento próprio para agregação de valor',
            'Cultivar resistente ao acamamento',
          ],
        };

        const notes =
          cropType && notesByType[cropType]
            ? notesByType[cropType]
            : [
                'Cultura bem adaptada às condições edafoclimáticas da região',
                'Manejo sustentável aplicado conforme boas práticas agrícolas',
                'Monitoramento regular do desenvolvimento da cultura',
                'Aplicação de defensivos conforme receituário agronômico',
                'Acompanhamento técnico especializado durante todo ciclo',
              ];

        return getRandomItem(notes);
      },

      // 📊 NÚMEROS - COM VALIDAÇÃO INTELIGENTE
      number: (min = 1, max = 1000) => getRandomNumber(min, max),
      percentage: (min = 30, max = 100) => getRandomNumber(min, max),
      year: () => getRandomNumber(2025, 2028),

      // 🎯 GERADOR INTELIGENTE DE ÁREAS PROPORCIONAIS
      smartAreas: (totalArea: number) => {
        // 🎯 Gera áreas que SEMPRE respeitam o total
        const agriculturePercent = getRandomNumber(40, 70) / 100; // 40-70% da área total
        const vegetationPercent = getRandomNumber(15, 25) / 100; // 15-25% da área total

        // Garante que a soma nunca exceda 95% da área total (margem de segurança)
        const maxTotal = 0.95;
        const actualAgriPercent = Math.min(agriculturePercent, maxTotal - vegetationPercent);
        const actualVegePercent = Math.min(vegetationPercent, maxTotal - actualAgriPercent);

        return {
          agricultural: Math.round(totalArea * actualAgriPercent),
          vegetation: Math.round(totalArea * actualVegePercent),
        };
      },

      // 🌱 ÁREA INTELIGENTE PARA CULTURAS (BASEADA NA ÁREA AGRÍCOLA DISPONÍVEL)
      smartCropArea: (availableArea: number, isFirstCrop = false) => {
        if (availableArea <= 0) return getRandomNumber(10, 50);

        // Se é a primeira cultura, pode usar uma porcentagem maior
        const maxPercent = isFirstCrop ? 0.6 : 0.4; // 60% ou 40% da área disponível
        const minPercent = 0.1; // Mínimo de 10%

        const percent = Math.random() * (maxPercent - minPercent) + minPercent;
        const calculatedArea = Math.round(availableArea * percent);

        // Garante que não seja menor que 1 hectare
        return Math.max(1, calculatedArea);
      },

      // 📅 DATAS BÁSICAS
      date: () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + getRandomNumber(1, 365));
        return futureDate.toISOString().split('T')[0];
      },

      // 🖼️ URLS DE IMAGENS
      url: () => getRandomItem(brazilianData.producerImages),
      producerImage: () => getRandomItem(brazilianData.producerImages),
      farmImage: () => getRandomItem(brazilianData.farmImages),

      cropImage: (cropType?: string) => {
        // Se tem tipo específico de cultura e existe imagens para ela
        if (
          cropType &&
          brazilianData.cropImages[cropType as keyof typeof brazilianData.cropImages]
        ) {
          return getRandomItem(
            brazilianData.cropImages[cropType as keyof typeof brazilianData.cropImages],
          );
        }

        // Senão, pega uma imagem aleatória de qualquer cultura
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

  // 🔍 VERIFICA SE CAMPO ESTÁ VAZIO
  const isFieldEmpty = useCallback((value: string | number | Date | undefined | null): boolean => {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (typeof value === 'number') return value === 0;
    if (value instanceof Date) return false; // Datas sempre são consideradas preenchidas
    return true;
  }, []);

  // 🚀 FUNÇÃO PRINCIPAL DE AUTO-FILL - VERSÃO SUPREMA TURBINADA
  const autoFill = useCallback(
    (
      schema: FormSchema,
      updateFunction: (path: string, value: string | number | Date) => void,
      options?: {
        excludeFields?: string[];
        customData?: Record<string, string | number | Date>;
        currentData?: CurrentFormData;
        fillOnlyEmpty?: boolean;
        imageContext?: 'producer' | 'farm' | 'crop';
        cropType?: string;
        availableArea?: number;
        isFirstCrop?: boolean;
      },
    ) => {
      const {
        excludeFields = [],
        customData = {},
        currentData = {},
        fillOnlyEmpty = true,
        imageContext = 'producer',
        cropType,
        availableArea,
        isFirstCrop = false,
      } = options || {};

      let filledCount = 0;
      let skippedCount = 0;

      console.log('🎯 AutoFill SUPREMO iniciado!');
      console.log('📊 Dados atuais:', currentData);
      console.log('🖼️ Contexto:', imageContext, cropType ? `- Tipo: ${cropType}` : '');
      console.log('🌱 Área disponível:', availableArea, '- Primeira cultura:', isFirstCrop);

      // 🎯 LÓGICA DE ÁREAS PARA FAZENDAS
      let totalAreaValue: number | null = null;

      // Primeiro, identifica se há área total no schema e a gera
      if ('totalArea' in schema && isFieldEmpty(currentData['totalArea'])) {
        const totalAreaConfig = schema['totalArea'];
        totalAreaValue = generators.number(totalAreaConfig.min, totalAreaConfig.max);
        updateFunction('totalArea', totalAreaValue);
        filledCount++;
        console.log(`✨ Área total gerada: ${totalAreaValue} ha`);
      } else if (currentData['totalArea'] && typeof currentData['totalArea'] === 'number') {
        totalAreaValue = currentData['totalArea'];
      }

      // Depois, gera as áreas proporcionais se a área total existir
      if (totalAreaValue && totalAreaValue > 0) {
        const smartAreas = generators.smartAreas(totalAreaValue);

        // Preenche área agrícola se vazia
        if ('agriculturalArea' in schema && isFieldEmpty(currentData['agriculturalArea'])) {
          updateFunction('agriculturalArea', smartAreas.agricultural);
          filledCount++;
          console.log(
            `✨ Área agrícola gerada: ${smartAreas.agricultural} ha (${Math.round((smartAreas.agricultural / totalAreaValue) * 100)}%)`,
          );
        }

        // Preenche área de vegetação se vazia
        if ('vegetationArea' in schema && isFieldEmpty(currentData['vegetationArea'])) {
          updateFunction('vegetationArea', smartAreas.vegetation);
          filledCount++;
          console.log(
            `✨ Área de vegetação gerada: ${smartAreas.vegetation} ha (${Math.round((smartAreas.vegetation / totalAreaValue) * 100)}%)`,
          );
        }
      }

      // 🌾 VARIÁVEIS PARA DATAS INTELIGENTES DE CULTURAS
      let generatedPlantingDate: Date | null = null;
      let selectedCropType: string | null = cropType || null;

      // Processa os demais campos normalmente
      Object.entries(schema).forEach(([fieldPath, config]) => {
        // ❌ Pular campos excluídos e áreas (já processadas acima)
        if (
          excludeFields.includes(fieldPath) ||
          fieldPath === 'totalArea' ||
          fieldPath === 'agriculturalArea' ||
          fieldPath === 'vegetationArea'
        ) {
          return;
        }

        // 🔍 VERIFICA SE CAMPO JÁ ESTÁ PREENCHIDO
        const currentValue = currentData[fieldPath];
        if (fillOnlyEmpty && !isFieldEmpty(currentValue)) {
          skippedCount++;
          console.log(`🔒 Campo '${fieldPath}' já preenchido - ignorando`);
          return;
        }

        let value: string | number | Date;

        // 🎯 Usar dados customizados se fornecidos
        if (customData[fieldPath] !== undefined) {
          value = customData[fieldPath];
        }
        // 🎯 GERADORES SUPREMOS PARA CULTURAS
        else {
          switch (config.type) {
            case 'select':
              value = config.options ? generators.select(config.options) : '';
              break;

            case 'cropType':
            case 'type':
              if (fieldPath === 'type' || fieldPath === 'cropType') {
                selectedCropType = config.options
                  ? generators.select(config.options)
                  : generators.cropType();
                value = selectedCropType;
              } else {
                value = generators.text();
              }
              break;

            case 'smartYield':
              value = generators.smartYield(selectedCropType || cropType);
              break;

            case 'smartPlantingDate':
              generatedPlantingDate = generators.smartPlantingDate();
              value = generatedPlantingDate;
              break;

            case 'smartHarvestDate': {
              const plantingDateToUse =
                generatedPlantingDate ||
                (currentData['plantingDate'] as Date) ||
                generators.smartPlantingDate();
              value = generators.smartHarvestDate(plantingDateToUse, selectedCropType || cropType);
              break;
            }

            case 'smartCropNotes':
              value = generators.smartCropNotes(selectedCropType || cropType);
              break;

            case 'text':
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
              // 🌱 LÓGICA ESPECIAL PARA ÁREA DE CULTURAS
              if (
                (fieldPath === 'plantedArea' || fieldPath.toLowerCase().includes('area')) &&
                availableArea !== undefined
              ) {
                value = generators.smartCropArea(availableArea, isFirstCrop);
              }
              // 🎯 LÓGICA ESPECIAL PARA PRODUTIVIDADE
              else if (
                fieldPath === 'expectedYield' ||
                fieldPath.toLowerCase().includes('yield') ||
                fieldPath.toLowerCase().includes('produtividade')
              ) {
                value = generators.smartYield(selectedCropType || cropType);
              } else {
                value = generators.number(config.min, config.max);
              }
              break;

            case 'percentage':
              value = generators.percentage(config.min || 30, config.max || 100);
              break;

            case 'year':
              value = generators.year();
              break;

            case 'date':
              // 🎯 LÓGICA ESPECIAL PARA DATAS DE CULTURAS
              if (fieldPath === 'plantingDate' || fieldPath.toLowerCase().includes('plantio')) {
                generatedPlantingDate = generators.smartPlantingDate();
                value = generatedPlantingDate.toISOString().split('T')[0];
              } else if (
                fieldPath === 'harvestDate' ||
                fieldPath.toLowerCase().includes('colheita')
              ) {
                const plantingDateToUse =
                  generatedPlantingDate ||
                  (currentData['plantingDate'] as Date) ||
                  generators.smartPlantingDate();
                const harvestDate = generators.smartHarvestDate(
                  plantingDateToUse,
                  selectedCropType || cropType,
                );
                value = harvestDate.toISOString().split('T')[0];
              } else {
                value = generators.date();
              }
              break;

            case 'url':
              if (
                fieldPath.toLowerCase().includes('farm') ||
                fieldPath.toLowerCase().includes('fazenda')
              ) {
                value = generators.farmImage();
              } else if (
                fieldPath.toLowerCase().includes('crop') ||
                fieldPath.toLowerCase().includes('cultura')
              ) {
                value = generators.cropImage(selectedCropType || cropType);
              } else if (
                fieldPath.toLowerCase().includes('producer') ||
                fieldPath.toLowerCase().includes('profile')
              ) {
                value = generators.producerImage();
              } else {
                switch (imageContext) {
                  case 'farm':
                    value = generators.farmImage();
                    break;
                  case 'crop':
                    value = generators.cropImage(selectedCropType || cropType);
                    break;
                  default:
                    value = generators.producerImage();
                }
              }
              break;

            case 'textarea':
              // 🎯 OBSERVAÇÕES ESPECIAIS PARA CULTURAS
              if (
                fieldPath === 'notes' ||
                fieldPath.toLowerCase().includes('observ') ||
                fieldPath.toLowerCase().includes('nota')
              ) {
                value = generators.smartCropNotes(selectedCropType || cropType);
              } else {
                value = generators.textarea();
              }
              break;

            default: {
              const generator =
                generators[config.type as keyof typeof generators] || generators.text;
              value = (generator as () => string)();
              break;
            }
          }
        }

        // ✅ Atualizar campo apenas se gerou um valor válido
        if (value !== '' && value !== undefined && value !== null) {
          updateFunction(fieldPath, value);
          filledCount++;
          console.log(`✨ Campo '${fieldPath}' preenchido:`, value);
        }
      });

      // 🎉 FEEDBACK SUPREMO
      console.log(
        `🚀 AutoFill CONCLUÍDO! ${filledCount} campos preenchidos, ${skippedCount} ignorados`,
      );

      return {
        filledCount,
        skippedCount,
        success: filledCount > 0,
      };
    },
    [generators, isFieldEmpty],
  );

  return {
    autoFill,
    generators, // Exporta os geradores para uso externo se necessário
    isFieldEmpty,
  };
};
