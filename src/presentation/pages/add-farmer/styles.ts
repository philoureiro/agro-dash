import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES CINEMATOGRÁFICAS
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

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
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

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    transform: translate3d(0, 0, 0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const progressAnimation = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress); }
`;

const floatIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
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

// 🏗️ CONTAINER PRINCIPAL
export const FormContainer = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  padding: 16px;

  position: relative;
  overflow-x: hidden;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ isDark }) =>
      isDark
        ? 'radial-gradient(circle at 20% 50%, rgba(55, 203, 131, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(90, 208, 255, 0.1) 0%, transparent 50%)'
        : 'radial-gradient(circle at 20% 50%, rgba(55, 203, 131, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(90, 208, 255, 0.05) 0%, transparent 50%)'};
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

// 🌄 SEÇÃO HERO DINÂMICA
export const HeroSection = styled.div<{ isDark: boolean }>`
  width: 100%;
  height: 300px;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: ${({ isDark }) =>
    isDark
      ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(55, 203, 131, 0.2)'
      : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(55, 203, 131, 0.1)'};
  animation: ${fadeInUp} 0.8s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 30px 60px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }

  @media (min-width: 768px) {
    height: 400px;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  ${HeroSection}:hover & {
    transform: scale(1.05);
  }
`;

export const HeroImageOverlay = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(135deg, rgba(15, 20, 25, 0.7), rgba(26, 35, 50, 0.8))'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.7), rgba(226, 232, 240, 0.8))'};
  pointer-events: none;
`;

// 📊 CONTADORES ANIMADOS
export const AnimatedCounter = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  backdrop-filter: blur(15px);
  border-radius: 12px;
  padding: 0.8rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
  animation: ${floatIn} 0.6s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px) scale(1.05);
    animation: ${pulse} 0.6s ease-in-out;
  }

  strong {
    font-size: 1.5rem;
    font-weight: bold;
    color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    line-height: 1;
  }

  span {
    font-size: 0.8rem;
    color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

// 📈 BARRA DE PROGRESSO
export const ProgressBar = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  height: 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;

  span {
    position: absolute;
    right: 10px;
    top: -25px;
    font-size: 0.8rem;
    color: white;
    font-weight: bold;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
`;

export const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(90deg, #37cb83, #27ae60, #37cb83);
  background-size: 200% 100%;
  border-radius: 4px;
  transition: width 1s ease-out;
  animation:
    ${progressAnimation} 1.5s ease-out,
    ${shimmer} 2s infinite;
  width: ${({ progress }) => progress}%;

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
`;

// 📝 SEÇÃO DO FORMULÁRIO
export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const FormCard = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
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
`;

export const SectionTitle = styled.h2<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
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
`;

// 📋 GRID DO FORMULÁRIO
export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// 🎯 GRUPO DE INPUT
export const InputGroup = styled.div`
  position: relative;
  animation: ${fadeInUp} 0.6s ease-out;

  &:hover {
    transform: translateY(-2px);
  }

  transition: transform 0.2s ease;
`;

export const FloatingLabel = styled.label<{ isDark: boolean; active: boolean }>`
  position: absolute;
  left: 16px;
  top: ${({ active }) => (active ? '8px' : '50%')};
  transform: translateY(-50%);
  font-size: ${({ active }) => (active ? '0.8rem' : '1rem')};
  color: ${({ isDark, active }) => {
    if (active) return isDark ? '#37cb83' : '#27ae60';
    return isDark ? 'rgba(255,255,255,0.6)' : 'rgba(44,62,80,0.6)';
  }};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  background: ${({ isDark }) => (isDark ? '#23272f' : '#fff')};
  padding: 0 4px;
  font-weight: 500;
  z-index: 2;

  @media (max-width: 768px) {
    font-size: 12px;
    left: 0px;
    width: 100%;
  }
`;

export const StyledInput = styled.input<{ isDark: boolean }>`
  width: 100%;
  padding: 16px;
  border: 2px solid ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  border-radius: 12px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  &:focus {
    outline: none;
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    box-shadow: ${({ isDark }) =>
      isDark ? '0 0 0 3px rgba(55, 203, 131, 0.2)' : '0 0 0 3px rgba(39, 174, 96, 0.1)'};
    animation: ${glowPulse} 2s infinite;
  }

  &:hover {
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: transparent;
  }
`;

export const StyledSelect = styled.select<{ isDark: boolean }>`
  width: 100%;
  padding: 16px;
  border: 2px solid ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  border-radius: 12px;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    box-shadow: ${({ isDark }) =>
      isDark ? '0 0 0 3px rgba(55, 203, 131, 0.2)' : '0 0 0 3px rgba(39, 174, 96, 0.1)'};
  }

  &:hover {
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    transform: translateY(-1px);
  }

  option {
    background: ${({ isDark }) => (isDark ? '#2d3748' : '#fff')};
    color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  }
`;

// 🏭 CARD DA FAZENDA
export const FarmCard = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(26, 35, 50, 0.8)' : 'rgba(248, 250, 252, 0.8)')};
  border-radius: 16px;
  padding: 2rem;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(55, 203, 131, 0.2)' : '1px solid rgba(55, 203, 131, 0.1)'};
  margin-bottom: 2rem;
  backdrop-filter: blur(15px);
  animation: ${slideInRight} 0.6s ease-out;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #37cb83, #27ae60);
    border-radius: 16px 16px 0 0;
  }

  &:hover {
    transform: translateX(5px);
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    box-shadow: ${({ isDark }) =>
      isDark ? '0 15px 30px rgba(0, 0, 0, 0.3)' : '0 15px 30px rgba(0, 0, 0, 0.1)'};
  }
`;

export const FarmHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const FarmNumber = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
  font-size: 1.2rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:before {
    content: '🏭';
    font-size: 1.5rem;
  }
`;

// 🖼️ PREVIEW DA FAZENDA
export const FarmPreview = styled.div<{ isDark: boolean }>`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  border-radius: 12px;
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};
  animation: ${fadeInUp} 0.6s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const PreviewImage = styled.img`
  width: 120px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    height: 120px;
  }
