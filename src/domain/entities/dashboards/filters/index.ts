import { CropType, DocumentType, FarmSize, States } from '@enums';

export interface DashboardFilters {
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
