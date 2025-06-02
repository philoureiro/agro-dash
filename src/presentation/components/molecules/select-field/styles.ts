/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultTheme, colors } from '@theme';
import styled from 'styled-components';

export const SelectField = styled.select<{ theme?: DefaultTheme }>`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.palette.divider || '#d9dbe0'};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 14px;
  outline: none;
  height: 50px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.activeGreen};
    background-color: ${({ theme }) => theme.palette.background.paper};
  }

  /* Estilo das options */
  option {
    background-color: ${({ theme }) => theme.palette.background.paper};
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputLabel = styled.label<{ theme?: any }>`
  font-size: 14px;
  margin-bottom: 4px;
  color: ${({ theme }) => theme.palette.text.secondary};
  transition: color 0.2s ease;
`;
