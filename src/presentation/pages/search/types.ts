import { Crop, Farm, Producer } from '@entities';

// 🎯 TIPOS DE PESQUISA
export type SearchType = 'all' | 'producers' | 'farms' | 'crops';

// 📊 INTERFACE PARA ITEM UNIFICADO
export interface UnifiedItem {
  id: string;
  type: 'producer' | 'farm' | 'crop';
  displayName: string;
  displayType: string;
  displayLocation: string;
  displaySize: string;
  image: string;
  stats: Record<string, number | string>;
  originalData: Producer | Farm | Crop;
}
