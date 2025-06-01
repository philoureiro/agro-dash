import { FarmSize } from '@enums';

export interface ChartData {
  // Gráfico: Fazendas por Estado (Pizza/Donut)
  farmsByState: {
    state: string; // Nome do estado
    count: number; // Quantidade de fazendas
    percentage: number; // Percentual do total
    totalArea: number; // Área total do estado
  }[];

  // Gráfico: Distribuição de Culturas (Pizza)
  cropsDistribution: {
    crop: string; // Nome da cultura
    count: number; // Quantidade de plantios
    totalArea: number; // Área total plantada
    percentage: number; // Percentual do total
  }[];

  // Gráfico: Uso do Solo (Donut)
  landUsage: {
    type: 'Agricultural' | 'Vegetation'; // Tipo de uso
    area: number; // Área em hectares
    percentage: number; // Percentual do total
  }[];

  // Gráfico: Tipos de Produtores (Donut)
  producersType: {
    type: 'CPF' | 'CNPJ'; // Tipo de documento
    count: number; // Quantidade de produtores
    percentage: number; // Percentual do total
  }[];

  // Gráfico: Distribuição por Tamanho (Barras)
  farmSizeDistribution: {
    size: FarmSize; // Tamanho da fazenda
    count: number; // Quantidade de fazendas
    averageArea: number; // Área média do grupo
  }[];

  // Gráfico: Top Estados por Área (Barras Horizontais)
  topStatesByArea: {
    state: string; // Nome do estado
    totalArea: number; // Área total em hectares
    farmsCount: number; // Quantidade de fazendas
  }[];

  // Gráfico: Culturas por Ano (Timeline/Linha)
  cropsByYear: {
    year: string; // Ano da safra
    totalCrops: number; // Total de culturas plantadas
    totalArea: number; // Área total plantada no ano
    topCrop: string; // Cultura mais plantada do ano
  }[];

  // Gráfico: Métricas de Performance (Radar)
  performanceMetrics: {
    metric: 'Productivity' | 'Sustainability' | 'Technology';
    average: number; // Média geral (0-100)
    max: number; // Valor máximo encontrado
    min: number; // Valor mínimo encontrado
  }[];
}
