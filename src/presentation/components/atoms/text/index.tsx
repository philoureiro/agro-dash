import React from 'react';

import { TypographyProps } from '@mui/material';

import { StyledText, WeightType } from './styles';

type TextProps = TypographyProps & {
  children: React.ReactNode;
  weight?: WeightType; // 'regular' | 'bold' | 'thin'
  italic?: boolean;
};

export const Text: React.FC<TextProps> = ({
  children,
  weight = 'regular',
  italic = false,
  ...props
}) => {
  return (
    <StyledText $weight={weight} $italic={italic} {...props}>
      {children}
    </StyledText>
  );
};
