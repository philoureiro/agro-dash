import React from 'react';

import { useTheme } from '@mui/material/styles';

import { Input } from './styles';

// Certifique-se de que o caminho está correto

type CustomInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const CustomInput: React.FC<CustomInputProps> = (props) => {
  const theme = useTheme();

  return <Input theme={theme} {...props} />;
};
