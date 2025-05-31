import styled, { keyframes } from 'styled-components';

// 🎨 ANIMAÇÕES ÉPICAS
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

const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
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

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const scaleIn = keyframes`
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
`;

// 🌄 SEÇÃO HERO
export const HeroSection = styled.div<{ isDark: boolean; isDesktop?: boolean }>`
  width: 100%;
  max-width: ${({ isDesktop }) => (isDesktop ? 'none' : '500px')};
  height: ${({ isDesktop }) => (isDesktop ? '250px' : '300px')};
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${({ isDark }) =>
    isDark
      ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(55, 203, 131, 0.2)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(55, 203, 131, 0.1)'};
  animation: ${fadeInUp} 0.8s ease-out;
  margin-bottom: ${({ isDesktop }) => (isDesktop ? '0' : '2rem')};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const HeroImageOverlay = styled.div<{ isDark: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(transparent, rgba(15, 20, 25, 0.8))'
      : 'linear-gradient(transparent, rgba(248, 250, 252, 0.8))'};
  pointer-events: none;
`;

export const ShimmerEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: ${shimmer} 1.5s infinite;
`;

// 🔍 SEÇÃO DE PESQUISA
export const SearchSection = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;

  @media (min-width: 1024px) {
    max-width: none;
    margin-bottom: 0;
  }
`;

export const SearchInputContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  border-radius: 50px;
  padding: 4px;
  box-shadow: ${({ isDark }) =>
    isDark
      ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'};
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(55, 203, 131, 0.3)' : '1px solid rgba(55, 203, 131, 0.2)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(55, 203, 131, 0.2)'
        : '0 15px 40px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(55, 203, 131, 0.1)'};
  }
`;

export const SearchInput = styled.input<{ isDark: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 16px 20px;
  font-size: 16px;
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-family: inherit;

  &::placeholder {
    color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 62, 80, 0.6)')};
  }
`;
export const RandomButton = styled.button<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.2), rgba(90, 208, 255, 0.2))'
      : 'linear-gradient(135deg, rgba(55, 203, 131, 0.1), rgba(90, 208, 255, 0.1))'};
  border: ${({ isDark }) =>
    isDark ? '2px solid rgba(55, 203, 131, 0.4)' : '2px solid rgba(55, 203, 131, 0.3)'};
  border-radius: 50px;
  padding: 12px 24px;
  color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover:not(:disabled) {
    background: ${({ isDark }) =>
      isDark
        ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.3), rgba(90, 208, 255, 0.3))'
        : 'linear-gradient(135deg, rgba(55, 203, 131, 0.2), rgba(90, 208, 255, 0.2))'};
    border-color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// 🏠 CARD DA FAZENDA
