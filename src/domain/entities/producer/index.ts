import { DocumentType } from '@enums';

export interface Producer {
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
