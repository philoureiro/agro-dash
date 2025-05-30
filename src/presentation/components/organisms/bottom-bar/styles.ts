// src/presentation/components/styles.ts
import styled from 'styled-components';

import { colors } from '../../../theme/colors';

// Ajuste o caminho para o seu arquivo de cores

export const GlassBar = styled.nav<{ themeMode?: string }>`
  /* 1. Definir altura fixa e gerenciar o espaço extra APENAS com padding */
  height: 70px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  display: flex;
  justify-content: space-around;
  align-items: center;

  /* 2. Definir o padding inicial, incluindo a safe area no padding-bottom */
  padding: 0.7rem 0 calc(0.7rem + env(safe-area-inset-bottom));
  box-sizing: border-box; /* Garante que padding não aumente a altura total */

  background: ${({ themeMode }) =>
    themeMode === 'dark'
      ? `linear-gradient(135deg, 
          rgba(20, 25, 20, 0.25) 0%,
          rgba(35, 40, 35, 0.15) 50%,
          rgba(25, 30, 25, 0.20) 100%
        )`
      : `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.35) 0%,
          rgba(255, 255, 255, 0.20) 50%,
          rgba(248, 250, 248, 0.30) 100%
        )`};

  border-top: 1px solid
    ${({ themeMode }) =>
      themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.40)'};

  border-radius: 20px 20px 0 0;

  backdrop-filter: blur(25px) saturate(180%) brightness(110%);
  -webkit-backdrop-filter: blur(25px) saturate(180%) brightness(110%);

  box-shadow: ${({ themeMode }) =>
    themeMode === 'dark'
      ? `0 -4px 20px rgba(0, 0, 0, 0.25),
         0 -1px 10px rgba(0, 0, 0, 0.15),
         inset 0 1px 0 rgba(255, 255, 255, 0.05)`
      : `0 -4px 20px rgba(0, 0, 0, 0.08),
         0 -1px 10px rgba(0, 0, 0, 0.05),
         inset 0 1px 0 rgba(255, 255, 255, 0.60)`};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ themeMode }) =>
      themeMode === 'dark' ? 'rgba(15, 20, 15, 0.10)' : 'rgba(255, 255, 255, 0.15)'};
    border-radius: inherit;
    pointer-events: none;
  }

  /* 3. Ajustar o padding para telas menores, mantendo a lógica da safe area */
  @media (max-width: 540px) {
    padding-top: 0.35rem;
    padding-bottom: calc(0.35rem + env(safe-area-inset-bottom));
  }
`;

export const BarItem = styled.button<{ active: boolean; themeMode?: string }>`
  position: relative;
  background: none;
  border: none;
  outline: none;
  font-size: 1.68rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.14rem;
  cursor: pointer;
  z-index: 1;
  min-width: 64px;
  min-height: 64px;
  justify-content: center;

  color: ${({ active, themeMode }) => {
    if (active) return colors.activeGreen;
    return themeMode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(120, 120, 120, 0.92)';
  }};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${({ active, themeMode }) =>
    active &&
    `
    &::before {
      content: '';
      position: absolute;
      width: 85px;
      height: 60px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: ${themeMode === 'dark' ? 'rgba(52, 217, 114, 0.12)' : 'rgba(52, 217, 114, 0.18)'};
      border-radius: 14px;
      backdrop-filter: blur(10px);
      z-index: -1;
      opacity: 0.8;
      border: ${themeMode === 'dark' ? 'none' : '1px solid rgba(52, 217, 114, 0.25)'};
    }
  `}

  &:hover {
    color: ${colors.activeGreen};
    transform: translateY(-1px);

    &::after {
      content: '';
      position: absolute;
      width: 85px;
      height: 52px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: rgba(52, 217, 114, 0.06);
      border-radius: 12px;
      z-index: -1;
      opacity: 0.6;
    }
  }

  &:active {
    transform: translateY(0);
  }
`;

export const Label = styled.span`
  font-size: 0.84rem;
  font-weight: 500;
  margin-top: 2px;
  letter-spacing: 0.015em;
  color: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0.93;
`;
