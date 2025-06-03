import { bounce, fadeInUp, shimmer } from '@animations';
import styled from 'styled-components';

// 🌱 CROP COMPONENTS
export const CropCard = styled.div<{ isDark: boolean; isValid?: boolean }>`
  background: ${({ isDark, isValid }) => {
    if (isValid) {
      return isDark
        ? 'linear-gradient(135deg, rgba(39, 174, 96, 0.1), rgba(35, 39, 47, 0.6))'
        : 'linear-gradient(135deg, rgba(39, 174, 96, 0.05), rgba(255, 255, 255, 0.6))';
    }
    return isDark ? 'rgba(35, 39, 47, 0.6)' : 'rgba(255, 255, 255, 0.6)';
  }};
  border-radius: 12px;
  padding: 1.5rem;
  border: ${({ isDark, isValid }) => {
    if (isValid) return '1px solid #27ae60';
    return isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)';
  }};
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.4s ease-out;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: ${({ isValid, isDark }) => {
      if (isValid) return 'linear-gradient(90deg, #27ae60, #229954)';
      return isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
    }};
    border-radius: 12px 12px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ isDark, isValid }) => {
      if (isValid) {
        return isDark
          ? '0 12px 25px rgba(39, 174, 96, 0.2)'
          : '0 12px 25px rgba(39, 174, 96, 0.15)';
      }
      return isDark ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 8px 25px rgba(0, 0, 0, 0.05)';
    }};
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CropHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const CropTypeIcon = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${({ color }) => color}15;
  border: 2px solid ${({ color }) => color}50;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px ${({ color }) => color}30;
  }

  &:before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    background: linear-gradient(45deg, ${({ color }) => color}20, transparent);
    z-index: -1;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

export const CropValidation = styled.div<{ isDark: boolean; type: 'error' | 'warning' | 'info' }>`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
  animation: ${bounce} 0.6s ease-out;
  transition: all 0.3s ease;

  ${({ type, isDark }) => {
    if (type === 'error') {
      return `
        background: ${isDark ? 'rgba(231, 76, 60, 0.15)' : 'rgba(231, 76, 60, 0.1)'};
        border: 1px solid rgba(231, 76, 60, 0.4);
      
        
        &:before {
          content: '❌';
          font-size: 1rem;
        }
      `;
    } else if (type === 'warning') {
      return `
        background: ${isDark ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.1)'};
        border: 1px solid rgba(255, 193, 7, 0.4);
     
        
        &:before {
          content: '⚠️';
          font-size: 1rem;
        }
      `;
    } else {
      return `
        background: ${isDark ? 'rgba(52, 152, 219, 0.15)' : 'rgba(52, 152, 219, 0.1)'};
        border: 1px solid rgba(52, 152, 219, 0.4);
        
        
        &:before {
          content: 'ℹ️';
          font-size: 1rem;
        }
      `;
    }
  }}

  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: ${({ type }) => {
      if (type === 'error') return '0 4px 15px rgba(231, 76, 60, 0.3)';
      if (type === 'warning') return '0 4px 15px rgba(255, 193, 7, 0.3)';
      return '0 4px 15px rgba(52, 152, 219, 0.3)';
    }};
  }

  .message {
    flex: 1;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
`;

export const ProductivityMeter = styled.div<{ isDark: boolean }>`
  margin-top: 1.5rem;
  padding: 1rem;
  background: ${({ isDark }) => (isDark ? 'rgba(52, 152, 219, 0.1)' : 'rgba(52, 152, 219, 0.05)')};
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(52, 152, 219, 0.3)' : 'rgba(52, 152, 219, 0.2)')};
  border-radius: 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(52, 152, 219, 0.2);
  }

  .metric {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }

    .label {
      color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)')};
      font-weight: 500;
    }

    .value {
      font-weight: bold;
      color: ${({ isDark }) => (isDark ? '#3498DB' : '#2980B9')};
      font-size: 1.1em;
    }

    @media (max-width: 768px) {
      font-size: 0.8rem;

      .value {
        font-size: 1em;
      }
    }
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.5rem;
    position: relative;

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: ${shimmer} 2s infinite;
    }

    .progress-fill {
      height: 100%;
      border-radius: 3px;
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      background-size: 200% 100%;
      animation: ${shimmer} 3s infinite;

      &:before {
        content: '';
        position: absolute;
        top: -1px;
        right: -1px;
        width: 2px;
        height: calc(100% + 2px);
        background: rgba(255, 255, 255, 0.8);
        border-radius: 1px;
        box-shadow: 0 0 6px rgba(255, 255, 255, 0.6);
      }
    }
  }
