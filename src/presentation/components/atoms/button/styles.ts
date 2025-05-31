import styled, { css } from 'styled-components';

export interface ButtonStyleProps {
  isDark?: boolean;
  disabled?: boolean;
  gradient?: string;
  color?: string;
  size?: 'small' | 'normal' | 'large';
}

const sizeMap = {
  small: css`
    padding: 8px 14px;
    font-size: 12px;
    border-radius: 8px;
  `,
  normal: css`
    padding: 12px 20px;
    font-size: 14px;
    border-radius: 12px;
  `,
  large: css`
    padding: 16px 26px;
    font-size: 16px;
    border-radius: 14px;
  `,
};

export const StyledButton = styled.button<ButtonStyleProps>`
  background: ${({ isDark, disabled, gradient }) =>
    disabled
      ? isDark
        ? '#2a3d32'
        : '#e0e0e0'
      : gradient ||
        (isDark
          ? 'linear-gradient(135deg, #37cb83 0%, #2f9469 100%)'
          : 'linear-gradient(135deg, #37cb83 0%, #5ad0ff 100%)')};
  color: ${({ isDark, disabled, color }) =>
    disabled ? (isDark ? '#6b7280' : '#9ca3af') : color || '#fff'};
  border: none;
  font-family: inherit;
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: ${({ disabled }) => (disabled ? 'none' : '0 4px 15px rgba(55, 203, 131, 0.3)')};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  ${({ size = 'normal' }) => sizeMap[size]}

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 8px 25px rgba(55, 203, 131, 0.4);

    &:before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0) scale(0.98);
  }
`;
