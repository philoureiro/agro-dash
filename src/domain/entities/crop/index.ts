import { CropType } from '@enums';

export interface Crop {
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
