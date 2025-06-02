// src/components/AddFarmer/components/CompactInput.tsx
import React from 'react';

import { CompactInput, CompactLabel, CompactSelect, ValidationMessage } from './styles';

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
}) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <CompactLabel $isDark={isDark}>{label}</CompactLabel>

      {options ? (
        <CompactSelect
          $isDark={isDark}
          $valid={valid}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Selecione...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </CompactSelect>
      ) : (
        <CompactInput
          $isDark={isDark}
          $valid={valid}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
      )}

      {validationMessage && (
        <ValidationMessage $isDark={isDark} $type={validationType}>
          {validationMessage}
        </ValidationMessage>
      )}
    </div>
  );
};
