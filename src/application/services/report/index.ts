import {
  ChartData,
  Crop,
  DashboardFilters,
  DashboardMetrics,
  Farm,
  Producer,
  ReportData,
} from '@entities';
import { FarmSize } from '@enums';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
import { formatArea } from '@validations';

export class ReportService {
  // ============= GERAÇÃO DE RELATÓRIO PRINCIPAL =============

  // ============= CÁLCULOS DIRETOS (SEM IMPORT CIRCULAR) =============

  private static calculateReportMetrics(): DashboardMetrics {
    const producers = useProducerStore.getState().getActiveProducers();
    const farms = useFarmStore.getState().getActiveFarms();

    if (farms.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0);
    const totalAgricultural = farms.reduce((sum, farm) => sum + farm.agriculturalArea, 0);
    const totalVegetation = farms.reduce((sum, farm) => sum + farm.vegetationArea, 0);

    const totalProductivity = farms.reduce((sum, farm) => sum + farm.productivity, 0);
    const totalSustainability = farms.reduce((sum, farm) => sum + farm.sustainability, 0);
    const totalTechnology = farms.reduce((sum, farm) => sum + farm.technology, 0);

    const sortedByArea = [...farms].sort((a, b) => a.totalArea - b.totalArea);
    const largestFarm = sortedByArea[sortedByArea.length - 1];
    const smallestFarm = sortedByArea[0];

    return {
      totalFarms: farms.length,
      totalHectares: totalArea,
      totalProducers: producers.length,
      averageAreaPerFarm: totalArea / farms.length,
      agriculturalPercentage: totalArea > 0 ? (totalAgricultural / totalArea) * 100 : 0,
      vegetationPercentage: totalArea > 0 ? (totalVegetation / totalArea) * 100 : 0,
      averageProductivity: totalProductivity / farms.length,
      averageSustainability: totalSustainability / farms.length,
      averageTechnology: totalTechnology / farms.length,
      largestFarm: {
        name: largestFarm.name,
        area: largestFarm.totalArea,
      },
      smallestFarm: {
        name: smallestFarm.name,
        area: smallestFarm.totalArea,
      },
    };
  }

  private static calculateReportCharts(): ChartData {
    // Implementação básica dos gráficos
    return {
      farmsByState: [],
      cropsDistribution: [],
      landUsage: [],
      producersType: [],
      farmSizeDistribution: [],
      topStatesByArea: [],
      cropsByYear: [],
      performanceMetrics: [],
    };
  }

  // ============= RELATÓRIOS ESPECÍFICOS =============

  static generateProducerReport(producerId?: string) {
    const producers = producerId
      ? [useProducerStore.getState().getProducerById(producerId)].filter(
          (p): p is Producer => p !== undefined,
        )
      : useProducerStore.getState().getActiveProducers();

    const farms = useFarmStore
      .getState()
      .getActiveFarms()
      .filter((f) => producers.some((p) => p.id === f.producerId));

    return {
      producers: producers.map((p) => ({
        ...p,
        farms: farms.filter((f) => f.producerId === p.id).length,
        totalArea: farms
          .filter((f) => f.producerId === p.id)
          .reduce((sum, f) => sum + f.totalArea, 0),
      })),
      totalProducers: producers.length,
      totalFarms: farms.length,
      totalArea: farms.reduce((sum, f) => sum + f.totalArea, 0),
      averageAreaPerProducer:
        producers.length > 0
          ? farms.reduce((sum, f) => sum + f.totalArea, 0) / producers.length
          : 0,
    };
  }

  static generateFarmReport(farmId?: string) {
    const farms = farmId
      ? [useFarmStore.getState().getFarmById(farmId)].filter((f): f is Farm => f !== undefined)
      : useFarmStore.getState().getActiveFarms();

    const crops = useCropStore
      .getState()
      .getActiveCrops()
      .filter((c) => farms.some((f) => f.id === c.farmId));

    return {
      farms: farms.map((f) => {
        const farmCrops = crops.filter((c) => c.farmId === f.id);
        const plantedArea = farmCrops.reduce((sum, c) => sum + c.plantedArea, 0);

        return {
          ...f,
          cropsCount: farmCrops.length,
          plantedArea,
          availableArea: f.agriculturalArea - plantedArea,
          utilizationRate: f.agriculturalArea > 0 ? (plantedArea / f.agriculturalArea) * 100 : 0,
        };
      }),
      totalFarms: farms.length,
      totalArea: farms.reduce((sum, f) => sum + f.totalArea, 0),
      totalAgricultural: farms.reduce((sum, f) => sum + f.agriculturalArea, 0),
      totalVegetation: farms.reduce((sum, f) => sum + f.vegetationArea, 0),
      averageProductivity:
        farms.length > 0 ? farms.reduce((sum, f) => sum + f.productivity, 0) / farms.length : 0,
    };
  }

