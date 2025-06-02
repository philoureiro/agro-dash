// src/components/ui/ProgressBar/ProgressBar.tsx
import React from 'react';

import { ProgressBarContainer, ProgressContainer, ProgressFillBar, ProgressText } from './styles';

interface ProgressBarProps {
  progress: number;
  isDark: boolean;
  color?: string;
  showPercentage?: boolean;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  isDark,
  color,
  showPercentage = true,
  label = 'Progresso',
}) => {
  const safeProgress = Math.min(Math.max(progress || 0, 0), 100);

  return (
    <ProgressContainer $isDark={isDark}>
      <ProgressBarContainer $isDark={isDark}>
        <ProgressFillBar $progress={safeProgress} $isDark={isDark} $color={color} />
      </ProgressBarContainer>

      {showPercentage && (
        <ProgressText $isDark={isDark}>
          <span>{label}</span>
          <span>{Math.round(safeProgress)}% completo</span>
        </ProgressText>
      )}
    </ProgressContainer>
  );
};
