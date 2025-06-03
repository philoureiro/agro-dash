import React, { useState } from 'react';

import { useAutoFill } from '@hooks';

import {
  AutoFillIcon,
  AutoFillTooltip,
  AutoFillWrapper,
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
type TooltipPosition = 'top' | 'bottom' | 'left' | 'right' | 'auto';

interface AutoFillButtonProps {
  schema: FormSchema;
  onUpdate: (path: string, value: string | number) => void;
  isDark: boolean;
  excludeFields?: string[];
  customData?: Record<string, string | number>;
  currentData?: CurrentFormData;
  tooltipPosition?: TooltipPosition; // 🎯 Apenas tooltip, sem position absoluto
  size?: 'small' | 'medium';
  disabled?: boolean;
  fillOnlyEmpty?: boolean;
  imageContext?: 'producer' | 'farm' | 'crop'; // 🎯 NOVO: contexto de imagem
}

export const AutoFillButton: React.FC<AutoFillButtonProps> = ({
  schema,
  onUpdate,
  isDark,
  excludeFields,
  customData,
  currentData,
  tooltipPosition = 'auto', // 🎯 Auto detecta melhor posição
  size = 'small',
  disabled = false,
  fillOnlyEmpty = true,
  imageContext = 'producer',
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
        currentData,
        fillOnlyEmpty,
        imageContext, // 🎯 Passa contexto de imagem
      });
    } catch (error) {
      console.error('❌ Erro no auto-fill:', error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  return (
    <AutoFillWrapper
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
        <AutoFillTooltip $isDark={isDark} $position={tooltipPosition}>
          {fillOnlyEmpty ? 'Preencher apenas campos vazios' : 'Substituir todos os dados'}
        </AutoFillTooltip>
      )}
    </AutoFillWrapper>
  );
};
