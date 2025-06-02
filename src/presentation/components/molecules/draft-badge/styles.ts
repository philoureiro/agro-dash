import styled, { css, keyframes } from 'styled-components';

// 🎬 ANIMAÇÕES ELEGANTES
const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideOutRight = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(100%) scale(0.8);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
`;

const slideOutLeft = keyframes`
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateX(-100%) scale(0.8);
  }
`;

const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideOutUp = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-100%) scale(0.8);
  }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const slideOutDown = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(100%) scale(0.8);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// 📍 CONTAINER POSICIONADO
export const BadgeContainer = styled.div<{
  $position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}>`
  position: fixed;
  z-index: 9999;
  pointer-events: none;

  padding: 15px;

  ${({ $position }) => {
    switch ($position) {
      case 'top-right':
        return css`
          top: 20px;
          right: 20px;
        `;
      case 'top-left':
        return css`
          top: 20px;
          left: 20px;
        `;
      case 'bottom-right':
        return css`
          bottom: 20px;
          right: 20px;
        `;
      case 'bottom-left':
        return css`
          bottom: 20px;
          left: 20px;
        `;
      default:
        return css`
          top: 20px;
          right: 20px;
        `;
    }
  }}

  @media (max-width: 768px) {
    top: ${({ $position }) => ($position.includes('top') ? '10px' : 'auto')};
    bottom: ${({ $position }) => ($position.includes('bottom') ? '10px' : 'auto')};
    left: ${({ $position }) => ($position.includes('left') ? '10px' : 'auto')};
    right: ${({ $position }) => ($position.includes('right') ? '10px' : 'auto')};
  }
`;

// 🎯 WRAPPER PRINCIPAL
export const BadgeWrapper = styled.div<{
  $isDark: boolean;
  $isVisible: boolean;
}>`
  margin-top: 40px;
  /* margin-right: 10px; */
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 20px;

  color: ${({ $isDark }) => ($isDark ? '#000' : '#fff')};

  background: ${({ $isDark }) =>
    $isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(35, 39, 47, 0.95)'};

  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(55, 203, 131, 0.2)')};

  backdrop-filter: blur(12px);
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: auto;
  cursor: default;

  /* 🎬 ANIMAÇÕES BASEADAS NA POSIÇÃO */
  ${({ $isVisible }) => {
    if ($isVisible) {
      return css`
        animation: ${slideInRight} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
    } else {
      return css`
        animation: ${slideOutRight} 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;
    }
  }}

  /* 🌟 EFEITO HOVER SUTIL */
  &:hover {
    transform: translateY(-4px);
    border-color: ${({ $isDark }) =>
      $isDark ? 'rgba(255, 255, 255, 0.95)' : 'rgba(55, 203, 131, 0.5)'};
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 12px 48px rgba(0, 0, 0, 0.5)' : '0 5px 20px rgba(55, 203, 131, 0.5)'};
  }

  /* 🎯 PULSE SUTIL AO APARECER */
  &:first-child {
    animation:
      ${slideInRight} 0.4s cubic-bezier(0.4, 0, 0.2, 1),
      ${pulse} 0.6s ease-in-out 0.4s;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.6rem;
    border-radius: 16px;
  }
`;

// 🎨 ÍCONE
export const BadgeIcon = styled.span`
  font-size: 1rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 🌟 MICRO ANIMAÇÃO DO ÍCONE */
  animation: ${pulse} 1s ease-in-out infinite;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// 📝 TEXTO
export const BadgeText = styled.span<{ $isDark: boolean }>`
  font-size: 0.8rem;
  font-weight: 600;

  white-space: nowrap;
  letter-spacing: 0.025em;

  background-clip: text;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;
