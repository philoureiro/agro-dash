import { Producer } from '@entities';
import { DocumentType } from '@enums';

export const mockProducers: Producer[] = [
  {
    id: 'prod-001',
    document: '12345678901',
    documentType: DocumentType.CPF,
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 98765-4321',
    profilePhoto:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2024-01-15'),
    active: true,
    farmsIds: ['farm-001', 'farm-002', 'farm-003'], // 3 fazendas
  },
  {
    id: 'prod-002',
    document: '98765432000123',
    documentType: DocumentType.CNPJ,
    name: 'Agropecuária Mato Verde Ltda',
    email: 'contato@matoverde.com.br',
    phone: '(65) 3344-5566',
    profilePhoto:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2024-02-20'),
    active: true,
    farmsIds: ['farm-004', 'farm-005', 'farm-006', 'farm-007', 'farm-008'], // 5 fazendas
  },
  {
    id: 'prod-003',
    document: '11122233344',
    documentType: DocumentType.CPF,
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@fazenda.com',
    phone: '(62) 99887-6655',
    profilePhoto:
      'https://images.unsplash.com/photo-1494790108755-2616b612b913?w=300&h=300&fit=crop&crop=face',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-03-10'),
    active: true,
    farmsIds: ['farm-009'], // 1 fazenda
  },
  {
    id: 'prod-004',
    document: '55544433000187',
    documentType: DocumentType.CNPJ,
    name: 'Fazendas Reunidas do Sul S.A.',
    email: 'admin@fazendasul.com.br',
    phone: '(51) 3456-7890',
    profilePhoto:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2024-04-05'),
    active: true,
    farmsIds: ['farm-010', 'farm-011', 'farm-012', 'farm-013'], // 4 fazendas
  },
  {
    id: 'prod-005',
    document: '99988877766',
    documentType: DocumentType.CPF,
    name: 'Carlos Eduardo Ferreira',
    email: 'carlos.ferreira@gmail.com',
    phone: '(27) 98765-1234',
    profilePhoto:
      'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=300&h=300&fit=crop&crop=face',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2024-05-12'),
    active: true,
    farmsIds: ['farm-014', 'farm-015'], // 2 fazendas
  },
];
