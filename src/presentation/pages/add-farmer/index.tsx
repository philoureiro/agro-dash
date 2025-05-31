import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@components';
import { useThemeMode } from '@theme';

import {
  AnimatedCounter,
  AreaValidation,
  CulturaCard,
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

// 🔍 VALIDAÇÃO DE CPF/CNPJ
const validateDocument = (doc: string): boolean => {
  const numbers = doc.replace(/\D/g, '');
  return numbers.length === 11 || numbers.length === 14;
};

// 📏 FORMATAÇÃO DE DOCUMENTO
const formatDocument = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
  return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
};

// 🎲 GERAR ID ÚNICO
const generateId = () => Math.random().toString(36).substr(2, 9);

export const AddFarmer = () => {
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const formRef = useRef<HTMLDivElement>(null);

  // 📝 ESTADOS DO FORMULÁRIO
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [produtor, setProdutor] = useState<Produtor>({
    nome: '',
    documento: '',
    fazendas: [],
  });

  // 🎯 IMAGEM HERO DINÂMICA
  const heroImage = useMemo(() => {
    if (produtor.fazendas.length > 0) {
      return farmImages[produtor.fazendas.length % farmImages.length];
    }
    return farmImages[0];
  }, [produtor.fazendas.length]);

  // 📊 ESTATÍSTICAS CALCULADAS
  const stats = useMemo(() => {
    const totalFazendas = produtor.fazendas.length;
    const totalArea = produtor.fazendas.reduce((sum, f) => sum + f.areaTotal, 0);
    const totalCulturas = produtor.fazendas.reduce((sum, f) => sum + f.culturas.length, 0);
    const progresso = Math.min(totalFazendas * 25 + totalCulturas * 10, 100);

    return { totalFazendas, totalArea, totalCulturas, progresso };
  }, [produtor.fazendas]);

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

    if (!produtor.nome.trim()) newErrors.push('Nome do produtor é obrigatório');
    if (!validateDocument(produtor.documento)) newErrors.push('CPF/CNPJ inválido');
    if (produtor.fazendas.length === 0) newErrors.push('Adicione pelo menos uma fazenda');

    produtor.fazendas.forEach((fazenda, index) => {
      if (!fazenda.nome.trim()) newErrors.push(`Nome da fazenda ${index + 1} é obrigatório`);
      if (!fazenda.cidade.trim()) newErrors.push(`Cidade da fazenda ${index + 1} é obrigatória`);
      if (!fazenda.estado) newErrors.push(`Estado da fazenda ${index + 1} é obrigatório`);
      if (fazenda.areaTotal <= 0)
        newErrors.push(`Área total da fazenda ${index + 1} deve ser maior que 0`);
      if (!validateAreas(fazenda)) {
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

      // Scroll para o topo
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      setErrors(['Erro ao salvar. Tente novamente.']);
    } finally {
      setIsLoading(false);
    }
  }, [produtor, validateAreas]);

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

            {/* 📈 BARRA DE PROGRESSO */}
            <ProgressBar>
              <ProgressFill progress={stats.progresso} />
              <span>{stats.progresso}% Completo</span>
            </ProgressBar>
          </HeroSection>

          {/* 📝 FORMULÁRIO PRINCIPAL */}
          <FormSection>
            <FormCard isDark={isDark}>
              <SectionTitle isDark={isDark}>👨‍🌾 Dados do Produtor</SectionTitle>

              <FormGrid>
                <InputGroup>
                  <FloatingLabel isDark={isDark} active={!!produtor.nome}>
                    Nome Completo
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="text"
                    value={produtor.nome}
                    onChange={(e) => setProdutor((prev) => ({ ...prev, nome: e.target.value }))}
                    placeholder=" "
                  />
                </InputGroup>

                <InputGroup>
                  <FloatingLabel isDark={isDark} active={!!produtor.documento}>
                    CPF/CNPJ
                  </FloatingLabel>
                  <StyledInput
                    isDark={isDark}
                    type="text"
                    value={formatDocument(produtor.documento)}
                    onChange={(e) =>
                      setProdutor((prev) => ({
                        ...prev,
                        documento: e.target.value.replace(/\D/g, ''),
                      }))
                    }
                    placeholder=" "
                    maxLength={18}
                  />
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

              {produtor.fazendas.map((fazenda, fazendaIndex) => (
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
                      <FloatingLabel isDark={isDark} active={!!fazenda.nome}>
                        Nome da Fazenda
                      </FloatingLabel>
                      <StyledInput
                        isDark={isDark}
                        type="text"
                        value={fazenda.nome}
                        onChange={(e) => updateFazenda(fazenda.id, 'nome', e.target.value)}
                        placeholder=" "
                      />
                    </InputGroup>

                    <InputGroup>
                      <FloatingLabel isDark={isDark} active={!!fazenda.cidade}>
                        Cidade
                      </FloatingLabel>
                      <StyledInput
                        isDark={isDark}
                        type="text"
                        value={fazenda.cidade}
                        onChange={(e) => updateFazenda(fazenda.id, 'cidade', e.target.value)}
                        placeholder=" "
                      />
                    </InputGroup>

                    <InputGroup>
                      <FloatingLabel isDark={isDark} active={!!fazenda.estado}>
                        Estado
                      </FloatingLabel>
                      <StyledSelect
                        isDark={isDark}
                        value={fazenda.estado}
                        onChange={(e) => updateFazenda(fazenda.id, 'estado', e.target.value)}
                      >
                        {estados.map((estado) => (
                          <option key={estado} value={estado}>
                            {estado}
                          </option>
                        ))}
                      </StyledSelect>
                    </InputGroup>

                    <InputGroup>
                      <FloatingLabel isDark={isDark} active={fazenda.areaTotal > 0}>
                        Área Total (hectares)
                      </FloatingLabel>
                      <StyledInput
                        isDark={isDark}
                        type="number"
                        value={fazenda.areaTotal || ''}
                        onChange={(e) =>
                          updateFazenda(fazenda.id, 'areaTotal', Number(e.target.value))
                        }
                        placeholder=" "
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>

                    <InputGroup>
                      <FloatingLabel isDark={isDark} active={fazenda.areaAgricultavel > 0}>
                        Área Agricultável (hectares)
                      </FloatingLabel>
                      <StyledInput
                        isDark={isDark}
                        type="number"
                        value={fazenda.areaAgricultavel || ''}
                        onChange={(e) =>
                          updateFazenda(fazenda.id, 'areaAgricultavel', Number(e.target.value))
                        }
                        placeholder=" "
                        min="0"
                        step="0.01"
                      />
                    </InputGroup>

                    <InputGroup>
                      <FloatingLabel isDark={isDark} active={fazenda.areaVegetacao > 0}>
                        Área de Vegetação (hectares)
                      </FloatingLabel>
                      <StyledInput
                        isDark={isDark}
                        type="number"
                        value={fazenda.areaVegetacao || ''}
                        onChange={(e) =>
                          updateFazenda(fazenda.id, 'areaVegetacao', Number(e.target.value))
                        }
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
                      {(fazenda.areaAgricultavel + fazenda.areaVegetacao).toLocaleString()} ha) não
                      pode exceder a área total ({fazenda.areaTotal.toLocaleString()} ha)
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

                    {fazenda.culturas.map((cultura, culturaIndex) => (
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
                            <FloatingLabel isDark={isDark} active={!!cultura.tipo}>
                              Tipo de Cultura
                            </FloatingLabel>
                            <StyledSelect
                              isDark={isDark}
                              value={cultura.tipo}
                              onChange={(e) =>
                                updateCultura(fazenda.id, cultura.id, 'tipo', e.target.value)
                              }
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
                            <FloatingLabel isDark={isDark} active={cultura.area > 0}>
                              Área (hectares)
                            </FloatingLabel>
                            <StyledInput
                              isDark={isDark}
                              type="number"
                              value={cultura.area || ''}
                              onChange={(e) =>
                                updateCultura(
                                  fazenda.id,
                                  cultura.id,
                                  'area',
                                  Number(e.target.value),
                                )
                              }
                              placeholder=" "
                              min="0"
                              step="0.01"
                            />
                          </InputGroup>

                          <InputGroup>
                            <FloatingLabel isDark={isDark} active={!!cultura.safra}>
                              Safra
                            </FloatingLabel>
                            <StyledInput
                              isDark={isDark}
                              type="text"
                              value={cultura.safra}
                              onChange={(e) =>
                                updateCultura(fazenda.id, cultura.id, 'safra', e.target.value)
                              }
                              placeholder=" "
                            />
                          </InputGroup>
                        </FormGrid>
                      </CulturaCard>
                    ))}
                  </div>
                </FarmCard>
              ))}
            </FormCard>

            {/* 🎯 AÇÕES DO FORMULÁRIO */}
            <FormActions>
              <SaveDraftButton isDark={isDark} onClick={saveDraft}>
                💾 Salvar Rascunho
              </SaveDraftButton>

              <Button
                style={{
                  fontSize: 30,
                }}
                isDark={isDark}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Salvando...
                  </>
                ) : (
                  '✅ Cadastrar Produtor'
                )}
              </Button>
            </FormActions>
          </FormSection>
        </FormContainer>
      </div>
      {/* 🎉 ALERT DE SUCESSO */}
    </>
  );
};
