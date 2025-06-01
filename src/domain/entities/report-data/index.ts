import { ChartData } from '../chart-data';
import { DashboardFilters, DashboardMetrics } from '../dashboards';

export interface ReportData {
  generatedAt: Date; // Data/hora de geração do relatório
  filters: DashboardFilters; // Filtros aplicados no relatório
  metrics: DashboardMetrics; // Métricas incluídas
  charts: ChartData; // Dados dos gráficos
  summary: {
    // Resumo executivo
    totalRecords: number;
    dataRange: {
      oldestRecord: Date;
      newestRecord: Date;
    };
    topPerformers: {
      mostProductiveFarm: string;
      mostSustainableFarm: string;
      mostTechnologicalFarm: string;
    };
  };
}
