import { Button } from '@components';
import styled, { keyframes } from 'styled-components';

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

const pulse = keyframes`
 0%, 100% {
   transform: scale(1);
 }
 50% {
   transform: scale(1.05);
 }
`;

const bounce = keyframes`
 0%, 20%, 50%, 80%, 100% {
   transform: translateY(0);
 }
 40% {
   transform: translateY(-10px);
 }
 60% {
   transform: translateY(-5px);
 }
`;

export const SearchBox = styled.div<{ $isDark: boolean }>`
  margin-top: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 30px;
  color: ${({ $isDark }) => ($isDark ? '#f8fafc' : '#1e293b')};
  gap: 20px;
  animation: ${pulse} 0.8s ease-out;
`;

// 🌄 SEÇÃO HERO SUPREMA
export const HeroSection = styled.div<{ $isDark: boolean; $isDesktop?: boolean }>`
  width: 100%;
  max-width: ${({ $isDesktop }) => ($isDesktop ? 'none' : '500px')};
  height: ${({ $isDesktop }) => ($isDesktop ? '250px' : '300px')};
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      : '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)'};
  animation: ${fadeInUp} 0.8s ease-out;
  margin-bottom: ${({ $isDesktop }) => ($isDesktop ? '0' : '2rem')};

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        : '0 25px 50px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.1)'};
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

export const HeroImageOverlay = styled.div<{ $isDark: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: ${({ $isDark }) =>
    $isDark
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

// 🔍 SEÇÃO DE PESQUISA SUPREMA
export const SearchSection = styled.div`
  width: 50%;
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

  @media (max-width: 540px) {
    width: 100%;
  }
`;

// 🎯 SELETOR DE TIPO DE PESQUISA
export const SearchTypeSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
`;

export const SearchTypeButton = styled.button<{ $isDark: boolean; $isActive: boolean }>`
  background: ${({ $isDark, $isActive }) =>
    $isActive
      ? $isDark
        ? 'linear-gradient(135deg, #37cb83, #10b981)'
        : 'linear-gradient(135deg, #37cb83, #10b981)'
      : $isDark
        ? 'rgba(35, 39, 47, 0.8)'
        : 'rgba(255, 255, 255, 0.8)'};
  border: ${({ $isDark, $isActive }) =>
    $isActive
      ? 'none'
      : $isDark
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(0, 0, 0, 0.1)'};
  border-radius: 12px;
  padding: 10px 12px;
  color: ${({ $isDark, $isActive }) =>
    $isActive ? '#fff' : $isDark ? 'rgba(255, 255, 255, 0.9)' : 'rgba(44, 62, 80, 0.9)'};
  font-size: 0.85rem;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : '600')};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;

  &:hover {
    transform: translateY(-2px);
    background: ${({ $isDark, $isActive }) =>
      $isActive
        ? $isDark
          ? 'linear-gradient(135deg, #10b981, #37cb83)'
          : 'linear-gradient(135deg, #10b981, #37cb83)'
        : $isDark
          ? 'rgba(45, 52, 64, 0.9)'
          : 'rgba(248, 250, 252, 0.9)'};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SearchInputContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  width: 50%;
  background: ${({ $isDark }) => ($isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  border-radius: 50px;
  padding: 4px;
  box-shadow: ${({ $isDark }) =>
    $isDark
      ? '0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      : '0 10px 30px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.8)'};
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.1)'};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:focus-within {
    border-color: #37cb83;
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 15px 40px rgba(0, 0, 0, 0.4), 0 0 0 3px rgba(55, 203, 131, 0.2)'
        : '0 15px 40px rgba(0, 0, 0, 0.15), 0 0 0 3px rgba(55, 203, 131, 0.1)'};
  }

  @media (max-width: 540px) {
    width: 100%;
  }
`;

export const SearchInput = styled.input<{ $isDark: boolean }>`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: 16px 20px;
  font-size: 16px;
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-family: inherit;

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 62, 80, 0.6)')};
  }
`;

