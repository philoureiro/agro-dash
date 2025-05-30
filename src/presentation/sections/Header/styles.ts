import styled from 'styled-components';

export const GlassHeader = styled.header<{ themeMode?: string }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1200;

  /* Adiciona padding top para safe area do iPhone */
  padding-top: env(safe-area-inset-top);

  /* Glassmorphism */
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

  /* Borda sutil */
  border-bottom: 1px solid
    ${({ themeMode }) =>
      themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.40)'};

  /* Blur */
  backdrop-filter: blur(25px) saturate(180%) brightness(110%);
  -webkit-backdrop-filter: blur(25px) saturate(180%) brightness(110%);

  /* Sombra */
  box-shadow: ${({ themeMode }) =>
    themeMode === 'dark'
      ? `0 4px 20px rgba(0, 0, 0, 0.25),
         0 1px 10px rgba(0, 0, 0, 0.15),
         inset 0 -1px 0 rgba(255, 255, 255, 0.05)`
      : `0 4px 20px rgba(0, 0, 0, 0.08),
         0 1px 10px rgba(0, 0, 0, 0.05),
         inset 0 -1px 0 rgba(255, 255, 255, 0.60)`};

  /* Overlay para transparência */
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

  /* Padding ajustado */
  padding: calc(0.25rem + env(safe-area-inset-top)) 1rem 0.25rem 1rem;
`;

export const HeaderContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

export const LeftSection = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

export const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

export const TitleButton = styled.button<{ themeMode?: string }>`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.02em;

  /* Remove user select para mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* Cores adaptativas */
  color: ${({ themeMode }) =>
    themeMode === 'dark' ? 'rgba(255, 255, 255, 0.90)' : 'rgba(52, 58, 64, 0.95)'};

  /* Transições */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover apenas em dispositivos com cursor */
  @media (hover: hover) {
    &:hover {
      background: ${({ themeMode }) =>
        themeMode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(52, 217, 114, 0.08)'};
      transform: translateY(-1px);
    }
  }

  /* Active para touch devices */
  &:active {
    transform: translateY(0);
    background: ${({ themeMode }) =>
      themeMode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(52, 217, 114, 0.05)'};
  }
`;

export const ActionButton = styled.button<{ themeMode?: string }>`
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  min-height: 48px;

  /* Remove user select e highlight para mobile */
  -webkit-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  /* Cores adaptativas */
  color: ${({ themeMode }) =>
    themeMode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(120, 120, 120, 0.92)'};

  /* Transições */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Hover apenas em dispositivos com cursor (desktop) */
  @media (hover: hover) {
    &:hover {
      color: #34d972;
      background: ${({ themeMode }) =>
        themeMode === 'dark' ? 'rgba(52, 217, 114, 0.12)' : 'rgba(52, 217, 114, 0.15)'};
      transform: translateY(-1px);
    }
  }

  /* Active para touch devices */
  &:active {
    transform: translateY(0);
    background: ${({ themeMode }) =>
      themeMode === 'dark' ? 'rgba(52, 217, 114, 0.08)' : 'rgba(52, 217, 114, 0.10)'};
  }
`;

export const Divider = styled.div<{ themeMode?: string }>`
  width: 1px;
  height: 24px;
  margin: 0 0.5rem;
  background: ${({ themeMode }) =>
    themeMode === 'dark' ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)'};
`;

export const Tooltip = styled.div`
  position: relative;

  /* Tooltip apenas em dispositivos com hover (desktop) */
  @media (hover: hover) {
    &:hover::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: -2.5rem;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      font-size: 0.75rem;
      white-space: nowrap;
      z-index: 1000;
      opacity: 0;
      animation: fadeIn 0.2s ease-in-out forwards;
      pointer-events: none;
    }

    @keyframes fadeIn {
      to {
        opacity: 1;
      }
    }
  }
`;
