import styled from 'styled-components';

export const CompactLabel = styled.label<{ $isDark: boolean }>`
  display: block;
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,62,80,0.8)')};
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

export const CompactInput = styled.input<{ $isDark: boolean; $valid?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid
    ${({ $isDark, $valid }) => {
      if ($valid === true) return '#37cb83';
      if ($valid === false) return '#ff6b6b';
      return $isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 8px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ $valid }) => ($valid === false ? '#ff6b6b' : '#37cb83')};
    box-shadow: 0 0 0 2px
      ${({ $valid }) => ($valid === false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(55, 203, 131, 0.2)')};
  }

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,62,80,0.4)')};
  }

  &:hover:not(:focus) {
    border-color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.2)')};
  }
`;

export const CompactSelect = styled.select<{ $isDark: boolean; $valid?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid
    ${({ $isDark, $valid }) => {
      if ($valid === true) return '#37cb83';
      if ($valid === false) return '#ff6b6b';
      return $isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
    }};
  border-radius: 8px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.8)')};
  color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: ${({ $valid }) => ($valid === false ? '#ff6b6b' : '#37cb83')};
    box-shadow: 0 0 0 2px
      ${({ $valid }) => ($valid === false ? 'rgba(255, 107, 107, 0.2)' : 'rgba(55, 203, 131, 0.2)')};
  }

  option {
    background: ${({ $isDark }) => ($isDark ? '#2d3748' : '#fff')};
    color: ${({ $isDark }) => ($isDark ? '#fff' : '#2c3e50')};
  }
`;

export const ValidationMessage = styled.div<{
  $isDark: boolean;
  $type: 'success' | 'error' | 'info';
}>`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $type, $isDark }) => {
    if ($type === 'success') {
      return `
        background: ${$isDark ? 'rgba(55, 203, 131, 0.1)' : 'rgba(55, 203, 131, 0.05)'};
        border: 1px solid rgba(55, 203, 131, 0.3);
        color: ${$isDark ? '#37cb83' : '#27ae60'};
        
        &:before {
          content: '✅';
        }
      `;
    } else if ($type === 'error') {
      return `
        background: ${$isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.05)'};
        border: 1px solid rgba(255, 107, 107, 0.3);
        color: ${$isDark ? '#ff6b6b' : '#e63946'};
        
        &:before {
          content: '❌';
        }
      `;
    } else {
      return `
        background: ${$isDark ? 'rgba(90, 208, 255, 0.1)' : 'rgba(90, 208, 255, 0.05)'};
        border: 1px solid rgba(90, 208, 255, 0.3);
        color: ${$isDark ? '#5ad0ff' : '#3b82f6'};
        
        &:before {
          content: 'ℹ️';
        }
      `;
    }
  }}
`;
