import styled, { css, keyframes } from 'styled-components';

// 🎬 ANIMAÇÕES
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shake = keyframes`
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 5px rgba(55, 203, 131, 0.3); }
  50% { box-shadow: 0 0 15px rgba(55, 203, 131, 0.6); }
`;

// 📦 CONTAINER PRINCIPAL
export const CompactContainer = styled.div`
  width: 100%;
  margin-bottom: 1rem;
  animation: ${fadeInUp} 0.3s ease-out;
`;

// 🏷️ LABEL MELHORADO
export const CompactLabel = styled.label<{
  $isDark: boolean;
  $hasValue: boolean;
  $isFocused: boolean;
  $isRequired: boolean;
  $validationStatus: 'success' | 'error' | 'info';
}>`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  color: ${({ $isDark, $validationStatus, $isFocused }) => {
    if ($isFocused) {
      if ($validationStatus === 'success') return '#27ae60';
      if ($validationStatus === 'error') return '#e74c3c';
      return $isDark ? '#37cb83' : '#3b82f6';
    }
    if ($validationStatus === 'success') return '#27ae60';
    if ($validationStatus === 'error') return '#e74c3c';
    return $isDark ? '#e2e8f0' : '#374151';
  }};

  .label-icon {
    margin-right: 0.5rem;
    font-size: 1rem;
  }

  .required {
    color: #ef4444;
    margin-left: 2px;
    font-weight: bold;
  }

  ${({ $isFocused }) =>
    $isFocused &&
    css`
      transform: translateY(-1px);
      font-weight: 700;
    `}
`;

// 🎯 WRAPPER DO INPUT
export const InputWrapper = styled.div<{
  $isDark: boolean;
  $validationStatus: 'success' | 'error' | 'info';
  $disabled: boolean;
}>`
  position: relative;
  width: 100%;

  ${({ $disabled }) =>
    $disabled &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}
`;

// 📝 INPUT BÁSICO
const inputStyles = css<{
  $isDark: boolean;
  $valid?: boolean;
  $hasValue: boolean;
  $isFocused: boolean;
}>`
  width: 100%;
  padding: 12px 16px;

  /* 🔥 ESPAÇAMENTO PARA ÍCONE QUANDO PRESENTE */
  padding-right: ${({ $valid }) => ($valid !== undefined ? '48px' : '16px')};

  border: 2px solid
    ${({ $isDark, $valid, $isFocused }) => {
      if ($isFocused) {
        if ($valid === true) return '#27ae60';
        if ($valid === false) return '#e74c3c';
        return $isDark ? '#37cb83' : '#3b82f6';
      }
      if ($valid === true) return '#27ae60';
      if ($valid === false) return '#e74c3c';
      return $isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    }};

  border-radius: 8px;
  background: ${({ $isDark }) => ($isDark ? 'rgba(45, 52, 64, 0.8)' : 'rgba(255, 255, 255, 0.9)')};

  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#1f2937')};
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);

  /* 🔥 REMOVER SETAS DE NÚMERO */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type='number'] {
    -moz-appearance: textfield;
  }

  /* 🔥 ESTILIZAR DATE PICKER */
  &[type='date'] {
    color-scheme: ${({ $isDark }) => ($isDark ? 'dark' : 'light')};

    &::-webkit-calendar-picker-indicator {
      background-image: none;
      background: ${({ $isDark }) => ($isDark ? '#37cb83' : '#27ae60')};
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.8;
      transition: all 0.3s ease;
      width: 20px;
      height: 20px;
      padding: 2px;

      &:hover {
        opacity: 1;
        transform: scale(1.1);
        background: ${({ $isDark }) => ($isDark ? '#27ae60' : '#37cb83')};
      }
    }

    &::-webkit-datetime-edit-text {
      color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)')};
    }

    &::-webkit-datetime-edit-month-field,
    &::-webkit-datetime-edit-day-field,
    &::-webkit-datetime-edit-year-field {
      color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#1f2937')};
      background: transparent;
      border: none;
      padding: 2px;
      border-radius: 2px;

      &:focus {
        background: ${({ $isDark }) =>
          $isDark ? 'rgba(55, 203, 131, 0.2)' : 'rgba(39, 174, 96, 0.1)'};
        outline: none;
      }
    }
  }

  &:focus {
    outline: none;
    box-shadow: ${({ $isDark, $valid }) => {
      if ($valid === true) return '0 0 0 3px rgba(39, 174, 96, 0.2)';
      if ($valid === false) return '0 0 0 3px rgba(231, 76, 60, 0.2)';
      return $isDark ? '0 0 0 3px rgba(55, 203, 131, 0.2)' : '0 0 0 3px rgba(59, 130, 246, 0.2)';
    }};
    transform: translateY(-1px);
  }

  &:hover:not(:focus) {
    border-color: ${({ $isDark }) => ($isDark ? '#37cb83' : '#3b82f6')};
    transform: translateY(-1px);
  }

  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(107, 114, 128, 0.8)')};
    transition: opacity 0.3s ease;
  }

  &:focus::placeholder {
    opacity: 0.7;
  }

  /* 🎯 ANIMAÇÃO DE ERRO - SEM AFETAR POSIÇÃO */
  ${({ $valid }) =>
    $valid === false &&
    css`
      animation: ${shake} 0.5s ease-in-out;
    `}

  /* 🌟 ANIMAÇÃO DE SUCESSO */
  ${({ $valid }) =>
    $valid === true &&
    css`
      animation: ${glow} 2s infinite;
    `}

  @media (max-width: 768px) {
    padding: 10px 14px;
    padding-right: ${({ $valid }) => ($valid !== undefined ? '44px' : '14px')};
    font-size: 0.9rem;
  }
`;

