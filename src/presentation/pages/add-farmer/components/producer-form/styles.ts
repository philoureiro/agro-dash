// src/components/AddFarmer/styles.ts
import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES SUPREMAS
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% {
    box-shadow: 0 0 5px rgba(55, 203, 131, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(55, 203, 131, 0.8), 0 0 30px rgba(55, 203, 131, 0.6);
  }
`;

export const ProgressText = styled.span<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
  font-weight: bold;
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 📝 CARDS DE FORMULÁRIO
export const FormCard = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.95)' : 'rgba(255, 255, 255, 0.95)')};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.05)'};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.08)'};
  animation: ${fadeInUp} 0.8s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(55, 203, 131, 0.05), transparent);
    transition: left 0.6s ease;
  }

  &:hover:before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(55, 203, 131, 0.2)'
        : '0 25px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(55, 203, 131, 0.1)'};
  }

  h2 {
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    animation: ${slideInLeft} 0.6s ease-out;

    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #37cb83, #27ae60);
      border-radius: 2px;
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 16px;
  }
`;

// 📋 GRID RESPONSIVO
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// 🎯 GRUPOS DE INPUT
export const InputGroup = styled.div`
  position: relative;
  animation: ${fadeInUp} 0.6s ease-out;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const FloatingLabel = styled.label<{
  isDark: boolean;
  active: boolean;
  valid: boolean;
}>`
  position: absolute;
  left: 16px;
  top: ${({ active }) => (active ? '8px' : '50%')};
  transform: translateY(-50%);
  font-size: ${({ active }) => (active ? '0.75rem' : '1rem')};
  color: ${({ isDark, active, valid }) => {
    if (active && valid) return isDark ? '#37cb83' : '#27ae60';
    if (active && !valid) return isDark ? '#ff6b6b' : '#e63946';
    return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(44,62,80,0.6)';
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  background: ${({ isDark }) => (isDark ? '#23272f' : '#fff')};
  padding: 0 4px;
  font-weight: 500;
  z-index: 2;
  border-radius: 4px;

  @media (max-width: 768px) {
    font-size: ${({ active }) => (active ? '0.7rem' : '0.9rem')};
    left: 12px;
  }
`;

export const StyledInput = styled.input<{ isDark: boolean; valid: boolean }>`
  width: 100%;
  padding: 16px;
  border: 2px solid
    ${({ isDark, valid }) => {
      if (!valid && isDark) return 'rgba(255, 107, 107, 0.4)';
      if (!valid && !isDark) return 'rgba(231, 76, 60, 0.4)';
      return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 12px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.9)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ isDark, valid }) => {
      if (!valid) return isDark ? '#ff6b6b' : '#e63946';
      return isDark ? '#37cb83' : '#27ae60';
    }};
    box-shadow: ${({ isDark, valid }) => {
      if (!valid)
        return isDark ? '0 0 0 3px rgba(255, 107, 107, 0.2)' : '0 0 0 3px rgba(231, 76, 60, 0.1)';
      return isDark ? '0 0 0 3px rgba(55, 203, 131, 0.2)' : '0 0 0 3px rgba(39, 174, 96, 0.1)';
    }};
    animation: ${glowPulse} 2s infinite;
  }

  &:hover:not(:focus) {
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: transparent;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 0.9rem;
  }
`;

export const StyledSelect = styled.select<{ isDark: boolean; valid: boolean }>`
  width: 100%;
  padding: 16px;
  border: 2px solid
    ${({ isDark, valid }) => {
      if (!valid && isDark) return 'rgba(255, 107, 107, 0.4)';
      if (!valid && !isDark) return 'rgba(231, 76, 60, 0.4)';
      return isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 12px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.9)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ isDark, valid }) => {
      if (!valid) return isDark ? '#ff6b6b' : '#e63946';
      return isDark ? '#37cb83' : '#27ae60';
    }};
    box-shadow: ${({ isDark, valid }) => {
      if (!valid)
        return isDark ? '0 0 0 3px rgba(255, 107, 107, 0.2)' : '0 0 0 3px rgba(231, 76, 60, 0.1)';
      return isDark ? '0 0 0 3px rgba(55, 203, 131, 0.2)' : '0 0 0 3px rgba(39, 174, 96, 0.1)';
    }};
  }

  &:hover:not(:focus) {
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    transform: translateY(-1px);
  }

  option {
    background: ${({ isDark }) => (isDark ? '#2d3748' : '#fff')};
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
    padding: 10px;
  }

  @media (max-width: 768px) {
    padding: 14px;
    font-size: 0.9rem;
  }
`;

// 📄 VALIDAÇÃO DE DOCUMENTO
export const DocumentValidation = styled.div<{ isDark: boolean; isValid?: boolean }>`
  margin-top: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  ${({ isValid, isDark }) => {
    if (isValid === false) {
      return `
        background: ${isDark ? 'rgba(255, 107, 107, 0.15)' : 'rgba(255, 107, 107, 0.1)'};
        border: 1px solid rgba(255, 107, 107, 0.4);
        color: ${isDark ? '#ff6b6b' : '#e63946'};
        
        &:before {
          content: '❌';
          font-size: 1rem;
        }
      `;
    } else if (isValid === true) {
      return `
        background: ${isDark ? 'rgba(55, 203, 131, 0.15)' : 'rgba(55, 203, 131, 0.1)'};
        border: 1px solid rgba(55, 203, 131, 0.4);
        color: ${isDark ? '#37cb83' : '#27ae60'};
        
        &:before {
          content: '✅';
          font-size: 1rem;
        }
      `;
    } else {
      return `
        background: ${isDark ? 'rgba(90, 208, 255, 0.1)' : 'rgba(90, 208, 255, 0.05)'};
        border: 1px solid rgba(90, 208, 255, 0.3);
        color: ${isDark ? '#5ad0ff' : '#3b82f6'};
        
        &:before {
          content: 'ℹ️';
          font-size: 1rem;
        }
      `;
    }
  }}

  .message {
    flex: 1;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.6rem 0.8rem;
  }
`;

// 🎯 AÇÕES DO FORMULÁRIO
export const FormActions = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;

    button {
      width: 100%;
    }
  }
`;

// 📊 ESTATÍSTICAS INLINE
export const StatsContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;

  .stat {
    background: ${({ isDark }) =>
      isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)'};
    border: 1px solid ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    border-radius: 8px;
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    font-weight: 500;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(55, 203, 131, 0.2);
    }

    .value {
      font-weight: bold;
      font-size: 1.1em;
    }

    @media (max-width: 768px) {
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
    }
  }
`;

// Adicionar no styles.ts os componentes que faltam
export const AddFarmerContainer = styled.div<{ $isDark: boolean }>`
  margin-top: 50px;
  margin-bottom: 90px;

  min-height: 100vh;
  padding: 2rem 1rem;

  position: relative;
`;

export const ProgressHeader = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(35, 39, 47, 0.95)' : 'rgba(255, 255, 255, 0.95)'};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(55, 203, 131, 0.2)' : '1px solid rgba(55, 203, 131, 0.1)'};

  h1 {
    color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }
`;

// src/components/AddFarmer/styles.ts - CORRIGIR PROGRESSBAR
export const ProgressBar = styled.div<{ $isDark: boolean }>`
  width: 100%;
  height: 12px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
`;

export const ProgressFill = styled.div<{ $progress: number; $isDark: boolean }>`
  height: 100%;
  background: linear-gradient(90deg, #37cb83, #27ae60);
  border-radius: 6px;
  width: ${({ $progress }) => $progress}%;
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
    animation: shimmer 2s infinite;
  }
`;