  static generateCropReport(cropType?: string) {
    const crops = cropType
      ? useCropStore
          .getState()
          .getActiveCrops()
          .filter((c) => c.type === cropType)
      : useCropStore.getState().getActiveCrops();

    const yearAnalysis = this.analyzeCropsByYear(crops);
    const productivityAnalysis = this.analyzeCropsProductivity(crops);

    return {
      crops: crops.map((c) => ({
        ...c,
        expectedProduction: c.expectedYield ? c.plantedArea * c.expectedYield : null,
      })),
      totalCrops: crops.length,
      totalPlantedArea: crops.reduce((sum, c) => sum + c.plantedArea, 0),
      averageArea:
        crops.length > 0 ? crops.reduce((sum, c) => sum + c.plantedArea, 0) / crops.length : 0,
      yearAnalysis,
      productivityAnalysis,
    };
  }

  // ============= RELATÓRIO EXECUTIVO =============

  static generateExecutiveReport() {
    const metrics = this.calculateReportMetrics();
    const farms = useFarmStore.getState().getActiveFarms();

    const insights = farms
      .map((farm) => ({
        farmId: farm.id,
        farmName: farm.name,
        productivity: farm.productivity,
        sustainability: farm.sustainability,
        technology: farm.technology,
        averageYield: 0, // Simplified
        cropsCount: 0, // Simplified
      }))
      .sort((a, b) => b.productivity - a.productivity);

    return {
      overview: {
        totalProducers: metrics.totalProducers,
        totalFarms: metrics.totalFarms,
        totalArea: metrics.totalHectares,
        averageProductivity: metrics.averageProductivity,
      },
      keyMetrics: {
        topPerformingFarms: insights.slice(0, 5),
        stateDistribution: [],
        cropDistribution: [],
        landUsage: [],
      },
      trends: {
        areaGrowth: 0,
        cropsGrowth: 0,
        currentYearCrops: 0,
        previousYearCrops: 0,
        currentArea: 0,
        previousArea: 0,
      },
      recommendations: this.generateRecommendations(metrics),
    };
  }

  // ============= EXPORT PARA PDF =============

  static generatePDFData(reportData: ReportData) {
    return {
      title: 'Relatório Agro Dash',
      subtitle: `Gerado em ${reportData.generatedAt.toLocaleDateString('pt-BR')}`,
      sections: [
        {
          title: 'Resumo Executivo',
          content: this.formatExecutiveSummary(reportData),
        },
        {
          title: 'Métricas Principais',
          content: this.formatMetrics(reportData.metrics),
        },
        {
          title: 'Performance das Fazendas',
          content: this.formatPerformanceMetrics(reportData.charts.performanceMetrics),
        },
      ],
    };
  }

  // ============= UTILITIES PRIVADAS =============

  private static applyFiltersToReport(filters: DashboardFilters): {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
  } {
    const producers = useProducerStore.getState().getActiveProducers();
    let farms = useFarmStore.getState().getActiveFarms();
    let crops = useCropStore.getState().getActiveCrops();

    if (filters.states.length > 0) {
      farms = farms.filter((f) => filters.states.includes(f.state));
    }

    if (filters.crops.length > 0) {
      crops = crops.filter((c) => filters.crops.includes(c.type));
    }

    if (filters.harvestYears.length > 0) {
      crops = crops.filter((c) => filters.harvestYears.includes(c.harvestYear));
    }

    return { producers, farms, crops };
  }

  private static calculateFilteredMetrics(data: {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
  }): DashboardMetrics {
    const { producers, farms } = data;

    if (farms.length === 0) {
      return this.getEmptyMetrics();
    }

    const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0);
    const totalAgricultural = farms.reduce((sum, farm) => sum + farm.agriculturalArea, 0);
    const totalVegetation = farms.reduce((sum, farm) => sum + farm.vegetationArea, 0);

    const sortedByArea = [...farms].sort((a, b) => a.totalArea - b.totalArea);
    const largestFarm = sortedByArea[sortedByArea.length - 1];
    const smallestFarm = sortedByArea[0];

