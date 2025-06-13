import React, { ButtonHTMLAttributes, ReactNode } from 'react';

import { ButtonStyleProps, StyledButton } from './styles';

export interface ExportButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  children: ReactNode;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

export const Button: React.FC<ExportButtonProps> = ({
  children,
  isDark,
  disabled,
  gradient,
  color,
  size = 'normal',
  startIcon,
  endIcon,
  ...rest
}) => {
  return (
    <StyledButton
      isDark={isDark}
      disabled={disabled}
      gradient={gradient}
      color={color}
      size={size}
      {...rest}
    >
      {startIcon && (
        <span data-testid="start-icon" style={{ display: 'flex', alignItems: 'center' }}>
          {startIcon}
        </span>
      )}
      {children}
      {endIcon && (
        <span data-testid="end-icon" style={{ display: 'flex', alignItems: 'center' }}>
          {endIcon}
        </span>
      )}
    </StyledButton>
  );
};
