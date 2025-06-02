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

export const FarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  max-height: 300px;
  object-fit: cover;
  border-radius: 8px;
  flex: 1 1 0;
  transition: transform 0.3s ease;
  display: block;

  &:hover {
    transform: scale(1.05);
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

  @media (max-width: 736px) {
    padding: 0.5rem;
    flex-direction: column;
  }
`;

export const PreviewInfo = styled.div`
  max-width: 100%;
  word-break: break-word;
  overflow-wrap: break-word;
  display: flex;
  flex-direction: column;
  justify-content: center;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 30px;
    font-weight: bold;
    word-break: break-word;
    overflow-wrap: break-word;
  }

  p {
    margin: 0.2rem 0;
    font-size: 20px;
    opacity: 0.8;
    word-break: break-word;
    overflow-wrap: break-word;
  }
`;

export const RemoveButton = styled.button<{ isDark: boolean }>`
  background: linear-gradient(135deg, #ff6b6b, #e63946);
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const AreaValidation = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
  border: 2px solid rgba(255, 107, 107, 0.3);
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
