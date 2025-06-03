import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES ESPECÍFICAS PARA EDIÇÃO
const slideInDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    transform: translate3d(0, -8px, 0);
  }
  70% {
    transform: translate3d(0, -4px, 0);
  }
`;

export const PrincipalContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
`;

// 🏗️ CONTAINER PRINCIPAL COMPACTO
export const EditContainer = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  padding: 20px;
  width: 100%;
  max-width: 1600px;
  position: relative;

  margin-top: 80px;
  margin-bottom: 80px;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

// 📋 HEADER EDITÁVEL
export const EditHeader = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.95)' : 'rgba(255, 255, 255, 0.95)')};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  margin-bottom: 2rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(55, 203, 131, 0.2)' : '1px solid rgba(55, 203, 131, 0.1)'};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.05)'};
  animation: ${slideInDown} 0.6s ease-out;

  .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

export const BackButton = styled.button<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(90, 208, 255, 0.1)' : 'rgba(90, 208, 255, 0.05)')};
  border: 1px solid ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
  color: ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
    color: white;
    transform: translateX(-3px);
  }
`;

export const HeaderTitle = styled.h1<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const LastModified = styled.p<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(44,62,80,0.6)')};
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const HeaderStats = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    justify-content: center;
    flex-wrap: wrap;
  }
`;

export const CompactCounter = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(55, 203, 131, 0.2)' : '1px solid rgba(55, 203, 131, 0.1)'};
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  text-align: center;
  min-width: 60px;

  strong {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    line-height: 1;
  }

  span {
    font-size: 0.7rem;
    color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)')};
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
`;

export const ValidationStatus = styled.div<{ isDark: boolean; valid: boolean }>`
  background: ${({ isDark, valid }) => {
    if (valid) return isDark ? 'rgba(55, 203, 131, 0.2)' : 'rgba(55, 203, 131, 0.1)';
    return isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)';
  }};
  color: ${({ isDark, valid }) => {
    if (valid) return isDark ? '#37cb83' : '#27ae60';
    return isDark ? '#ff6b6b' : '#e63946';
  }};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid ${({ valid }) => (valid ? '#37cb83' : '#ff6b6b')};
  animation: ${({ valid }) => (valid ? pulse : 'none')} 2s infinite;
`;

// ⚠️ MUDANÇAS NÃO SALVAS
export const UnsavedChanges = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(255, 193, 7, 0.15)' : 'rgba(255, 193, 7, 0.1)')};
  border: 2px solid rgba(255, 193, 7, 0.4);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${slideInDown} 0.5s ease-out;

  .changes-info {
    color: ${({ isDark }) => (isDark ? '#ffc107' : '#f57c00')};
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .changes-actions {
    display: flex;
    gap: 0.75rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;

      &:first-child {
        background: transparent;
        color: ${({ isDark }) => (isDark ? '#ffc107' : '#f57c00')};
        border: 1px solid currentColor;

        &:hover {
          background: currentColor;
          color: white;
        }
      }

      &:last-child {
        background: ${({ isDark }) => (isDark ? '#ffc107' : '#f57c00')};
        color: white;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 193, 7, 0.3);
        }

        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

// 🎯 SISTEMA DE ABAS
export const TabContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 12px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
  animation: ${fadeIn} 0.6s ease-out;
`;

export const TabButton = styled.button<{ isDark: boolean; active: boolean }>`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: ${({ isDark, active }) => {
    if (active) return isDark ? '#37cb83' : '#27ae60';
    return 'transparent';
  }};
  color: ${({ isDark, active }) => {
    if (active) return 'white';
    return isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)';
  }};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${({ active }) => (active ? 'bold' : '500')};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ isDark, active }) => {
      if (active) return isDark ? '#37cb83' : '#27ae60';
      return isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)';
    }};
    color: ${({ active, isDark }) => {
      if (active) return 'white';
      return isDark ? '#37cb83' : '#27ae60';
    }};
  }
`;

