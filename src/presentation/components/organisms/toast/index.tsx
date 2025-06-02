import React, { useEffect, useState } from 'react';

import { useToastStore } from '@storage';
import { useThemeMode } from '@theme';

import {
  Toast as StyledToast,
  ToastActions,
  ToastButton,
  ToastContent,
  ToastIcon,
  ToastMessage,
  ToastProgress,
  ToastText,
  ToastTitle,
} from './styles';
import { ToastData } from './types';

/* eslint-disable react-refresh/only-export-components */

export * from './types';
export * from './components/ToastContainer';

interface ToastProps {
  data: ToastData;
  position:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
  onRemove: (id: string) => void;
}

const getToastIcon = (type: ToastData['type']) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return 'ℹ️';
  }
};

export const Toast: React.FC<ToastProps> = ({ data, position, onRemove }) => {
  const { themeMode } = useThemeMode();
  const isDark = themeMode === 'dark';
  const [isRemoving, setIsRemoving] = useState(false);

  const handleClose = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(data.id);
      data.onClose?.();
    }, 300);
  };

  const handleAction = () => {
    data.action?.onClick();
    handleClose();
  };

  // Auto-close
  useEffect(() => {
    if (data.duration && data.duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, data.duration);

      return () => clearTimeout(timer);
    }
  }, [data.duration]);

  return (
    <StyledToast type={data.type} position={position} isDark={isDark} isRemoving={isRemoving}>
      <ToastContent>
        <ToastIcon>{getToastIcon(data.type)}</ToastIcon>

        <ToastText>
          <ToastTitle>{data.title}</ToastTitle>
          {data.message && <ToastMessage>{data.message}</ToastMessage>}
        </ToastText>

        <ToastActions>
          {data.action && (
            <ToastButton variant="action" onClick={handleAction}>
              {data.action.label}
            </ToastButton>
          )}

          <ToastButton variant="close" onClick={handleClose}>
            ✕
          </ToastButton>
        </ToastActions>
      </ToastContent>

      {data.duration && data.duration > 0 && <ToastProgress duration={data.duration} />}
    </StyledToast>
  );
};

// Função global para usar fora de componentes React
export const toast = {
  success: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'success', title, message }),

  error: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'error', title, message }),

  warning: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'warning', title, message }),

  info: (title: string, message?: string) =>
    useToastStore.getState().addToast({ type: 'info', title, message }),

  clear: () => useToastStore.getState().clearAll(),
};
