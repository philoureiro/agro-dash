// ============= VALIDAÇÕES DE DOCUMENTO =============

// ============= GERADORES DE ID =============

// Função para gerar UUID simples para produtores
export const generateProducerId = (): string => {
  return 'prod-' + Math.random().toString(36).substring(2, 11);
};

// 🔥 Função para gerar UUID simples para fazendas
export const generateFarmId = (): string => {
  return 'farm-' + Math.random().toString(36).substring(2, 11);
};

// Função para gerar UUID simples para culturas
export const generateCropId = (): string => {
  return 'crop-' + Math.random().toString(36).substring(2, 11);
};

// ============= VALIDAÇÕES DE ÁREA =============

// Validação de áreas da fazenda
export const validateFarmAreas = (
  totalArea: number,
  agriculturalArea: number,
  vegetationArea: number,
): boolean => {
  if (totalArea <= 0 || agriculturalArea < 0 || vegetationArea < 0) {
    return false;
  }
  return agriculturalArea + vegetationArea <= totalArea;
};

// Validação se área plantada não excede área agricultável
export const validatePlantedArea = (plantedArea: number, agriculturalArea: number): boolean => {
  return plantedArea > 0 && plantedArea <= agriculturalArea;
};

// ============= FORMATADORES =============

// Formatar CPF
export const formatCPF = (cpf: string): string => {
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

// Formatar CNPJ
export const formatCNPJ = (cnpj: string): string => {
  const clean = cnpj.replace(/\D/g, '');
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// Formatar área em hectares
export const formatArea = (area: number): string => {
  return `${area.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
};

// Formatar percentual
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// src/utils/validations.ts - VALIDAÇÕES REAIS BRASILEIRAS
export const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');

  // Verificar se tem 11 dígitos
  if (numbers.length !== 11) return false;

  // Verificar se todos os dígitos são iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Validar primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(numbers.charAt(9))) return false;

  // Validar segundo dígito verificador
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

  // Verificar se tem 14 dígitos
  if (numbers.length !== 14) return false;

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(numbers)) return false;

  // Validar primeiro dígito verificador
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weights1[i];
  }

  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  if (digit1 !== parseInt(numbers.charAt(12))) return false;

  // Validar segundo dígito verificador
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
  if (!document) return false;

  if (type === 'CPF') {
    return validateCPF(document);
  } else {
    return validateCNPJ(document);
  }
};

export const formatDocument = (value: string, type: 'CPF' | 'CNPJ'): string => {
  const numbers = value.replace(/\D/g, '');

  if (type === 'CPF') {
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  } else {
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
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

// 🧪 TESTE AS VALIDAÇÕES (remover em produção)
console.log('Teste CPF válido:', validateCPF('11144477735')); // true
console.log('Teste CPF inválido:', validateCPF('12345678901')); // false
console.log('Teste CNPJ válido:', validateCNPJ('11222333000181')); // true
console.log('Teste CNPJ inválido:', validateCNPJ('12345678000100')); // false
