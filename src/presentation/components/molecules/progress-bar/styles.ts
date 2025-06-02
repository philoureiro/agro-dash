import styled, { keyframes } from 'styled-components';

export const shimmerGlow = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`;

export const floatUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ProgressText = styled.div<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;

  /* 🔥 CORES INVERTIDAS: ESCURO NO LIGHT, CLARO NO DARK */
  color: ${({ $isDark }) => ($isDark ? '#e2e8f0' : '#1e293b')};

  span:last-child {
    font-weight: 700;
    /* 🔥 PORCENTAGEM COM CORES INVERTIDAS */
    color: ${({ $isDark }) => ($isDark ? '#f1f5f9' : '#0f172a')};
  }
`;

export const ProgressFillBar = styled.div<{
  $progress: number;
  $isDark: boolean;
  $color?: string;
}>`
  height: 100%;
  border-radius: 6px;
  width: ${({ $progress }) => $progress}%;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  /* 🔥 COR PERSONALIZADA OU CORES INVERTIDAS PADRÃO */
  background: ${({ $color, $isDark }) => {
    if ($color) return $color;
    // ESCURO NO LIGHT THEME, CLARO NO DARK THEME
    return $isDark
      ? 'linear-gradient(90deg, #4ade80, #22c55e)' // VERDE CLARO DARK
      : 'linear-gradient(90deg, #166534, #15803d)'; // VERDE ESCURO LIGHT
  }};

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: shimmer 2s infinite;
  }
`;

export const ProgressBarContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;

  /* 🔥 FUNDO TAMBÉM COM CORES INVERTIDAS */
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
`;

export const ProgressContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProgressLabel = styled.div<{ $isDark: boolean; $hasBackground?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  /* 🔥 CORES INVERTIDAS: ESCURO NO LIGHT, CLARO NO DARK */
  color: ${({ $hasBackground, $isDark }) => {
    if ($hasBackground) return '#f8fafc'; // BRANCO SUAVE COM IMAGEM
    return $isDark ? '#e2e8f0' : '#1e293b'; // CLARO NO DARK, ESCURO NO LIGHT
  }};

  text-shadow: ${({ $hasBackground }) =>
    $hasBackground ? '2px 2px 4px rgba(0, 0, 0, 0.8)' : 'none'};

  .percentage {
    font-weight: 800;
    font-size: 1.1rem;

    /* 🔥 PORCENTAGEM COM CORES INVERTIDAS */
    color: ${({ $hasBackground, $isDark }) => {
      if ($hasBackground) return '#f1f5f9'; // BRANCO SUAVE COM IMAGEM
      return $isDark ? '#f1f5f9' : '#0f172a'; // CLARO NO DARK, ESCURO NO LIGHT
    }};
  }
`;
