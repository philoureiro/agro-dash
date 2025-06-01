// ============= ENUMS =============
enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
}

enum CropType {
  SOYBEAN = 'Soybean', // Soja
  CORN = 'Corn', // Milho
  COFFEE = 'Coffee', // Café
  COTTON = 'Cotton', // Algodão
  SUGARCANE = 'Sugarcane', // Cana de açúcar
  WHEAT = 'Wheat', // Trigo
  RICE = 'Rice', // Arroz
  BEANS = 'Beans', // Feijão
  OTHER = 'Other', // Outros
}

enum States {
  AC = 'AC',
  AL = 'AL',
  AP = 'AP',
  AM = 'AM',
  BA = 'BA',
  CE = 'CE',
  DF = 'DF',
  ES = 'ES',
  GO = 'GO',
  MA = 'MA',
  MT = 'MT',
  MS = 'MS',
  MG = 'MG',
  PA = 'PA',
  PB = 'PB',
  PR = 'PR',
  PE = 'PE',
  PI = 'PI',
  RJ = 'RJ',
  RN = 'RN',
  RS = 'RS',
  RO = 'RO',
  RR = 'RR',
  SC = 'SC',
  SP = 'SP',
  SE = 'SE',
  TO = 'TO',
}

enum FarmSize {
  SMALL = 'Small', // Pequena: < 50 hectares
  MEDIUM = 'Medium', // Média: 50-500 hectares
  LARGE = 'Large', // Grande: > 500 hectares
}

// ============= ENTIDADES PRINCIPAIS =============

interface Producer {
  id: string; // UUID único do produtor
  document: string; // CPF ou CNPJ sem formatação
  documentType: DocumentType; // Tipo do documento para validação
  name: string; // Nome completo ou razão social
  email?: string; // Email para contato (opcional)
  phone?: string; // Telefone para contato (opcional)
  createdAt: Date; // Data de cadastro no sistema
  updatedAt: Date; // Data da última atualização
  active: boolean; // Status ativo/inativo (soft delete)
  farmsIds: string[]; // Array com IDs das fazendas do produtor
}

interface Farm {
  id: string; // UUID único da fazenda
  producerId: string; // ID do produtor proprietário
  name: string; // Nome da propriedade rural
  city: string; // Cidade onde está localizada
  state: States; // Estado (enum para padronização)
  zipCode?: string; // CEP da propriedade (opcional)
  totalArea: number; // Área total em hectares
  agriculturalArea: number; // Área agricultável em hectares
  vegetationArea: number; // Área de vegetação em hectares
  productivity: number; // Score de produtividade (0-100)
  sustainability: number; // Score de sustentabilidade (0-100)
  technology: number; // Score de tecnologia (0-100)
  createdAt: Date; // Data de cadastro da fazenda
  updatedAt: Date; // Data da última atualização
  active: boolean; // Status ativo/inativo
  crops: Crop[]; // Array de culturas plantadas
}

interface Crop {
  id: string; // UUID único da cultura
  farmId: string; // ID da fazenda onde está plantada
  type: CropType; // Tipo da cultura (enum)
  harvestYear: string; // Ano da safra ("2024", "2025")
  plantedArea: number; // Área plantada em hectares
  expectedYield?: number; // Produtividade esperada (ton/hectare)
  plantingDate?: Date; // Data do plantio (opcional)
  harvestDate?: Date; // Data da colheita (opcional)
  notes?: string; // Observações adicionais
  active: boolean; // Status ativo/inativo
}

// ============= MÉTRICAS DO DASHBOARD =============

interface DashboardMetrics {
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

// ============= DADOS DOS GRÁFICOS =============

interface ChartData {
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

// ============= FILTROS PARA DASHBOARD =============

interface DashboardFilters {
  states: States[]; // Filtro por estados
  crops: CropType[]; // Filtro por tipos de cultura
  harvestYears: string[]; // Filtro por anos de safra
  farmSizes: FarmSize[]; // Filtro por tamanho de fazenda
  producerTypes: DocumentType[]; // Filtro por tipo de produtor
  areaRange: {
    // Filtro por área
    min: number;
    max: number;
  };
  performanceRange: {
    // Filtro por performance
    productivity: { min: number; max: number };
    sustainability: { min: number; max: number };
    technology: { min: number; max: number };
  };
}

// ============= BUSCA E PAGINAÇÃO =============

interface SearchParams {
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

// ============= ESTADO GLOBAL DA APLICAÇÃO =============

interface AppState {
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

// ============= DADOS PARA RELATÓRIO PDF =============

interface ReportData {
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

// typescript// ============= COMO VAI FUNCIONAR =============

// 1. 📦 MOCKS → Dados iniciais
// 2. 🗄️ STORES → Estado global zustand
// 3. ⚙️ SERVICES → Regras de negócio
// 4. 🖥️ COMPONENTS → Consomem DIRECT do store + services

// // Fluxo direto:
// COMPONENTS → useAppStore() + Services → STORE → localStorage
