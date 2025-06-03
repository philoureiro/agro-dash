import React, { useEffect, useState } from 'react';

import { BadgeContainer, BadgeIcon, BadgeText, BadgeWrapper } from './styles';

interface DraftBadgeProps {
  isVisible: boolean;
  isDark: boolean;
  message?: string;
  icon?: string;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  duration?: number; // duração em ms para auto-hide
  onHide?: () => void;
}

export const DraftBadge: React.FC<DraftBadgeProps> = ({
  isVisible,
  isDark,
  message = 'Rascunho salvo',
  icon = '💾',
  position = 'top-right',
  duration = 3000,
  onHide,
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);

      // Auto-hide após duração especificada
      if (duration > 0) {
        const timer = setTimeout(() => {
          setShow(false);
          setTimeout(() => {
            onHide?.();
          }, duration); // Aguarda animação de saída
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onHide]);

  if (!isVisible && !show) return null;

  return (
    <BadgeContainer $position={position}>
      <BadgeWrapper $isDark={isDark} $isVisible={show}>
        <BadgeIcon>{icon}</BadgeIcon>
        <BadgeText $isDark={isDark}>{message}</BadgeText>
      </BadgeWrapper>
    </BadgeContainer>
  );
};
