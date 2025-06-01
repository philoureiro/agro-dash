import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES DO LOADING SUPREMO
const spinRings = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeInScale = keyframes`
  0% { opacity: 0; transform: scale(0.8); }
  100% { opacity: 1; transform: scale(1); }
`;

const dotPulse = keyframes`
  0%, 20% { opacity: 0; }
  50% { opacity: 1; }
  80%, 100% { opacity: 0; }
`;

const shimmerGlow = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

const dotsRotate = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulseBeat = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
`;

const waveMove = keyframes`
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% { transform: scaleY(1.0); }
`;

const bounceMove = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1.0); }
`;

const fadeRotate = keyframes`
  0%, 39%, 100% { opacity: 0; }
  40% { opacity: 1; }
`;

const floatUp = keyframes`
  0% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

// 🌟 CONTAINER PRINCIPAL
export const LoadingOverlayContainer = styled.div<{
  $isDark: boolean;
  $zIndex: number;
  $blurIntensity: 'light' | 'medium' | 'heavy';
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, rgba(15, 20, 25, 0.95), rgba(26, 35, 50, 0.95))'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(255, 255, 255, 0.95))'};
  backdrop-filter: blur(
    ${({ $blurIntensity }) =>
      $blurIntensity === 'light' ? '10px' : $blurIntensity === 'medium' ? '20px' : '30px'}
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  animation: ${fadeInScale} 0.5s ease-out;
  padding: 2rem;
  box-sizing: border-box;
`;

export const LoadingBackground = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ $isDark }) =>
    $isDark
      ? 'radial-gradient(circle at center, rgba(52, 152, 219, 0.1) 0%, transparent 70%)'
      : 'radial-gradient(circle at center, rgba(52, 152, 219, 0.05) 0%, transparent 70%)'};
  animation: ${shimmerGlow} 3s ease-in-out infinite;
  pointer-events: none;
