// Adicionar ao final do styles.ts
import styled from 'styled-components';

// 🎨 COMPONENTES DE SLIDER
export const SliderContainer = styled.div<{ isDark: boolean }>`
  width: 100%;
`;

export const SliderLabel = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const SliderTrack = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 8px;
  background: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  border-radius: 4px;
  position: relative;
  cursor: pointer;
`;

export const SliderThumb = styled.div<{
  isDark: boolean;
  position: number;
  color: string;
}>`
  position: absolute;
  top: -4px;
  left: ${({ position }) => position}%;
  transform: translateX(-50%);
  width: 16px;
  height: 16px;
  background: ${({ color }) => color};
  border-radius: 50%;
  border: 3px solid ${({ isDark }) => (isDark ? '#1a1a1a' : '#fff')};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) scale(1.2);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

// 🏭 FARM CARD ESPECÍFICO
export const FarmCard = styled.div<{ isDark: boolean; isValid?: boolean }>`
  border-radius: 16px;
  backdrop-filter: blur(15px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  */ &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ isDark, isValid }) => {
      if (isValid) {
        return isDark
          ? '0 20px 40px rgba(55, 203, 131, 0.3)'
          : '0 20px 40px rgba(55, 203, 131, 0.2)';
      }
      return isDark ? '0 15px 30px rgba(0, 0, 0, 0.3)' : '0 15px 30px rgba(0, 0, 0, 0.1)';
    }};
  }
`;

// Adicione estes novos componentes ao arquivo de styles

export const FarmAccordion = styled.div<{
  isDark: boolean;
  isOpen: boolean;
  isValid: boolean;
}>`
  border-radius: 16px;
  backdrop-filter: blur(15px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  // 🎯 BORDA BASEADA NA VALIDAÇÃO
  border: 1px solid
    ${({ isDark, isValid }) => {
      if (isValid) {
        return isDark ? 'rgba(55, 203, 131, 0.4)' : 'rgba(55, 203, 131, 0.3)';
      } else {
        return isDark ? 'rgba(239, 68, 68, 0.4)' : 'rgba(239, 68, 68, 0.3)';
      }
    }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ isDark, isValid }) => {
      if (isValid) {
        return isDark
          ? '0 8px 25px rgba(55, 203, 131, 0.2)'
          : '0 8px 25px rgba(55, 203, 131, 0.15)';
      } else {
        return isDark ? '0 8px 25px rgba(239, 68, 68, 0.2)' : '0 8px 25px rgba(239, 68, 68, 0.15)';
      }
    }};
  }
`;

export const FarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.02);
  }
`;

export const FarmContent = styled.div<{ isOpen: boolean }>`
  max-height: ${({ isOpen }) => (isOpen ? '2000px' : '0')};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${({ isOpen }) => (isOpen ? 'translateY(0)' : 'translateY(-20px)')};
`;

export const ToggleButton = styled.div<{ isDark: boolean; isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  transition: all 0.3s ease;
  font-size: 0.8rem;

  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};

  &:hover {
    background: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)')};
    transform: ${({ isOpen }) =>
      isOpen ? 'rotate(180deg) scale(1.1)' : 'rotate(0deg) scale(1.1)'};
  }
`;

export const FarmSummary = styled.div<{ isDark: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)')};
  font-weight: 500;

  span:first-child {
    font-weight: 600;
  }
`;

export const StatusIndicator = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 0.8rem;

  animation: ${({ isValid }) => (!isValid ? 'pulse 2s infinite' : 'none')};

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
`;

// Continuação do RemoveButton
export const RemoveButton = styled.button<{ isDark: boolean }>`
  border: none;

  padding: 6px;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75rem;
  display: flex;
  align-items: center;

  opacity: 0.8;

  &:hover {
    opacity: 1;
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }

  // 🎯 IMPEDE QUE O CLICK PROPAGUE PARA O HEADER
  &:focus {
    outline: none;
  }
`;

// Mantenha os outros componentes existentes...
export const PreviewImage = styled.img`
  width: 100%;
  max-height: 200px; // 🎯 Reduzido para accordion
  object-fit: cover;
  border-radius: 8px;
  flex: 1 1 0;
  transition: transform 0.3s ease;
  display: block;

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
  }
`;

export const PreviewContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 0.5rem;
  }
`;

export const PreviewInfo = styled.div`
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-left: 1rem;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem; // 🎯 Reduzido para accordion
    font-weight: bold;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  p {
    margin: 0.2rem 0;
    font-size: 0.9rem; // 🎯 Reduzido para accordion
    opacity: 0.8;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

export const AreaValidation = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
  border: 1px solid rgba(255, 107, 107, 0.3); // 🎯 Reduzido para 1px
  border-radius: 8px;
  padding: 1rem;
  color: ${({ isDark }) => (isDark ? '#ff6b6b' : '#e63946')};
  font-weight: 500;
  margin-top: 1rem;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
