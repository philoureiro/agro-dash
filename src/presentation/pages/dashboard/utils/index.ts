import { TRANSLATIONS } from '../config';

// 🏷️ FUNÇÃO AUXILIAR PARA LABELS DOS FILTROS
export const getFilterLabel = (filter: string): string => {
  switch (filter) {
    case 'all':
      return 'Todos os Dados';
    case 'month':
      return 'Este Mês';
    case 'quarter':
      return 'Este Trimestre';
    case 'year':
      return 'Este Ano';
    default:
      return 'Todos';
  }
};

// 🔧 FUNÇÃO PARA TRADUZIR DADOS
export const translateData = (
  data: Record<string, unknown>[],
  type: keyof typeof TRANSLATIONS,
): Record<string, unknown>[] => {
  const translations = TRANSLATIONS[type];

  return data.map((item) => ({
    ...item,
    // Traduz diferentes campos baseado no tipo
    ...(type === 'crops' && {
      crop:
        translations[(item as Record<string, unknown>).crop as keyof typeof translations] ||
        (item as Record<string, unknown>).crop,
    }),
    ...(type === 'farmSizes' && {
      size:
        translations[(item as Record<string, unknown>).size as keyof typeof translations] ||
        (item as Record<string, unknown>).size,
    }),
    ...(type === 'metrics' && {
      metric:
        translations[(item as Record<string, unknown>).metric as keyof typeof translations] ||
        (item as Record<string, unknown>).metric,
    }),
    ...(type === 'landUse' && {
      type:
        translations[(item as Record<string, unknown>).type as keyof typeof translations] ||
        (item as Record<string, unknown>).type,
    }),
    ...(type === 'producerTypes' && {
      type:
        translations[(item as Record<string, unknown>).type as keyof typeof translations] ||
        (item as Record<string, unknown>).type,
    }),
  }));
};
