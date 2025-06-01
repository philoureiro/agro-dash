import { Farm } from '@entities';
import { FarmSize, States } from '@enums';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
import { formatArea, validateFarmAreas } from '@validations';

export class FarmService {
  // ============= CRUD OPERATIONS =============

  static async createFarm(
    data: Omit<Farm, 'id' | 'createdAt' | 'updatedAt' | 'crops'>,
  ): Promise<Farm | null> {
    try {
      // Validação de áreas
      if (!this.validateFarmAreas(data.totalArea, data.agriculturalArea, data.vegetationArea)) {
        throw new Error('A soma das áreas agricultável e vegetação não pode exceder a área total');
      }

      // Validar se produtor existe
      const producer = useProducerStore.getState().getProducerById(data.producerId);
      if (!producer) {
        throw new Error('Produtor não encontrado');
      }

      // Validar scores (0-100)
      if (!this.validateScores(data.productivity, data.sustainability, data.technology)) {
        throw new Error('Os scores devem estar entre 0 e 100');
      }

      // Criar fazenda
      useFarmStore.getState().addFarm(data);

      // Buscar a fazenda criada
      const farms = useFarmStore.getState().farms;
      const newFarm = farms[farms.length - 1];

      // Atualizar lista de fazendas do produtor
      const currentFarmIds = producer.farmsIds || [];
      useProducerStore.getState().updateProducer(data.producerId, {
        farmsIds: [...currentFarmIds, newFarm.id],
      });

      return newFarm;
    } catch (error) {
      useFarmStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao criar fazenda');
      return null;
    }
  }

  static async updateFarm(id: string, updates: Partial<Farm>): Promise<boolean> {
    try {
      const farm = useFarmStore.getState().getFarmById(id);
      if (!farm) {
        throw new Error('Fazenda não encontrada');
      }

      // Se alterando áreas, validar
      if (updates.totalArea || updates.agriculturalArea || updates.vegetationArea) {
        const totalArea = updates.totalArea ?? farm.totalArea;
        const agriculturalArea = updates.agriculturalArea ?? farm.agriculturalArea;
        const vegetationArea = updates.vegetationArea ?? farm.vegetationArea;

        if (!this.validateFarmAreas(totalArea, agriculturalArea, vegetationArea)) {
          throw new Error(
            'A soma das áreas agricultável e vegetação não pode exceder a área total',
          );
        }

        // Verificar se área agricultável comporta as culturas plantadas
        const totalPlantedArea = this.getTotalPlantedArea(id);
        if (agriculturalArea < totalPlantedArea) {
          throw new Error(
            `Área agricultável não pode ser menor que a área plantada (${formatArea(totalPlantedArea)})`,
          );
        }
      }

      // Validar scores se alterados
      if (
        updates.productivity !== undefined ||
        updates.sustainability !== undefined ||
        updates.technology !== undefined
      ) {
        const productivity = updates.productivity ?? farm.productivity;
        const sustainability = updates.sustainability ?? farm.sustainability;
        const technology = updates.technology ?? farm.technology;

        if (!this.validateScores(productivity, sustainability, technology)) {
          throw new Error('Os scores devem estar entre 0 e 100');
        }
      }

      useFarmStore.getState().updateFarm(id, updates);
      return true;
    } catch (error) {
      useFarmStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao atualizar fazenda');
      return false;
    }
  }

  static async deleteFarm(id: string): Promise<boolean> {
    try {
      const farm = useFarmStore.getState().getFarmById(id);
      if (!farm) {
        throw new Error('Fazenda não encontrada');
      }

      // Verificar se tem culturas associadas
      const crops = useCropStore.getState().getCropsByFarm(id);
      if (crops.length > 0) {
        throw new Error('Não é possível excluir fazenda com culturas plantadas');
      }

      // Remover da lista do produtor
      const producer = useProducerStore.getState().getProducerById(farm.producerId);
      if (producer) {
        const updatedFarmIds = producer.farmsIds.filter((farmId) => farmId !== id);
        useProducerStore.getState().updateProducer(farm.producerId, {
          farmsIds: updatedFarmIds,
        });
      }

      useFarmStore.getState().deleteFarm(id);
      return true;
    } catch (error) {
      useFarmStore
        .getState()
        .setError(error instanceof Error ? error.message : 'Erro ao excluir fazenda');
      return false;
    }
  }

  // ============= VALIDAÇÕES =============

  static validateFarmAreas(
    totalArea: number,
    agriculturalArea: number,
    vegetationArea: number,
  ): boolean {
    return validateFarmAreas(totalArea, agriculturalArea, vegetationArea);
  }

  static validateScores(productivity: number, sustainability: number, technology: number): boolean {
    return [productivity, sustainability, technology].every((score) => score >= 0 && score <= 100);
  }

  static getTotalPlantedArea(farmId: string): number {
    const crops = useCropStore.getState().getCropsByFarm(farmId);
    return crops.reduce((total, crop) => total + crop.plantedArea, 0);
  }

