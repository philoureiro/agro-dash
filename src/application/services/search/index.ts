import { Crop, DashboardFilters, Farm, Producer, SearchParams } from '@entities';
import { CropType, FarmSize } from '@enums';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
import { formatDocument } from '@validations';

export class SearchService {
  // ============= BUSCA GLOBAL =============

  static globalSearch(term: string): {
    producers: Producer[];
    farms: Farm[];
    crops: Crop[];
    total: number;
  } {
    const producers = useProducerStore.getState().searchProducers(term);
    const farms = useFarmStore.getState().searchFarms(term);
    const crops = useCropStore.getState().searchCrops(term);

    return {
      producers,
      farms,
      crops,
      total: producers.length + farms.length + crops.length,
    };
  }

  // ============= BUSCA AVANÇADA COM FILTROS =============

  static advancedSearch(params: SearchParams) {
    let producers = useProducerStore.getState().getActiveProducers();
    let farms = useFarmStore.getState().getActiveFarms();
    const crops = useCropStore.getState().getActiveCrops();

    // Aplicar termo de busca
    if (params.searchTerm) {
      const term = params.searchTerm.toLowerCase();

      if (params.searchField === 'all' || params.searchField === 'name') {
        producers = producers.filter((p) => p.name.toLowerCase().includes(term));
      }

      if (params.searchField === 'all' || params.searchField === 'document') {
        producers = producers.filter(
          (p) =>
            p.document.includes(term) || formatDocument(p.document, p.documentType).includes(term),
        );
      }

      if (params.searchField === 'all' || params.searchField === 'farm') {
        farms = farms.filter((f) => f.name.toLowerCase().includes(term));
      }

      if (params.searchField === 'all' || params.searchField === 'city') {
        farms = farms.filter((f) => f.city.toLowerCase().includes(term));
      }
    }

    // Aplicar filtros
    const filteredResults = this.applyFilters({ producers, farms, crops }, params.filters);

    // Aplicar ordenação
    const sortedResults = this.applySorting(filteredResults, params.sorting);

    // Aplicar paginação
    const paginatedResults = this.applyPagination(sortedResults, params.pagination);

    return {
      ...paginatedResults,
      totalResults:
        sortedResults.producers.length + sortedResults.farms.length + sortedResults.crops.length,
    };
  }

  // ============= APLICAR FILTROS =============

  static applyFilters(
    data: { producers: Producer[]; farms: Farm[]; crops: Crop[] },
    filters: DashboardFilters,
  ) {
    let { producers, farms, crops } = data;

    // Filtro por Estados
    if (filters.states.length > 0) {
      farms = farms.filter((f) => filters.states.includes(f.state));
      const farmIds = farms.map((f) => f.id);
      crops = crops.filter((c) => farmIds.includes(c.farmId));
      const producerIds = farms.map((f) => f.producerId);
      producers = producers.filter((p) => producerIds.includes(p.id));
    }

    // Filtro por Tipos de Cultura
    if (filters.crops.length > 0) {
      crops = crops.filter((c) => filters.crops.includes(c.type));
      const farmIds = [...new Set(crops.map((c) => c.farmId))];
      farms = farms.filter((f) => farmIds.includes(f.id));
      const producerIds = farms.map((f) => f.producerId);
      producers = producers.filter((p) => producerIds.includes(p.id));
    }

    // Filtro por Anos de Safra
    if (filters.harvestYears.length > 0) {
      crops = crops.filter((c) => filters.harvestYears.includes(c.harvestYear));
    }

    // Filtro por Tamanho de Fazenda
    if (filters.farmSizes.length > 0) {
      farms = farms.filter((f) => {
        const size = this.getFarmSize(f.totalArea);
        return filters.farmSizes.includes(size);
      });
    }

    // Filtro por Tipo de Produtor
    if (filters.producerTypes.length > 0) {
      producers = producers.filter((p) => filters.producerTypes.includes(p.documentType));
    }

    // Filtro por Área
    if (filters.areaRange.min > 0 || filters.areaRange.max > 0) {
      farms = farms.filter((f) => {
        const minCheck = filters.areaRange.min > 0 ? f.totalArea >= filters.areaRange.min : true;
        const maxCheck = filters.areaRange.max > 0 ? f.totalArea <= filters.areaRange.max : true;
        return minCheck && maxCheck;
      });
    }

    // Filtro por Performance
    if (this.hasPerformanceFilters(filters.performanceRange)) {
      farms = farms.filter((f) => {
        const prodCheck = this.checkRange(f.productivity, filters.performanceRange.productivity);
        const sustCheck = this.checkRange(
          f.sustainability,
          filters.performanceRange.sustainability,
        );
        const techCheck = this.checkRange(f.technology, filters.performanceRange.technology);
        return prodCheck && sustCheck && techCheck;
      });
    }

    return { producers, farms, crops };
  }

  // ============= APLICAR ORDENAÇÃO =============

  static applySorting(
    data: { producers: Producer[]; farms: Farm[]; crops: Crop[] },
    sorting: { field: string; direction: 'asc' | 'desc' },
  ) {
    const { producers, farms, crops } = data;
    const direction = sorting.direction === 'asc' ? 1 : -1;

    // Ordenar produtores
    const sortedProducers = [...producers].sort((a, b) => {
      switch (sorting.field) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'document':
          return a.document.localeCompare(b.document) * direction;
        case 'createdAt':
          return (a.createdAt.getTime() - b.createdAt.getTime()) * direction;
        default:
          return 0;
      }
    });