    return {
      totalFarms: farms.length,
      totalHectares: totalArea,
      totalProducers: producers.length,
      averageAreaPerFarm: totalArea / farms.length,
      agriculturalPercentage: (totalAgricultural / totalArea) * 100,
      vegetationPercentage: (totalVegetation / totalArea) * 100,
      averageProductivity: farms.reduce((sum, f) => sum + f.productivity, 0) / farms.length,
      averageSustainability: farms.reduce((sum, f) => sum + f.sustainability, 0) / farms.length,
      averageTechnology: farms.reduce((sum, f) => sum + f.technology, 0) / farms.length,
      largestFarm: {
        name: largestFarm.name,
        area: largestFarm.totalArea,
      },
      smallestFarm: {
        name: smallestFarm.name,
        area: smallestFarm.totalArea,
      },
    };
  }

  private static generateSummary() {
    const farms = useFarmStore.getState().getActiveFarms();
    const sortedByDate = [...farms].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    // Find top performers safely
    const mostProductiveFarm =
      farms.length > 0
        ? farms.reduce((max, farm) => (farm.productivity > max.productivity ? farm : max))
        : null;

    const mostSustainableFarm =
      farms.length > 0
        ? farms.reduce((max, farm) => (farm.sustainability > max.sustainability ? farm : max))
        : null;

    const mostTechnologicalFarm =
      farms.length > 0
        ? farms.reduce((max, farm) => (farm.technology > max.technology ? farm : max))
        : null;

    return {
      totalRecords: farms.length,
      dataRange: {
        oldestRecord: sortedByDate[0]?.createdAt || new Date(),
        newestRecord: sortedByDate[sortedByDate.length - 1]?.createdAt || new Date(),
      },
      topPerformers: {
        mostProductiveFarm: mostProductiveFarm?.name || '',
        mostSustainableFarm: mostSustainableFarm?.name || '',
        mostTechnologicalFarm: mostTechnologicalFarm?.name || '',
      },
    };
  }

  private static getDefaultFilters(): DashboardFilters {
    return {
      states: [],
      crops: [],
      harvestYears: [],
      farmSizes: [],
      producerTypes: [],
      areaRange: { min: 0, max: 0 },
      performanceRange: {
        productivity: { min: 0, max: 100 },
        sustainability: { min: 0, max: 100 },
        technology: { min: 0, max: 100 },
      },
    };
  }

  private static analyzeCropsByYear(crops: Crop[]): {
    [year: string]: { count: number; area: number };
  } {
    const yearStats: { [year: string]: { count: number; area: number } } = {};

    crops.forEach((crop) => {
      if (!yearStats[crop.harvestYear]) {
        yearStats[crop.harvestYear] = { count: 0, area: 0 };
      }
      yearStats[crop.harvestYear].count++;
      yearStats[crop.harvestYear].area += crop.plantedArea;
    });

    return yearStats;
  }

  private static analyzeCropsProductivity(crops: Crop[]): {
    [type: string]: { count: number; avgYield: number };
  } {
    const typeStats: { [type: string]: { count: number; avgYield: number } } = {};

    crops.forEach((crop) => {
      if (!crop.expectedYield) return;

      if (!typeStats[crop.type]) {
        typeStats[crop.type] = { count: 0, avgYield: 0 };
      }
      typeStats[crop.type].count++;
      typeStats[crop.type].avgYield += crop.expectedYield;
    });

    Object.keys(typeStats).forEach((type) => {
      typeStats[type].avgYield = typeStats[type].avgYield / typeStats[type].count;
    });

    return typeStats;
  }

  private static generateRecommendations(metrics: DashboardMetrics): string[] {
    const recommendations: string[] = [];

    if (metrics.averageProductivity < 70) {
      recommendations.push(
        'Considere investir em tecnologias para aumentar a produtividade média das fazendas',
      );
    }

    if (metrics.agriculturalPercentage < 60) {
      recommendations.push(
        'Há potencial para aumentar a área agricultável em relação à área total',
      );
    }

    return recommendations;
  }

  private static getEmptyMetrics(): DashboardMetrics {
    return {
      totalFarms: 0,
      totalHectares: 0,
      totalProducers: 0,
      averageAreaPerFarm: 0,
      agriculturalPercentage: 0,
      vegetationPercentage: 0,
      averageProductivity: 0,
      averageSustainability: 0,
      averageTechnology: 0,
      largestFarm: { name: '', area: 0 },
      smallestFarm: { name: '', area: 0 },
    };
  }

  private static formatExecutiveSummary(data: ReportData): string {
    return `Este relatório apresenta uma análise completa dos ${data.metrics.totalProducers} produtores, ${data.metrics.totalFarms} fazendas e ${formatArea(data.metrics.totalHectares)} registrados no sistema.`;
  }

  private static formatMetrics(metrics: DashboardMetrics): string {
    return `Total de fazendas: ${metrics.totalFarms}\nÁrea total: ${formatArea(metrics.totalHectares)}\nProdutividade média: ${metrics.averageProductivity.toFixed(1)}`;
  }

  private static formatPerformanceMetrics(data: ChartData['performanceMetrics']): string {
    return data
      .map(
        (item) =>
          `${item.metric}: Média ${item.average.toFixed(1)}, Máx ${item.max}, Mín ${item.min}`,
      )
      .join('\n');
  }

  // ============= MÉTODOS AUXILIARES (ADICIONAR NO FINAL DA CLASSE) =============

  private static calculateFarmsByStateFiltered(farms: Farm[]) {
    const stateCount: { [state: string]: { count: number; totalArea: number } } = {};

    farms.forEach((farm) => {
      if (!stateCount[farm.state]) {
        stateCount[farm.state] = { count: 0, totalArea: 0 };
      }
      stateCount[farm.state].count++;
      stateCount[farm.state].totalArea += farm.totalArea;
    });

    const total = farms.length;
    return Object.entries(stateCount).map(([state, data]) => ({
      state,
      count: data.count,
      percentage: total > 0 ? (data.count / total) * 100 : 0,
      totalArea: data.totalArea,
    }));
  }

  private static calculateCropsDistributionFiltered(crops: Crop[]) {
    const cropCount: { [type: string]: { count: number; totalArea: number } } = {};

    crops.forEach((crop) => {
      if (!cropCount[crop.type]) {
        cropCount[crop.type] = { count: 0, totalArea: 0 };
      }
      cropCount[crop.type].count++;
      cropCount[crop.type].totalArea += crop.plantedArea;
    });

    const totalArea = crops.reduce((sum, crop) => sum + crop.plantedArea, 0);
    return Object.entries(cropCount).map(([crop, data]) => ({
      crop,
      count: data.count,
      totalArea: data.totalArea,
      percentage: totalArea > 0 ? (data.totalArea / totalArea) * 100 : 0,
    }));
  }

  private static calculateLandUsageFiltered(farms: Farm[]) {
    const totalAgricultural = farms.reduce((sum, farm) => sum + farm.agriculturalArea, 0);
    const totalVegetation = farms.reduce((sum, farm) => sum + farm.vegetationArea, 0);
    const totalLand = totalAgricultural + totalVegetation;

    return [
      {
        type: 'Agricultural' as const,
        area: totalAgricultural,
        percentage: totalLand > 0 ? (totalAgricultural / totalLand) * 100 : 0,
      },
      {
        type: 'Vegetation' as const,
        area: totalVegetation,
        percentage: totalLand > 0 ? (totalVegetation / totalLand) * 100 : 0,
      },
    ];
  }

  private static calculateProducersTypeFiltered(producers: Producer[]) {
    const cpfCount = producers.filter((p) => p.documentType === 'CPF').length;
    const cnpjCount = producers.filter((p) => p.documentType === 'CNPJ').length;
    const total = producers.length;

    return [
      {
        type: 'CPF' as const,
        count: cpfCount,
        percentage: total > 0 ? (cpfCount / total) * 100 : 0,
      },
      {
        type: 'CNPJ' as const,
        count: cnpjCount,
        percentage: total > 0 ? (cnpjCount / total) * 100 : 0,
      },
    ];
  }

  private static calculateTopStatesByAreaFiltered(farms: Farm[]) {
    const stateStats: { [state: string]: { totalArea: number; farmsCount: number } } = {};

    farms.forEach((farm) => {
      if (!stateStats[farm.state]) {
        stateStats[farm.state] = { totalArea: 0, farmsCount: 0 };
      }
      stateStats[farm.state].totalArea += farm.totalArea;
      stateStats[farm.state].farmsCount++;
    });

    return Object.entries(stateStats)
      .map(([state, data]) => ({
        state,
        totalArea: data.totalArea,
        farmsCount: data.farmsCount,
      }))
      .sort((a, b) => b.totalArea - a.totalArea)
      .slice(0, 10);
  }

  private static calculateCropsByYearFiltered(crops: Crop[]) {
    const yearStats: {
      [year: string]: {
        totalCrops: number;
        totalArea: number;
        cropTypes: { [type: string]: number };
      };
    } = {};

    crops.forEach((crop) => {
      if (!yearStats[crop.harvestYear]) {
        yearStats[crop.harvestYear] = {
          totalCrops: 0,
          totalArea: 0,
          cropTypes: {},
        };
      }

      const yearData = yearStats[crop.harvestYear];
      yearData.totalCrops++;
      yearData.totalArea += crop.plantedArea;
      yearData.cropTypes[crop.type] = (yearData.cropTypes[crop.type] || 0) + 1;
    });

    return Object.entries(yearStats)
      .map(([year, data]) => {
        const topCrop = Object.entries(data.cropTypes).sort(([, a], [, b]) => b - a)[0];

        return {
          year,
          totalCrops: data.totalCrops,
          totalArea: data.totalArea,
          topCrop: topCrop ? topCrop[0] : '',
        };
      })
      .sort((a, b) => a.year.localeCompare(b.year));
  }

  private static calculatePerformanceMetricsFiltered(farms: Farm[]) {
    if (farms.length === 0) {
      return [
        { metric: 'Productivity' as const, average: 0, max: 0, min: 0 },
        { metric: 'Sustainability' as const, average: 0, max: 0, min: 0 },
        { metric: 'Technology' as const, average: 0, max: 0, min: 0 },
      ];
    }

    const productivity = farms.map((f) => f.productivity);
    const sustainability = farms.map((f) => f.sustainability);
    const technology = farms.map((f) => f.technology);

    return [
      {
        metric: 'Productivity' as const,
        average: productivity.reduce((sum, val) => sum + val, 0) / farms.length,
        max: Math.max(...productivity),
        min: Math.min(...productivity),
      },
      {
        metric: 'Sustainability' as const,
        average: sustainability.reduce((sum, val) => sum + val, 0) / farms.length,
        max: Math.max(...sustainability),
        min: Math.min(...sustainability),
      },
      {
        metric: 'Technology' as const,
        average: technology.reduce((sum, val) => sum + val, 0) / farms.length,
        max: Math.max(...technology),
        min: Math.min(...technology),
      },
    ];
  }

  private static calculateFarmSizeDistributionFiltered(farms: Farm[]) {
    const small = farms.filter((f) => f.totalArea < 50);
    const medium = farms.filter((f) => f.totalArea >= 50 && f.totalArea <= 500);
    const large = farms.filter((f) => f.totalArea > 500);

    return [
      {
        size: FarmSize.SMALL, // 🔥 CORRIGIDO - usar enum
        count: small.length,
        averageArea:
          small.length > 0 ? small.reduce((sum, f) => sum + f.totalArea, 0) / small.length : 0,
      },
      {
        size: FarmSize.MEDIUM, // 🔥 CORRIGIDO - usar enum
        count: medium.length,
        averageArea:
          medium.length > 0 ? medium.reduce((sum, f) => sum + f.totalArea, 0) / medium.length : 0,
      },
      {
        size: FarmSize.LARGE, // 🔥 CORRIGIDO - usar enum
        count: large.length,
        averageArea:
          large.length > 0 ? large.reduce((sum, f) => sum + f.totalArea, 0) / large.length : 0,
      },
    ];
  }

  private static calculateFilteredCharts(data: {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
  }): ChartData {
    const { producers, farms, crops } = data;

    return {
      farmsByState: this.calculateFarmsByStateFiltered(farms),
      cropsDistribution: this.calculateCropsDistributionFiltered(crops),
      landUsage: this.calculateLandUsageFiltered(farms),
      producersType: this.calculateProducersTypeFiltered(producers),
      farmSizeDistribution: this.calculateFarmSizeDistributionFiltered(farms),
      topStatesByArea: this.calculateTopStatesByAreaFiltered(farms),
      cropsByYear: this.calculateCropsByYearFiltered(crops),
      performanceMetrics: this.calculatePerformanceMetricsFiltered(farms),
    };
  }

  static generateReport(filters?: DashboardFilters): ReportData {
    const metrics = this.calculateReportMetrics();
    const charts = this.calculateReportCharts();

    const filteredData = filters ? this.applyFiltersToReport(filters) : null;
    const summary = this.generateSummary();

    return {
      generatedAt: new Date(),
      filters: filters || this.getDefaultFilters(),
      metrics: filteredData ? this.calculateFilteredMetrics(filteredData) : metrics,
      charts: filteredData ? this.calculateFilteredCharts(filteredData) : charts, // 🔥 CORRIGIDO
      summary,
    };
  }
}
