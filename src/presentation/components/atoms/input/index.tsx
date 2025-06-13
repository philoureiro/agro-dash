import React, { useState } from 'react';
import { IoIosCheckmarkCircle, IoIosCloseCircle } from 'react-icons/io';

import {
  CompactContainer,
  CompactInput,
  CompactLabel,
  CompactSelect,
  CompactTextarea,
  InputIcon,
  InputWrapper,
  ValidationMessage,
} from './styles';

interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
  valid?: boolean;
  validationMessage?: string;
  validationType?: 'success' | 'error' | 'info';
  placeholder?: string;
  type?: string;
  options?: { value: string; label: string }[];
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  icon?: string;
  min?: string;
  max?: string;
  step?: string;
  maxLength?: number;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  isDark,
  valid,
  validationMessage,
  validationType = 'info',
  placeholder,
  type = 'text',
  options,
  multiline = false,
  rows = 3,
  disabled = false,
  icon,
  min,
  max,
  step,
  maxLength,
  required = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  // 🎯 DETERMINAR STATUS VISUAL
  const getValidationStatus = () => {
    if (valid === true) return 'success';
    if (valid === false) return 'error';
    return validationType;
  };

  const validationStatus = getValidationStatus();
  const hasValue = value && value.length > 0;

  // 🔥 SÓ MOSTRAR VALIDAÇÃO QUANDO ERRO OU INFO (NÃO QUANDO SUCESSO)
  const showValidation =
    validationMessage &&
    (validationStatus === 'error' || validationStatus === 'info') &&
    (hasValue || isFocused || valid !== undefined);

  // 🎨 RENDERIZAR CAMPO BASEADO NO TIPO
  const renderInput = () => {
    const commonProps = {
      $isDark: isDark,
      $valid: valid,
      $hasValue: hasValue,
      $isFocused: isFocused,
      value,
      onChange: (e: any) => onChange(e.target.value),
      onFocus: () => setIsFocused(true),
      onBlur: () => setIsFocused(false),
      placeholder: placeholder || '',
      disabled,
      maxLength,
      id: inputId,
    };

    if (options) {
      return (
        <CompactSelect {...commonProps}>
          <option value="">{placeholder || 'Selecione...'}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </CompactSelect>
      );
    }

    if (multiline) {
      return <CompactTextarea {...commonProps} rows={rows} />;
    }

    return <CompactInput {...commonProps} type={type} min={min} max={max} step={step} />;
  };

  return (
    <CompactContainer>
      <CompactLabel
        $isDark={isDark}
        $hasValue={hasValue}
        $isFocused={isFocused}
        $isRequired={required}
        $validationStatus={validationStatus}
        htmlFor={inputId}
      >
        {icon && <span className="label-icon">{icon}</span>}
        {label}
        {required && <span className="required">*</span>}
      </CompactLabel>

      <InputWrapper $isDark={isDark} $validationStatus={validationStatus} $disabled={disabled}>
        {renderInput()}

        {/* 🎯 ÍCONE DE VALIDAÇÃO COM ESPAÇAMENTO */}
        {valid !== undefined && (
          <InputIcon
            $validationStatus={validationStatus}
            $hasIcon={true}
            data-testid="validation-icon"
          >
            <div style={{ marginTop: '5px' }}>
              {valid === true ? (
                <IoIosCheckmarkCircle color="#2ecc71" size={20} />
              ) : (
                <IoIosCloseCircle color="#e74c3c" size={20} />
              )}
            </div>
          </InputIcon>
        )}
      </InputWrapper>

      {/* 📝 MENSAGEM DE VALIDAÇÃO - SÓ ERRO E INFO */}
      {showValidation && (
        <ValidationMessage $isDark={isDark} $type={validationStatus}>
          {validationMessage}
        </ValidationMessage>
      )}
    </CompactContainer>
  );
};
