// src/components/AddFarmer/components/producer-form/ProducerForm.tsx
import React from 'react';

import { AutoFillButton, Input } from '@components';
import { Producer } from '@entities';
import { DocumentType } from '@enums';
import { formatDocument } from '@validations';
import { formatPhone, validatePhone } from '@validations';

import { FormCard, FormGrid, HeaderContainer } from './styles';

interface ProducerFormProps {
  producer: Producer;
  validation: {
    producer: {
      nameValid: boolean;
      documentValid: boolean;
      emailValid: boolean;
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
  // 🎯 SCHEMA PARA AUTO-FILL DO PRODUTOR
  const autoFillSchema = {
    name: { type: 'text' as const },
    documentType: {
      type: 'select' as const,
      options: [DocumentType.CPF, DocumentType.CNPJ],
    },
    document: {
      type: producer.documentType === DocumentType.CPF ? 'cpf' : 'cnpj',
    },
    email: { type: 'email' as const },
    phone: { type: 'phone' as const },
    profilePhoto: { type: 'url' as const },
  };

  // 🎯 DADOS ATUAIS DO FORMULÁRIO
  const currentFormData = {
    name: producer.name,
    documentType: producer.documentType,
    document: producer.document,
    email: producer.email,
    phone: producer.phone,
    profilePhoto: producer.profilePhoto,
  };

  // 🎯 FUNÇÃO PARA ATUALIZAR CAMPOS VIA AUTO-FILL
  const handleAutoFillUpdate = (path: string, value: string | number) => {
    console.log(`🎯 AutoFill atualizando ${path} com valor:`, value);

    // Mapeia os caminhos do schema para as propriedades do Producer
    const fieldMap: Record<string, keyof Producer> = {
      name: 'name',
      documentType: 'documentType',
      document: 'document',
      email: 'email',
      phone: 'phone',
      profilePhoto: 'profilePhoto',
    };

    const producerField = fieldMap[path];
    if (producerField) {
      const updates: Partial<Producer> = { [producerField]: value };

      // Se estiver mudando o tipo de documento, limpa o documento atual
      if (path === 'documentType') {
        updates.document = '';
      }

      onUpdate(updates);
    }
  };

  // 🎯 VALIDAÇÃO EM TEMPO REAL DO DOCUMENTO
  const handleDocumentChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const maxLength = producer.documentType === DocumentType.CPF ? 11 : 14;
    onUpdate({ document: numbers.slice(0, maxLength) });
  };

  // 📱 VALIDAÇÃO DO TELEFONE
  const handlePhoneChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    onUpdate({ phone: numbers.slice(0, 11) });
  };

  // 🎨 VALIDAÇÃO DE FOTO
  const isValidImageUrl = (url: string): boolean => {
    return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(url);
  };

  return (
    <FormCard isDark={isDark}>
      {/* 🎯 HEADER COM TÍTULO E BOTÃO AUTO-FILL */}
      <HeaderContainer>
        <h2>👨‍🌾 Dados do Produtor</h2>

        <AutoFillButton
          schema={autoFillSchema}
          onUpdate={handleAutoFillUpdate}
          currentData={currentFormData} // 🎯 CRUCIAL: passa os dados atuais
          isDark={isDark}
          position="top-right"
          tooltipPosition="left" // 🎯 NOVO: controla posição do tooltip
          size="medium"
          fillOnlyEmpty={true} // 🎯 CRUCIAL: só preenche campos vazios
          excludeFields={[]} // Pode excluir campos específicos se necessário
        />
      </HeaderContainer>

      <FormGrid>
        {/* Nome */}
        <Input
          label="Nome Completo *"
          value={producer.name || ''}
          onChange={(value) => onUpdate({ name: value })}
          isDark={isDark}
          valid={validation.producer.nameValid}
          validationMessage={
            producer.name
              ? validation.producer.nameValid
                ? 'Nome válido!'
                : 'Nome deve ter pelo menos 3 caracteres'
              : undefined
          }
          validationType={validation.producer.nameValid ? 'success' : 'error'}
          placeholder="Digite o nome completo"
        />

        {/* Tipo de Documento */}
        <Input
          label="Tipo de Documento *"
          value={producer.documentType || DocumentType.CPF}
          onChange={(value) =>
            onUpdate({
              documentType: value as DocumentType,
              document: '', // Limpa documento ao trocar tipo
            })
          }
          isDark={isDark}
          valid={true}
          options={[
            { value: DocumentType.CPF, label: 'CPF - Pessoa Física' },
            { value: DocumentType.CNPJ, label: 'CNPJ - Pessoa Jurídica' },
          ]}
        />

        {/* Documento */}
        <Input
          label={`${producer.documentType === DocumentType.CPF ? 'CPF' : 'CNPJ'} *`}
          value={formatDocument(producer.document || '', producer.documentType)}
          onChange={handleDocumentChange}
          isDark={isDark}
          valid={producer.document ? validation.producer.documentValid : undefined}
          validationMessage={
            producer.document
              ? validation.producer.documentValid
                ? `${producer.documentType} válido!`
                : `${producer.documentType} inválido - verifique os dígitos`
              : `Digite um ${producer.documentType} válido`
          }
          validationType={
            producer.document ? (validation.producer.documentValid ? 'success' : 'error') : 'info'
          }
          placeholder={
            producer.documentType === DocumentType.CPF ? '000.000.000-00' : '00.000.000/0000-00'
          }
        />

        {/* Email */}
        <Input
          label="Email (opcional)"
          value={producer.email || ''}
          onChange={(value) => onUpdate({ email: value })}
          isDark={isDark}
          type="email"
          valid={producer.email ? validation.producer.emailValid : undefined}
          validationMessage={
            producer.email
              ? validation.producer.emailValid
                ? 'Email válido!'
                : 'Email inválido'
              : undefined
          }
          validationType={validation.producer.emailValid ? 'success' : 'error'}
          placeholder="exemplo@email.com"
        />

        {/* Telefone */}
        <Input
          label="Telefone (opcional)"
          value={formatPhone(producer.phone || '')}
          onChange={handlePhoneChange}
          isDark={isDark}
          valid={producer.phone ? validatePhone(producer.phone) : undefined}
          validationMessage={
            producer.phone
              ? validatePhone(producer.phone)
                ? 'Telefone válido!'
                : 'Telefone deve ter 10 ou 11 dígitos'
              : undefined
          }
          validationType={validatePhone(producer.phone || '') ? 'success' : 'error'}
          placeholder="(11) 99999-9999"
        />

        {/* URL da Foto */}
        <div style={{ gridColumn: '1 / -1' }}>
          <Input
            label="URL da Foto (opcional)"
            value={producer.profilePhoto || ''}
            onChange={(value) => onUpdate({ profilePhoto: value })}
            isDark={isDark}
            valid={producer.profilePhoto ? isValidImageUrl(producer.profilePhoto) : undefined}
            validationMessage={
              producer.profilePhoto
                ? isValidImageUrl(producer.profilePhoto)
                  ? 'URL válida!'
                  : 'URL deve ser uma imagem válida (.jpg, .png, .gif, .webp)'
                : 'Cole uma URL de imagem para ver o preview'
            }
            validationType={
              producer.profilePhoto
                ? isValidImageUrl(producer.profilePhoto)
                  ? 'success'
                  : 'error'
                : 'info'
            }
            placeholder="https://exemplo.com/foto.jpg"
          />
        </div>
      </FormGrid>
    </FormCard>
  );
};
