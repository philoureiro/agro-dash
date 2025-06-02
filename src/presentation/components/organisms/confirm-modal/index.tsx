import React from 'react';
import { FiAlertTriangle, FiCheck, FiTrash2, FiX } from 'react-icons/fi';
import { HiOutlineExclamation } from 'react-icons/hi';

import {
  ModalActions,
  ModalButton,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalIcon,
  ModalOverlay,
  ModalSubtitle,
  ModalText,
  ModalTitle,
} from './styles';

// 🎯 TIPOS DE MODAL
export type ModalType = 'confirm' | 'warning' | 'danger' | 'info';

// 🔧 PROPS DO MODAL
interface ConfirmModalProps {
  /** Controla se o modal está visível */
  isVisible: boolean;

  /** Tema escuro ou claro */
  isDark: boolean;

  /** Tipo do modal */
  type?: ModalType;

  /** Título principal */
  title: string;

  /** Subtítulo/descrição */
  subtitle?: string;

  /** Conteúdo do modal */
  message: string;

  /** Texto do botão de confirmação */
  confirmText?: string;

  /** Texto do botão de cancelamento */
  cancelText?: string;

  /** Callback de confirmação */
  onConfirm: () => void;

  /** Callback de cancelamento */
  onCancel: () => void;

  /** Loading no botão de confirmar */
  loading?: boolean;

  /** Z-index customizado */
  zIndex?: number;
}

// 🎨 CONFIGURAÇÕES POR TIPO
const getModalConfig = (type: ModalType) => {
  const configs = {
    confirm: {
      icon: <FiCheck size={24} />,
      color: '#3498db',
      confirmText: 'Confirmar',
    },
    warning: {
      icon: <HiOutlineExclamation size={24} />,
      color: '#f39c12',
      confirmText: 'Continuar',
    },
    danger: {
      icon: <FiTrash2 size={24} />,
      color: '#e74c3c',
      confirmText: 'Excluir',
    },
    info: {
      icon: <FiAlertTriangle size={24} />,
      color: '#3498db',
      confirmText: 'OK',
    },
  };

  return configs[type] || configs.confirm;
};

// 🎯 COMPONENTE PRINCIPAL
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  isDark,
  type = 'confirm',
  title,
  subtitle,
  message,
  confirmText,
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  loading = false,
  zIndex = 10000,
}) => {
  const config = getModalConfig(type);

  // 🎨 Handle ESC key
  React.useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVisible) {
        onCancel();
      }
    };

    if (isVisible) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isVisible, onCancel]);

  if (!isVisible) return null;

  return (
    <ModalOverlay
      $isDark={isDark}
      $zIndex={zIndex}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancel();
        }
      }}
    >
      <ModalContainer $isDark={isDark} $type={type}>
        {/* 🎨 BOTÃO FECHAR */}
        <ModalCloseButton $isDark={isDark} onClick={onCancel} type="button">
          <FiX size={20} />
        </ModalCloseButton>

        {/* 🎨 HEADER */}
        <ModalHeader>
          <ModalIcon $color={config.color} $type={type}>
            {config.icon}
          </ModalIcon>

          <ModalTitle $isDark={isDark}>{title}</ModalTitle>

          {subtitle && <ModalSubtitle $isDark={isDark}>{subtitle}</ModalSubtitle>}
        </ModalHeader>

        {/* 🎨 CONTEÚDO */}
        <ModalContent>
          <ModalText $isDark={isDark}>{message}</ModalText>
        </ModalContent>

        {/* 🎨 AÇÕES */}
        <ModalActions>
          <ModalButton
            $isDark={isDark}
            $variant="secondary"
            onClick={onCancel}
            disabled={loading}
            type="button"
          >
            {cancelText}
          </ModalButton>

          <ModalButton
            $isDark={isDark}
            $variant="primary"
            $type={type}
            onClick={onConfirm}
            disabled={loading}
            type="button"
          >
            {loading ? 'Processando...' : confirmText || config.confirmText}
          </ModalButton>
        </ModalActions>
      </ModalContainer>
    </ModalOverlay>
  );
};
