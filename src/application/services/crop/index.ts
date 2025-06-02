import { Crop } from '@entities';
import { CropType } from '@enums';
import { useCropStore, useFarmStore } from '@storage';
import { formatArea, validatePlantedArea } from '@validations';

export class CropService {
  // ============= CRUD OPERATIONS =============

  static async createCrop(data: Omit<Crop, 'id' | 'active'>): Promise<Crop | null> {
    try {
      // Validar se fazenda existe
      const farm = useFarmStore.getState().getFarmById(data.farmId);
      if (!farm) {
        throw new Error('Fazenda não encontrada');
      }

      // Validar área plantada
      const currentPlantedArea = this.getTotalPlantedAreaByFarm(data.farmId);
      const newTotalPlanted = currentPlantedArea + data.plantedArea;

      if (newTotalPlanted > farm.agriculturalArea) {
        throw new Error(
          `Área plantada excede área agricultável da fazenda. Disponível: ${formatArea(farm.agriculturalArea - currentPlantedArea)}`,
        );
      }

      // Validar área positiva
      if (data.plantedArea <= 0) {
        throw new Error('Área plantada deve ser maior que zero');
      }

      // Validar produtividade se informada
      if (data.expectedYield && data.expectedYield < 0) {
        throw new Error('Produtividade esperada deve ser positiva');
      }

      // Validar datas se informadas
      if (data.plantingDate && data.harvestDate) {
        if (data.harvestDate <= data.plantingDate) {
          throw new Error('Data de colheita deve ser posterior à data de plantio');
        }
      }

      // Criar cultura
      useCropStore.getState().addCrop({ ...data, active: true });

      // Buscar a cultura criada
      const crops = useCropStore.getState().crops;
      const newCrop = crops[crops.length - 1];

      // Sincronizar com fazenda
      this.syncFarmCrops(data.farmId);

      return newCrop;
    } catch (error) {
      useCropStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao criar cultura');
      return null;
    }
  }

  static async updateCrop(id: string, updates: Partial<Crop>): Promise<boolean> {
    try {
      const crop = useCropStore.getState().getCropById(id);
      if (!crop) {
        throw new Error('Cultura não encontrada');
      }

      const farm = useFarmStore.getState().getFarmById(crop.farmId);
      if (!farm) {
        throw new Error('Fazenda associada não encontrada');
      }

      // Se alterando área plantada, validar
      if (updates.plantedArea !== undefined) {
        if (updates.plantedArea <= 0) {
          throw new Error('Área plantada deve ser maior que zero');
        }

        // Calcular área total sem a cultura atual
        const otherCropsArea = this.getTotalPlantedAreaByFarm(crop.farmId) - crop.plantedArea;
        const newTotalPlanted = otherCropsArea + updates.plantedArea;

        if (newTotalPlanted > farm.agriculturalArea) {
          const available = farm.agriculturalArea - otherCropsArea;
          throw new Error(`Área plantada excede área disponível. Máximo: ${formatArea(available)}`);
        }
      }

      // Validar produtividade se alterada
      if (updates.expectedYield !== undefined && updates.expectedYield < 0) {
        throw new Error('Produtividade esperada deve ser positiva');
      }

      // Validar datas se alteradas
      if (updates.plantingDate || updates.harvestDate) {
        const plantingDate = updates.plantingDate || crop.plantingDate;
        const harvestDate = updates.harvestDate || crop.harvestDate;

        if (plantingDate && harvestDate && harvestDate <= plantingDate) {
          throw new Error('Data de colheita deve ser posterior à data de plantio');
        }
      }

      useCropStore.getState().updateCrop(id, updates);

      // Sincronizar com fazenda se área mudou
      if (updates.plantedArea !== undefined) {
        this.syncFarmCrops(crop.farmId);
      }

      return true;
    } catch (error) {
      useCropStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao atualizar cultura');
      return false;
    }
  }

  static async deleteCrop(id: string): Promise<boolean> {
    try {
      const crop = useCropStore.getState().getCropById(id);
      if (!crop) {
        throw new Error('Cultura não encontrada');
      }

      useCropStore.getState().deleteCrop(id);

      // Sincronizar com fazenda
      this.syncFarmCrops(crop.farmId);

      return true;
    } catch (error) {
      useCropStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao excluir cultura');
      return false;
    }
  }

  // ============= VALIDAÇÕES E UTILITÁRIOS =============

  static validatePlantedArea(plantedArea: number, agriculturalArea: number): boolean {
    return validatePlantedArea(plantedArea, agriculturalArea);
  }

  static getTotalPlantedAreaByFarm(farmId: string): number {
    const crops = useCropStore.getState().getCropsByFarm(farmId);
    return crops.reduce((total, crop) => total + crop.plantedArea, 0);
  }

  static getAvailableAreaForFarm(farmId: string): number {
    const farm = useFarmStore.getState().getFarmById(farmId);
    if (!farm) return 0;

    const plantedArea = this.getTotalPlantedAreaByFarm(farmId);
    return farm.agriculturalArea - plantedArea;
  }

  static syncFarmCrops(farmId: string): void {
    const crops = useCropStore.getState().getCropsByFarm(farmId);
    useFarmStore.getState().updateFarm(farmId, { crops });
  }

  // ============= BUSINESS LOGIC =============

