import { DashboardFilters } from '../dashboards';

export interface SearchParams {
  searchTerm: string; // Termo de busca
  searchField: 'name' | 'document' | 'farm' | 'city' | 'all'; // Campo de busca
  filters: DashboardFilters; // Filtros aplicados
  sorting: {
    // Ordenação
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination: {
    // Controle de paginação
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}
