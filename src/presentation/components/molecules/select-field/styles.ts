import { colors } from '@theme';
import styled from 'styled-components';

export const SelectField = styled.select<{ themeMode?: string }>`
  padding: 10px;
  border: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#d9dbe0')};
  border-radius: 8px;
  background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#fff')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#333')};
  font-size: 14px;
  outline: none;
  height: 50px;
  transition: all 0.2s ease;

  &:focus {
    border-color: ${colors.activeGreen};
    background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#333' : '#fff')};
  }

  /* Estilo das options */
  option {
    background-color: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : '#fff')};
    color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#333')};
  }
`;

export const FieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const InputLabel = styled.label<{ themeMode?: string }>`
  font-size: 14px;
  margin-bottom: 4px;
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#ccc' : '#555')};
  transition: color 0.2s ease;
`;