// 📝 CARDS COMPACTOS
export const CompactCard = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.05)'};
  animation: ${fadeIn} 0.8s ease-out;
`;

export const SectionHeader = styled.div<{ isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};

  h3,
  h4 {
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
    font-size: 1.3rem;
    font-weight: bold;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const StatusBadge = styled.span<{ isDark: boolean; valid: boolean }>`
  background: ${({ isDark, valid }) => {
    if (valid) return isDark ? 'rgba(55, 203, 131, 0.2)' : 'rgba(55, 203, 131, 0.1)';
    return isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)';
  }};
  color: ${({ valid }) => (valid ? '#37cb83' : '#ff6b6b')};
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px solid ${({ valid }) => (valid ? '#37cb83' : '#ff6b6b')};
`;

export const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    background: linear-gradient(135deg, #37cb83, #27ae60);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(55, 203, 131, 0.3);
    }
  }
`;

// 📋 GRID COMPACTO
export const CompactGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const CompactLabel = styled.label<{ isDark: boolean }>`
  display: block;
  color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const CompactInput = styled.input<{ isDark: boolean; valid?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid
    ${({ isDark, valid }) => {
      if (valid === true) return '#37cb83';
      if (valid === false) return '#ff6b6b';
      return isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 8px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 0.9rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ valid }) => (valid === false ? '#ff6b6b' : '#37cb83')};
    box-shadow: 0 0 0 2px
      ${({ valid }) => (valid === false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(55, 203, 131, 0.2)')};
  }

  &::placeholder {
    color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,62,80,0.4)')};
  }
`;

export const CompactSelect = styled.select<{ isDark: boolean; valid?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid
    ${({ isDark, valid }) => {
      if (valid === true) return '#37cb83';
      if (valid === false) return '#ff6b6b';
      return isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 8px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${({ valid }) => (valid === false ? '#ff6b6b' : '#37cb83')};
    box-shadow: 0 0 0 2px
      ${({ valid }) => (valid === false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(55, 203, 131, 0.2)')};
  }

  option {
    background: ${({ isDark }) => (isDark ? '#2d3748' : '#fff')};
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  }
`;

// 🏭 LINHAS DE FAZENDA
export const FarmRow = styled.div<{ isDark: boolean; isValid?: boolean }>`
  background: ${({ isDark, isValid }) => {
    if (isValid) {
      return isDark
        ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.05), rgba(45, 52, 64, 0.8))'
        : 'linear-gradient(135deg, rgba(55, 203, 131, 0.03), rgba(255, 255, 255, 0.8))';
    }
    return isDark ? 'rgba(45, 52, 64, 0.5)' : 'rgba(255, 255, 255, 0.5)';
  }};
  border: ${({ isDark, isValid }) => {
    if (isValid) return '1px solid #37cb83';
    return isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)';
  }};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;

  .farm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h4 {
      color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
      font-size: 1.1rem;
      font-weight: bold;
      margin: 0;
    }

    .farm-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .remove-btn {
        background: linear-gradient(135deg, #ff6b6b, #e63946);
        color: white;
        border: none;
        padding: 0.25rem 0.5rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;

        &:hover {
          transform: scale(1.1);
        }
      }
    }
  }

  .crops-section {
    margin-top: 1rem;

    .crops-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;

      h5 {
        color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.9)' : 'rgba(44,62,80,0.9)')};
        font-size: 1rem;
        margin: 0;
      }

      button {
        background: rgba(55, 203, 131, 0.1);
        color: #37cb83;
        border: 1px solid #37cb83;
        padding: 0.25rem 0.75rem;
        border-radius: 6px;
        cursor: pointer;
        font-size: 0.8rem;

        &:hover {
          background: #37cb83;
          color: white;
        }
      }
    }
  }
`;

export const CropRow = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.4)' : 'rgba(255, 255, 255, 0.4)')};
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;

  .crop-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;

    span {
      color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
      font-weight: 600;
      font-size: 0.9rem;
    }

    button {
      background: transparent;
      color: #ff6b6b;
      border: 1px solid #ff6b6b;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.7rem;

      &:hover {
        background: #ff6b6b;
        color: white;
      }
    }
  }

  .crop-fields {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 0.75rem;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

export const SectionDivider = styled.hr<{ isDark: boolean }>`
  border: none;
  height: 1px;
  background: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  margin: 1.5rem 0;
