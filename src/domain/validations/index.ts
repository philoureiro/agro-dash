import { DocumentType } from '@enums';

// Validação de CPF (algoritmo simplificado)
export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');
  if (cleanCPF.length !== 11) return false;
  // Verificação básica - em produção usar biblioteca específica
  return !/^(\d)\1{10}$/.test(cleanCPF);
};

// Validação de CNPJ (algoritmo simplificado)
export const validateCNPJ = (cnpj: string): boolean => {
  const cleanCNPJ = cnpj.replace(/\D/g, '');
  if (cleanCNPJ.length !== 14) return false;
  // Verificação básica - em produção usar biblioteca específica
  return !/^(\d)\1{13}$/.test(cleanCNPJ);
};

// Função principal de validação de documento
export const validateDocument = (document: string, type: DocumentType): boolean => {
  const cleanDocument = document.replace(/\D/g, '');

  if (type === DocumentType.CPF) {
    return validateCPF(cleanDocument);
  }

  if (type === DocumentType.CNPJ) {
    return validateCNPJ(cleanDocument);
  }

  return false;
};

// Função para gerar UUID simples
export const generateProducerId = (): string => {
  return 'prod-' + Math.random().toString(36).substring(2, 11);
};

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

// Formatar documento baseado no tipo
export const formatDocument = (document: string, type: DocumentType): string => {
  if (type === DocumentType.CPF) {
    return formatCPF(document);
  }
  if (type === DocumentType.CNPJ) {
    return formatCNPJ(document);
  }
  return document;
};