    // Ordenar fazendas
    const sortedFarms = [...farms].sort((a, b) => {
      switch (sorting.field) {
        case 'name':
          return a.name.localeCompare(b.name) * direction;
        case 'area':
          return (a.totalArea - b.totalArea) * direction;
        case 'productivity':
          return (a.productivity - b.productivity) * direction;
        case 'city':
          return a.city.localeCompare(b.city) * direction;
        case 'state':
          return a.state.localeCompare(b.state) * direction;
        default:
          return 0;
      }
    });

    // Ordenar culturas
    const sortedCrops = [...crops].sort((a, b) => {
      switch (sorting.field) {
        case 'type':
          return a.type.localeCompare(b.type) * direction;
        case 'area':
          return (a.plantedArea - b.plantedArea) * direction;
        case 'year':
          return a.harvestYear.localeCompare(b.harvestYear) * direction;
        default:
          return 0;
      }
    });

    return {
      producers: sortedProducers,
      farms: sortedFarms,
      crops: sortedCrops,
    };
  }

  // ============= APLICAR PAGINAÇÃO =============

  static applyPagination(
    data: { producers: Producer[]; farms: Farm[]; crops: Crop[] },
    pagination: { page: number; itemsPerPage: number; totalItems: number; totalPages: number },
  ) {
    const { page, itemsPerPage } = pagination;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Combinar todos os resultados para paginação global
    const allResults = [
      ...data.producers.map((p) => ({ type: 'producer' as const, data: p })),
      ...data.farms.map((f) => ({ type: 'farm' as const, data: f })),
      ...data.crops.map((c) => ({ type: 'crop' as const, data: c })),
    ];

    const paginatedResults = allResults.slice(startIndex, endIndex);
    const totalPages = Math.ceil(allResults.length / itemsPerPage);

    return {
      results: paginatedResults,
      pagination: {
        page,
        itemsPerPage,
        totalItems: allResults.length,
        totalPages,
      },
    };
  }

  // ============= FILTROS RÁPIDOS =============

  static getTopProducers(limit: number = 10) {
    const producers = useProducerStore.getState().getActiveProducers();
    const farms = useFarmStore.getState().getActiveFarms();

    return producers
      .map((producer) => {
        const producerFarms = farms.filter((f) => f.producerId === producer.id);
        const totalArea = producerFarms.reduce((sum, f) => sum + f.totalArea, 0);
        return {
          ...producer,
          farmsCount: producerFarms.length,
          totalArea,
        };
      })
      .sort((a, b) => b.totalArea - a.totalArea)
      .slice(0, limit);
  }

  static getLargestFarms(limit: number = 10) {
    return useFarmStore
      .getState()
      .getActiveFarms()
      .sort((a, b) => b.totalArea - a.totalArea)
      .slice(0, limit);
  }

  static getMostProductiveFarms(limit: number = 10) {
    return useFarmStore
      .getState()
      .getActiveFarms()
      .sort((a, b) => b.productivity - a.productivity)
      .slice(0, limit);
  }

  static getRecentlyAdded(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const producers = useProducerStore
      .getState()
      .getActiveProducers()
      .filter((p) => p.createdAt >= cutoffDate);

    const farms = useFarmStore
      .getState()
      .getActiveFarms()
      .filter((f) => f.createdAt >= cutoffDate);

    return { producers, farms };
  }

  // ============= SUGESTÕES DE BUSCA =============

  static getSearchSuggestions(term: string): string[] {
    const suggestions: Set<string> = new Set();
    const lowerTerm = term.toLowerCase();

    // Sugestões de produtores
    const producers = useProducerStore.getState().getActiveProducers();
    producers.forEach((p) => {
      if (p.name.toLowerCase().includes(lowerTerm)) {
        suggestions.add(p.name);
      }
    });

    // Sugestões de fazendas
    const farms = useFarmStore.getState().getActiveFarms();
    farms.forEach((f) => {
      if (f.name.toLowerCase().includes(lowerTerm)) {
        suggestions.add(f.name);
      }
      if (f.city.toLowerCase().includes(lowerTerm)) {
        suggestions.add(f.city);
      }
    });

    // Sugestões de culturas
    Object.values(CropType).forEach((cropType) => {
      if (cropType.toLowerCase().includes(lowerTerm)) {
        suggestions.add(cropType);
      }
    });

    return Array.from(suggestions).slice(0, 10);
  }

  // ============= UTILITIES =============

  private static getFarmSize(area: number): FarmSize {
    if (area < 50) return FarmSize.SMALL;
    if (area <= 500) return FarmSize.MEDIUM;
    return FarmSize.LARGE;
  }

  private static hasPerformanceFilters(range: DashboardFilters['performanceRange']): boolean {
    return (
      range.productivity.min > 0 ||
      range.productivity.max < 100 ||
      range.sustainability.min > 0 ||
      range.sustainability.max < 100 ||
      range.technology.min > 0 ||
      range.technology.max < 100
    );
  }

  private static checkRange(value: number, range: { min: number; max: number }): boolean {
    const minCheck = range.min > 0 ? value >= range.min : true;
    const maxCheck = range.max < 100 ? value <= range.max : true;
    return minCheck && maxCheck;
  }
}
