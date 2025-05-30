import styled from 'styled-components';

const activeGreen = '#34d972';

export const GlassBar = styled.nav<{ themeMode?: string }>`
  height: 70px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.7rem 0;

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

  @media (max-width: 540px) {
    padding: 0.35rem 0;
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
  /* Tamanho fixo para manter consistência */
  min-width: 64px;
  min-height: 64px;
  justify-content: center;

  color: ${({ active, themeMode }) => {
    if (active) return activeGreen;
    return themeMode === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(120, 120, 120, 0.92)'; // Cinza para tema claro
  }};

  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    color: ${activeGreen};
    transform: translateY(-1px);

    &::after {
      content: '';
      position: absolute;
      top: -8px;
      left: -14px;
      right: -14px;
      bottom: -8px;
      width: 90px;
      height: 60px;
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
