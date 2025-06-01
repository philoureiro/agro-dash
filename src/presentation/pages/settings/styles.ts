import styled, { keyframes } from 'styled-components';

// 🌊 ANIMAÇÕES SUAVES
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

// 🎯 CONTAINER PRINCIPAL
export const SettingsContainer = styled.div<{ isDark: boolean }>`
  margin-top: 70px;
  margin-bottom: 70px;

  min-height: 100vh;

  padding: 2rem;
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-bottom: 120px;
  }
`;

// 🏆 HEADER DA PÁGINA
export const SettingsHeader = styled.div`
  max-width: 1200px;
  margin: 0 auto 3rem;
  text-align: center;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const SettingsTitle = styled.h1<{ isDark: boolean }>`
  font-size: 3rem;
  font-weight: 800;

  background-clip: text;
  margin: 0 0 1rem;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

export const SettingsSubtitle = styled.p<{ isDark: boolean }>`
  font-size: 1.2rem;

  font-weight: 500;
  margin: 0;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

// 🎨 GRID DE SEÇÕES
export const SettingsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

// 🎯 CARD DE SEÇÃO
export const SettingsCard = styled.div<{ isDark: boolean; delay?: number }>`
  background: ${({ theme }) => theme.palette?.background?.paper || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)')};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: ${({ isDark }) =>
    isDark ? '0 25px 50px -12px rgba(0, 0, 0, 0.4)' : '0 25px 50px -12px rgba(0, 0, 0, 0.1)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.6s ease-out;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark ? '0 35px 60px -12px rgba(0, 0, 0, 0.5)' : '0 35px 60px -12px rgba(0, 0, 0, 0.15)'};
    border-color: ${({ isDark }) =>
      isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(148, 163, 184, 0.3)'};
  }
`;

// 🎨 HEADER DO CARD
export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const CardIcon = styled.div<{ isDark: boolean }>`
  font-size: 2rem;
  padding: 0.8rem;
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #34d399 0%, #10b981 100%)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.3);
  margin-top: -7%;
`;

export const CardTitle = styled.h3<{ isDark: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ isDark }) => (isDark ? '#f1f5f9' : '#1e293b')};
  margin: 0;
  letter-spacing: -0.01em;
`;

export const CardDescription = styled.p<{ isDark: boolean }>`
  font-size: 0.95rem;
  color: ${({ isDark }) => (isDark ? '#94a3b8' : '#64748b')};
  margin: 0 0 1.5rem;
  line-height: 1.5;
  display: flex;
  max-width: 400px;
`;

// 🎯 OPÇÕES DE CONFIGURAÇÃO
export const SettingOption = styled.div<{ delay?: number }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(148, 163, 184, 0.1);
  animation: ${slideIn} 0.4s ease-out;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;
  gap: 5px;
  &:last-child {
    border-bottom: none;
  }
`;

export const OptionInfo = styled.div`
  flex: 1;
`;

export const OptionLabel = styled.label<{ isDark: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ isDark }) => (isDark ? '#f1f5f9' : '#1e293b')};
  display: block;
  margin-bottom: 0.25rem;
  cursor: pointer;
`;

export const OptionSubtext = styled.span<{ isDark: boolean }>`
  display: flex;
  font-size: 0.875rem;
  color: ${({ isDark }) => (isDark ? '#94a3b8' : '#64748b')};
  line-height: 1.4;
  max-width: 240px;
  text-align: left;
`;

// 🎨 TOGGLE SWITCH
export const ToggleSwitch = styled.div<{ isActive: boolean; isDark: boolean }>`
  position: relative;
  width: 56px;
  height: 28px;
  background: ${({ isActive, isDark }) => {
    if (isActive) {
      return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    }
    return isDark ? '#374151' : '#d1d5db';
  }};
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: ${({ isActive }) =>
    isActive ? '0 4px 12px rgba(16, 185, 129, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ isActive }) => (isActive ? '30px' : '2px')};
    width: 24px;
    height: 24px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`;

// 🎯 BOTÕES DE AÇÃO
export const ActionButton = styled.button<{
  variant?: 'primary' | 'secondary' | 'danger';
  isDark: boolean;
  size?: 'small' | 'medium' | 'large';
}>`
  padding: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return '0.5rem 1rem';
      case 'large':
        return '1rem 2rem';
      default:
        return '0.75rem 1.5rem';
    }
  }};
  font-size: ${({ size = 'medium' }) => {
    switch (size) {
      case 'small':
        return '0.875rem';
      case 'large':
        return '1.1rem';
      default:
        return '1rem';
    }
  }};
  font-weight: 600;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  letter-spacing: -0.01em;

  background: ${({ variant = 'primary', isDark }) => {
    switch (variant) {
      case 'danger':
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
      case 'secondary':
        return isDark
          ? 'linear-gradient(135deg, #374151 0%, #1f2937 100%)'
          : 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
      default:
        return 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
    }
  }};

  color: ${({ variant = 'primary', isDark }) => {
    if (variant === 'secondary' && !isDark) return '#374151';
    return 'white';
  }};

  box-shadow: ${({ variant = 'primary' }) => {
    switch (variant) {
      case 'danger':
        return '0 4px 12px rgba(239, 68, 68, 0.3)';
      case 'secondary':
        return '0 2px 8px rgba(0, 0, 0, 0.1)';
      default:
        return '0 4px 12px rgba(59, 130, 246, 0.3)';
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ variant = 'primary' }) => {
      switch (variant) {
        case 'danger':
          return '0 8px 20px rgba(239, 68, 68, 0.4)';
        case 'secondary':
          return '0 6px 16px rgba(0, 0, 0, 0.15)';
        default:
          return '0 8px 20px rgba(59, 130, 246, 0.4)';
      }
    }};
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// 🎨 SEÇÃO DE ESTATÍSTICAS
export const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const StatItem = styled.div<{ isDark: boolean; delay?: number }>`
  text-align: center;
  padding: 1rem;
  background: ${({ isDark }) => (isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(248, 250, 252, 0.8)')};
  border-radius: 12px;
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)')};
  animation: ${pulse} 2s ease-in-out infinite;
  animation-delay: ${({ delay = 0 }) => delay}ms;
`;

export const StatValue = styled.div<{ isDark: boolean }>`
  font-size: 1.5rem;
  font-weight: 800;
  color: ${({ isDark }) => (isDark ? '#10b981' : '#059669')};
  margin-bottom: 0.25rem;
`;

export const StatLabel = styled.div<{ isDark: boolean }>`
  font-size: 0.75rem;
  color: ${({ isDark }) => (isDark ? '#94a3b8' : '#64748b')};
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

// 🎯 MODAL DE CONFIRMAÇÃO
export const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 2rem;
`;

export const ModalContent = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? '#1e293b' : 'white')};
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)')};
  transform: scale(0.95);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${Modal}[data-open="true"] & {
    transform: scale(1);
  }
`;

export const ModalTitle = styled.h3<{ isDark: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ isDark }) => (isDark ? '#f1f5f9' : '#1e293b')};
  margin: 0 0 1rem;
  text-align: center;
`;

export const ModalText = styled.p<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#94a3b8' : '#64748b')};
  margin: 0 0 2rem;
  text-align: center;
  line-height: 1.5;
`;

export const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
`;