export const FarmCard = styled.div<{ isDark: boolean; isDesktop?: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: ${({ isDesktop }) => (isDesktop ? 'none' : '500px')};
  box-shadow: ${({ isDark }) =>
    isDark
      ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.8)'};
  backdrop-filter: blur(15px);
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
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
    background: linear-gradient(90deg, transparent, rgba(55, 203, 131, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover:before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }
`;

export const FarmImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

export const FarmInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const FarmNumber = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 62, 80, 0.6)')};
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const FarmName = styled.h2<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0.5rem 0;
  text-align: center;
  animation: ${slideIn} 0.6s ease-out;
`;

export const FarmType = styled.div<{ typeColor: string; isDark: boolean }>`
  background: ${({ typeColor, isDark }) =>
    isDark
      ? `linear-gradient(135deg, ${typeColor}20, ${typeColor}40)`
      : `linear-gradient(135deg, ${typeColor}40, ${typeColor}60)`};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0.5rem 0;
  border: ${({ typeColor, isDark }) =>
    isDark ? `1px solid ${typeColor}60` : `1px solid ${typeColor}80`};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const FarmDetails = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

export const FarmSize = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
`;

export const FarmLocation = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
`;

// 📊 ESTATÍSTICAS
export const FarmStats = styled.div`
  margin-top: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

export const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 2fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StatLabel = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
`;

export const StatValue = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#37cb83' : '#27ae60')};
  font-size: 1rem;
  font-weight: bold;
  min-width: 30px;
  text-align: right;
`;

export const StatBar = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(44, 62, 80, 0.1)')};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

export const StatFill = styled.div<{ percentage: number; isDark: boolean }>`
  background: linear-gradient(90deg, #37cb83, #27ae60);
  height: 100%;
  width: ${({ percentage }) => percentage}%;
  border-radius: 4px;
  transition: width 1s ease-out;
  animation: ${slideIn} 1.2s ease-out;

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

export const SectionTitle = styled.h3<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.6s ease-out;

  @media (min-width: 1024px) {
    text-align: left;
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
`;

export const MiniCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MiniCardName = styled.h4<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.3;
`;

export const MiniCardType = styled.div<{ typeColor: string; isDark: boolean }>`
  background: ${({ typeColor, isDark }) =>
    isDark
      ? `linear-gradient(135deg, ${typeColor}25, ${typeColor}45)`
      : `linear-gradient(135deg, ${typeColor}35, ${typeColor}55)`};
  color: ${({ isDark }) => (isDark ? '#fff' : '#2c3e50')};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  width: fit-content;
  border: ${({ typeColor, isDark }) =>
    isDark ? `1px solid ${typeColor}50` : `1px solid ${typeColor}70`};
`;

// 🚫 SEM RESULTADOS
export const NoResultsContainer = styled.div<{ isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  text-align: center;
  color: ${({ isDark }) => (isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  background: ${({ isDark }) => (isDark ? 'rgba(35, 39, 47, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(44, 62, 80, 0.1)'};
  animation: ${fadeInUp} 0.8s ease-out;
  transition: all 0.3s ease;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ isDark }) =>
      isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)'};
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

export const SearchButton = styled.button<{ isDark: boolean }>`
  background: linear-gradient(135deg, #37cb83, #27ae60);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 4px;
  color: white;
  box-shadow: 0 4px 15px rgba(55, 203, 131, 0.3);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.4);
    background: linear-gradient(135deg, #27ae60, #37cb83);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  /* Efeito shimmer no hover */
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transition: left 0.5s ease;
  }

  &:hover:not(:disabled):before {
    left: 100%;
  }
`;

// 🏗️ CONTAINER PRINCIPAL - LARGURA TOTAL
export const SearchContainer = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  margin-top: 50px;
  margin-bottom: 50px;
  padding: 16px; /* Padding único de 16px */
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background 0.3s ease;
  position: relative;
  overflow-x: hidden;
  width: 100%; /* Garante largura total */
  box-sizing: border-box;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  @media (min-width: 1024px) {
    padding: 16px; /* Mantém padding consistente */
    align-items: stretch;
  }
`;

// 🖥️ LAYOUT DESKTOP - LARGURA MÁXIMA
export const DesktopLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%; /* Ocupa toda a largura disponível */
  max-width: none; /* Remove limitação de largura */
  margin: 0;
  min-height: calc(100vh - 132px); /* Ajusta para o padding */
`;

export const LeftPanel = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(135deg, rgba(35, 39, 47, 0.8), rgba(26, 35, 50, 0.8))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(248, 250, 252, 0.8))'};
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 25px 50px rgba(0, 0, 0, 0.4)' : '0 25px 50px rgba(0, 0, 0, 0.08)'};
  animation: ${fadeInLeft} 0.8s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: calc(100vh - 100px); /* Evita overflow */
  overflow-y: auto; /* Scroll interno se necessário */

  /* Scrollbar personalizada para o painel esquerdo também */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #37cb83, #27ae60);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #27ae60, #37cb83);
  }
`;

export const RightPanel = styled.div<{ isDark: boolean }>`
  background: ${({ isDark }) =>
    isDark
      ? 'linear-gradient(135deg, rgba(35, 39, 47, 0.6), rgba(26, 35, 50, 0.6))'
      : 'linear-gradient(135deg, rgba(255, 255, 255, 0.6), rgba(248, 250, 252, 0.6))'};
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: ${({ isDark }) =>
    isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.03)'};
  box-shadow: ${({ isDark }) =>
    isDark ? '0 25px 50px rgba(0, 0, 0, 0.3)' : '0 25px 50px rgba(0, 0, 0, 0.05)'};
  animation: ${fadeInRight} 0.8s ease-out;
  /* Remove overflow-y daqui para evitar scrollbar dupla */
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
`;

// 🖥️ GRID DESKTOP - SEM SCROLLBAR DUPLA
export const FarmGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(300px, 1fr)
  ); /* Reduz mínimo para melhor aproveitamento */
  gap: 1.5rem;
  flex: 1; /* Ocupa o espaço restante */
  overflow-y: auto; /* Apenas UMA scrollbar aqui */
  padding-right: 0.5rem;

  /* 🎨 SCROLLBAR PERSONALIZADA ÚNICA */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #37cb83, #27ae60);
    border-radius: 3px;

    /* Animação suave no hover */
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #27ae60, #37cb83);
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #37cb83 rgba(255, 255, 255, 0.1);
`;

// 📱 MINI CARDS - OTIMIZADO PARA LARGURA TOTAL
export const MiniCard = styled.div<{ isDark: boolean; isSelected: boolean }>`
  background: ${({ isDark }) => (isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${({ isDark, isSelected }) =>
    isSelected
      ? `2px solid ${isDark ? '#37cb83' : '#27ae60'}`
      : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`};
  box-shadow: ${({ isDark, isSelected }) =>
    isSelected
      ? isDark
        ? '0 15px 35px rgba(55, 203, 131, 0.3), 0 5px 15px rgba(0, 0, 0, 0.4)'
        : '0 15px 35px rgba(55, 203, 131, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)'
      : isDark
        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
        : '0 8px 25px rgba(0, 0, 0, 0.08)'};
  animation: ${scaleIn} 0.4s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  min-height: 280px; /* Altura mínima consistente */

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      ${({ isDark }) => (isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)')},
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ isDark }) =>
      isDark
        ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }

  &:active {
    transform: translateY(-4px) scale(0.98);
  }
`;

export const MiniCardImage = styled.img`
  width: 100%;
  height: 140px; /* Altura otimizada */
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  ${MiniCard}:hover & {
    transform: scale(1.05);
  }
`;

// 🌾 SEÇÃO DE TODAS AS FAZENDAS - MOBILE
export const AllFarmsSection = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

// 🌐 GRID DE FAZENDAS - MOBILE OTIMIZADO
export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  width: 100%;
  animation: ${fadeInUp} 0.8s ease-out;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;