`;

export const LoadingIcon = styled.div<{ $isDark: boolean; $spinnerColor?: string }>`
  color: ${({ $spinnerColor, $isDark }) => $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out;
  opacity: 0.8;
`;

export const LoadingSpinner = styled.div<{
  $isDark: boolean;
  $variant: string;
  $size: 'small' | 'medium' | 'large';
  $spinnerColor?: string;
}>`
  position: relative;
  width: ${({ $size }) => ($size === 'small' ? '60px' : $size === 'medium' ? '80px' : '100px')};
  height: ${({ $size }) => ($size === 'small' ? '60px' : $size === 'medium' ? '80px' : '100px')};
  z-index: 1;

  /* RINGS ANIMATION */
  .spinner-ring {
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
    animation: ${spinRings} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &.ring-1 {
      width: 100%;
      height: 100%;
      border-top: 3px solid
        ${({ $spinnerColor, $isDark }) => $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      animation-delay: -0.45s;
    }

    &.ring-2 {
      width: 80%;
      height: 80%;
      top: 10%;
      left: 10%;
      border-top: 3px solid
        ${({ $spinnerColor, $isDark }) => $spinnerColor || ($isDark ? '#27ae60' : '#219a52')};
      animation-delay: -0.3s;
    }

    &.ring-3 {
      width: 60%;
      height: 60%;
      top: 20%;
      left: 20%;
      border-top: 3px solid
        ${({ $spinnerColor, $isDark }) => $spinnerColor || ($isDark ? '#f39c12' : '#e67e22')};
      animation-delay: -0.15s;
    }
  }

  /* DOTS ANIMATION */
  .spinner-dots {
    position: relative;
    width: 100%;
    height: 100%;
    animation: ${dotsRotate} 2s linear infinite;

    .dot {
      position: absolute;
      width: 12px;
      height: 12px;
      background: ${({ $spinnerColor, $isDark }) =>
        $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      border-radius: 50%;

      &:nth-child(1) {
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &:nth-child(2) {
        top: 50%;
        right: 0;
        transform: translateY(-50%);
      }
      &:nth-child(3) {
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
      &:nth-child(4) {
        top: 50%;
        left: 0;
        transform: translateY(-50%);
      }
    }
  }

  /* PULSE ANIMATION */
  .spinner-pulse {
    position: relative;
    width: 100%;
    height: 100%;

    .pulse-ring {
      position: absolute;
      width: 100%;
      height: 100%;
      border: 3px solid
        ${({ $spinnerColor, $isDark }) => $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      border-radius: 50%;
      animation: ${pulseBeat} 1.5s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: -0.75s;
      }
    }
  }

  /* WAVE ANIMATION */
  .spinner-wave {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    height: 100%;

    .wave-bar {
      width: 12%;
      height: 100%;
      background: ${({ $spinnerColor, $isDark }) =>
        $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      border-radius: 2px;
      animation: ${waveMove} 1.2s ease-in-out infinite;

      &:nth-child(1) {
        animation-delay: -1.1s;
      }
      &:nth-child(2) {
        animation-delay: -1s;
      }
      &:nth-child(3) {
        animation-delay: -0.9s;
      }
      &:nth-child(4) {
        animation-delay: -0.8s;
      }
      &:nth-child(5) {
        animation-delay: -0.7s;
      }
    }
  }

  /* BOUNCE ANIMATION */
  .spinner-bounce {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    .bounce-ball {
      width: 20px;
      height: 20px;
      background: ${({ $spinnerColor, $isDark }) =>
        $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      border-radius: 50%;
      animation: ${bounceMove} 1.4s ease-in-out infinite both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }
      &:nth-child(2) {
        animation-delay: -0.16s;
      }
      &:nth-child(3) {
        animation-delay: 0s;
      }
    }
  }

  /* FADE ANIMATION */
  .spinner-fade {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 100%;

    .fade-rect {
      width: 18%;
      height: 100%;
      background: ${({ $spinnerColor, $isDark }) =>
        $spinnerColor || ($isDark ? '#3498db' : '#2980b9')};
      border-radius: 2px;
      animation: ${fadeRotate} 1.2s ease-in-out infinite;

      &:nth-child(1) {
        animation-delay: -1.1s;
      }
      &:nth-child(2) {
        animation-delay: -1s;
      }
      &:nth-child(3) {
        animation-delay: -0.9s;
      }
      &:nth-child(4) {
        animation-delay: -0.8s;
      }
    }
  }
`;

export const LoadingTitle = styled.h2<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 1.8rem;
  font-weight: bold;
  text-align: center;
  margin: 0;
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out 0.2s both;
`;

export const LoadingSubtitle = styled.p<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};
  font-size: 1rem;
  text-align: center;
  margin: 0;
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out 0.3s both;
`;

export const LoadingText = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.9)' : 'rgba(44,62,80,0.9)')};
  font-size: 1.1rem;
  font-weight: 600;
  text-align: center;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  animation: ${floatUp} 0.6s ease-out 0.4s both;
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 0.1rem;

  span {
    animation: ${dotPulse} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

export const LoadingProgress = styled.div<{ $isDark: boolean }>`
  width: 100%;
  max-width: 300px;
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out 0.5s both;
`;

export const LoadingProgressBar = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 8px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

export const LoadingProgressFill = styled.div<{
  $progress: number;
  $isDark: boolean;
  $spinnerColor?: string;
}>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: ${({ $spinnerColor, $isDark }) =>
    $spinnerColor ||
    ($isDark
      ? 'linear-gradient(90deg, #3498db, #27ae60)'
      : 'linear-gradient(90deg, #2980b9, #219a52)')};
  border-radius: 4px;
  transition: width 0.3s ease;
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

export const LoadingStats = styled.div<{ $isDark: boolean }>`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  z-index: 1;
  animation: ${floatUp} 0.6s ease-out 0.6s both;

  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

export const LoadingStat = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')};
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  min-width: 80px;

  .stat-value {
    font-size: 1.2rem;
    font-weight: bold;
    color: ${({ $isDark }) => ($isDark ? '#3498db' : '#2980b9')};
  }

  .stat-label {
    font-size: 0.8rem;
    color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)')};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;
