import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@components';
import { useThemeMode } from '@theme';

import {
  AnimatedCounter,
  AreaValidation,
  CulturaCard,
  DocumentValidation,
  ErrorAlert,
  FarmCard,
  FarmHeader,
  FarmNumber,
  FarmPreview,
  FloatingLabel,
  FormActions,
  FormCard,
  FormContainer,
  FormGrid,
  FormSection,
  HeroImage,
  HeroImageOverlay,
  HeroSection,
  InputGroup,
  LoadingSpinner,
  PreviewImage,
  PreviewInfo,
  ProgressBar,
  ProgressFill,
  RemoveButton,
  SaveDraftButton,
  SectionTitle,
  StyledInput,
  StyledSelect,
  SuccessAlert,
} from './styles';

// 🌾 TIPOS DE DADOS
interface Cultura {
  id: string;
  tipo: string;
  area: number;
  safra: string;
}

interface Fazenda {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  areaTotal: number;
  areaAgricultavel: number;
  areaVegetacao: number;
  culturas: Cultura[];
}

interface Produtor {
  nome: string;
  documento: string;
  fazendas: Fazenda[];
}

// 🎯 ESTADO DE VALIDAÇÃO DOS CAMPOS
interface FieldStates {
  // Produtor
  nomeValid: boolean;
  documentoValid: boolean;

  // Fazendas
  fazendasValid: {
    [key: string]: {
      nomeValid: boolean;
      cidadeValid: boolean;
      estadoValid: boolean;
      areaTotalValid: boolean;
      areaAgricultavelValid: boolean;
      areaVegetacaoValid: boolean;
      areasBalanceadas: boolean;
      culturasValid: {
        [key: string]: {
          tipoValid: boolean;
          areaValid: boolean;
          safraValid: boolean;
        };
      };
    };
  };
}

// 🎯 ESTADO DE FOCUS DOS INPUTS
interface FocusStates {
  [key: string]: boolean;
}

// 🎨 IMAGENS DE FAZENDAS PARA PREVIEW
const farmImages = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=400&fit=crop',
  'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=400&fit=crop',
];

// 📍 ESTADOS BRASILEIROS
const estados = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];

// 🌱 TIPOS DE CULTURAS
const tiposCulturas = [
  'Soja',
  'Milho',
  'Algodão',
  'Cana-de-açúcar',
  'Café',
  'Arroz',
  'Feijão',
  'Trigo',
  'Sorgo',
  'Girassol',
  'Amendoim',
  'Mandioca',
];

// 🔍 VALIDAÇÃO DE CPF/CNPJ COM REGEX
const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(numbers)) return false;

  // Validação do algoritmo do CPF
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(numbers.charAt(i)) * (10 - i);
  }
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (parseInt(numbers.charAt(9)) !== checkDigit) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(numbers.charAt(i)) * (11 - i);
  }
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;

  return parseInt(numbers.charAt(10)) === checkDigit;
};

const validateCNPJ = (cnpj: string): boolean => {
  const numbers = cnpj.replace(/\D/g, '');
  if (numbers.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(numbers)) return false;

  // Validação do algoritmo do CNPJ
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers.charAt(i)) * weights1[i];
  }
  let checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (parseInt(numbers.charAt(12)) !== checkDigit) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers.charAt(i)) * weights2[i];
  }
  checkDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);

  return parseInt(numbers.charAt(13)) === checkDigit;
};

const validateDocument = (doc: string): boolean => {
  const numbers = doc.replace(/\D/g, '');
  if (numbers.length === 11) return validateCPF(doc);
  if (numbers.length === 14) return validateCNPJ(doc);
  return false;
};

