import styled, { css, keyframes } from 'styled-components';

const sparkle = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(55, 203, 131, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(55, 203, 131, 0); }
`;

export const AutoFillContainer = styled.div<{
  $position: 'top-right' | 'top-left';
}>`
  margin-top: -21px;
  position: absolute;
  z-index: 10;

  ${({ $position }) =>
    $position === 'top-right'
      ? css`
          top: 1rem;
          right: 1rem;
        `
      : css`
          top: 1rem;
          left: 1rem;
        `}

  @media (max-width: 768px) {
    right: ${({ $position }) => ($position === 'top-right' ? '0.5rem' : 'auto')};
    left: ${({ $position }) => ($position === 'top-left' ? '0.5rem' : 'auto')};
  }
`;

export const AutoFillButton = styled.button<{
  $isDark: boolean;
  $size: 'small' | 'medium';
  $disabled: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${({ $size }) => ($size === 'small' ? '40px' : '48px')};
  height: ${({ $size }) => ($size === 'small' ? '40px' : '48px')};

  border-radius: 50%;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  background: ${({ $isDark, $disabled }) => {
    if ($disabled) return $isDark ? 'rgba(107, 114, 128, 0.5)' : 'rgba(156, 163, 175, 0.5)';
    return $isDark
      ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.2), rgba(39, 174, 96, 0.3))'
      : 'linear-gradient(135deg, rgba(55, 203, 131, 0.1), rgba(39, 174, 96, 0.2))';
  }};

  border: 2px solid
    ${({ $isDark, $disabled }) => {
      if ($disabled) return $isDark ? 'rgba(107, 114, 128, 0.3)' : 'rgba(156, 163, 175, 0.3)';
      return $isDark ? 'rgba(55, 203, 131, 0.4)' : 'rgba(39, 174, 96, 0.3)';
    }};

  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    background: ${({ $isDark }) =>
      $isDark
        ? 'linear-gradient(135deg, rgba(55, 203, 131, 0.3), rgba(39, 174, 96, 0.4))'
        : 'linear-gradient(135deg, rgba(55, 203, 131, 0.15), rgba(39, 174, 96, 0.25))'};

    border-color: ${({ $isDark }) =>
      $isDark ? 'rgba(55, 203, 131, 0.6)' : 'rgba(39, 174, 96, 0.5)'};

    box-shadow: ${({ $isDark }) =>
      $isDark ? '0 8px 25px rgba(55, 203, 131, 0.3)' : '0 8px 25px rgba(39, 174, 96, 0.2)'};

    animation: ${pulse} 1s infinite;
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }
`;

export const AutoFillIcon = styled.span<{ $isAnimated: boolean }>`
  font-size: 1.2rem;
  line-height: 1;

  ${({ $isAnimated }) =>
    $isAnimated &&
    css`
      animation: ${sparkle} 2s ease-in-out infinite;
    `}

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

// 🎯 TOOLTIP COM TODAS AS 4 POSIÇÕES POSSÍVEIS
export const AutoFillTooltip = styled.div<{
  $isDark: boolean;
  $position: 'top' | 'bottom' | 'left' | 'right';
}>`
  position: absolute;
  z-index: 20;

  background: ${({ $isDark }) =>
    $isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};

  color: ${({ $isDark }) => ($isDark ? '#e2e8f0' : '#374151')};

  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;

  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(55, 203, 131, 0.3)' : 'rgba(39, 174, 96, 0.2)')};

  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

  // 🎯 POSICIONAMENTO BASEADO NA PROP $position
  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return css`
          bottom: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom':
        return css`
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return css`
          right: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'right':
        return css`
          left: calc(100% + 8px);
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return css`
          top: calc(100% + 8px);
          left: 50%;
          transform: translateX(-50%);
        `;
    }
  }}

  // 🎯 SETA DO TOOLTIP BASEADA NA POSIÇÃO
  &:before {
    content: '';
    position: absolute;
    width: 8px;
    height: 8px;

    background: ${({ $isDark }) =>
      $isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)'};

    ${({ $position, $isDark }) => {
      const borderColor = $isDark ? 'rgba(55, 203, 131, 0.3)' : 'rgba(39, 174, 96, 0.2)';

      switch ($position) {
        case 'top':
          return css`
            top: 100%;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            border-right: 1px solid ${borderColor};
            border-bottom: 1px solid ${borderColor};
          `;
        case 'bottom':
          return css`
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            border-left: 1px solid ${borderColor};
            border-top: 1px solid ${borderColor};
          `;
        case 'left':
          return css`
            left: 100%;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
            border-top: 1px solid ${borderColor};
            border-right: 1px solid ${borderColor};
          `;
        case 'right':
          return css`
            right: 100%;
            top: 50%;
            transform: translateY(-50%) rotate(45deg);
            border-left: 1px solid ${borderColor};
            border-bottom: 1px solid ${borderColor};
          `;
        default:
          return css`
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%) rotate(45deg);
            border-left: 1px solid ${borderColor};
            border-top: 1px solid ${borderColor};
          `;
      }
    }}
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
    padding: 0.4rem 0.6rem;
  }
`;