export const SearchButton = styled.button<{ $isDark: boolean }>`
  background: linear-gradient(135deg, #37cb83, #10b981);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 4px;
  color: white;
  box-shadow: 0 4px 15px rgba(55, 203, 131, 0.3);

  &:hover:not(:disabled) {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.4);
    background: linear-gradient(135deg, #10b981, #37cb83);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

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

// 🏠 CARD DO ITEM SUPREMO
export const ItemCard = styled.div<{ $isDark: boolean; $isDesktop?: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(35, 39, 47, 0.9)' : 'rgba(255, 255, 255, 0.9)')};
  border-radius: 20px;
  padding: 2rem;
  width: 100%;
  max-width: ${({ $isDesktop }) => ($isDesktop ? 'none' : '500px')};
  box-shadow: ${({ $isDark }) =>
    $isDark
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
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2)'
        : '0 25px 50px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1)'};
  }
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
`;

export const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`;

export const ItemNumber = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(44, 62, 80, 0.6)')};
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const ItemName = styled.h2<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0.5rem 0;
  text-align: center;
  animation: ${slideIn} 0.6s ease-out;
`;

export const ItemType = styled.div<{ $typeColor: string; $isDark: boolean }>`
  background: ${({ $typeColor, $isDark }) =>
    $isDark
      ? `linear-gradient(135deg, ${$typeColor}20, ${$typeColor}40)`
      : `linear-gradient(135deg, ${$typeColor}40, ${$typeColor}60)`};
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  margin: 0.5rem 0;
  border: ${({ $typeColor, $isDark }) =>
    $isDark ? `1px solid ${$typeColor}60` : `1px solid ${$typeColor}80`};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  justify-content: center;
`;

export const ItemTypeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ItemDetails = styled.div`
  display: flex;
  gap: 2rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  justify-content: center;
`;

export const ItemSize = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const ItemLocation = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// 🎬 BOTÕES DE AÇÃO SUPREMOS
export const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const ActionButton = styled.button<{ $isDark: boolean; $variant: 'edit' | 'delete' }>`
  background: ${({ $variant, $isDark }) =>
    $variant === 'edit'
      ? $isDark
        ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.2), rgba(16, 185, 129, 0.3))'
        : 'linear-gradient(135deg, rgba(55, 203, 131, 0.1), rgba(16, 185, 129, 0.2))'
      : $isDark
        ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(231, 76, 60, 0.3))'
        : 'linear-gradient(135deg, rgba(231, 76, 60, 0.1), rgba(231, 76, 60, 0.2))'};
  border: ${({ $variant, $isDark }) =>
    $variant === 'edit'
      ? $isDark
        ? '1px solid rgba(55, 203, 131, 0.4)'
        : '1px solid rgba(55, 203, 131, 0.3)'
      : $isDark
        ? '1px solid rgba(231, 76, 60, 0.4)'
        : '1px solid rgba(231, 76, 60, 0.3)'};
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $variant }) => ($variant === 'edit' ? '#37cb83' : '#e74c3c')};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    background: ${({ $variant, $isDark }) =>
      $variant === 'edit'
        ? $isDark
          ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.3), rgba(16, 185, 129, 0.4))'
          : 'linear-gradient(135deg, rgba(55, 203, 131, 0.2), rgba(16, 185, 129, 0.3))'
        : $isDark
          ? 'linear-gradient(135deg, rgba(231, 76, 60, 0.3), rgba(231, 76, 60, 0.4))'
          : 'linear-gradient(135deg, rgba(231, 76, 60, 0.2), rgba(231, 76, 60, 0.3))'};
    transform: scale(1.1);
    animation: ${bounce} 0.6s ease;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const ItemStats = styled.div`
  margin-top: 1.5rem;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;

  /* 🔥 PERMITIR QUE CRESÇA NATURALMENTE */
  /* Remover TODAS as limitações de altura */
  padding-right: 0.5rem;

  /* 🎨 Scrollbar customizada para estatísticas - TEMA VERDE */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(55, 203, 131, 0.08);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #37cb83, #10b981);
    border-radius: 2px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #10b981, #37cb83);
  }

  /* Firefox scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #37cb83 rgba(55, 203, 131, 0.08);
`;
export const StatRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 2fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  min-height: 40px; /* 🔧 NOVA LINHA: Altura mínima para consistência */
`;

export const StatLabel = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: capitalize;
`;