// 📏 FORMATAÇÃO DE DOCUMENTO CORRIGIDA
const formatDocument = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  // Se não tem números, retorna vazio
  if (!numbers) return '';

  // CPF: 11 dígitos ou menos
  if (numbers.length <= 11) {
    // CPF progressivo: 123.456.789-01
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  // CNPJ: mais de 11 dígitos
  // CNPJ progressivo: 12.345.678/0001-23
  return numbers
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

// 🎲 GERAR ID ÚNICO
const generateId = () => Math.random().toString(36).substr(2, 9);

export const AddFarmer = () => {
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const formRef = useRef<HTMLDivElement>(null);

  // 📝 ESTADOS DO FORMULÁRIO
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // 🎯 ESTADOS DE FOCUS DOS INPUTS
  const [focusStates, setFocusStates] = useState<FocusStates>({});

  const [produtor, setProdutor] = useState<Produtor>({
    nome: '',
    documento: '',
    fazendas: [],
  });

  // 📊 ESTADOS DE VALIDAÇÃO COMPLETOS
  const fieldStates = useMemo((): FieldStates => {
    const states: FieldStates = {
      nomeValid: produtor.nome.trim().length >= 3,
      documentoValid: validateDocument(produtor.documento),
      fazendasValid: {},
    };

    produtor.fazendas.forEach((fazenda) => {
      const areaSum = fazenda.areaAgricultavel + fazenda.areaVegetacao;
      const areasBalanceadas = fazenda.areaTotal > 0 ? areaSum <= fazenda.areaTotal : true;

      states.fazendasValid[fazenda.id] = {
        nomeValid: fazenda.nome.trim().length >= 3,
        cidadeValid: fazenda.cidade.trim().length >= 2,
        estadoValid: !!fazenda.estado,
        areaTotalValid: fazenda.areaTotal > 0,
        areaAgricultavelValid: fazenda.areaAgricultavel >= 0,
        areaVegetacaoValid: fazenda.areaVegetacao >= 0,
        areasBalanceadas,
        culturasValid: {},
      };

      fazenda.culturas.forEach((cultura) => {
        states.fazendasValid[fazenda.id].culturasValid[cultura.id] = {
          tipoValid: !!cultura.tipo,
          areaValid: cultura.area > 0,
          safraValid: cultura.safra.trim().length >= 4,
        };
      });
    });

    return states;
  }, [produtor]);

  // 🎯 IMAGEM HERO DINÂMICA
  const heroImage = useMemo(() => {
    if (produtor.fazendas.length > 0) {
      return farmImages[produtor.fazendas.length % farmImages.length];
    }
    return farmImages[0];
  }, [produtor.fazendas.length]);

  // 📊 ESTATÍSTICAS E PROGRESSO CALCULADOS
  const stats = useMemo(() => {
    const totalFazendas = produtor.fazendas.length;
    const totalArea = produtor.fazendas.reduce((sum, f) => sum + f.areaTotal, 0);
    const totalCulturas = produtor.fazendas.reduce((sum, f) => sum + f.culturas.length, 0);

    // 📈 CÁLCULO DE PROGRESSO BASEADO NA VALIDAÇÃO
    let totalFields = 0;
    let validFields = 0;

    // Campos do produtor (2 campos)
    totalFields += 2;
    if (fieldStates.nomeValid) validFields++;
    if (fieldStates.documentoValid) validFields++;

    // Campos das fazendas
    produtor.fazendas.forEach((fazenda) => {
      totalFields += 6; // 6 campos por fazenda
      const fazendaState = fieldStates.fazendasValid[fazenda.id];
      if (fazendaState) {
        if (fazendaState.nomeValid) validFields++;
        if (fazendaState.cidadeValid) validFields++;
        if (fazendaState.estadoValid) validFields++;
        if (fazendaState.areaTotalValid) validFields++;
        if (fazendaState.areaAgricultavelValid) validFields++;
        if (fazendaState.areaVegetacaoValid) validFields++;
      }

      // Campos das culturas
      fazenda.culturas.forEach((cultura) => {
        totalFields += 3; // 3 campos por cultura
        const culturaState = fazendaState?.culturasValid[cultura.id];
        if (culturaState) {
          if (culturaState.tipoValid) validFields++;
          if (culturaState.areaValid) validFields++;
          if (culturaState.safraValid) validFields++;
        }
      });
    });

    const progresso = totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;

    return { totalFazendas, totalArea, totalCulturas, progresso, validFields, totalFields };
  }, [produtor, fieldStates]);

  // 🎯 HANDLES DE FOCUS
  const handleFocus = useCallback((fieldKey: string) => {
    setFocusStates((prev) => ({ ...prev, [fieldKey]: true }));
  }, []);

  const handleBlur = useCallback((fieldKey: string) => {
    setFocusStates((prev) => ({ ...prev, [fieldKey]: false }));
  }, []);

  // 🏭 ADICIONAR NOVA FAZENDA
  const addFazenda = useCallback(() => {
    const novaFazenda: Fazenda = {
      id: generateId(),
      nome: '',
      cidade: '',
      estado: '',
      areaTotal: 0,
      areaAgricultavel: 0,
      areaVegetacao: 0,
      culturas: [],
    };

    setProdutor((prev) => ({
      ...prev,
      fazendas: [...prev.fazendas, novaFazenda],
    }));

    // Scroll suave para a nova fazenda
    setTimeout(() => {
      const newFarmElement = document.querySelector(`[data-farm-id="${novaFazenda.id}"]`);
      if (newFarmElement) {
        newFarmElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  }, []);

  // 🗑️ REMOVER FAZENDA
  const removeFazenda = useCallback((fazendaId: string) => {
    setProdutor((prev) => ({
      ...prev,
      fazendas: prev.fazendas.filter((f) => f.id !== fazendaId),
    }));
  }, []);

  // ✏️ ATUALIZAR FAZENDA
  const updateFazenda = useCallback((fazendaId: string, field: keyof Fazenda, value: any) => {
    setProdutor((prev) => ({
      ...prev,
      fazendas: prev.fazendas.map((f) => (f.id === fazendaId ? { ...f, [field]: value } : f)),
    }));
  }, []);

  // 🌱 ADICIONAR CULTURA
  const addCultura = useCallback(
    (fazendaId: string) => {
      const novaCultura: Cultura = {
        id: generateId(),
        tipo: '',
        area: 0,
        safra: new Date().getFullYear().toString(),
      };

      updateFazenda(
        fazendaId,
        'culturas',
        produtor.fazendas.find((f) => f.id === fazendaId)?.culturas.concat(novaCultura) || [
          novaCultura,
        ],
      );
    },
    [produtor.fazendas, updateFazenda],
  );

  // 🗑️ REMOVER CULTURA
  const removeCultura = useCallback(
    (fazendaId: string, culturaId: string) => {
      const fazenda = produtor.fazendas.find((f) => f.id === fazendaId);
      if (fazenda) {
        updateFazenda(
          fazendaId,
          'culturas',
          fazenda.culturas.filter((c) => c.id !== culturaId),
        );
      }
    },
    [produtor.fazendas, updateFazenda],
  );

  // ✏️ ATUALIZAR CULTURA
  const updateCultura = useCallback(
    (fazendaId: string, culturaId: string, field: keyof Cultura, value: any) => {
      const fazenda = produtor.fazendas.find((f) => f.id === fazendaId);
      if (fazenda) {
        updateFazenda(
          fazendaId,
          'culturas',
          fazenda.culturas.map((c) => (c.id === culturaId ? { ...c, [field]: value } : c)),
        );
      }
    },
    [produtor.fazendas, updateFazenda],
  );

  // ✅ VALIDAÇÃO DE ÁREAS
  const validateAreas = useCallback((fazenda: Fazenda): boolean => {
    return fazenda.areaAgricultavel + fazenda.areaVegetacao <= fazenda.areaTotal;
  }, []);

  // 📤 SUBMETER FORMULÁRIO
  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    // Validações
    const newErrors: string[] = [];

    if (!fieldStates.nomeValid) newErrors.push('Nome do produtor deve ter pelo menos 3 caracteres');
    if (!fieldStates.documentoValid) newErrors.push('CPF/CNPJ inválido');
    if (produtor.fazendas.length === 0) newErrors.push('Adicione pelo menos uma fazenda');

    produtor.fazendas.forEach((fazenda, index) => {
      const fazendaState = fieldStates.fazendasValid[fazenda.id];
      if (!fazendaState?.nomeValid)
        newErrors.push(`Nome da fazenda ${index + 1} deve ter pelo menos 3 caracteres`);
      if (!fazendaState?.cidadeValid)
        newErrors.push(`Cidade da fazenda ${index + 1} deve ter pelo menos 2 caracteres`);
      if (!fazendaState?.estadoValid)
        newErrors.push(`Estado da fazenda ${index + 1} é obrigatório`);
      if (!fazendaState?.areaTotalValid)
        newErrors.push(`Área total da fazenda ${index + 1} deve ser maior que 0`);
      if (!fazendaState?.areasBalanceadas) {
        newErrors.push(`Soma das áreas da fazenda ${index + 1} não pode exceder a área total`);
      }
    });

    if (newErrors.length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    // Simular salvamento
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setProdutor({ nome: '', documento: '', fazendas: [] });
      setFocusStates({});

      // Limpar localStorage
      localStorage.removeItem('addFarmer_draft');

      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setErrors(['Erro ao salvar. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  }, [produtor, fieldStates]);

  // 💾 SALVAR RASCUNHO
  const saveDraft = useCallback(() => {
    localStorage.setItem('addFarmer_draft', JSON.stringify(produtor));
    alert('💾 Rascunho salvo com sucesso!');
  }, [produtor]);

  // 📂 CARREGAR RASCUNHO
  useEffect(() => {
    const draft = localStorage.getItem('addFarmer_draft');
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.nome || parsedDraft.fazendas?.length > 0) {
          setProdutor(parsedDraft);
        }
      } catch (error) {
        console.error('Erro ao carregar rascunho:', error);
      }
    }
  }, []);

  return (
    <>
      <meta name="title" content="Cadastrar Produtor" />

      <div style={{ marginTop: 80, marginBottom: 100 }}>
        {showSuccess && (
          <SuccessAlert isDark={isDark}>
            <div>✅ Produtor cadastrado com sucesso!</div>
          </SuccessAlert>
        )}

        {/* ⚠️ ALERTS DE ERRO */}
        {errors.length > 0 && (
          <ErrorAlert isDark={isDark}>
            {errors.map((error, index) => (
              <div key={index}>❌ {error}</div>
            ))}
          </ErrorAlert>
        )}

        <FormContainer isDark={isDark} ref={formRef}>
          {/* 🌄 SEÇÃO HERO DINÂMICA */}
          <HeroSection isDark={isDark}>
            <HeroImage src={heroImage} alt="Fazenda" loading="lazy" />
            <HeroImageOverlay isDark={isDark} />

            {/* 📊 ESTATÍSTICAS FLUTUANTES */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '20px',
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap',
              }}
            >
              <AnimatedCounter isDark={isDark}>
                <strong>{stats.totalFazendas}</strong>
                <span>Fazendas</span>
              </AnimatedCounter>
              <AnimatedCounter isDark={isDark}>
                <strong>{stats.totalArea.toLocaleString()}</strong>
                <span>Hectares</span>
              </AnimatedCounter>
              <AnimatedCounter isDark={isDark}>
                <strong>{stats.totalCulturas}</strong>
                <span>Culturas</span>
              </AnimatedCounter>
            </div>

            {/* 📈 BARRA DE PROGRESSO DINÂMICA */}
            <ProgressBar>
              <ProgressFill progress={stats.progresso} />
              <span>
                {stats.progresso}% Completo ({stats.validFields}/{stats.totalFields} campos)
              </span>
            </ProgressBar>
          </HeroSection>

          {/* 📝 FORMULÁRIO PRINCIPAL */}
          <FormSection>
            <FormCard isDark={isDark}>
              <SectionTitle isDark={isDark}>👨‍🌾 Dados do Produtor</SectionTitle>

              <FormGrid>
                <InputGroup>
                  <FloatingLabel
                    isDark={isDark}
                    active={!!produtor.nome || focusStates['produtor-nome']}
                    valid={fieldStates.nomeValid}
                  >
                    Nome Completo
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="text"
                    value={produtor.nome}
                    valid={fieldStates.nomeValid}
                    onChange={(e) => setProdutor((prev) => ({ ...prev, nome: e.target.value }))}
                    onFocus={() => handleFocus('produtor-nome')}
                    onBlur={() => handleBlur('produtor-nome')}
                    placeholder=" "
                  />
                </InputGroup>

                <InputGroup>
                  <FloatingLabel
                    isDark={isDark}
                    active={!!produtor.documento || focusStates['produtor-documento']}
                    valid={!!produtor.documento && fieldStates.documentoValid}
                  >
                    CPF/CNPJ
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="text"
                    value={formatDocument(produtor.documento)}
                    valid={!!produtor.documento && fieldStates.documentoValid}
                    onChange={(e) => {
                      // Remove tudo que não é número e limita a 14 dígitos
                      const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 14);
                      setProdutor((prev) => ({
                        ...prev,
                        documento: numbersOnly,
                      }));
                    }}
                    onFocus={() => handleFocus('produtor-documento')}
                    onBlur={() => handleBlur('produtor-documento')}
                    placeholder=" "
                  />

                  {/* 🎯 VALIDAÇÃO EM TEMPO REAL */}
                  {produtor.documento && (
                    <DocumentValidation isDark={isDark} isValid={fieldStates.documentoValid}>
                      <span className="message">
                        {fieldStates.documentoValid
                          ? produtor.documento.replace(/\D/g, '').length === 11
                            ? 'CPF válido!'
                            : 'CNPJ válido!'
                          : ` ${produtor.documento.replace(/\D/g, '').length <= 11 ? 'CPF' : 'CNPJ'} inválido. Verifique os dígitos.`}
                      </span>
                    </DocumentValidation>
                  )}

                  {/* 🎯 DICA QUANDO VAZIO */}
                  {!produtor.documento && focusStates['produtor-documento'] && (
                    <DocumentValidation isDark={isDark}>
                      <span className="message">
                        📝 Digite um CPF (11 dígitos) ou CNPJ (14 dígitos)
                      </span>
                    </DocumentValidation>
                  )}
                </InputGroup>
              </FormGrid>
            </FormCard>

            {/* 🏭 SEÇÃO DE FAZENDAS */}
            <FormCard isDark={isDark}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '2rem',
                }}
              >
                <SectionTitle isDark={isDark}>
                  🏭 Fazendas ({produtor.fazendas.length})
                </SectionTitle>
                <Button isDark={isDark} onClick={addFazenda}>
                  ➕ Adicionar Fazenda
                </Button>
              </div>

              {produtor.fazendas.map((fazenda, fazendaIndex) => {
                const fazendaState = fieldStates.fazendasValid[fazenda.id];

                return (
                  <FarmCard key={fazenda.id} isDark={isDark} data-farm-id={fazenda.id}>
                    <FarmHeader>
                      <FarmNumber isDark={isDark}>Fazenda #{fazendaIndex + 1}</FarmNumber>
                      {produtor.fazendas.length > 1 && (
                        <RemoveButton isDark={isDark} onClick={() => removeFazenda(fazenda.id)}>
                          🗑️
                        </RemoveButton>
                      )}
                    </FarmHeader>

                    {/* 🖼️ PREVIEW DA FAZENDA */}
                    <FarmPreview isDark={isDark}>
                      <PreviewImage
                        src={farmImages[fazendaIndex % farmImages.length]}
                        alt={`Fazenda ${fazendaIndex + 1}`}
                      />
                      <PreviewInfo>
                        <h4>{fazenda.nome || `Fazenda ${fazendaIndex + 1}`}</h4>
                        <p>
                          📍 {fazenda.cidade || 'Cidade'}, {fazenda.estado || 'Estado'}
                        </p>
                        <p>📏 {fazenda.areaTotal.toLocaleString()} hectares</p>
                      </PreviewInfo>
                    </FarmPreview>

                    <FormGrid>
                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!fazenda.nome || focusStates[`fazenda-${fazenda.id}-nome`]}
                          valid={fazendaState?.nomeValid}
                        >
                          Nome da Fazenda
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="text"
                          value={fazenda.nome}
                          valid={fazendaState?.nomeValid}
                          onChange={(e) => updateFazenda(fazenda.id, 'nome', e.target.value)}
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-nome`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-nome`)}
                          placeholder=" "
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!fazenda.cidade || focusStates[`fazenda-${fazenda.id}-cidade`]}
                          valid={fazendaState?.cidadeValid}
                        >
                          Cidade
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="text"
                          value={fazenda.cidade}
                          valid={fazendaState?.cidadeValid}
                          onChange={(e) => updateFazenda(fazenda.id, 'cidade', e.target.value)}
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-cidade`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-cidade`)}
                          placeholder=" "
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={!!fazenda.estado || focusStates[`fazenda-${fazenda.id}-estado`]}
                          valid={fazendaState?.estadoValid}
                        >
                          Estado
                        </FloatingLabel>
                        <StyledSelect
                          isDark={isDark}
                          value={fazenda.estado}
                          valid={fazendaState?.estadoValid}
                          onChange={(e) => updateFazenda(fazenda.id, 'estado', e.target.value)}
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-estado`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-estado`)}
                        >
                          <option value="">Selecione</option>
                          {estados.map((estado) => (
                            <option key={estado} value={estado}>
                              {estado}
                            </option>
                          ))}
                        </StyledSelect>
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={
                            fazenda.areaTotal > 0 || focusStates[`fazenda-${fazenda.id}-areaTotal`]
                          }
                          valid={fazendaState?.areaTotalValid}
                        >
                          Área Total (hectares)
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="number"
                          value={fazenda.areaTotal || ''}
                          valid={fazendaState?.areaTotalValid}
                          onChange={(e) =>
                            updateFazenda(fazenda.id, 'areaTotal', Number(e.target.value))
                          }
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-areaTotal`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-areaTotal`)}
                          placeholder=" "
                          min="0"
                          step="0.01"
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={
                            fazenda.areaAgricultavel > 0 ||
                            focusStates[`fazenda-${fazenda.id}-areaAgricultavel`]
                          }
                          valid={fazendaState?.areaAgricultavelValid}
                        >
                          Área Agricultável (hectares)
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="number"
                          value={fazenda.areaAgricultavel || ''}
                          valid={fazendaState?.areaAgricultavelValid}
                          onChange={(e) =>
                            updateFazenda(fazenda.id, 'areaAgricultavel', Number(e.target.value))
                          }
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-areaAgricultavel`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-areaAgricultavel`)}
                          placeholder=" "
                          min="0"
                          step="0.01"
                        />
                      </InputGroup>

                      <InputGroup>
                        <FloatingLabel
                          isDark={isDark}
                          active={
                            fazenda.areaVegetacao > 0 ||
                            focusStates[`fazenda-${fazenda.id}-areaVegetacao`]
                          }
                          valid={fazendaState?.areaVegetacaoValid}
                        >
                          Área de Vegetação (hectares)
                        </FloatingLabel>
                        <StyledInput
                          isDark={isDark}
                          type="number"
                          value={fazenda.areaVegetacao || ''}
                          valid={fazendaState?.areaVegetacaoValid}
                          onChange={(e) =>
                            updateFazenda(fazenda.id, 'areaVegetacao', Number(e.target.value))
                          }
                          onFocus={() => handleFocus(`fazenda-${fazenda.id}-areaVegetacao`)}
                          onBlur={() => handleBlur(`fazenda-${fazenda.id}-areaVegetacao`)}
                          placeholder=" "
                          min="0"
                          step="0.01"
                        />
                      </InputGroup>
                    </FormGrid>

                    {/* ⚠️ VALIDAÇÃO DE ÁREAS */}
                    {fazenda.areaTotal > 0 && !validateAreas(fazenda) && (
                      <AreaValidation isDark={isDark}>
                        ⚠️ A soma das áreas (
                        {(fazenda.areaAgricultavel + fazenda.areaVegetacao).toLocaleString()} ha)
                        não pode exceder a área total ({fazenda.areaTotal.toLocaleString()} ha)
                      </AreaValidation>
                    )}

                    {/* 🌱 CULTURAS DA FAZENDA */}
                    <div style={{ marginTop: '2rem' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '1rem',
                        }}
                      >
                        <h4
                          style={{
                            color: isDark ? '#fff' : '#2c3e50',
                            margin: 0,
                          }}
                        >
                          🌱 Culturas ({fazenda.culturas.length})
                        </h4>
                        <Button
                          isDark={isDark}
                          onClick={() => addCultura(fazenda.id)}
                          style={{ fontSize: '0.9rem', padding: '8px 16px' }}
                        >
                          ➕ Adicionar Cultura
                        </Button>
                      </div>

                      {fazenda.culturas.map((cultura, culturaIndex) => {
                        const culturaState = fazendaState?.culturasValid[cultura.id];

                        return (
                          <CulturaCard key={cultura.id} isDark={isDark}>
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '1rem',
                              }}
                            >
                              <span
                                style={{
                                  color: isDark ? '#37cb83' : '#27ae60',
                                  fontWeight: 'bold',
                                }}
                              >
                                Cultura #{culturaIndex + 1}
                              </span>
                              <RemoveButton
                                isDark={isDark}
                                onClick={() => removeCultura(fazenda.id, cultura.id)}
                                style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                              >
                                🗑️
                              </RemoveButton>
                            </div>

                            <FormGrid style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                              <InputGroup>
                                <FloatingLabel
                                  isDark={isDark}
                                  active={
                                    !!cultura.tipo || focusStates[`cultura-${cultura.id}-tipo`]
                                  }
                                  valid={culturaState?.tipoValid}
                                >
                                  Tipo de Cultura
                                </FloatingLabel>
                                <StyledSelect
                                  isDark={isDark}
                                  value={cultura.tipo}
                                  valid={culturaState?.tipoValid}
                                  onChange={(e) =>
                                    updateCultura(fazenda.id, cultura.id, 'tipo', e.target.value)
                                  }
                                  onFocus={() => handleFocus(`cultura-${cultura.id}-tipo`)}
                                  onBlur={() => handleBlur(`cultura-${cultura.id}-tipo`)}
                                >
                                  <option value="">Selecione</option>
                                  {tiposCulturas.map((tipo) => (
                                    <option key={tipo} value={tipo}>
                                      {tipo}
                                    </option>
                                  ))}
                                </StyledSelect>
                              </InputGroup>

                              <InputGroup>
                                <FloatingLabel
                                  isDark={isDark}
                                  active={
                                    cultura.area > 0 || focusStates[`cultura-${cultura.id}-area`]
                                  }
                                  valid={culturaState?.areaValid}
                                >
                                  Área (hectares)
                                </FloatingLabel>
                                <StyledInput
                                  isDark={isDark}
                                  type="number"
                                  value={cultura.area || ''}
                                  valid={culturaState?.areaValid}
                                  onChange={(e) =>
                                    updateCultura(
                                      fazenda.id,
                                      cultura.id,
                                      'area',
                                      Number(e.target.value),
                                    )
                                  }
                                  onFocus={() => handleFocus(`cultura-${cultura.id}-area`)}
                                  onBlur={() => handleBlur(`cultura-${cultura.id}-area`)}
                                  placeholder=" "
                                  min="0"
                                  step="0.01"
                                />
                              </InputGroup>

                              <InputGroup>
                                <FloatingLabel
                                  isDark={isDark}
                                  active={
                                    !!cultura.safra || focusStates[`cultura-${cultura.id}-safra`]
                                  }
                                  valid={culturaState?.safraValid}
                                >
                                  Safra
                                </FloatingLabel>
                                <StyledInput
                                  isDark={isDark}
                                  type="text"
                                  value={cultura.safra}
                                  valid={culturaState?.safraValid}
                                  onChange={(e) =>
                                    updateCultura(fazenda.id, cultura.id, 'safra', e.target.value)
                                  }
                                  onFocus={() => handleFocus(`cultura-${cultura.id}-safra`)}
                                  onBlur={() => handleBlur(`cultura-${cultura.id}-safra`)}
                                  placeholder=" "
                                />
                              </InputGroup>
                            </FormGrid>
                          </CulturaCard>
                        );
                      })}
                    </div>
                  </FarmCard>
                );
              })}
            </FormCard>

            {/* 🎯 AÇÕES DO FORMULÁRIO */}
            <FormActions>
              <SaveDraftButton isDark={isDark} onClick={saveDraft}>
                💾 Salvar Rascunho
              </SaveDraftButton>

              <Button
                style={{
                  fontSize: 20,
                  width: '400px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                isDark={isDark}
                onClick={handleSubmit}
                disabled={isLoading || stats.progresso < 100}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Salvando...
                  </>
                ) : stats.progresso === 100 ? (
                  '✅ Cadastrar Produtor'
                ) : (
                  `📋 Complete o formulário (${stats.progresso}%)`
                )}
              </Button>
            </FormActions>
          </FormSection>
        </FormContainer>
      </div>
    </>
  );
};
