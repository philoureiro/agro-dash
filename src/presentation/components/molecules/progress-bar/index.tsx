// src/components/ui/ProgressBar/ProgressBar.tsx
import React from 'react';

import {
  ProgressBarContainer,
  ProgressContainer,
  ProgressEmptyBar,
  ProgressFillBar,
  ProgressText,
} from './styles';

interface ProgressBarProps {
  progress: number; // Valor de 0 a 100
  isDark: boolean;
  color?: string; // Cor da barra preenchida
  emptyColor?: string; // Cor da barra faltante
  showPercentage?: boolean; // Mostra texto de progresso
  label?: string;
  textColor?: string; // Cor do texto (opcional)
  style?: React.CSSProperties;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isDark,
  color,
  emptyColor,
  showPercentage = true,
  label = 'Progresso',
  textColor,
  style,
}) => {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);
  const missing = 100 - safeProgress;

  return (
    <ProgressContainer $isDark={isDark} style={style}>
      <ProgressBarContainer $isDark={isDark}>
        {/* Barra preenchida */}
        <ProgressFillBar $progress={safeProgress} $isDark={isDark} $color={color} />
        {/* Barra faltante (direita) */}
        <ProgressEmptyBar $progress={missing} $isDark={isDark} $emptyColor={emptyColor} />
      </ProgressBarContainer>

      {showPercentage && (
        <ProgressText $isDark={isDark} $textColor={textColor}>
          <span>{label}</span>
          {showPercentage && <span>{Math.round(safeProgress)}% completo</span>}
        </ProgressText>
      )}
    </ProgressContainer>
  );
};
