// src/utils/validations.ts
export const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');

  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false; // Todos iguais

  // Validação do primeiro dígito
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;

  // Validação do segundo dígito
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(10))) return false;

  return true;
};

export const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');

  if (numbers.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(numbers)) return false; // Todos iguais

  // Validação do primeiro dígito
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(numbers.charAt(12))) return false;

  // Validação do segundo dígito
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(numbers.charAt(13))) return false;

  return true;
};

export const validateDocument = (document: string, type: 'CPF' | 'CNPJ'): boolean => {
  if (type === 'CPF') return validateCPF(document);
  return validateCNPJ(document);
};

export const formatDocument = (value: string, type: 'CPF' | 'CNPJ'): string => {
  const numbers = value.replace(/\D/g, '');

  if (type === 'CPF') {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
  }

  return numbers.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
};

export const validatePhone = (phone: string): boolean => {
  const numbers = phone.replace(/\D/g, '');
  return numbers.length >= 10 && numbers.length <= 11;
};
