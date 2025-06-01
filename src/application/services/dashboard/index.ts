import { ChartData, DashboardMetrics } from '@entities';
import { FarmSize } from '@enums';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';

export class DashboardService {
  // ============= MÉTRICAS PRINCIPAIS =============

  static calculateMetrics(): DashboardMetrics {
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

    // Encontrar maior e menor fazenda
    const sortedByArea = [...farms].sort((a, b) => a.totalArea - b.totalArea);
    const largestFarm = sortedByArea[sortedByArea.length - 1];
    const smallestFarm = sortedByArea[0];

    return {
      totalFarms: farms.length,
      totalHectares: totalArea,
      totalProducers: producers.length, // ✅ AGORA USA producers
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

  // ============= DADOS DOS GRÁFICOS =============

  static calculateChartData(): ChartData {
    return {
      farmsByState: this.calculateFarmsByState(),
      cropsDistribution: this.calculateCropsDistribution(),
      landUsage: this.calculateLandUsage(),
      producersType: this.calculateProducersType(),
      farmSizeDistribution: this.calculateFarmSizeDistribution(),
      topStatesByArea: this.calculateTopStatesByArea(),
      cropsByYear: this.calculateCropsByYear(),
      performanceMetrics: this.calculatePerformanceMetrics(),
    };
  }

  // ============= GRÁFICOS ESPECÍFICOS =============

  static calculateFarmsByState() {
    const farms = useFarmStore.getState().getActiveFarms();
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

  static calculateCropsDistribution() {
    const crops = useCropStore.getState().getActiveCrops();
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

  static calculateLandUsage() {
    const farms = useFarmStore.getState().getActiveFarms();

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

  static calculateProducersType() {
    const producers = useProducerStore.getState().getActiveProducers();

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

  static calculateFarmSizeDistribution() {
    const farms = useFarmStore.getState().getActiveFarms();

    const small = farms.filter((f) => f.totalArea < 50);
    const medium = farms.filter((f) => f.totalArea >= 50 && f.totalArea <= 500);
    const large = farms.filter((f) => f.totalArea > 500);

    return [
      {
        size: FarmSize.SMALL,
        count: small.length,
        averageArea:
          small.length > 0 ? small.reduce((sum, f) => sum + f.totalArea, 0) / small.length : 0,
      },
      {
        size: FarmSize.MEDIUM,
        count: medium.length,
        averageArea:
          medium.length > 0 ? medium.reduce((sum, f) => sum + f.totalArea, 0) / medium.length : 0,
      },
      {
        size: FarmSize.LARGE,
        count: large.length,
        averageArea:
          large.length > 0 ? large.reduce((sum, f) => sum + f.totalArea, 0) / large.length : 0,
      },
    ];
  }

  static calculateTopStatesByArea() {
    const farms = useFarmStore.getState().getActiveFarms();
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

  static calculateCropsByYear() {
    const crops = useCropStore.getState().getActiveCrops();
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
          totalCrops: data.totalCrops, // ✅ AGORA USA totalCrops
          totalArea: data.totalArea,
          topCrop: topCrop ? topCrop[0] : '',
        };
      })
      .sort((a, b) => a.year.localeCompare(b.year));
  }

  static calculatePerformanceMetrics() {
    const farms = useFarmStore.getState().getActiveFarms();

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

  // ============= ANÁLISES AVANÇADAS =============

  static getProductivityInsights() {
    const farms = useFarmStore.getState().getActiveFarms();
    const crops = useCropStore.getState().getActiveCrops();

    const insights = farms
      .map((farm) => {
        const farmCrops = crops.filter((c) => c.farmId === farm.id && c.expectedYield);
        const avgYield =
          farmCrops.length > 0
            ? farmCrops.reduce((sum, c) => sum + (c.expectedYield || 0), 0) / farmCrops.length
            : 0;

        return {
          farmId: farm.id,
          farmName: farm.name,
          productivity: farm.productivity,
          sustainability: farm.sustainability,
          technology: farm.technology,
          averageYield: avgYield,
          cropsCount: farmCrops.length,
        };
      })
      .filter((item) => item.averageYield > 0);

    return insights.sort((a, b) => b.averageYield - a.averageYield);
  }

  static getRegionalAnalysis() {
    const farms = useFarmStore.getState().getActiveFarms();
    const crops = useCropStore.getState().getActiveCrops();

    const analysis: {
      [state: string]: {
        farmsCount: number;
        producersCount: number;
        totalArea: number;
        averageProductivity: number;
        dominantCrop: string;
        cropsCount: number;
      };
    } = {};

    farms.forEach((farm) => {
      if (!analysis[farm.state]) {
        analysis[farm.state] = {
          farmsCount: 0,
          producersCount: 0,
          totalArea: 0,
          averageProductivity: 0,
          dominantCrop: '',
          cropsCount: 0,
        };
      }

      const stateData = analysis[farm.state];
      stateData.farmsCount++;
      stateData.totalArea += farm.totalArea;
      stateData.averageProductivity += farm.productivity;
    });

    // Calcular médias e dados adicionais
    Object.keys(analysis).forEach((state) => {
      const stateData = analysis[state];
      const stateFarms = farms.filter((f) => f.state === state);
      const stateProducers = new Set(stateFarms.map((f) => f.producerId));
      const stateCrops = crops.filter((c) => {
        const farm = farms.find((f) => f.id === c.farmId);
        return farm?.state === state;
      });

      stateData.producersCount = stateProducers.size;
      stateData.averageProductivity = stateData.averageProductivity / stateData.farmsCount;
      stateData.cropsCount = stateCrops.length;

      // Cultura dominante
      const cropTypes: { [type: string]: number } = {};
      stateCrops.forEach((crop) => {
        cropTypes[crop.type] = (cropTypes[crop.type] || 0) + 1;
      });

      const dominantEntry = Object.entries(cropTypes).sort(([, a], [, b]) => b - a)[0];
      stateData.dominantCrop = dominantEntry ? dominantEntry[0] : '';
    });

    return analysis;
  }

  static getTrendAnalysis() {
    const crops = useCropStore.getState().getActiveCrops();
    const currentYear = new Date().getFullYear().toString();
    const previousYear = (new Date().getFullYear() - 1).toString();

    const currentYearCrops = crops.filter((c) => c.harvestYear === currentYear);
    const previousYearCrops = crops.filter((c) => c.harvestYear === previousYear);

    const currentArea = currentYearCrops.reduce((sum, c) => sum + c.plantedArea, 0);
    const previousArea = previousYearCrops.reduce((sum, c) => sum + c.plantedArea, 0);

    const areaGrowth = previousArea > 0 ? ((currentArea - previousArea) / previousArea) * 100 : 0;

    return {
      areaGrowth,
      cropsGrowth:
        previousYearCrops.length > 0
          ? ((currentYearCrops.length - previousYearCrops.length) / previousYearCrops.length) * 100
          : 0,
      currentYearCrops: currentYearCrops.length,
      previousYearCrops: previousYearCrops.length,
      currentArea,
      previousArea,
    };
  }

  // ============= UTILITIES =============

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

  // ============= REFRESH DATA =============

  static refreshDashboard() {
    const metrics = this.calculateMetrics();
    const chartData = this.calculateChartData();

    return {
      metrics,
      chartData,
      lastUpdated: new Date(),
    };
  }
}
