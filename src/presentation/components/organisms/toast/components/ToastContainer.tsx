import React from 'react';

import { Toast } from '@components';
import { useToastStore } from '@storage';
import { useThemeMode } from '@theme';

import { ToastContainer as StyledContainer } from '../styles';

export const ToastContainer: React.FC = () => {
  const { themeMode } = useThemeMode();
  const isDark = themeMode === 'dark';
  const { toasts, config, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <StyledContainer position={config.position} isDark={isDark}>
      {toasts.map((toast) => (
        <Toast key={toast.id} data={toast} position={config.position} onRemove={removeToast} />
      ))}
    </StyledContainer>
  );
};
