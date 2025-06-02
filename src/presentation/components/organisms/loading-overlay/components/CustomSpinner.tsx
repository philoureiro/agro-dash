import React from 'react';

import { LoadingSpinner } from '../styles';

export type SpinnerVariant = 'rings' | 'dots' | 'pulse' | 'wave' | 'bounce' | 'fade';
export type SpinnerSize = 'small' | 'medium' | 'large';

export interface SpinnerProps {
  isDark?: boolean;
  variant?: SpinnerVariant;
  spinnerSize?: SpinnerSize;
  spinnerColor?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  isDark = false,
  variant = 'rings',
  spinnerSize = 'medium',
  spinnerColor,
}) => {
  return (
    <LoadingSpinner
      $isDark={isDark}
      $variant={variant}
      $size={spinnerSize}
      $spinnerColor={spinnerColor}
    >
      {/* 🌟 SPINNER ANIMADO */}
      {variant === 'rings' && (
        <>
          <div className="spinner-ring ring-1"></div>
          <div className="spinner-ring ring-2"></div>
          <div className="spinner-ring ring-3"></div>
        </>
      )}

      {variant === 'dots' && (
        <div className="spinner-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      )}

      {variant === 'pulse' && (
        <div className="spinner-pulse">
          <div className="pulse-ring"></div>
          <div className="pulse-ring"></div>
        </div>
      )}

      {variant === 'wave' && (
        <div className="spinner-wave">
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
          <div className="wave-bar"></div>
        </div>
      )}

      {variant === 'bounce' && (
        <div className="spinner-bounce">
          <div className="bounce-ball"></div>
          <div className="bounce-ball"></div>
          <div className="bounce-ball"></div>
        </div>
      )}

      {variant === 'fade' && (
        <div className="spinner-fade">
          <div className="fade-rect"></div>
          <div className="fade-rect"></div>
          <div className="fade-rect"></div>
          <div className="fade-rect"></div>
        </div>
      )}
    </LoadingSpinner>
  );
};
