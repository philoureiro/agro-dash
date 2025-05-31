import React from 'react';

import { Typography, TypographyProps } from '@mui/material';

type TextProps = TypographyProps & {
  children: React.ReactNode;
};

export const Text: React.FC<TextProps> = ({ children, ...props }) => {
  return <Typography {...props}>{children}</Typography>;
};