`;

export const PreviewInfo = styled.div`
  flex: 1;

  h4 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    font-weight: bold;
  }

  p {
    margin: 0.2rem 0;
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

// 🌱 CARD DE CULTURA
export const CulturaCard = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.6)' : 'rgba(255, 255, 255, 0.6)')};
  border-radius: 12px;

  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.05)' : '1px solid rgba(0, 0, 0, 0.03)'};
  margin-bottom: 1rem;
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.4s ease-out;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ isDark }) =>
      isDark ? '0 8px 25px rgba(0, 0, 0, 0.2)' : '0 8px 25px rgba(0, 0, 0, 0.05)'};
  }
`;

// ⚠️ VALIDAÇÃO DE ÁREAS
export const AreaValidation = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
  border: 2px solid rgba(255, 107, 107, 0.3);
  border-radius: 8px;
  padding: 1rem;
  color: ${({ isDark }) => (isDark ? '#ff6b6b' : '#e63946')};
  font-weight: 500;
  margin-top: 1rem;
  animation: ${bounce} 0.6s ease-out;
  backdrop-filter: blur(10px);
`;

// 🔘 BOTÕES
export const AddButton = styled.button<{ isDark: boolean }>`
  background: linear-gradient(135deg, #37cb83, #27ae60);
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(55, 203, 131, 0.3);
  position: relative;
  overflow: hidden;

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

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.4);
    animation: ${pulse} 0.6s ease-in-out;

    &:before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export const RemoveButton = styled.button<{ isDark: boolean }>`
  background: linear-gradient(135deg, #ff6b6b, #e63946);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const SubmitButton = styled.button<{ isDark: boolean }>`
  background: linear-gradient(135deg, #37cb83, #27ae60);
  border: none;
  border-radius: 16px;
  padding: 18px 48px;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  box-shadow: 0 8px 25px rgba(55, 203, 131, 0.3);
  position: relative;
  overflow: hidden;
  min-height: 60px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
    transition: left 0.6s ease;
  }

  &:hover:not(:disabled) {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 12px 35px rgba(55, 203, 131, 0.4);

    &:before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(-2px) scale(0.98);
  }

  &:disabled {
    opacity: 0.8;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SaveDraftButton = styled.button<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(90, 208, 255, 0.1)' : 'rgba(90, 208, 255, 0.05)')};
  border: 2px solid ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
  border-radius: 12px;
  padding: 12px 24px;
  color: ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({ isDark }) => (isDark ? '#5ad0ff' : '#3b82f6')};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(90, 208, 255, 0.3);
  }
`;

// 🎯 AÇÕES DO FORMULÁRIO
export const FormActions = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
`;

// 🎉 ALERTAS
export const SuccessAlert = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #37cb83, #27ae60);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(55, 203, 131, 0.3);
  z-index: 1000;
  animation:
    ${slideInRight} 0.5s ease-out,
    ${bounce} 0.6s ease-out 0.5s;
  font-weight: bold;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const ErrorAlert = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 100px;
  right: 20px;
  background: linear-gradient(135deg, #ff6b6b, #e63946);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  z-index: 1000;
  animation: ${slideInRight} 0.5s ease-out;
  font-weight: bold;
  max-width: 400px;

  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;

// 🔄 LOADING SPINNER
export const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// 🎯 ÍCONE DE BOTÃO
export const IconButton = styled.button<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)')};
  border: 1px solid ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};

  &:hover {
    background: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(55, 203, 131, 0.3);
  }
