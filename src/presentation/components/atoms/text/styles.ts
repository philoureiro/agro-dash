import { Typography } from '@mui/material';

import styled from 'styled-components';

export type WeightType = 'regular' | 'bold' | 'thin' | 'extraBold';

export interface StyledTextProps {
  $weight?: WeightType;
  $italic?: boolean;
}

export const fontWeightByType = {
  thin: 300,
  regular: 400,
  bold: 700,
  extraBold: 900,
};

// Usando Feather Bold SEMPRE, e ignorando os weights porque Feather Bold só tem um peso.
export const StyledText = styled(Typography)<StyledTextProps>`
  font-family: 'Feather Bold', Arial, Helvetica, sans-serif !important;
  font-weight: 700 !important; /* Feather Bold só tem bold, mas mantém a tipagem para interface */
  font-style: ${({ $italic }) => ($italic ? 'italic' : 'normal')};
  letter-spacing: -0.01em;
`;
