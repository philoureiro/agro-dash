import { ChartData } from '../chart-data';
import { Crop } from '../crop';
import { DashboardFilters, DashboardMetrics } from '../dashboards';
import { Farm } from '../farm';
import { Producer } from '../producer';
import { SearchParams } from '../search-params';

export interface AppState {
  // Dados Principais
  producers: Producer[]; // Array de todos os produtores
  farms: Farm[]; // Array de todas as fazendas
  crops: Crop[]; // Array de todas as culturas

  // Estado da Interface
  loading: boolean; // Indicador de carregamento
  error: string | null; // Mensagem de erro atual

  // Dashboard
  dashboardMetrics: DashboardMetrics; // Métricas calculadas
  chartData: ChartData; // Dados para os gráficos
  activeFilters: DashboardFilters; // Filtros ativos no dashboard

  // Navegação e Busca
  searchParams: SearchParams; // Parâmetros de busca/filtro
  selectedProducerId: string | null; // Produtor selecionado
  selectedFarmId: string | null; // Fazenda selecionada

  // Formulários
  editMode: boolean; // Modo de edição ativo
  formData: Partial<Producer | Farm | Crop>; // Dados do formulário

  // Configurações
  settings: {
    theme: 'light' | 'dark'; // Tema da aplicação
    language: 'pt-BR'; // Idioma
    currency: 'BRL'; // Moeda
  };
}
