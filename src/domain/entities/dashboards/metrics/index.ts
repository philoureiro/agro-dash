export interface DashboardMetrics {
  totalFarms: number; // Total de fazendas cadastradas
  totalHectares: number; // Soma de todas as áreas totais
  totalProducers: number; // Total de produtores únicos
  averageAreaPerFarm: number; // Área média por fazenda
  agriculturalPercentage: number; // % de área agricultável
  vegetationPercentage: number; // % de área de vegetação
  averageProductivity: number; // Média geral de produtividade
  averageSustainability: number; // Média geral de sustentabilidade
  averageTechnology: number; // Média geral de tecnologia
  largestFarm: {
    // Maior fazenda cadastrada
    name: string;
    area: number;
  };
  smallestFarm: {
    // Menor fazenda cadastrada
    name: string;
    area: number;
  };
}
