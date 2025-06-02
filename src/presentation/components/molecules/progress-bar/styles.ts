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

export const ProgressContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out;
`;

export const ProgressBarContainer = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 12px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 0.5rem;
`;

export const ProgressFillBar = styled.div<{
  $progress: number;
  $isDark: boolean;
  $color?: string;
}>`
  height: 100%;
  width: ${({ $progress }) => Math.min(Math.max($progress, 0), 100)}%;
  background: ${({ $color, $isDark }) =>
    $color ||
    ($isDark
      ? 'linear-gradient(90deg, #37cb83, #27ae60)'
      : 'linear-gradient(90deg, #27ae60, #219a52)')};
  border-radius: 6px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    animation: ${shimmerGlow} 2s infinite;
  }
`;

export const ProgressText = styled.div<{ $isDark: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $isDark }) => ($isDark ? '#37cb83' : '#27ae60')};
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
