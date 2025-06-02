// src/components/AddFarmer/ProducerForm.tsx
import React from 'react';

import { Producer } from '@entities';
import { DocumentType } from '@enums';

import {
  DocumentValidation,
  FloatingLabel,
  FormCard,
  FormGrid,
  InputGroup,
  StyledInput,
  StyledSelect,
} from './styles';

interface ProducerFormProps {
  producer: Producer;
  validation: {
    producer: {
      nameValid: boolean;
      documentValid: boolean;
      emailValid: boolean;
      photoValid: boolean;
    };
  };
  onUpdate: (updates: Partial<Producer>) => void;
  isDark: boolean;
}

export const ProducerForm: React.FC<ProducerFormProps> = ({
  producer,
  validation,
  onUpdate,
  isDark,
}) => {
  const formatDocument = (value: string, type: DocumentType): string => {
    const numbers = value.replace(/\D/g, '');

    if (type === DocumentType.CPF) {
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

  return (
    <FormCard isDark={isDark}>
      <h2>👨‍🌾 Dados do Produtor</h2>

      <FormGrid>
        <InputGroup>
          <FloatingLabel
            isDark={isDark}
            active={!!producer.name}
            valid={validation.producer.nameValid}
          >
            Nome Completo *
          </FloatingLabel>
          <StyledInput
            isDark={isDark}
            value={producer.name}
            valid={validation.producer.nameValid}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder=" "
          />
        </InputGroup>

        <InputGroup>
          <FloatingLabel isDark={isDark} active={!!producer.documentType} valid={true}>
            Tipo de Documento
          </FloatingLabel>
          <StyledSelect
            isDark={isDark}
            value={producer.documentType}
            valid={true}
            onChange={(e) =>
              onUpdate({
                documentType: e.target.value as DocumentType,
                document: '', // Limpa documento quando muda tipo
              })
            }
          >
            <option value={DocumentType.CPF}>CPF</option>
            <option value={DocumentType.CNPJ}>CNPJ</option>
          </StyledSelect>
        </InputGroup>

        <InputGroup>
          <FloatingLabel
            isDark={isDark}
            active={!!producer.document}
            valid={validation.producer.documentValid}
          >
            {producer.documentType === DocumentType.CPF ? 'CPF' : 'CNPJ'} *
          </FloatingLabel>
          <StyledInput
            isDark={isDark}
            value={formatDocument(producer.document, producer.documentType)}
            valid={validation.producer.documentValid}
            onChange={(e) => {
              const numbers = e.target.value.replace(/\D/g, '');
              const maxLength = producer.documentType === DocumentType.CPF ? 11 : 14;
              onUpdate({ document: numbers.slice(0, maxLength) });
            }}
            placeholder=" "
          />

          {producer.document && (
            <DocumentValidation isDark={isDark} isValid={validation.producer.documentValid}>
              <span className="message">
                {validation.producer.documentValid
                  ? `${producer.documentType} válido!`
                  : `${producer.documentType} inválido`}
              </span>
            </DocumentValidation>
          )}
        </InputGroup>

        <InputGroup>
          <FloatingLabel
            isDark={isDark}
            active={!!producer.email}
            valid={validation.producer.emailValid}
          >
            Email
          </FloatingLabel>
          <StyledInput
            isDark={isDark}
            type="email"
            value={producer.email || ''}
            valid={validation.producer.emailValid}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder=" "
          />
        </InputGroup>

        <InputGroup>
          <FloatingLabel isDark={isDark} active={!!producer.phone} valid={true}>
            Telefone
          </FloatingLabel>
          <StyledInput
            isDark={isDark}
            value={producer.phone || ''}
            valid={true}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder=" "
          />
        </InputGroup>

        <InputGroup>
          <FloatingLabel
            isDark={isDark}
            active={!!producer.profilePhoto}
            valid={validation.producer.photoValid}
          >
            URL da Foto (opcional)
          </FloatingLabel>
          <StyledInput
            isDark={isDark}
            value={producer.profilePhoto || ''}
            valid={validation.producer.photoValid}
            onChange={(e) => onUpdate({ profilePhoto: e.target.value })}
            placeholder=" "
          />
        </InputGroup>
      </FormGrid>
    </FormCard>
  );
};
