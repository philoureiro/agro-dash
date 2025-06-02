import { Crop } from '@entities';
import { CropType } from '@enums';

export const mockCrops: Crop[] = [
  // Culturas da Fazenda Santa Clara (farm-001)
  {
    id: 'crop-001',
    farmId: 'farm-001',
    type: CropType.SOYBEAN,
    harvestYear: '2024',
    plantedArea: 120,
    expectedYield: 3.2,
    plantingDate: new Date('2023-10-15'),
    harvestDate: new Date('2024-02-20'),
    notes: 'Variedade precoce, boa resistência',
    cropPhoto:
      'https://t4.ftcdn.net/jpg/01/97/51/95/360_F_197519511_13yz5XbqMwLm1sG7kc8X1rDkyLpGflbX.jpg',
    active: true,
  },
  {
    id: 'crop-002',
    farmId: 'farm-001',
    type: CropType.CORN,
    harvestYear: '2024',
    plantedArea: 60,
    expectedYield: 8.5,
    plantingDate: new Date('2023-09-05'),
    harvestDate: new Date('2024-01-15'),
    notes: 'Milho safrinha',
    cropPhoto:
      'https://tecseed.com.br/wp-content/uploads/2021/09/milho-doce-hibrido-sv-9298-sn2.jpg',
    active: true,
  },

  // Culturas do Sítio Boa Vista (farm-002)
  {
    id: 'crop-003',
    farmId: 'farm-002',
    type: CropType.COFFEE,
    harvestYear: '2024',
    plantedArea: 90,
    expectedYield: 2.8,
    plantingDate: new Date('2020-03-10'),
    harvestDate: new Date('2024-06-30'),
    notes: 'Café arábica premium',
    cropPhoto: 'https://i.pinimg.com/736x/95/66/3f/95663f10d4647758d559f2e87e9f3065.jpg',
    active: true,
  },

  // Culturas da Chácara dos Ipês (farm-003)
  {
    id: 'crop-004',
    farmId: 'farm-003',
    type: CropType.BEANS,
    harvestYear: '2024',
    plantedArea: 35,
    expectedYield: 1.8,
    plantingDate: new Date('2023-11-20'),
    harvestDate: new Date('2024-03-10'),
    notes: 'Feijão carioca',
    cropPhoto:
      'https://www.observatorioagro.sc.gov.br/wp-content/uploads/2024/03/scs204Feijao-Predileto-Chapeco-36-scaled.jpg',
    active: true,
  },
  {
    id: 'crop-005',
    farmId: 'farm-003',
    type: CropType.CORN,
    harvestYear: '2025',
    plantedArea: 20,
    expectedYield: 7.2,
    plantingDate: new Date('2024-08-15'),
    harvestDate: new Date('2025-01-20'),
    notes: 'Segunda safra',
    cropPhoto:
      'https://plus.unsplash.com/premium_photo-1664299124175-e2c793325bfa?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWlsaG98ZW58MHx8MHx8fDA%3D',
    active: true,
  },

  // Culturas da Fazenda Cerrado Verde (farm-004)
  {
    id: 'crop-006',
    farmId: 'farm-004',
    type: CropType.SOYBEAN,
    harvestYear: '2024',
    plantedArea: 650,
    expectedYield: 3.8,
    plantingDate: new Date('2023-09-20'),
    harvestDate: new Date('2024-02-15'),
    notes: 'Soja transgênica alta produtividade',
    cropPhoto:
      'https://st4.depositphotos.com/1480128/27809/i/450/depositphotos_278091096-stock-photo-soybean-field-rows.jpg',
    active: true,
  },
  {
    id: 'crop-007',
    farmId: 'farm-004',
    type: CropType.CORN,
    harvestYear: '2024',
    plantedArea: 330,
    expectedYield: 9.2,
    plantingDate: new Date('2024-01-10'),
    harvestDate: new Date('2024-06-25'),
    notes: 'Milho safrinha irrigado',
    cropPhoto: 'https://sna.agr.br/wp-content/uploads/2016/02/milho-capa-708.png',
    active: true,
  },

  // Culturas da Estância Pantanal (farm-005)
  {
    id: 'crop-008',
    farmId: 'farm-005',
    type: CropType.COTTON,
    harvestYear: '2024',
    plantedArea: 400,
    expectedYield: 4.2,
    plantingDate: new Date('2023-12-05'),
    harvestDate: new Date('2024-07-20'),
    notes: 'Algodão de fibra longa',
    cropPhoto: 'https://files.agro20.com.br/uploads/2019/11/%C3%93leo-de-algod%C3%A3o-2.jpg',
    active: true,
  },
  {
    id: 'crop-009',
    farmId: 'farm-005',
    type: CropType.SOYBEAN,
    harvestYear: '2025',
    plantedArea: 200,
    expectedYield: 3.5,
    plantingDate: new Date('2024-10-10'),
    harvestDate: new Date('2025-02-28'),
    notes: 'Rotação de cultura',
    cropPhoto:
      'https://st2.depositphotos.com/30188930/50753/i/450/depositphotos_507534514-stock-photo-soybean-field-ripening-at-spring.jpg',
    active: true,
  },

  // Culturas da Fazenda Horizonte (farm-006)
  {
    id: 'crop-010',
    farmId: 'farm-006',
    type: CropType.SOYBEAN,
    harvestYear: '2024',
    plantedArea: 500,
    expectedYield: 3.9,
    plantingDate: new Date('2023-09-15'),
    harvestDate: new Date('2024-02-10'),
    notes: 'Variedade resistente à seca',
    cropPhoto:
      'https://blog.verde.ag/pt/wp-content/uploads/2023/12/Ciclo-da-soja.-descubra-a-duracao-as-etapas-e-as-principais-fatores-que-o-influenciam.jpg',
    active: true,
  },
  {
    id: 'crop-011',
    farmId: 'farm-006',
    type: CropType.CORN,
    harvestYear: '2024',
    plantedArea: 250,
    expectedYield: 8.8,
    plantingDate: new Date('2024-02-20'),
    harvestDate: new Date('2024-07-15'),
    notes: 'Milho verão',
    cropPhoto:
      'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbdTrLnzt-XW8EMwttWk-ON2f4e0h7iw4oLoEM2l1Yju7NHlEIvIwb9b6VTMQzBIPTgswMW2zny1IzItSTAs_6l5Vfa0HdGSk6m6YRwjJlu9BTIV0-ZPgaEf_ItTvO_3UPicYVRapiq478/s1600/DSC00164.JPG',
    active: true,
  },

  // Culturas do Sítio Três Lagoas (farm-007)
  {
    id: 'crop-012',
    farmId: 'farm-007',
    type: CropType.RICE,
    harvestYear: '2024',
    plantedArea: 200,
    expectedYield: 6.5,
    plantingDate: new Date('2023-11-10'),
    harvestDate: new Date('2024-04-20'),
    notes: 'Arroz irrigado',
    cropPhoto:
      'https://static.nationalgeographicbrasil.com/files/styles/image_3200/public/arroz-com-casca-e-arroz-branco.webp?w=1600&h=1071',
    active: true,
  },
  {
    id: 'crop-013',
    farmId: 'farm-007',
    type: CropType.BEANS,
    harvestYear: '2024',
    plantedArea: 120,
    expectedYield: 2.1,
    plantingDate: new Date('2024-05-15'),
    harvestDate: new Date('2024-09-10'),
    notes: 'Feijão preto',
    cropPhoto: 'https://ecrie70.com.br/sistema/conteudos/imagem/g_66_0_1_06062023100506.jpg',
    active: true,
  },

  // Culturas da Fazenda Dourados (farm-008)
  {
    id: 'crop-014',
    farmId: 'farm-008',
    type: CropType.SUGARCANE,
    harvestYear: '2024',
    plantedArea: 350,
    expectedYield: 85.0,
    plantingDate: new Date('2022-08-20'),
    harvestDate: new Date('2024-08-15'),
    notes: 'Cana de açúcar para etanol',
    cropPhoto:
      'https://img.freepik.com/fotos-premium/plantas-de-cana-de-acucar-crescem-no-campo_9185-337.jpg?semt=ais_hybrid&w=740',
    active: true,
  },
  {
    id: 'crop-015',
    farmId: 'farm-008',
    type: CropType.SOYBEAN,
    harvestYear: '2025',
    plantedArea: 150,
    expectedYield: 3.4,
    plantingDate: new Date('2024-09-25'),
    harvestDate: new Date('2025-02-05'),
    notes: 'Renovação de área',
    cropPhoto:
      'https://img.freepik.com/fotos-premium/soja-fresca-na-palma-da-mao_712131-2346.jpg?semt=ais_items_boosted&w=740',
    active: true,
  },

  // Culturas da Fazenda Esperança (farm-009)
  {
    id: 'crop-016',
    farmId: 'farm-009',
    type: CropType.CORN,
    harvestYear: '2024',
    plantedArea: 150,
    expectedYield: 7.8,
    plantingDate: new Date('2023-08-30'),
    harvestDate: new Date('2024-01-25'),
    notes: 'Milho para silagem',
    cropPhoto: 'https://img.freepik.com/fotos-premium/grao-de-milho-cozido-em-branco_64161-28.jpg',
    active: true,
  },
  {
    id: 'crop-017',
    farmId: 'farm-009',
    type: CropType.WHEAT,
    harvestYear: '2024',
    plantedArea: 70,
    expectedYield: 4.2,
    plantingDate: new Date('2024-03-15'),
    harvestDate: new Date('2024-08-20'),
    notes: 'Trigo de inverno',
    cropPhoto:
      'https://media.istockphoto.com/id/119165809/pt/foto/plano-aproximado-de-orelhas-de-trigo-maduro.jpg?b=1&s=612x612&w=0&k=20&c=GCqxd53D0o1ibYyR0bahNjaGGQDRIj2-gQqSmMEN0sQ=',
    active: true,
  },

  // Culturas da Estância Gaúcha (farm-010)
  {
    id: 'crop-018',
    farmId: 'farm-010',
    type: CropType.SOYBEAN,
    harvestYear: '2024',
    plantedArea: 400,
    expectedYield: 3.6,
    plantingDate: new Date('2023-10-05'),
    harvestDate: new Date('2024-03-15'),
    notes: 'Soja convencional',
    // Repetindo a primeira imagem de soja, pois já usamos as 5 disponíveis
    cropPhoto:
      'https://t4.ftcdn.net/jpg/01/97/51/95/360_F_197519511_13yz5XbqMwLm1sG7kc8X1rDkyLpGflbX.jpg',
    active: true,
  },
  {
    id: 'crop-019',
    farmId: 'farm-010',
    type: CropType.WHEAT,
    harvestYear: '2024',
    plantedArea: 150,
    expectedYield: 4.8,
    plantingDate: new Date('2024-04-20'),
    harvestDate: new Date('2024-10-30'),
    notes: 'Trigo para panificação',
    cropPhoto:
      'https://aditivosingredientes.com/upload_arquivos/202204/202204-2d81baf6c08962b7a6fb25aa7c441390.jpg',
    active: true,
  },

  // Culturas da Fazenda Pampas (farm-011)
  {
    id: 'crop-020',
    farmId: 'farm-011',
    type: CropType.RICE,
    harvestYear: '2024',
    plantedArea: 280,
    expectedYield: 7.2,
    plantingDate: new Date('2023-10-20'),
    harvestDate: new Date('2024-03-25'),
    notes: 'Arroz tipo agulhinha',
    cropPhoto: 'https://eos.com/wp-content/uploads/2023/04/rice-field.jpg.webp',
    active: true,
  },
  {
    id: 'crop-021',
    farmId: 'farm-011',
    type: CropType.CORN,
    harvestYear: '2025',
    plantedArea: 100,
    expectedYield: 8.0,
    plantingDate: new Date('2024-09-10'),
    harvestDate: new Date('2025-02-20'),
    notes: 'Milho para ração',
    // Repetindo a primeira imagem de milho
    cropPhoto:
      'https://tecseed.com.br/wp-content/uploads/2021/09/milho-doce-hibrido-sv-9298-sn2.jpg',
    active: true,
  },

  // Culturas do Sítio Santa Fé (farm-012)
  {
    id: 'crop-022',
    farmId: 'farm-012',
    type: CropType.BEANS,
    harvestYear: '2024',
    plantedArea: 120,
    expectedYield: 2.3,
    plantingDate: new Date('2023-12-10'),
    harvestDate: new Date('2024-04-15'),
    notes: 'Feijão vermelho',
    cropPhoto: 'https://assets.revistacultivar.com.br/d87a1aad-5cd2-4058-ab75-402ef73cb8af.jpg',
    active: true,
  },
  {
    id: 'crop-023',
    farmId: 'farm-012',
    type: CropType.WHEAT,
    harvestYear: '2024',
    plantedArea: 80,
    expectedYield: 4.5,
    plantingDate: new Date('2024-05-08'),
    harvestDate: new Date('2024-11-12'),
    notes: 'Trigo duro',
    cropPhoto: 'https://cdn.pixabay.com/video/2018/07/14/17285-280038627_tiny.jpg',
    active: true,
  },

  // Culturas da Fazenda Três Coroas (farm-013)
  {
    id: 'crop-024',
    farmId: 'farm-013',
    type: CropType.CORN,
    harvestYear: '2024',
    plantedArea: 200,
    expectedYield: 8.3,
    plantingDate: new Date('2023-09-12'),
    harvestDate: new Date('2024-02-08'),
    notes: 'Milho híbrido',
    // Repetindo a segunda imagem de milho
    cropPhoto:
      'https://plus.unsplash.com/premium_photo-1664299124175-e2c793325bfa?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWlsaG98ZW58MHx8MHx8fDA%3D',
    active: true,
  },
  {
    id: 'crop-025',
    farmId: 'farm-013',
    type: CropType.SOYBEAN,
    harvestYear: '2025',
    plantedArea: 90,
    expectedYield: 3.3,
    plantingDate: new Date('2024-10-15'),
    harvestDate: new Date('2025-03-05'),
    notes: 'Rotação com milho',
    // Repetindo a segunda imagem de soja
    cropPhoto:
      'https://st4.depositphotos.com/1480128/27809/i/450/depositphotos_278091096-stock-photo-soybean-field-rows.jpg',
    active: true,
  },

  // Culturas da Fazenda Café do Monte (farm-014)
  {
    id: 'crop-026',
    farmId: 'farm-014',
    type: CropType.COFFEE,
    harvestYear: '2024',
    plantedArea: 140,
    expectedYield: 3.1,
    plantingDate: new Date('2019-05-20'),
    harvestDate: new Date('2024-07-10'),
    notes: 'Café conilon especial',
    cropPhoto: 'https://wallpapers.com/images/hd/coffee-background-t0c3wh99fpnzgto4.jpg',
    active: true,
  },

  // Culturas do Sítio Vale Verde (farm-015)
  {
    id: 'crop-027',
    farmId: 'farm-015',
    type: CropType.OTHER,
    harvestYear: '2024',
    plantedArea: 50,
    expectedYield: 12.0,
    plantingDate: new Date('2024-01-30'),
    harvestDate: new Date('2024-06-15'),
    notes: 'Mamão papaya',
    cropPhoto:
      'https://content.paodeacucar.com/wp-content/uploads/2020/06/alimentos-in-natura-capa.jpg',
    active: true,
  },
  {
    id: 'crop-028',
    farmId: 'farm-015',
    type: CropType.BEANS,
    harvestYear: '2024',
    plantedArea: 20,
    expectedYield: 1.9,
    plantingDate: new Date('2024-02-20'),
    harvestDate: new Date('2024-07-25'),
    notes: 'Feijão fradinho',
    cropPhoto:
      'https://s2-g1.glbimg.com/fy-XrJifAv1Pny2KIrLZLeR4kDY=/0x0:640x426/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_59edd422c0c84a879bd37670ae4f538a/internal_photos/bs/2022/f/y/hRJd26TAACeARS5TPybw/brs-jurua.jpg',
    active: true,
  },
];