export const StatValue = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#37cb83' : '#10b981')};
  font-size: 1rem;
  font-weight: bold;
  min-width: 30px;
  text-align: right;
`;

export const StatBar = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(44, 62, 80, 0.1)')};
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
`;

export const StatFill = styled.div<{ $percentage: number; $isDark: boolean }>`
  background: linear-gradient(90deg, #37cb83, #10b981);
  height: 100%;
  width: ${({ $percentage }) => Math.min($percentage, 100)}%;
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

// 📊 CONTADOR DE RESULTADOS
export const ResultsCount = styled.div<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.6s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: 1024px) {
    text-align: left;
    justify-content: flex-start;
    font-size: 1.6rem;
    margin-bottom: 2rem;
  }
`;

export const MiniCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const MiniCardName = styled.h4<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0;
  line-height: 1.3;
`;

export const MiniCardType = styled.div<{ $typeColor: string; $isDark: boolean }>`
  background: ${({ $typeColor, $isDark }) =>
    $isDark
      ? `linear-gradient(135deg, ${$typeColor}25, ${$typeColor}45)`
      : `linear-gradient(135deg, ${$typeColor}35, ${$typeColor}55)`};
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  width: fit-content;
  border: ${({ $typeColor, $isDark }) =>
    $isDark ? `1px solid ${$typeColor}50` : `1px solid ${$typeColor}70`};
  display: flex;
  align-items: center;
  gap: 0.3rem;
`;

// 🚫 SEM RESULTADOS
export const NoResultsContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  text-align: center;
  color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(44, 62, 80, 0.8)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(35, 39, 47, 0.5)' : 'rgba(255, 255, 255, 0.5)')};
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(44, 62, 80, 0.1)'};
  animation: ${fadeInUp} 0.8s ease-out;
  transition: all 0.3s ease;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 20px 40px rgba(0, 0, 0, 0.3)' : '0 20px 40px rgba(0, 0, 0, 0.1)'};
  }

  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

export const EmptyStateIcon = styled.div`
  margin-bottom: 1rem;
  opacity: 0.7;
  animation: ${bounce} 2s infinite;
`;

export const StyledButton = styled(Button)`
  width: 270px;
  justify-content: center;
  align-items: center;
`;

// 🏗️ CONTAINER PRINCIPAL
export const SearchContainer = styled.div<{ $isDark: boolean }>`
  min-height: 100vh;

  margin-bottom: 100px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    padding: 16px;
    align-items: stretch;
  }
`;

// 🖥️ LAYOUT DESKTOP SUPREMO
export const DesktopLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  width: 100%;
  max-width: none;
  margin: 0;
  min-height: calc(100vh - 132px);
`;

export const LeftPanel = styled.div<{ $isDark: boolean }>`
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.05)'};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 25px 50px rgba(0, 0, 0, 0.4)' : '0 25px 50px rgba(0, 0, 0, 0.08)'};
  animation: ${fadeInLeft} 0.8s ease-out;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #37cb83, #10b981);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #10b981, #37cb83);
  }

  @media (min-width: 720px) {
    max-height: 4000px;
  }
`;

export const RightPanel = styled.div<{ $isDark: boolean }>`
  border-radius: 24px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.03)'};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 25px 50px rgba(0, 0, 0, 0.3)' : '0 25px 50px rgba(0, 0, 0, 0.05)'};
  animation: ${fadeInRight} 0.8s ease-out;
  max-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
`;

// 🖥️ GRID DESKTOP SUPREMO
export const ItemGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #37cb83, #10b981);
    border-radius: 3px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #10b981, #37cb83);
  }

  scrollbar-width: thin;
  scrollbar-color: #37cb83 rgba(255, 255, 255, 0.1);