  // ============= BUSINESS LOGIC =============

  static getFarmWithDetails(id: string) {
    const farm = useFarmStore.getState().getFarmById(id);
    if (!farm) return null;

    const producer = useProducerStore.getState().getProducerById(farm.producerId);
    const crops = useCropStore.getState().getCropsByFarm(id);
    const totalPlantedArea = crops.reduce((sum, crop) => sum + crop.plantedArea, 0);
    const availableArea = farm.agriculturalArea - totalPlantedArea;

    return {
      ...farm,
      producer,
      crops,
      totalPlantedArea,
      availableArea,
      utilizationPercentage:
        farm.agriculturalArea > 0 ? (totalPlantedArea / farm.agriculturalArea) * 100 : 0,
      formattedAreas: {
        total: formatArea(farm.totalArea),
        agricultural: formatArea(farm.agriculturalArea),
        vegetation: formatArea(farm.vegetationArea),
        planted: formatArea(totalPlantedArea),
        available: formatArea(availableArea),
      },
    };
  }

  static getFarmsBySize(): { small: Farm[]; medium: Farm[]; large: Farm[] } {
    return useFarmStore.getState().getFarmsBySize();
  }

  static getFarmSize(area: number): FarmSize {
    if (area < 50) return FarmSize.SMALL;
    if (area <= 500) return FarmSize.MEDIUM;
    return FarmSize.LARGE;
  }

  static searchFarms(
    term: string,
    filters?: {
      state?: States;
      producerId?: string;
      minArea?: number;
      maxArea?: number;
      size?: FarmSize;
    },
  ) {
    let results = useFarmStore.getState().searchFarms(term);

    // Aplicar filtros
    if (filters?.state) {
      results = results.filter((f) => f.state === filters.state);
    }

    if (filters?.producerId) {
      results = results.filter((f) => f.producerId === filters.producerId);
    }

    if (filters?.minArea) {
      results = results.filter((f) => f.totalArea >= filters.minArea!);
    }

    if (filters?.maxArea) {
      results = results.filter((f) => f.totalArea <= filters.maxArea!);
    }

    if (filters?.size) {
      results = results.filter((f) => {
        const size = this.getFarmSize(f.totalArea);
        return size === filters.size;
      });
    }

    return results.map((farm) => ({
      ...farm,
      size: this.getFarmSize(farm.totalArea),
      formattedArea: formatArea(farm.totalArea),
    }));
  }

  // ============= STATISTICS =============

  static getFarmStats() {
    return useFarmStore.getState().getFarmStats();
  }

  static getFarmDistributionByState() {
    const farms = useFarmStore.getState().getActiveFarms();
    const distribution: { [state: string]: { count: number; totalArea: number } } = {};

    farms.forEach((farm) => {
      if (!distribution[farm.state]) {
        distribution[farm.state] = { count: 0, totalArea: 0 };
      }
      distribution[farm.state].count++;
      distribution[farm.state].totalArea += farm.totalArea;
    });

    return Object.entries(distribution).map(([state, data]) => ({
      state,
      count: data.count,
      totalArea: data.totalArea,
      averageArea: data.count > 0 ? data.totalArea / data.count : 0,
      percentage: (data.count / farms.length) * 100,
    }));
  }

  static getFarmPerformanceStats() {
    const farms = useFarmStore.getState().getActiveFarms();

    const stats = {
      productivity: { min: 100, max: 0, avg: 0 },
      sustainability: { min: 100, max: 0, avg: 0 },
      technology: { min: 100, max: 0, avg: 0 },
    };

    if (farms.length === 0) return stats;

    let totalProductivity = 0;
    let totalSustainability = 0;
    let totalTechnology = 0;

    farms.forEach((farm) => {
      // Productivity
      stats.productivity.min = Math.min(stats.productivity.min, farm.productivity);
      stats.productivity.max = Math.max(stats.productivity.max, farm.productivity);
      totalProductivity += farm.productivity;

      // Sustainability
      stats.sustainability.min = Math.min(stats.sustainability.min, farm.sustainability);
      stats.sustainability.max = Math.max(stats.sustainability.max, farm.sustainability);
      totalSustainability += farm.sustainability;

      // Technology
      stats.technology.min = Math.min(stats.technology.min, farm.technology);
      stats.technology.max = Math.max(stats.technology.max, farm.technology);
      totalTechnology += farm.technology;
    });

    stats.productivity.avg = totalProductivity / farms.length;
    stats.sustainability.avg = totalSustainability / farms.length;
    stats.technology.avg = totalTechnology / farms.length;

    return stats;
  }

  static getTopPerformingFarms(limit: number = 10) {
    const farms = useFarmStore.getState().getActiveFarms();

    return farms
      .map((farm) => ({
        ...farm,
        overallScore: (farm.productivity + farm.sustainability + farm.technology) / 3,
      }))
      .sort((a, b) => b.overallScore - a.overallScore)
      .slice(0, limit);
  }
}
