import { Crop } from '@entities';
import { States } from '@enums';

export interface Farm {
  id: string; // UUID único da fazenda
  producerId: string; // ID do produtor proprietário
  name: string; // Nome da propriedade rural
  city: string; // Cidade onde está localizada
  state: States; // Estado (enum para padronização)
  zipCode?: string; // CEP da propriedade (opcional)
  farmPhoto?: string; // 🔥 URL da foto da fazenda (opcional)
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
