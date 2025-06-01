import React from 'react';
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

import {
  LoadingBackground,
  LoadingDots,
  LoadingIcon,
  LoadingOverlayContainer,
  LoadingProgress,
  LoadingProgressBar,
  LoadingProgressFill,
  LoadingSpinner,
  LoadingStat,
  LoadingStats,
  LoadingSubtitle,
  LoadingText,
  LoadingTitle,
} from './styles';

// 🎯 TIPOS DE LOADING PREDEFINIDOS
export type LoadingType =
  | 'default'
  | 'search'
  | 'data'
  | 'upload'
  | 'download'
  | 'processing'
  | 'saving'
  | 'deleting'
  | 'analyzing'
  | 'generating'
  | 'dashboard'
  | 'forms'
  | 'charts'
  | 'users'
  | 'farms'
  | 'crops'
  | 'producers';

// 🎨 VARIANTES DE ANIMAÇÃO
export type AnimationVariant = 'rings' | 'dots' | 'pulse' | 'wave' | 'bounce' | 'fade';

// 📊 INTERFACE PARA ESTATÍSTICAS DE LOADING
interface LoadingStat {
  label: string;
  value: string | number;
}

// 🔧 PROPS DO COMPONENTE
interface LoadingOverlayProps {
  /** Controla se o overlay está visível */
  isVisible: boolean;

  /** Tema escuro ou claro */
  isDark: boolean;

  /** Tipo de loading predefinido */
  type?: LoadingType;

  /** Variante da animação */
  variant?: AnimationVariant;

  /** Título principal */
  title?: string;

  /** Subtítulo/descrição */
  subtitle?: string;

  /** Texto do loading */
  loadingText?: string;

  /** Ícone personalizado */
  icon?: React.ReactNode;

  /** Mostra barra de progresso */
  showProgress?: boolean;

  /** Valor do progresso (0-100) */
  progress?: number;

  /** Estatísticas para mostrar */
  stats?: LoadingStat[];

  /** Callback quando o loading é cancelado */
  onCancel?: () => void;

  /** Permite cancelar o loading */
  cancelable?: boolean;

  /** Duração estimada em ms */
  estimatedDuration?: number;

  /** Z-index customizado */
  zIndex?: number;

  /** Cor personalizada para o spinner */
  spinnerColor?: string;

  /** Tamanho do spinner (small, medium, large) */
  spinnerSize?: 'small' | 'medium' | 'large';

  /** Backdrop blur intensity */
  blurIntensity?: 'light' | 'medium' | 'heavy';
}

