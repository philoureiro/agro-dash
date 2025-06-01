import styled, { css, keyframes } from 'styled-components';

import { ToastConfig } from './types';

// 🌊 ANIMAÇÕES
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const progressBar = keyframes`
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
`;

// 🎯 CONTAINER PRINCIPAL
export const ToastContainer = styled.div<{
  position: ToastConfig['position'];
  isDark?: boolean;
}>`
  position: fixed;
  z-index: 9999;
  pointer-events: none;

  ${({ position }) => {
    switch (position) {
      case 'top-right':
        return css`
          top: 1rem;
          right: 1rem;
        `;
      case 'top-left':
        return css`
          top: 1rem;
          left: 1rem;
        `;
      case 'bottom-right':
        return css`
          bottom: 1rem;
          right: 1rem;
        `;
      case 'bottom-left':
        return css`
          bottom: 1rem;
          left: 1rem;
        `;
      case 'top-center':
        return css`
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-center':
        return css`
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
        `;
      default:
        return css`
          top: 1rem;
          right: 1rem;
        `;
    }
  }}

  @media (max-width: 768px) {
    left: 0.5rem !important;
    right: 0.5rem !important;
    top: ${({ position }) => (position.includes('top') ? '0.5rem' : 'auto')};
    bottom: ${({ position }) => (position.includes('bottom') ? '0.5rem' : 'auto')};
    transform: none !important;
    width: calc(100% - 1rem);
  }
`;

// 🎨 TOAST INDIVIDUAL
export const Toast = styled.div<{
  type: 'success' | 'error' | 'warning' | 'info';
  position: ToastConfig['position'];
  isDark?: boolean;
  isRemoving?: boolean;
}>`
  position: relative;
  pointer-events: auto;
  margin-bottom: 0.75rem;
  min-width: 320px;
  max-width: 500px;
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  border: 1px solid;
  box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);

  /* Cores por tipo */
  ${({ type, isDark }) => {
    const colors = {
      success: {
        bg: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.95)',
        border: isDark ? 'rgba(34, 197, 94, 0.3)' : 'rgba(34, 197, 94, 0.8)',
        text: isDark ? '#ffffff' : '#ffffff',
        icon: '#22c55e',
      },
      error: {
        bg: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.95)',
        border: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.8)',
        text: isDark ? '#ffffff' : '#ffffff',
        icon: '#ef4444',
      },
      warning: {
        bg: isDark ? 'rgba(245, 158, 11, 0.15)' : 'rgba(245, 158, 11, 0.95)',
        border: isDark ? 'rgba(245, 158, 11, 0.3)' : 'rgba(245, 158, 11, 0.8)',
        text: isDark ? '#ffffff' : '#ffffff',
        icon: '#f59e0b',
      },
      info: {
        bg: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.95)',
        border: isDark ? 'rgba(59, 130, 246, 0.3)' : 'rgba(59, 130, 246, 0.8)',
        text: isDark ? '#ffffff' : '#ffffff',
        icon: '#3b82f6',
      },
    };

    const color = colors[type];

    return css`
      background: ${color.bg};
      border-color: ${color.border};
      color: ${color.text};

      --toast-icon-color: ${color.icon};
    `;
  }}

  /* Animações de entrada */
  ${({ position, isRemoving }) => {
    if (isRemoving) {
      if (position.includes('right'))
        return css`
          animation: ${slideOutRight} 0.3s ease-in-out forwards;
        `;
      if (position.includes('left'))
        return css`
          animation: ${slideOutLeft} 0.3s ease-in-out forwards;
        `;
      return css`
        opacity: 0;
        transform: scale(0.9);
      `;
    }

    if (position.includes('right'))
      return css`
        animation: ${slideInRight} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
    if (position.includes('left'))
      return css`
        animation: ${slideInLeft} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
    if (position.includes('top'))
      return css`
        animation: ${slideInTop} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;
    if (position.includes('bottom'))
      return css`
        animation: ${slideInBottom} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      `;

    return css`
      animation: ${slideInRight} 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    `;
  }}

  @media (max-width: 768px) {
    min-width: auto;
    max-width: none;
    width: 100%;
    margin-bottom: 0.5rem;
  }
`;

// 📄 CONTEÚDO DO TOAST
export const ToastContent = styled.div`
  padding: 1rem 1.25rem;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  position: relative;
`;

// 🎨 ÍCONE
export const ToastIcon = styled.div`
  font-size: 1.25rem;
  line-height: 1;
  margin-top: 0.125rem;
  color: var(--toast-icon-color);
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
`;

// 📝 TEXTO
export const ToastText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ToastTitle = styled.div`
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.3;
  margin-bottom: 0.25rem;
  letter-spacing: -0.01em;
`;

export const ToastMessage = styled.div`
  font-size: 0.85rem;
  line-height: 1.4;
  opacity: 0.9;
  word-wrap: break-word;
`;

// 🎯 BOTÕES
export const ToastActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-left: auto;
`;

export const ToastButton = styled.button<{ variant?: 'action' | 'close' }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ variant }) => (variant === 'close' ? '1rem' : '0.75rem')};
  font-weight: 600;
  color: currentColor;
  opacity: 0.8;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: ${({ variant }) => (variant === 'close' ? '24px' : 'auto')};
  height: 24px;

  &:hover {
    opacity: 1;
    background: rgba(255, 255, 255, 0.1);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  ${({ variant }) =>
    variant === 'action' &&
    css`
      padding: 0.25rem 0.5rem;
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    `}
`;

// ⏱️ BARRA DE PROGRESSO
export const ToastProgress = styled.div<{ duration: number }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--toast-icon-color), rgba(255, 255, 255, 0.8));
  border-radius: 0 0 16px 16px;
  animation: ${progressBar} ${({ duration }) => duration}ms linear forwards;
  opacity: 0.7;
`;
