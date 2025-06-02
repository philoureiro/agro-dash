import {
  FiBarChart,
  FiDatabase,
  FiDownload,
  FiFile,
  FiHome,
  FiLoader,
  FiSearch,
  FiSettings,
  FiUpload,
  FiUsers,
} from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineCog, HiOutlineSparkles } from 'react-icons/hi';
import { IoLeafOutline } from 'react-icons/io5';
import { TbPlant2 } from 'react-icons/tb';

import { LoadingType } from '.';

// 🎨 CONFIGURAÇÕES PREDEFINIDAS POR TIPO
export const getLoadingConfig = (type: LoadingType) => {
  const configs = {
    default: {
      title: 'Carregando',
      subtitle: 'Aguarde um momento...',
      icon: <FiLoader size={24} />,
      loadingText: 'Processando dados',
    },
    search: {
      title: 'Pesquisando',
      subtitle: 'Buscando os melhores resultados',
      icon: <FiSearch size={24} />,
      loadingText: 'Analisando dados',
    },
    data: {
      title: 'Carregando Dados',
      subtitle: 'Obtendo informações atualizadas',
      icon: <FiDatabase size={24} />,
      loadingText: 'Sincronizando',
    },
    upload: {
      title: 'Enviando Arquivo',
      subtitle: 'Upload em progresso',
      icon: <FiUpload size={24} />,
      loadingText: 'Transferindo',
    },
    download: {
      title: 'Baixando Arquivo',
      subtitle: 'Download em progresso',
      icon: <FiDownload size={24} />,
      loadingText: 'Baixando',
    },
    processing: {
      title: 'Processando',
      subtitle: 'Executando operação',
      icon: <HiOutlineCog size={24} />,
      loadingText: 'Calculando',
    },
    saving: {
      title: 'Salvando',
      subtitle: 'Armazenando informações',
      icon: <FiFile size={24} />,
      loadingText: 'Gravando dados',
    },
    deleting: {
      title: 'Excluindo',
      subtitle: 'Removendo registros',
      icon: <FiLoader size={24} />,
      loadingText: 'Processando exclusão',
    },
    analyzing: {
      title: 'Analisando',
      subtitle: 'Processando informações',
      icon: <HiOutlineChartBar size={24} />,
      loadingText: 'Gerando insights',
    },
    generating: {
      title: 'Gerando Relatório',
      subtitle: 'Compilando dados',
      icon: <FiBarChart size={24} />,
      loadingText: 'Criando documento',
    },
    dashboard: {
      title: 'Carregando Dashboard',
      subtitle: 'Preparando visualizações',
      icon: <HiOutlineSparkles size={24} />,
      loadingText: 'Montando gráficos',
    },
    forms: {
      title: 'Carregando Formulário',
      subtitle: 'Preparando campos',
      icon: <FiSettings size={24} />,
      loadingText: 'Configurando',
    },
    charts: {
      title: 'Gerando Gráficos',
      subtitle: 'Processando estatísticas',
      icon: <FiBarChart size={24} />,
      loadingText: 'Calculando métricas',
    },
    users: {
      title: 'Carregando Usuários',
      subtitle: 'Obtendo perfis',
      icon: <FiUsers size={24} />,
      loadingText: 'Buscando dados',
    },
    farms: {
      title: 'Carregando Fazendas',
      subtitle: 'Obtendo propriedades rurais',
      icon: <FiHome size={24} />,
      loadingText: 'Sincronizando fazendas',
    },
    crops: {
      title: 'Carregando Culturas',
      subtitle: 'Obtendo informações de plantio',
      icon: <TbPlant2 size={24} />,
      loadingText: 'Processando safras',
    },
    producers: {
      title: 'Carregando Produtores',
      subtitle: 'Obtendo dados dos agricultores',
      icon: <IoLeafOutline size={24} />,
      loadingText: 'Buscando produtores',
    },
  };

  return configs[type] || configs.default;
};