`;

// 🎯 AÇÕES FLUTUANTES
export const FloatingActions = styled.div<{ isDark: boolean }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100;
  animation: ${slideInRight} 0.6s ease-out;

  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    left: 1rem;
  }
`;

export const ChangesSummary = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.95)' : 'rgba(255, 255, 255, 0.95)')};
  backdrop-filter: blur(20px);
  border: ${({ isDark }) => (isDark ? '1px solid #37cb83' : '1px solid #27ae60')};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  box-shadow: ${({ isDark }) =>
    isDark ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: ${bounce} 0.6s ease-out;

  span {
    color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    font-weight: 600;
  }

  .summary-actions {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;

      &:first-child {
        background: transparent;
        color: ${({ isDark }) => (isDark ? '#ff6b6b' : '#e63946')};
        border: 1px solid currentColor;

        &:hover {
          background: currentColor;
          color: white;
        }
      }

      &:last-child {
        background: linear-gradient(135deg, #37cb83, #27ae60);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(55, 203, 131, 0.4);
        }
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }
`;

// 🎉 ALERTAS PARA EDIÇÃO
export const SuccessBanner = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #37cb83, #27ae60);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(55, 203, 131, 0.3);
  z-index: 1000;
  animation: ${slideInRight} 0.5s ease-out;
  font-weight: 600;

  @media (max-width: 768px) {
    right: 1rem;
    left: 1rem;
  }
`;

export const ErrorBanner = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #ff6b6b, #e63946);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  z-index: 1000;
  animation: ${slideInRight} 0.5s ease-out;
  font-weight: 600;
  max-width: 400px;

  div {
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    right: 1rem;
    left: 1rem;
  }
`;

// 📄 DOCUMENT VALIDATION PARA EDIÇÃO
export const DocumentValidation = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'isValid',
})<{ isDark: boolean; isValid?: boolean }>`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  ${({ isValid, isDark }) => {
    if (isValid === false) {
      return `
       background: ${isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
       border: 1px solid rgba(255, 107, 107, 0.3);
       color: ${isDark ? '#ff6b6b' : '#e63946'};
       
       &:before {
         content: '❌';
         font-size: 0.9rem;
       }
     `;
    } else if (isValid === true) {
      return `
       background: ${isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)'};
       border: 1px solid rgba(55, 203, 131, 0.3);
       color: ${isDark ? '#37cb83' : '#27ae60'};
       
       &:before {
         content: '✅';
         font-size: 0.9rem;
       }
     `;
    } else {
      return `
       background: ${isDark ? 'rgba(90, 208, 255, 0.05)' : 'rgba(90, 208, 255, 0.03)'};
       border: 1px solid rgba(90, 208, 255, 0.2);
       color: ${isDark ? '#5ad0ff' : '#3b82f6'};
       
       &:before {
         content: 'ℹ️';
         font-size: 0.9rem;
       }
     `;
    }
  }}

  .message {
    flex: 1;
    line-height: 1.3;
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;

    &:before {
      font-size: 0.8rem;
    }
  }
`;

// 🎨 EFEITOS ADICIONAIS PARA EDIÇÃO
export const EditHighlight = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    ${({ isDark }) => (isDark ? 'rgba(55, 203, 131, 0.05)' : 'rgba(55, 203, 131, 0.02)')} 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  border-radius: inherit;

  &.active {
    opacity: 1;
    animation: shimmer 1.5s ease-out;
  }
`;

export const FormProgress = styled.div<{ isDark: boolean; progress: number }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  z-index: 1000;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${({ progress }) => progress}%;
    background: linear-gradient(90deg, #37cb83, #27ae60);
    transition: width 0.5s ease;
    border-radius: 0 2px 2px 0;
  }
`;

export const QuickStats = styled.div<{ isDark: boolean }>`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.3)' : 'rgba(255, 255, 255, 0.3)')};
  border-radius: 8px;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};

  .stat-item {
    text-align: center;
    flex: 1;

    .stat-value {
      display: block;
      font-size: 1.2rem;
      font-weight: bold;
      color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
      line-height: 1;
    }

    .stat-label {
      font-size: 0.8rem;
      color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(44,62,80,0.6)')};
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 0.25rem;
    }
  }

  @media (max-width: 768px) {
    .stat-item {
      .stat-value {
        font-size: 1rem;
      }
      .stat-label {
        font-size: 0.7rem;
      }
    }
  }
