import styled from 'styled-components';

import { colors } from '../../../theme/colors';

export const GlassBar = styled.nav<{ themeMode?: string }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  display: flex;
  justify-content: space-around;
  align-items: center;

  /* Altura base */
  height: 70px;
  padding: 0.7rem 0;

  /* Safe area para iPhone */
  padding-bottom: max(0.7rem, env(safe-area-inset-bottom));

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

  /* Mobile responsivo (site normal) */
  @media (max-width: 540px) {
    padding: 0.35rem 0;
    padding-bottom: max(0.35rem, env(safe-area-inset-bottom));
  }

  /* PWA standalone mode */
  @media (display-mode: standalone) {
    /* PWA Desktop/Windows - qualquer tamanho */
    height: 60px;
    padding: 0.4rem 0;
    padding-bottom: max(0.4rem, env(safe-area-inset-bottom));

    /* PWA Mobile iOS específico - só iOS precisa de altura maior */
    @supports (-webkit-touch-callout: none) {
      @media (max-width: 540px) {
        padding: 1.2rem 0;
        padding-bottom: calc(1.2rem + env(safe-area-inset-bottom));
        height: 95px;
      }
    }
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

  /* Margins padrão */
  margin-top: 4px;
  margin-bottom: 4px;

  /* Remove user select e highlight para mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  color: ${({ active, themeMode }) => {
    if (active) return colors.activeGreen;
    return themeMode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(120, 120, 120, 0.92)';
  }};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* PWA standalone mode */
  @media (display-mode: standalone) {
    /* PWA Desktop/Windows - padrão para qualquer tamanho */
    margin-top: 6px;
    margin-bottom: 6px;
    min-height: 48px;
    font-size: 1.5rem;

    /* PWA Mobile iOS específico - só iOS precisa de margins maiores */
    @supports (-webkit-touch-callout: none) {
      @media (max-width: 540px) {
        margin-top: 25px;
        margin-bottom: 20px;
        font-size: 1.4rem;
        min-height: 50px;
      }
    }
  }

  /* Ajustes para iOS browser (não PWA) */
  @supports (-webkit-touch-callout: none) {
    margin-top: 18px;
    margin-bottom: 8px;
    font-size: 1.6rem;
  }

  /* Efeito de seleção */
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
      border-radius: 10px;
      backdrop-filter: blur(10px);
      z-index: -1;
      opacity: 0.8;
      border: ${themeMode === 'dark' ? 'none' : '1px solid rgba(52, 217, 114, 0.25)'};
    }
  `}

  /* Badge ajustada para PWA */
  @media (display-mode: standalone) {
    /* PWA Desktop/Windows - badge padrão */
    ${({ active }) =>
      active &&
      `
      &::before {
        width: 75px !important;
        height: 45px !important;
        border-radius: 8px !important;
      }
    `}

    /* PWA Mobile iOS específico - badge maior só no iOS */
    @supports (-webkit-touch-callout: none) {
      @media (max-width: 540px) {
        ${({ active }) =>
          active &&
          `
          &::before {
            width: 85px !important;
            height: 60px !important;
            border-radius: 8px !important;
          }
        `}
      }
    }
  }

  /* Hover apenas em dispositivos com cursor */
  @media (hover: hover) {
    &:hover {
      color: ${colors.activeGreen};
      transform: translateY(-1px);

      &::after {
        content: '';
        position: absolute;
        width: 70px;
        height: 42px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        background: rgba(52, 217, 114, 0.06);
        border-radius: 8px;
        z-index: -1;
        opacity: 0.6;
      }
    }
  }

  /* Active para touch devices */
  &:active {
    transform: translateY(0);
    background: rgba(52, 217, 114, 0.05);
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

  /* PWA standalone mode */
  @media (display-mode: standalone) {
    /* PWA Desktop/Windows - padrão */
    font-size: 0.8rem;
    margin-top: 1px;

    /* PWA Mobile iOS específico - fonte menor só no iOS */
    @supports (-webkit-touch-callout: none) {
      @media (max-width: 540px) {
        font-size: 0.7rem;
        margin-top: -2px;
      }
    }
  }

  /* Ajustes para iOS browser */
  @supports (-webkit-touch-callout: none) {
    font-size: 0.8rem;
    margin-top: 1px;
  }
`;
