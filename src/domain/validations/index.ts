import { DocumentType } from '@enums';

// ============= VALIDAÇÕES DE DOCUMENTO =============

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

// Formatar área em hectares
export const formatArea = (area: number): string => {
  return `${area.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} ha`;
};

// Formatar percentual
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