`;

// 🎯 FARM SELECTOR PARA CULTURAS
export const FarmSelector = styled.div<{ isDark: boolean }>`
  border-radius: 12px;
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  .farm-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:before {
      content: '🏭';
      font-size: 1.4rem;
    }

    @media (max-width: 768px) {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
  }

  .farm-stats {
    display: flex;
    gap: 2rem;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)')};

    .stat {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      .value {
        font-weight: bold;
        color: ${({ isDark }) => (isDark ? '#3498DB' : '#2980B9')};
      }
    }

    @media (max-width: 768px) {
      gap: 1rem;
      font-size: 0.8rem;
    }
  }
`;

export const CropFormContainer = styled.div<{ isDark: boolean }>`
  border: ${({ isDark }) => (isDark ? '1px solid rgba(111, 250, 47, 0.14)' : '1px solid #ecf0f1')};
  border-radius: 12px;
  padding: 20px;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${({ isDark }) =>
    isDark ? '0 8px 25px rgba(0, 0, 0, 0.37)' : '0 8px 25px rgba(0, 0, 0, 0.05)'};
  transition: all 0.3s ease;
  display: flex;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CropFormHeader = styled.div<{ isDark: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
`;

export const HeaderBox = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 30px;
    gap: 20px;
  }
`;

// 🗑️ BOTÃO DE DELETAR CULTURA - NOVO DESIGN
export const DeleteCropButton = styled.button<{ isDark: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #ffffff;
  border: 1px solid rgba(231, 76, 60, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  color: #e74c3c;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
    border-color: #e74c3c;
    background: #ffffff;
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
  }
`;

// 🌾 STATUS BADGES PARA CULTURAS - REMOVIDO O PLANNED
export const CropStatusBadge = styled.span<{
  status: 'growing' | 'ready' | 'harvested';
  isDark: boolean;
}>`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.6rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;

  ${({ status, isDark }) => {
    switch (status) {
      case 'growing':
        return `
          background: ${isDark ? 'rgba(39, 174, 96, 0.2)' : 'rgba(39, 174, 96, 0.1)'};
          color: ${isDark ? '#2ECC71' : '#27AE60'};
          border: 1px solid ${isDark ? 'rgba(39, 174, 96, 0.4)' : 'rgba(39, 174, 96, 0.3)'};
          
          &:before {
            content: '🌱';
          }
        `;
      case 'ready':
        return `
          background: ${isDark ? 'rgba(243, 156, 18, 0.2)' : 'rgba(243, 156, 18, 0.1)'};
          color: ${isDark ? '#F39C12' : '#E67E22'};
          border: 1px solid ${isDark ? 'rgba(243, 156, 18, 0.4)' : 'rgba(243, 156, 18, 0.3)'};
          
          &:before {
            content: '🌾';
          }
        `;
      case 'harvested':
        return `
          background: ${isDark ? 'rgba(46, 204, 113, 0.2)' : 'rgba(46, 204, 113, 0.1)'};
          color: ${isDark ? '#2ECC71' : '#27AE60'};
          border: 1px solid ${isDark ? 'rgba(46, 204, 113, 0.4)' : 'rgba(46, 204, 113, 0.3)'};
          
          &:before {
            content: '✅';
          }
        `;
      default:
        return '';
    }
  }}

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;