`;

// 📱 MINI CARDS SUPREMOS
export const MiniCard = styled.div<{ $isDark: boolean; $isSelected: boolean }>`
  background: ${({ $isDark }) => ($isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: ${({ $isDark, $isSelected }) =>
    $isSelected
      ? `2px solid ${$isDark ? '#37cb83' : '#10b981'}`
      : `1px solid ${$isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`};
  box-shadow: ${({ $isDark, $isSelected }) =>
    $isSelected
      ? $isDark
        ? '0 15px 35px rgba(55, 203, 131, 0.3), 0 5px 15px rgba(0, 0, 0, 0.4)'
        : '0 15px 35px rgba(55, 203, 131, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1)'
      : $isDark
        ? '0 8px 25px rgba(0, 0, 0, 0.3)'
        : '0 8px 25px rgba(0, 0, 0, 0.08)'};
  animation: ${scaleIn} 0.4s ease-out;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
  min-height: 380px;
  max-height: 420px;

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
      ${({ $isDark }) => ($isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)')},
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover:before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 20px 40px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }

  &:active {
    transform: translateY(-4px) scale(0.98);
  }
`;

export const MiniCardImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;

  ${MiniCard}:hover & {
    transform: scale(1.05);
  }
`;

// 🌾 SEÇÃO DE TODOS OS ITENS - MOBILE
export const AllItemsSection = styled.div`
  margin-top: 2rem;
  width: 100%;
`;

// 🌐 GRID DE ITENS - MOBILE OTIMIZADO
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

// 🎯 EXPORTAÇÕES ADICIONAIS PARA COMPATIBILIDADE
export const SectionTitle = styled.h3<{ $isDark: boolean }>`
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
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

// 🎨 ANIMAÇÕES DO LOADING SUPREMO
const spinRings = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const fadeInScale = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const dotPulse = keyframes`
  0%, 20% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  80%, 100% {
    opacity: 0;
  }
`;

const shimmerGlow = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// 🌟 OVERLAY DE LOADING SUPREMO
export const LoadingOverlay = styled.div<{ $isDark: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(135deg, rgba(15, 20, 25, 0.95), rgba(26, 35, 50, 0.95))'
      : 'linear-gradient(135deg, rgba(248, 250, 252, 0.95), rgba(255, 255, 255, 0.95))'};
  backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  animation: ${fadeInScale} 0.5s ease-out;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ $isDark }) =>
      $isDark
        ? 'radial-gradient(circle at center, rgba(52, 152, 219, 0.1) 0%, transparent 70%)'
        : 'radial-gradient(circle at center, rgba(52, 152, 219, 0.05) 0%, transparent 70%)'};
    animation: ${shimmerGlow} 3s ease-in-out infinite;
  }
`;

export const LoadingSpinner = styled.div<{ $isDark: boolean }>`
  position: relative;
  width: 80px;
  height: 80px;
  z-index: 1;

  .spinner-ring {
    position: absolute;
    border: 3px solid transparent;
    border-radius: 50%;
    animation: ${spinRings} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

    &:nth-child(1) {
      width: 80px;
      height: 80px;
      border-top: 3px solid ${({ $isDark }) => ($isDark ? '#3498db' : '#2980b9')};
      animation-delay: -0.45s;
    }

    &:nth-child(2) {
      width: 64px;
      height: 64px;
      top: 8px;
      left: 8px;
      border-top: 3px solid ${({ $isDark }) => ($isDark ? '#27ae60' : '#219a52')};
      animation-delay: -0.3s;
    }

    &:nth-child(3) {
      width: 48px;
      height: 48px;
      top: 16px;
      left: 16px;
      border-top: 3px solid ${({ $isDark }) => ($isDark ? '#f39c12' : '#e67e22')};
      animation-delay: -0.15s;
    }
  }
`;

export const LoadingText = styled.div<{ isDark: boolean }>`
  color: ${({ isDark }) => (isDark ? '#fff' : '#27ae60')};
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.2rem;
`;

export const LoadingDots = styled.div`
  display: flex;
  gap: 0.1rem;

  span {
    animation: ${dotPulse} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }

    &:nth-child(2) {
      animation-delay: -0.16s;
    }

    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

// 🎯 ALIASES PARA COMPATIBILIDADE COM CÓDIGO ANTIGO
export const FarmCard = ItemCard;
export const FarmDetails = ItemDetails;
export const FarmGrid = ItemGrid;
export const FarmImage = ItemImage;
export const FarmInfo = ItemInfo;
export const FarmLocation = ItemLocation;
export const FarmName = ItemName;
export const FarmNumber = ItemNumber;
export const FarmSize = ItemSize;
export const FarmStats = ItemStats;
export const FarmType = ItemType;
