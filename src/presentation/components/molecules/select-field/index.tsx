import React from 'react';

import { useTheme } from '@mui/material/styles';

import { FieldContainer, InputLabel, SelectField } from './styles';

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options, style }) => {
  const theme = useTheme(); // Pega o tema atual do MUI

  return (
    <FieldContainer style={style}>
      <InputLabel theme={theme}>{label}</InputLabel>
      <SelectField theme={theme} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>
    </FieldContainer>
  );
};
