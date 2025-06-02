import { DefaultTheme } from '@theme';
import styled from 'styled-components';

export const Input = styled.input<{ theme?: DefaultTheme }>`
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.palette.divider || '#d9dbe0'};
  border-radius: 6px;
  font-size: 1rem;
  background: ${({ theme }) => theme.palette.background.paper};
  color: ${({ theme }) => theme.palette.text.primary};
  outline: none;
  height: 50px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${({ theme }) => theme.palette.primary.main};
    background: ${({ theme }) => theme.palette.background.paper};
  }

  &::placeholder {
    color: ${({ theme }) => theme.palette.text.secondary};
    opacity: 0.7;
  }
`;