`;

// 💡 TOOLTIP
export const Tooltip = styled.div<{ isDark: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: ${({ isDark }) => (isDark ? '#2d3748' : '#4a5568')};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  z-index: 10;

  &:before {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: ${({ isDark }) => (isDark ? '#2d3748' : '#4a5568')};
  }

  ${IconButton}:hover & {
    opacity: 1;
    bottom: calc(100% + 10px);
  }
`;

// 📊 INDICADOR DE ETAPAS
export const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
  animation: ${fadeInUp} 0.6s ease-out;
`;

export const StepDot = styled.div<{ isDark: boolean; active: boolean; completed: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ isDark, active, completed }) => {
    if (completed) return '#37cb83';
    if (active) return isDark ? '#5ad0ff' : '#3b82f6';
    return isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)';
  }};
  transition: all 0.3s ease;
  position: relative;

  ${({ active }) =>
    active &&
    `
    animation: ${pulse} 2s infinite;
    box-shadow: 0 0 10px currentColor;
  `}

  ${({ completed }) =>
    completed &&
    `
    &:after {
      content: '✓';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: white;
      font-size: 8px;
      font-weight: bold;
    }
  `}
`;

export const StepLine = styled.div<{ isDark: boolean; completed: boolean }>`
  height: 2px;
  width: 40px;
  background: ${({ isDark, completed }) =>
    completed ? '#37cb83' : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  transition: all 0.5s ease;
`;

// 📱 RESPONSIVIDADE ADICIONAL
export const ResponsiveText = styled.span<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

// 🎨 CONTAINER DE CORES DINÂMICAS
export const ColorAccent = styled.div<{ color: string }>`
  width: 4px;
  height: 100%;
  background: linear-gradient(135deg, ${({ color }) => color}, ${({ color }) => color}88);
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0 4px 4px 0;
`;

// 🌟 EFEITO DE DESTAQUE
export const HighlightEffect = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    transparent 30%,
    ${({ isDark }) => (isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)')} 50%,
    transparent 70%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;

  &.active {
    opacity: 1;
    animation: ${shimmer} 1.5s ease-out;
  }
`;

// 📏 MEDIDORES DE ÁREA
export const AreaMeter = styled.div<{ isDark: boolean; percentage: number }>`
  width: 100%;
  height: 8px;
  background: ${({ isDark }) => (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  border-radius: 4px;
  overflow: hidden;
  margin: 0.5rem 0;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${({ percentage }) => Math.min(percentage, 100)}%;
    background: ${({ percentage }) =>
      percentage > 100
        ? 'linear-gradient(90deg, #ff6b6b, #e63946)'
        : 'linear-gradient(90deg, #37cb83, #27ae60)'};
    border-radius: 4px;
    transition: all 0.5s ease;
    animation: ${({ percentage }) => (percentage > 100 ? pulse : 'none')} 1s infinite;
  }
`;

// 🎭 MÁSCARA DE CARREGAMENTO
export const LoadingMask = styled.div<{ isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ isDark }) => (isDark ? 'rgba(15, 20, 25, 0.8)' : 'rgba(248, 250, 252, 0.8)')};
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: ${fadeInUp} 0.3s ease-out;

  .spinner {
    width: 60px;
    height: 60px;
    border: 4px solid rgba(55, 203, 131, 0.2);
    border-top: 4px solid #37cb83;
    border-radius: 50%;
    animation: ${spin} 1s linear infinite;
  }
`;

// 🎯 ESTATÍSTICAS INLINE
export const InlineStats = styled.div<{ isDark: boolean }>`
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

    .value {
      font-weight: bold;
      font-size: 1.1em;
    }
  }
`;

// 🌅 GRADIENTE ANIMADO PARA FUNDOS
export const AnimatedBackground = styled.div<{ isDark: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(45deg, #0f1419, #1a2332, #26435f, #1a2332, #0f1419)'
      : 'linear-gradient(45deg, #f8fafc, #e2e8f0, #cbd5e0, #e2e8f0, #f8fafc)'};
  background-size: 400% 400%;
  animation: ${shimmer} 15s ease infinite;
  opacity: 0.3;
  pointer-events: none;
`;

// 🔥 EFEITO GLASSMORPHISM
export const GlassEffect = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.25)'};
  backdrop-filter: blur(20px);
  border: 1px solid
    ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)')};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)'};
`;