export const CompactInput = styled.input`
  ${inputStyles}
`;

export const CompactSelect = styled.select`
  ${inputStyles}
  cursor: pointer;
  padding-right: ${({ $valid }) =>
    $valid !== undefined ? '68px' : '40px'}; /* 🔥 ESPAÇO PARA ÍCONE + SETA */
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right ${({ $valid }) => ($valid !== undefined ? '48px' : '12px')} center;
  background-size: 16px;
  appearance: none;

  option {
    background: ${({ $isDark }) => ($isDark ? '#2d3748' : '#ffffff')};
    color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#1f2937')};
    padding: 10px;
  }
`;

export const CompactTextarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: 1.5;
`;

// 🎯 ÍCONE DE VALIDAÇÃO - POSIÇÃO FIXA
export const InputIcon = styled.div<{
  $validationStatus: 'success' | 'error' | 'info';
  $hasIcon: boolean;
}>`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  pointer-events: none;
  z-index: 2;

  /* 🔥 POSIÇÃO FIXA - SEM ANIMAÇÃO DE MOVIMENTO */
  transition: opacity 0.3s ease;

  ${({ $validationStatus }) =>
    $validationStatus === 'success' &&
    css`
      animation: ${glow} 2s infinite;
    `}

  /* 🔥 REMOVER ANIMAÇÃO DE SHAKE DO ÍCONE */
  ${({ $validationStatus }) =>
    $validationStatus === 'error' &&
    css`
      color: #e74c3c;
      /* Sem animação de shake aqui */
    `}
`;

// 📝 MENSAGEM DE VALIDAÇÃO
export const ValidationMessage = styled.div<{
  $isDark: boolean;
  $type: 'success' | 'error' | 'info';
}>`
  margin-top: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  animation: ${fadeInUp} 0.3s ease-out;

  ${({ $type, $isDark }) => {
    if ($type === 'success') {
      return css`
        background: ${$isDark ? 'rgba(39, 174, 96, 0.15)' : 'rgba(39, 174, 96, 0.1)'};
        border: 1px solid rgba(39, 174, 96, 0.4);
        color: ${$isDark ? '#2ecc71' : '#27ae60'};

        &:before {
          content: '✅';
          font-size: 0.9rem;
        }
      `;
    } else if ($type === 'error') {
      return css`
        background: ${$isDark ? 'rgba(231, 76, 60, 0.15)' : 'rgba(231, 76, 60, 0.1)'};
        border: 1px solid rgba(231, 76, 60, 0.4);
        color: ${$isDark ? '#e74c3c' : '#c0392b'};

        &:before {
          content: '❌';
          font-size: 0.9rem;
        }
      `;
    } else {
      return css`
        background: ${$isDark ? 'rgba(52, 152, 219, 0.15)' : 'rgba(52, 152, 219, 0.1)'};
        border: 1px solid rgba(52, 152, 219, 0.4);
        color: ${$isDark ? '#3498db' : '#2980b9'};

        &:before {
          content: 'ℹ️';
          font-size: 0.9rem;
        }
      `;
    }
  }}

  &:hover {
    transform: translateY(-1px);
    box-shadow: ${({ $type }) => {
      if ($type === 'success') return '0 4px 15px rgba(39, 174, 96, 0.3)';
      if ($type === 'error') return '0 4px 15px rgba(231, 76, 60, 0.3)';
      return '0 4px 15px rgba(52, 152, 219, 0.3)';
    }};
  }

  @media (max-width: 768px) {
    font-size: 0.75rem;
    padding: 0.4rem 0.6rem;
  }
`;