  static getCropWithDetails(id: string) {
    const crop = useCropStore.getState().getCropById(id);
    if (!crop) return null;

    const farm = useFarmStore.getState().getFarmById(crop.farmId);

    // 🔥 CORREÇÃO: Verificar se harvestDate existe e é Date válida
    let daysToHarvest = null;
    if (crop.harvestDate) {
      const harvestDate =
        crop.harvestDate instanceof Date ? crop.harvestDate : new Date(crop.harvestDate);

      if (!isNaN(harvestDate.getTime())) {
        daysToHarvest = Math.ceil(
          (harvestDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
        );
      }
    }

    return {
      ...crop,
      farm,
      formattedArea: formatArea(crop.plantedArea),
      expectedProduction: crop.expectedYield ? crop.plantedArea * crop.expectedYield : null,
      daysToHarvest,
      isReadyToHarvest: daysToHarvest !== null && daysToHarvest <= 0,
      cropStatus: this.getCropStatus(crop),
    };
  }

  static getCropStatus(crop: Crop): 'planted' | 'growing' | 'ready' | 'harvested' {
    const now = new Date();

    if (!crop.plantingDate) return 'planted';

    if (crop.plantingDate > now) return 'planted';

    if (!crop.harvestDate) return 'growing';

    if (crop.harvestDate > now) return 'growing';

    return 'ready';
  }

  static searchCrops(
    term: string,
    filters?: {
      farmId?: string;
      type?: CropType;
      harvestYear?: string;
      status?: 'planted' | 'growing' | 'ready' | 'harvested';
    },
  ) {
    let results = useCropStore.getState().searchCrops(term);

    // Aplicar filtros
    if (filters?.farmId) {
      results = results.filter((c) => c.farmId === filters.farmId);
    }

    if (filters?.type) {
      results = results.filter((c) => c.type === filters.type);
    }

    if (filters?.harvestYear) {
      results = results.filter((c) => c.harvestYear === filters.harvestYear);
    }

    if (filters?.status) {
      results = results.filter((c) => this.getCropStatus(c) === filters.status);
    }

    return results.map((crop) => ({
      ...crop,
      formattedArea: formatArea(crop.plantedArea),
      status: this.getCropStatus(crop),
    }));
  }

  // ============= STATISTICS =============

  static getCropStats() {
    return useCropStore.getState().getCropStats();
  }

  static getCropDistribution() {
    return useCropStore.getState().getCropsByTypeDistribution();
  }

  static getCropsByYearAnalysis() {
    const crops = useCropStore.getState().getActiveCrops();
    const analysis: {
      [year: string]: {
        count: number;
        totalArea: number;
        types: { [type: string]: number };
        averageYield: number;
      };
    } = {};

    crops.forEach((crop) => {
      if (!analysis[crop.harvestYear]) {
        analysis[crop.harvestYear] = {
          count: 0,
          totalArea: 0,
          types: {},
          averageYield: 0,
        };
      }

      const yearData = analysis[crop.harvestYear];
      yearData.count++;
      yearData.totalArea += crop.plantedArea;
      yearData.types[crop.type] = (yearData.types[crop.type] || 0) + 1;
    });

    // Calcular médias
    Object.keys(analysis).forEach((year) => {
      const yearCrops = crops.filter((c) => c.harvestYear === year && c.expectedYield);
      if (yearCrops.length > 0) {
        const totalYield = yearCrops.reduce((sum, c) => sum + (c.expectedYield || 0), 0);
        analysis[year].averageYield = totalYield / yearCrops.length;
      }
    });

    return analysis;
  }

  static getProductivityAnalysis() {
    const crops = useCropStore
      .getState()
      .getActiveCrops()
      .filter((crop) => crop.expectedYield);

    const analysis: {
      [type: string]: {
        count: number;
        totalArea: number;
        totalProduction: number;
        averageYield: number;
        minYield: number;
        maxYield: number;
      };
    } = {};

    crops.forEach((crop) => {
      if (!crop.expectedYield) return;

      if (!analysis[crop.type]) {
        analysis[crop.type] = {
          count: 0,
          totalArea: 0,
          totalProduction: 0,
          averageYield: 0,
          minYield: crop.expectedYield,
          maxYield: crop.expectedYield,
        };
      }

      const typeData = analysis[crop.type];
      typeData.count++;
      typeData.totalArea += crop.plantedArea;
      typeData.totalProduction += crop.plantedArea * crop.expectedYield;
      typeData.minYield = Math.min(typeData.minYield, crop.expectedYield);
      typeData.maxYield = Math.max(typeData.maxYield, crop.expectedYield);
    });

    // Calcular médias
    Object.keys(analysis).forEach((type) => {
      const typeCrops = crops.filter((c) => c.type === type);
      const totalYield = typeCrops.reduce((sum, c) => sum + (c.expectedYield || 0), 0);
      analysis[type].averageYield = totalYield / typeCrops.length;
    });

    return analysis;
  }

  static getHarvestCalendar(year?: string) {
    const crops = useCropStore.getState().getActiveCrops();
    const targetYear = year || new Date().getFullYear().toString();

    const calendar = crops
      .filter((crop) => crop.harvestYear === targetYear && crop.harvestDate)
      .map((crop) => ({
        ...crop,
        month: crop.harvestDate!.getMonth() + 1,
        formattedDate: crop.harvestDate!.toLocaleDateString('pt-BR'),
        status: this.getCropStatus(crop),
      }))
      .sort((a, b) => a.harvestDate!.getTime() - b.harvestDate!.getTime());

    return calendar;
  }
}
