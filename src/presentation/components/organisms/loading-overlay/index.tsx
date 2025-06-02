import React from 'react';

import { Spinner } from './components/CustomSpinner';
import {
  CancelButton,
  LoadingBackground,
  LoadingDots,
  LoadingIcon,
  LoadingOverlayContainer,
  LoadingProgress,
  LoadingProgressBar,
  LoadingProgressFill,
  LoadingStat,
  LoadingStats,
  LoadingSubtitle,
  LoadingText,
  LoadingTitle,
} from './styles';
import { getLoadingConfig } from './utils';

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
  isVisible: boolean;
  isDark: boolean;
  type?: LoadingType;
  variant?: AnimationVariant;
  title?: string;
  subtitle?: string;
  loadingText?: string;
  icon?: React.ReactNode;
  showProgress?: boolean;
  progress?: number;
  stats?: LoadingStat[];
  onCancel?: () => void;
  cancelable?: boolean;
  estimatedDuration?: number;
  zIndex?: number;
  spinnerColor?: string;
  spinnerSize?: 'small' | 'medium' | 'large';
  blurIntensity?: 'light' | 'medium' | 'heavy';
}

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
      <Spinner
        isDark={isDark}
        variant={variant}
        spinnerSize={spinnerSize}
        spinnerColor={spinnerColor}
      />

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
        <CancelButton
          $isDark={isDark}
          onClick={onCancel}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          Cancelar
        </CancelButton>
      )}
    </LoadingOverlayContainer>
  );
};