// 🎨 CONFIGURAÇÕES PREDEFINIDAS POR TIPO
const getLoadingConfig = (type: LoadingType) => {
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

// 🎯 COMPONENTE PRINCIPAL
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  isDark,
  type = 'default',
  variant = 'rings',
  title,
  subtitle,
  loadingText,
  icon,
  showProgress = false,
  progress = 0,
  stats = [],
  onCancel,
  cancelable = false,
  estimatedDuration,
  zIndex = 9999,
  spinnerColor,
  spinnerSize = 'medium',
  blurIntensity = 'medium',
}) => {
  // 🎨 Configuração baseada no tipo
  const config = getLoadingConfig(type);

  // 📊 Estados internos para animações
  const [currentProgress, setCurrentProgress] = React.useState(0);
  const [timeElapsed, setTimeElapsed] = React.useState(0);

  // ⏱️ Timer para progresso simulado
  React.useEffect(() => {
    if (!isVisible) {
      setCurrentProgress(0);
      setTimeElapsed(0);
      return;
    }

    const interval = setInterval(() => {
      setTimeElapsed((prev) => prev + 100);

      if (showProgress && progress === 0) {
        // Progresso simulado se não fornecido
        setCurrentProgress((prev) => {
          const increment = Math.random() * 2 + 0.5;
          return Math.min(prev + increment, 95);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isVisible, showProgress, progress]);

  // ⏰ Tempo estimado restante
  const getEstimatedTime = () => {
    if (!estimatedDuration) return null;

    const remaining = Math.max(0, estimatedDuration - timeElapsed);
    const seconds = Math.ceil(remaining / 1000);

    if (seconds < 60) return `${seconds}s restantes`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s restantes`;
  };

  if (!isVisible) return null;

  return (
    <LoadingOverlayContainer $isDark={isDark} $zIndex={zIndex} $blurIntensity={blurIntensity}>
      <LoadingBackground $isDark={isDark} />

      {/* 🎨 ÍCONE PRINCIPAL */}
      <LoadingIcon $isDark={isDark} $spinnerColor={spinnerColor}>
        {icon || config.icon}
      </LoadingIcon>

      {/* 🌟 SPINNER ANIMADO */}
      <LoadingSpinner
        $isDark={isDark}
        $variant={variant}
        $size={spinnerSize}
        $spinnerColor={spinnerColor}
      >
        {variant === 'rings' && (
          <>
            <div className="spinner-ring ring-1"></div>
            <div className="spinner-ring ring-2"></div>
            <div className="spinner-ring ring-3"></div>
          </>
        )}

        {variant === 'dots' && (
          <div className="spinner-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}

        {variant === 'pulse' && (
          <div className="spinner-pulse">
            <div className="pulse-ring"></div>
            <div className="pulse-ring"></div>
          </div>
        )}

        {variant === 'wave' && (
          <div className="spinner-wave">
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
            <div className="wave-bar"></div>
          </div>
        )}

        {variant === 'bounce' && (
          <div className="spinner-bounce">
            <div className="bounce-ball"></div>
            <div className="bounce-ball"></div>
            <div className="bounce-ball"></div>
          </div>
        )}

        {variant === 'fade' && (
          <div className="spinner-fade">
            <div className="fade-rect"></div>
            <div className="fade-rect"></div>
            <div className="fade-rect"></div>
            <div className="fade-rect"></div>
          </div>
        )}
      </LoadingSpinner>

      {/* 📝 TÍTULO E SUBTÍTULO */}
      <LoadingTitle $isDark={isDark}>{title || config.title}</LoadingTitle>

      {(subtitle || config.subtitle) && (
        <LoadingSubtitle $isDark={isDark}>{subtitle || config.subtitle}</LoadingSubtitle>
      )}

      {/* 📊 BARRA DE PROGRESSO */}
      {showProgress && (
        <LoadingProgress $isDark={isDark}>
          <LoadingProgressBar $isDark={isDark}>
            <LoadingProgressFill
              $progress={progress > 0 ? progress : currentProgress}
              $isDark={isDark}
              $spinnerColor={spinnerColor}
            />
          </LoadingProgressBar>
          <div
            style={{
              fontSize: '0.8rem',
              opacity: 0.8,
              marginTop: '0.5rem',
              textAlign: 'center',
            }}
          >
            {progress > 0 ? `${Math.round(progress)}%` : `${Math.round(currentProgress)}%`}
            {estimatedDuration && <span style={{ marginLeft: '1rem' }}>{getEstimatedTime()}</span>}
          </div>
        </LoadingProgress>
      )}

      {/* 📈 ESTATÍSTICAS */}
      {stats.length > 0 && (
        <LoadingStats $isDark={isDark}>
          {stats.map((stat, index) => (
            <LoadingStat key={index} $isDark={isDark}>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </LoadingStat>
          ))}
        </LoadingStats>
      )}

      {/* 💬 TEXTO DE LOADING */}
      <LoadingText $isDark={isDark}>
        {loadingText || config.loadingText}
        <LoadingDots>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </LoadingDots>
      </LoadingText>

      {/* ❌ BOTÃO DE CANCELAR */}
      {cancelable && onCancel && (
        <button
          onClick={onCancel}
          style={{
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            background: 'transparent',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
            borderRadius: '25px',
            color: isDark ? '#fff' : '#2c3e50',
            cursor: 'pointer',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Cancelar
        </button>
      )}
    </LoadingOverlayContainer>
  );
};
