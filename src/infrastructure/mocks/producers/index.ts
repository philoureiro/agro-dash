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
      'https://media.istockphoto.com/id/1451087401/pt/foto/happy-male-farmer-using-mobile-phone-in-field.jpg?s=612x612&w=0&k=20&c=vnxCzFftOSTjEkFrpSIqi1auQZGLOZGH6AkOc2O6H1c=',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2025-01-15'),
    active: true,
    farmsIds: ['farm-001', 'farm-002', 'farm-003'],
  },
  {
    id: 'prod-002',
    document: '98765432000123',
    documentType: DocumentType.CNPJ,
    name: 'Agropecuária Mato Verde Ltda',
    email: 'contato@matoverde.com.br',
    phone: '(65) 3344-5566',
    profilePhoto:
      'https://media.istockphoto.com/id/1412751704/pt/foto/female-farmer-is-holding-a-digital-tablet-in-a-farm-field-smart-farming.jpg?s=612x612&w=0&k=20&c=VStz7Z5VHuarwiAii2Pz0ZdkALcikNbtEuIcGwFN1D0=',
    createdAt: new Date('2023-02-20'),
    updatedAt: new Date('2025-02-20'),
    active: true,
    farmsIds: ['farm-004', 'farm-005', 'farm-006', 'farm-007', 'farm-008'],
  },
  {
    id: 'prod-003',
    document: '11122233344',
    documentType: DocumentType.CPF,
    name: 'Maria Oliveira Costa',
    email: 'maria.costa@fazenda.com',
    phone: '(62) 99887-6655',
    profilePhoto: 'https://cdn.pixabay.com/photo/2020/12/15/13/44/portrait-5833683_640.jpg',
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2025-03-10'),
    active: true,
    farmsIds: ['farm-009'],
  },
  {
    id: 'prod-004',
    document: '55544433000187',
    documentType: DocumentType.CNPJ,
    name: 'Fazendas Reunidas do Sul S.A.',
    email: 'admin@fazendasul.com.br',
    phone: '(51) 3456-7890',
    profilePhoto:
      'https://st2.depositphotos.com/2454853/7822/i/450/depositphotos_78220290-stock-photo-woman-agronomist-in-wheat-field.jpg',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2025-04-05'),
    active: true,
    farmsIds: ['farm-010', 'farm-011', 'farm-012', 'farm-013'],
  },
  {
    id: 'prod-005',
    document: '99988877766',
    documentType: DocumentType.CPF,
    name: 'Carlos Eduardo Ferreira',
    email: 'carlos.ferreira@gmail.com',
    phone: '(27) 98765-1234',
    profilePhoto:
      'https://img.freepik.com/fotos-premium/agricultor-maduro-gesticulando-para-cima-em-um-campo-de-milho_251859-3720.jpg',
    createdAt: new Date('2023-05-12'),
    updatedAt: new Date('2025-05-12'),
    active: true,
    farmsIds: ['farm-014', 'farm-015'],
  },
];