`;

export const ActionHistory = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.3)' : 'rgba(255, 255, 255, 0.3)')};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};

  .history-title {
    color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};
    font-size: 0.9rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: ${({ isDark }) =>
      isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};

    &:last-child {
      border-bottom: none;
    }

    .action-description {
      color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)')};
      font-size: 0.85rem;
    }

    .action-time {
      color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.5)' : 'rgba(44,62,80,0.5)')};
      font-size: 0.75rem;
    }
  }
`;

// 🔧 UTILITÁRIOS DE LAYOUT
export const FlexBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const FlexCenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const FlexGap = styled.div<{ gap?: string }>`
  display: flex;
  gap: ${({ gap }) => gap || '1rem'};
  align-items: center;
`;

export const TextMuted = styled.span<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.6)' : 'rgba(44,62,80,0.6)')};
  font-size: 0.9rem;
`;

export const TextSuccess = styled.span`
  color: #37cb83;
  font-weight: 600;
`;

export const TextError = styled.span`
  color: #ff6b6b;
  font-weight: 600;
`;

export const Badge = styled.span<{
  variant: 'success' | 'error' | 'warning' | 'info';
  isDark: boolean;
}>`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;

  ${({ variant, isDark }) => {
    switch (variant) {
      case 'success':
        return `
         background: ${isDark ? 'rgba(55, 203, 131, 0.2)' : 'rgba(55, 203, 131, 0.1)'};
         color: #37cb83;
         border: 1px solid #37cb83;
       `;
      case 'error':
        return `
         background: ${isDark ? 'rgba(255, 107, 107, 0.2)' : 'rgba(255, 107, 107, 0.1)'};
         color: #ff6b6b;
         border: 1px solid #ff6b6b;
       `;
      case 'warning':
        return `
         background: ${isDark ? 'rgba(255, 193, 7, 0.2)' : 'rgba(255, 193, 7, 0.1)'};
         color: #ffc107;
         border: 1px solid #ffc107;
       `;
      case 'info':
        return `
         background: ${isDark ? 'rgba(90, 208, 255, 0.2)' : 'rgba(90, 208, 255, 0.1)'};
         color: #5ad0ff;
         border: 1px solid #5ad0ff;
       `;
      default:
        return '';
    }
  }}
`;

// 📱 RESPONSIVIDADE ADICIONAL
export const MobileOnly = styled.div`
  @media (min-width: 769px) {
    display: none !important;
  }
`;

export const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

export const ResponsiveGrid = styled.div<{ minWidth?: string }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${({ minWidth }) => minWidth || '250px'}, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// 🔄 LOADING PARA EDIÇÃO - CORRIGIDO
export const LoadingOverlay = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ isDark }) => (isDark ? 'rgba(15, 20, 25, 0.9)' : 'rgba(248, 250, 252, 0.9)')};
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: ${fadeIn} 0.3s ease-out;

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid
      ${({ isDark }) => (isDark ? 'rgba(55, 203, 131, 0.2)' : 'rgba(55, 203, 131, 0.3)')};
    border-top: 4px solid #37cb83;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
    margin-bottom: 1rem;
  }

  p {
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    animation: ${pulse} 2s infinite;
  }
`;

// 🎨 ANIMAÇÃO SHIMMER (adicione no topo do arquivo, com as outras animações)
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;
