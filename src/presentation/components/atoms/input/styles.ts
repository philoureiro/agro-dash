import styled from 'styled-components';

export const Input = styled.input<{ themeMode?: string }>`
  width: 100%;
  padding: 1rem 2.5rem 1rem 1rem;
  margin-bottom: 1rem;
  border: 1px solid ${({ themeMode }) => (themeMode === 'dark' ? '#444' : '#d9dbe0')};
  border-radius: 6px;
  font-size: 1rem;
  background: ${({ themeMode }) => (themeMode === 'dark' ? '#222' : 'transparent')};
  color: ${({ themeMode }) => (themeMode === 'dark' ? '#fff' : '#333')};
  outline: none;
  height: 50px;
  transition: all 0.2s ease;

  &:focus {
    border-color: #00db8d;
    background: ${({ themeMode }) => (themeMode === 'dark' ? '#333' : '#fff')};
  }

  &::placeholder {
    color: ${({ themeMode }) => (themeMode === 'dark' ? '#888' : '#999')};
  }
`;
