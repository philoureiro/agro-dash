import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const scaleIn = keyframes`
  from { 
    opacity: 0; 
    transform: scale(0.9) translateY(-10px); 
  }
  to { 
    opacity: 1; 
    transform: scale(1) translateY(0); 
  }
`;

const iconPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

// 🌟 OVERLAY
export const ModalOverlay = styled.div<{ $isDark: boolean; $zIndex: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: ${({ $zIndex }) => $zIndex};
  background: ${({ $isDark }) => ($isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.6)')};
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease-out;
`;

// 🏠 CONTAINER
export const ModalContainer = styled.div<{ $isDark: boolean; $type: string }>`
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, rgba(35, 39, 47, 0.95), rgba(26, 35, 50, 0.95))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95))'};
  border-radius: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(20px);
  animation: ${scaleIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: ${({ $type }) => {
      switch ($type) {
        case 'danger':
          return 'linear-gradient(90deg, #e74c3c, #c0392b)';
        case 'warning':
          return 'linear-gradient(90deg, #f39c12, #e67e22)';
        case 'info':
          return 'linear-gradient(90deg, #3498db, #2980b9)';
        default:
          return 'linear-gradient(90deg, #27ae60, #219a52)';
      }
    }};
  }
`;

// 🎨 HEADER
export const ModalHeader = styled.div`
  padding: 2rem 2rem 1rem 2rem;
  text-align: center;
`;

export const ModalIcon = styled.div<{ $color: string; $type: string }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${({ $color }) => `${$color}15`};
  border: 2px solid ${({ $color }) => `${$color}30`};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem auto;
  color: ${({ $color }) => $color};
  animation: ${iconPulse} 2s ease-in-out infinite;
`;

export const ModalTitle = styled.h2<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 0.5rem 0;
`;

export const ModalSubtitle = styled.p<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)')};
  font-size: 0.9rem;
  margin: 0;
`;

// 🎨 CONTEÚDO
export const ModalContent = styled.div`
  padding: 0 2rem 1.5rem 2rem;
`;

export const ModalText = styled.p<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.9)' : 'rgba(44,62,80,0.9)')};
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
`;

// 🎨 AÇÕES
export const ModalActions = styled.div`
  padding: 0 2rem 2rem 2rem;
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

export const ModalButton = styled.button<{
  $isDark: boolean;
  $variant: 'primary' | 'secondary';
  $type?: string;
}>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  position: relative;
  overflow: hidden;
  min-width: 100px;

  ${({ $variant, $isDark, $type }) => {
    if ($variant === 'primary') {
      const colors = {
        danger: { bg: '#e74c3c', hover: '#c0392b' },
        warning: { bg: '#f39c12', hover: '#e67e22' },
        info: { bg: '#3498db', hover: '#2980b9' },
        confirm: { bg: '#27ae60', hover: '#219a52' },
      };

      const color = colors[$type as keyof typeof colors] || colors.confirm;

      return `
        background: linear-gradient(135deg, ${color.bg}, ${color.hover});
        color: white;
        box-shadow: 0 4px 15px ${color.bg}30;
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, ${color.hover}, ${color.bg});
          box-shadow: 0 6px 20px ${color.bg}40;
          transform: translateY(-2px);
        }
      `;
    } else {
      return `
        background: ${$isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'};
        color: ${$isDark ? 'rgba(255,255,255,0.9)' : 'rgba(44,62,80,0.9)'};
        border: 1px solid ${$isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
        
        &:hover:not(:disabled) {
          background: ${$isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'};
          transform: translateY(-2px);
        }
      `;
    }
  }}

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled):before {
    left: 100%;
  }
`;

export const ModalCloseButton = styled.button<{ $isDark: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')};
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)')};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)')};
    color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
    transform: rotate(90deg);
  }
`;
