import styled, { keyframes } from 'styled-components';

// 🎬 ANIMAÇÕES
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

// 📦 CONTAINER PRINCIPAL
export const StatsHeaderContainer = styled.div<{ $isDark: boolean }>`
  position: relative;
  border-radius: 20px;
  margin-bottom: 2rem;
  overflow: hidden;
  border: ${({ $isDark }) =>
    $isDark ? '1px solid rgba(55, 203, 131, 0.2)' : '1px solid rgba(55, 203, 131, 0.1)'};
  box-shadow: ${({ $isDark }) =>
    $isDark ? '0 20px 40px rgba(0, 0, 0, 0.4)' : '0 20px 40px rgba(0, 0, 0, 0.08)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.8s ease-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ $isDark }) =>
      $isDark
        ? '0 25px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(55, 203, 131, 0.3)'
        : '0 25px 50px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(55, 203, 131, 0.2)'};
  }

  min-height: 320px;

  @media (max-width: 768px) {
    border-radius: 16px;
    margin-bottom: 1.5rem;
  }
`;

// 🖼️ CONTAINER DA IMAGEM DE FUNDO
export const BackgroundImageContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  z-index: 1;

  img {
    width: 100%;
    height: 100%;

    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: 0.3; /* 🎯 IMAGEM MAIS OPACA IGUAL AO PRINT */
  }

  ${StatsHeaderContainer}:hover & img {
    transform: scale(1.1);
    opacity: 0.7; /* 🎯 LEVE AUMENTO NA OPACIDADE NO HOVER */
  }
`;

// 📄 OVERLAY DE CONTEÚDO - MAIS ESCURO

export const ContentOverlay = styled.div<{ $isDark: boolean; $hasBackground: boolean }>`
  position: relative;
  z-index: 2;
  padding: 2rem;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* 🔥 ESCURECIMENTO SUTIL E PROGRESSIVO */
  background: ${({ $isDark, $hasBackground }) => {
    if ($hasBackground) {
      return `linear-gradient(
        180deg, 
        rgba(0, 0, 0, 0.2) 0%, 
        rgba(0, 0, 0, 0.4) 50%, 
        rgba(0, 0, 0, 0.75) 100%
      )`;
    }
    return 'none';
  }};

  /* 🎯 REFORÇO NO BOTTOM PARA A BARRA */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
    pointer-events: none;
    z-index: 1;
  }

  > * {
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;
// 📊 GRID DE ESTATÍSTICAS
export const StatsGrid = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: auto; /* 🎯 EMPURRA O PROGRESSO PARA BAIXO */

  @media (max-width: 768px) {
    gap: 0.8rem;
  }
`;

// 📋 CARD DE ESTATÍSTICA - MAIS DESTACADO
export const StatCard = styled.div<{ $isDark: boolean }>`
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(44, 62, 80, 0.85)' : 'rgba(236, 240, 241, 0.85)'};
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  min-width: 100px;
  backdrop-filter: blur(10px);
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
    background: linear-gradient(90deg, transparent, rgba(55, 203, 131, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.3);
    border-color: #27ae60;

    &:before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    padding: 0.8rem 1rem;
    min-width: 80px;
  }
`;

// 🔢 VALOR DA ESTATÍSTICA
export const StatValue = styled.span<{ $isDark: boolean }>`
  font-size: 1.8rem;
  font-weight: bold;

  line-height: 1;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

// 🏷️ LABEL DA ESTATÍSTICA
export const StatLabel = styled.span<{ $isDark: boolean }>`
  font-size: 0.85rem;
  font-weight: 600;

  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

// 📈 SEÇÃO DE PROGRESSO
export const ProgressSection = styled.div<{ $hasBackground?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: auto;

  /* 🔥 SOBRESCREVER COR DO TEXTO QUANDO TEM IMAGEM */
  ${({ $hasBackground }) =>
    $hasBackground &&
    `
    & > div > div:last-child {
      color: #ffffff !important;
      
      span {
        color: #ffffff !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }
      
      span:last-child {
        color: #ffffff !important;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
      }
    }
  `}
`;

// src/components/StatsHeader/styles.ts

export const ProgressLabel = styled.div<{ $isDark: boolean; $hasBackground?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  /* 🔥 CORES INVERTIDAS: ESCURO NO LIGHT, CLARO NO DARK */
  color: ${({ $hasBackground, $isDark }) => {
    if ($hasBackground) return '#f8fafc'; // BRANCO SUAVE COM IMAGEM
    return $isDark ? '#e2e8f0' : '#1e293b'; // CLARO NO DARK, ESCURO NO LIGHT
  }};

  text-shadow: ${({ $hasBackground }) =>
    $hasBackground ? '2px 2px 4px rgba(0, 0, 0, 0.8)' : 'none'};

  .percentage {
    font-weight: 800;
    font-size: 1.1rem;

    /* 🔥 PORCENTAGEM COM CORES INVERTIDAS */
    color: ${({ $hasBackground, $isDark }) => {
      if ($hasBackground) return '#f1f5f9'; // BRANCO SUAVE COM IMAGEM
      return $isDark ? '#f1f5f9' : '#0f172a'; // CLARO NO DARK, ESCURO NO LIGHT
    }};
  }
`;
