import React, { useState } from 'react';

import { useAutoFill } from '@hooks';

import {
  AutoFillContainer,
  AutoFillIcon,
  AutoFillTooltip,
  AutoFillButton as StyledButton,
} from './styles';

interface FieldConfig {
  type:
    | 'text'
    | 'email'
    | 'phone'
    | 'number'
    | 'date'
    | 'select'
    | 'url'
    | 'textarea'
    | 'cpf'
    | 'cnpj'
    | 'cep'
    | 'percentage'
    | 'year';
  options?: string[];
  min?: number;
  max?: number;
  custom?: () => string | number;
}

interface FormSchema {
  [fieldPath: string]: FieldConfig;
}

// 🎯 DADOS ATUAIS DO FORMULÁRIO
interface CurrentFormData {
  [fieldPath: string]: string | number | undefined | null;
}

// 🎯 POSIÇÕES POSSÍVEIS DO TOOLTIP
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface AutoFillButtonProps {
  schema: FormSchema;
  onUpdate: (path: string, value: string | number) => void;
  isDark: boolean;
  excludeFields?: string[];
  customData?: Record<string, string | number>;
  currentData?: CurrentFormData; // 🎯 NOVO: dados atuais para verificar campos preenchidos
  position?: 'top-right' | 'top-left';
  tooltipPosition?: TooltipPosition; // 🎯 NOVO: controle da posição do tooltip
  size?: 'small' | 'medium';
  disabled?: boolean;
  fillOnlyEmpty?: boolean; // 🎯 NOVO: só preenche campos vazios
}

export const AutoFillButton: React.FC<AutoFillButtonProps> = ({
  schema,
  onUpdate,
  isDark,
  excludeFields,
  customData,
  currentData, // 🎯 NOVO
  position = 'top-right',
  tooltipPosition = 'bottom', // 🎯 NOVO
  size = 'small',
  disabled = false,
  fillOnlyEmpty = true, // 🎯 Por padrão só preenche vazios
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { autoFill } = useAutoFill();

  const handleAutoFill = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);

    try {
      await autoFill(schema, onUpdate, {
        excludeFields,
        customData,
        currentData, // 🎯 Passa os dados atuais
        fillOnlyEmpty, // 🎯 Controla se preenche apenas vazios
      });
    } catch (error) {
      console.error('❌ Erro no auto-fill:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 500); // Delay para mostrar o loading
    }
  };

  return (
    <AutoFillContainer
      $position={position}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <StyledButton
        $isDark={isDark}
        $size={size}
        $disabled={disabled || isLoading}
        onClick={handleAutoFill}
        title={fillOnlyEmpty ? 'Preencher apenas campos vazios' : 'Preencher todos os campos'}
      >
        <AutoFillIcon $isAnimated={(isHovered || isLoading) && !disabled}>
          {isLoading ? '⏳' : '✨'}
        </AutoFillIcon>
      </StyledButton>
      {isHovered && !disabled && !isLoading && (
        <AutoFillTooltip
          $isDark={isDark}
          $position={tooltipPosition} // 🎯 NOVO: posição do tooltip
        >
          {fillOnlyEmpty ? 'Preencher apenas campos vazios' : 'Substituir todos os dados'}
        </AutoFillTooltip>
      )}
    </AutoFillContainer>
  );
};
