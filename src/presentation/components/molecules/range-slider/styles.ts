import { Slider } from '@mui/material';

import styled from 'styled-components';

// 🔥 SLIDER CUSTOMIZADO COM ALINHAMENTO PERFEITO
export const CustomSlider = styled(Slider)<{
  $color: string;
  $isDark: boolean;
}>`
  color: ${({ $color }) => $color};
  height: 8px;
  margin: 20px 0;

  /* 🔥 GARANTIR QUE O CONTAINER MANTENHA ALTURA CONSISTENTE */
  .MuiSlider-root {
    padding: 13px 0;
  }

  & .MuiSlider-track {
    border: none;
    background: ${({ $color }) => $color};
    height: 8px;
    border-radius: 4px;
  }

  & .MuiSlider-rail {
    background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
    opacity: 1;
    height: 8px;
    border-radius: 4px;
  }

  & .MuiSlider-thumb {
    height: 24px;
    width: 24px;
    background: ${({ $color }) => $color};
    border: 4px solid ${({ $isDark }) => ($isDark ? '#1e293b' : '#ffffff')};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

    /* 🔥 TRANSIÇÕES SUAVES SEM AFETAR POSICIONAMENTO */
    transition:
      box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.1s cubic-bezier(0.4, 0, 0.2, 1);

    /* 🔥 GARANTIR QUE PERMANEÇA NO CENTRO VERTICAL */
    transform-origin: center center;

    &:hover {
      /* 🔥 SCALE SEM DESLOCAR POSIÇÃO */

      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
    }

    &:focus,
    &.Mui-focusVisible {
      box-shadow: 0 0 0 8px ${({ $color }) => `${$color}30`};
    }

    /* 🔥 PREVENIR MOVIMENTO DURANTE DRAG */
    &.MuiSlider-dragging {
      transform: scale(1.15);
      box-shadow:
        0 0 0 12px ${({ $color }) => `${$color}25`},
        0 8px 25px rgba(0, 0, 0, 0.4);
    }
  }

  & .MuiSlider-valueLabel {
    line-height: 1.2;
    font-size: 12px;
    font-weight: 600;
    background: ${({ $color }) => $color};
    padding: 4px 8px;
    border-radius: 6px;
    color: white;

    /* 🔥 POSICIONAR LABEL CORRETAMENTE */
    transform: translateY(-100%) scale(0);

    &:before {
      border-top-color: ${({ $color }) => $color};
    }
  }

  & .MuiSlider-markActive {
    background: ${({ $color }) => $color};
  }

  &.Mui-disabled {
    color: rgba(156, 163, 175, 0.5);

    & .MuiSlider-thumb {
      background: #9ca3af;
    }
  }
`;

// 🎨 CONTAINER E LABEL (IGUAIS)
export const SliderContainer = styled('div')<{ $isDark: boolean }>`
  width: 100%;
  user-select: none;
`;

export const SliderLabel = styled('div')<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  color: ${({ $isDark }) => ($isDark ? '#e2e8f0' : '#334155')};
  font-weight: 500;
  font-size: 0.9rem;
`;

export const SliderValue = styled('span')<{ $color: string }>`
  color: ${({ $color }) => $color};
  font-size: 1rem;
  font-weight: 700;
`;
