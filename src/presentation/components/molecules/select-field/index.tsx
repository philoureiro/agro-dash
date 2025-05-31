import React from 'react';

import { FieldContainer, InputLabel, SelectField } from './styles';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  themeMode?: string; // Adicione a prop de tema
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  label,
  value,
  onChange,
  options,
  themeMode,
  style,
}) => {
  return (
    <FieldContainer style={style}>
      <InputLabel themeMode={themeMode}>{label}</InputLabel>
      <SelectField themeMode={themeMode} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
    </FieldContainer>
  );
};
