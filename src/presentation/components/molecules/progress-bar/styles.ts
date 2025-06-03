// src/components/ui/ProgressBar/styles.ts
import styled, { keyframes } from 'styled-components';

// Animação shimmer (efeito brilho na parte preenchida)
const shimmerGlow = keyframes`
  0% { transform: translateX(-100%);}
  100% { transform: translateX(100%);}
`;

export const ProgressContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProgressBarContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 16px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)')};
`;

// Barra Preenchida (PROGRESSO)
export const ProgressFillBar = styled.div<{
  $progress: number;
  $isDark: boolean;
  $color?: string;
}>`
  height: 100%;
  border-radius: 8px 0 0 8px;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.85s cubic-bezier(0.6, 0.1, 0.3, 1);
  background: ${({ $color, $isDark }) =>
    $color
      ? $color
      : $isDark
        ? 'linear-gradient(90deg, #4ade80, #22c55e)'
        : 'linear-gradient(90deg, #166534, #15803d)'};
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;

  // Efeito shimmer
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.23), transparent);
    animation: ${shimmerGlow} 2.3s infinite linear;
    opacity: 0.65;
    pointer-events: none;
  }
`;

// Barra FALTANTE (Vazia)
export const ProgressEmptyBar = styled.div<{
  $progress: number; // quanto falta
  $isDark: boolean;
  $emptyColor?: string;
}>`
  height: 100%;
  border-radius: 0 8px 8px 0;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.85s cubic-bezier(0.6, 0.1, 0.3, 1);
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  background: ${({ $emptyColor, $isDark }) =>
    $emptyColor ? $emptyColor : $isDark ? 'rgba(255,255,255,0.12)' : 'rgba(16,44,16,0.16)'};
`;

// Texto do progresso
export const ProgressText = styled.div<{
  $isDark: boolean;
}>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.98rem;
  font-weight: 600;
  margin-top: 0.45rem;
  letter-spacing: 0.01em;

  color: ${({ $isDark }) => ($isDark ? '#e2e8f0' : '#1e293b')};

  span:last-child {
    font-weight: 700;
  }
`;
