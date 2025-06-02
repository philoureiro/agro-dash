import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router';

import { Button } from '@components';
import { useThemeMode } from '@theme';

import {
  BackButton,
  ChangesSummary,
  CompactCard,
  CompactCounter,
  CompactGrid,
  CompactInput,
  CompactLabel,
  CompactSelect,
  CropRow,
  DocumentValidation,
  EditContainer,
  EditHeader,
  ErrorBanner,
  FarmRow,
  FloatingActions,
  HeaderActions,
  HeaderStats,
  HeaderTitle,
  LastModified,
  LoadingOverlay,
  QuickActions,
  SectionDivider,
  SectionHeader,
  StatusBadge,
  SuccessBanner,
  TabButton,
  TabContainer,
  UnsavedChanges,
  ValidationStatus,
} from './styles';

// 🌾 TIPOS DE DADOS (mesmos da tela de cadastro)
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
  id: string;
  nome: string;
  documento: string;
  fazendas: Fazenda[];
  createdAt: string;
  updatedAt: string;
}

// 🎯 VALIDAÇÃO DOS CAMPOS (mesma lógica)
interface FieldStates {
  nomeValid: boolean;
  documentoValid: boolean;
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

// 📍 CONSTANTES (mesmas da tela de cadastro)
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

// 🔍 VALIDAÇÃO DE CPF/CNPJ (mesmas funções)
const validateCPF = (cpf: string): boolean => {
  const numbers = cpf.replace(/\D/g, '');
  if (numbers.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(numbers)) return false;

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
  if (/^(\d)\1{13}$/.test(numbers)) return false;

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

const formatDocument = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (!numbers) return '';

  if (numbers.length <= 11) {
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

const generateId = () => Math.random().toString(36).substr(2, 9);

export const EditFarmer = () => {
  const { id } = useParams<{ id: string }>();
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const formRef = useRef<HTMLDivElement>(null);

  // 📝 ESTADOS DO FORMULÁRIO
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'dados' | 'fazendas'>('dados');

  const [originalProdutor, setOriginalProdutor] = useState<Produtor | null>(null);
  const [produtor, setProdutor] = useState<Produtor>({
    id: '',
    nome: '',
    documento: '',
    fazendas: [],
    createdAt: '',
    updatedAt: '',
  });

  // 📊 VALIDAÇÃO DOS CAMPOS
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

  // 📊 ESTATÍSTICAS
  const stats = useMemo(() => {
    const totalFazendas = produtor.fazendas.length;
    const totalArea = produtor.fazendas.reduce((sum, f) => sum + f.areaTotal, 0);
    const totalCulturas = produtor.fazendas.reduce((sum, f) => sum + f.culturas.length, 0);

    let totalFields = 2; // nome e documento
    let validFields = 0;

    if (fieldStates.nomeValid) validFields++;
    if (fieldStates.documentoValid) validFields++;

    produtor.fazendas.forEach((fazenda) => {
      totalFields += 6;
      const fazendaState = fieldStates.fazendasValid[fazenda.id];
      if (fazendaState) {
        if (fazendaState.nomeValid) validFields++;
        if (fazendaState.cidadeValid) validFields++;
        if (fazendaState.estadoValid) validFields++;
        if (fazendaState.areaTotalValid) validFields++;
        if (fazendaState.areaAgricultavelValid) validFields++;
        if (fazendaState.areaVegetacaoValid) validFields++;
      }

      fazenda.culturas.forEach(() => {
        totalFields += 3;
        // ... validação das culturas
      });
    });

    const progresso = totalFields > 0 ? Math.round((validFields / totalFields) * 100) : 0;
    return { totalFazendas, totalArea, totalCulturas, progresso };
  }, [produtor, fieldStates]);

  // 🔄 DETECTAR MUDANÇAS
  useEffect(() => {
    if (originalProdutor) {
      const hasChanges = JSON.stringify(originalProdutor) !== JSON.stringify(produtor);
      setHasUnsavedChanges(hasChanges);
    }
  }, [produtor, originalProdutor]);

  // 📂 CARREGAR DADOS DO PRODUTOR - CORRIGIDO
  useEffect(() => {
    const loadProdutor = async () => {
      if (!id) return;

      setIsLoadingData(true);
      try {
        // Simular carregamento da API
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Dados simulados
        const produtorData: Produtor = {
          id: id,
          nome: 'João Silva Santos',
          documento: '12345678901',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-12-20T15:45:00Z',
          fazendas: [
            {
              id: 'fazenda1',
              nome: 'Fazenda São João',
              cidade: 'Ribeirão Preto',
              estado: 'SP',
              areaTotal: 1000,
              areaAgricultavel: 800,
              areaVegetacao: 200,
              culturas: [
                {
                  id: 'cultura1',
                  tipo: 'Soja',
                  area: 400,
                  safra: '2024',
                },
                {
                  id: 'cultura2',
                  tipo: 'Milho',
                  area: 400,
                  safra: '2024',
                },
              ],
            },
          ],
        };

        setProdutor(produtorData);
        setOriginalProdutor(produtorData); // ✅ REMOVE O JSON.parse/stringify daqui
      } catch (error) {
        setErrors(['Erro ao carregar dados do produtor']);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadProdutor();
  }, [id]); // ✅ DEPENDÊNCIA APENAS DO ID

  // 🏭 AÇÕES DAS FAZENDAS
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
  }, []);

  const removeFazenda = useCallback((fazendaId: string) => {
    setProdutor((prev) => ({
      ...prev,
      fazendas: prev.fazendas.filter((f) => f.id !== fazendaId),
    }));
  }, []);

  const updateFazenda = useCallback((fazendaId: string, field: keyof Fazenda, value: any) => {
    setProdutor((prev) => ({
      ...prev,
      fazendas: prev.fazendas.map((f) => (f.id === fazendaId ? { ...f, [field]: value } : f)),
    }));
  }, []);

  // 🌱 AÇÕES DAS CULTURAS
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

  // 💾 SALVAR ALTERAÇÕES - CORRIGIDO
  const handleSave = useCallback(async () => {
    setIsLoading(true);
    setErrors([]);

    try {
      // Validações
      const newErrors: string[] = [];
      if (!fieldStates.nomeValid) newErrors.push('Nome deve ter pelo menos 3 caracteres');
      if (!fieldStates.documentoValid) newErrors.push('CPF/CNPJ inválido');

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      // Simular salvamento
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setShowSuccess(true);
      setOriginalProdutor({ ...produtor }); // ✅ SPREAD OPERATOR EM VEZ DE JSON
      setHasUnsavedChanges(false);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrors(['Erro ao salvar alterações']);
    } finally {
      setIsLoading(false);
    }
  }, [produtor, fieldStates]);

  // 🔄 REVERTER ALTERAÇÕES - CORRIGIDO
  const handleRevert = useCallback(() => {
    if (originalProdutor) {
      setProdutor({ ...originalProdutor }); // ✅ SPREAD OPERATOR
      setHasUnsavedChanges(false);
    }
  }, [originalProdutor]);

  return (
    <>
      <meta name="title" content="Editar Produtor" />

      <EditContainer isDark={isDark} ref={formRef}>
        {/* 🎉 ALERTAS */}
        {showSuccess && (
          <SuccessBanner isDark={isDark}>✅ Alterações salvas com sucesso!</SuccessBanner>
        )}

        {errors.length > 0 && (
          <ErrorBanner isDark={isDark}>
            {errors.map((error, index) => (
              <div key={index}>❌ {error}</div>
            ))}
          </ErrorBanner>
        )}

        {/* 📋 HEADER COMPACTO */}
        <EditHeader isDark={isDark}>
          <div className="header-left">
            <BackButton isDark={isDark} onClick={() => window.history.back()}>
              ← Voltar
            </BackButton>
            <div>
              <HeaderTitle isDark={isDark}>✏️ Editando: {produtor.nome || 'Produtor'}</HeaderTitle>
              <LastModified isDark={isDark}>
                Última alteração: {new Date(produtor.updatedAt).toLocaleString('pt-BR')}
              </LastModified>
            </div>
          </div>

          <HeaderActions>
            <HeaderStats>
              <CompactCounter isDark={isDark}>
                <strong>{stats.totalFazendas}</strong>
                <span>Fazendas</span>
              </CompactCounter>
              <CompactCounter isDark={isDark}>
                <strong>{stats.totalArea.toLocaleString()}</strong>
                <span>Hectares</span>
              </CompactCounter>
              <CompactCounter isDark={isDark}>
                <strong>{stats.totalCulturas}</strong>
                <span>Culturas</span>
              </CompactCounter>
            </HeaderStats>

            <ValidationStatus isDark={isDark} valid={stats.progresso === 100}>
              {stats.progresso}% Válido
            </ValidationStatus>
          </HeaderActions>
        </EditHeader>

        {/* ⚠️ MUDANÇAS NÃO SALVAS */}
        {hasUnsavedChanges && (
          <UnsavedChanges isDark={isDark}>
            <div className="changes-info">⚠️ Você tem alterações não salvas</div>
            <div className="changes-actions">
              <button onClick={handleRevert}>Descartar</button>
              <button onClick={handleSave} disabled={isLoading}>
                {isLoading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </UnsavedChanges>
        )}

        {/* 🎯 NAVEGAÇÃO POR ABAS */}
        <TabContainer isDark={isDark}>
          <TabButton
            isDark={isDark}
            active={activeTab === 'dados'}
            onClick={() => setActiveTab('dados')}
          >
            👨‍🌾 Dados Pessoais
          </TabButton>
          <TabButton
            isDark={isDark}
            active={activeTab === 'fazendas'}
            onClick={() => setActiveTab('fazendas')}
          >
            🏭 Fazendas ({stats.totalFazendas})
          </TabButton>
        </TabContainer>

        {/* 📝 CONTEÚDO DAS ABAS */}
        {activeTab === 'dados' && (
          <CompactCard isDark={isDark}>
            <SectionHeader isDark={isDark}>
              👨‍🌾 Informações Pessoais
              <StatusBadge
                isDark={isDark}
                valid={fieldStates.nomeValid && fieldStates.documentoValid}
              >
                {fieldStates.nomeValid && fieldStates.documentoValid ? 'Válido' : 'Pendente'}
              </StatusBadge>
            </SectionHeader>

            <CompactGrid>
              <div>
                <CompactLabel isDark={isDark}>Nome Completo</CompactLabel>
                <CompactInput
                  isDark={isDark}
                  type="text"
                  value={produtor.nome}
                  valid={fieldStates.nomeValid}
                  onChange={(e) => setProdutor((prev) => ({ ...prev, nome: e.target.value }))}
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <CompactLabel isDark={isDark}>CPF/CNPJ</CompactLabel>
                <CompactInput
                  isDark={isDark}
                  type="text"
                  value={formatDocument(produtor.documento)}
                  valid={fieldStates.documentoValid}
                  onChange={(e) => {
                    const numbersOnly = e.target.value.replace(/\D/g, '').slice(0, 14);
                    setProdutor((prev) => ({ ...prev, documento: numbersOnly }));
                  }}
                  placeholder="Digite CPF ou CNPJ"
                />
                {produtor.documento && (
                  <DocumentValidation isDark={isDark} isValid={fieldStates.documentoValid}>
                    <span className="message">
                      {fieldStates.documentoValid
                        ? produtor.documento.length === 11
                          ? '✅ CPF válido!'
                          : '✅ CNPJ válido!'
                        : `❌ ${produtor.documento.length <= 11 ? 'CPF' : 'CNPJ'} inválido`}
                    </span>
                  </DocumentValidation>
                )}
              </div>
            </CompactGrid>
          </CompactCard>
        )}

        {activeTab === 'fazendas' && (
          <CompactCard isDark={isDark}>
            <SectionHeader isDark={isDark}>
              🏭 Gestão de Fazendas
              <QuickActions>
                <button onClick={addFazenda}>+ Nova Fazenda</button>
              </QuickActions>
            </SectionHeader>

            {produtor.fazendas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', opacity: 0.7 }}>
                <p>Nenhuma fazenda cadastrada</p>
                <button onClick={addFazenda}>+ Adicionar primeira fazenda</button>
              </div>
            ) : (
              produtor.fazendas.map((fazenda, index) => {
                const fazendaState = fieldStates.fazendasValid[fazenda.id];
                const isValid =
                  fazendaState?.nomeValid &&
                  fazendaState?.cidadeValid &&
                  fazendaState?.estadoValid &&
                  fazendaState?.areaTotalValid;

                return (
                  <div key={fazenda.id}>
                    <FarmRow isDark={isDark} isValid={isValid}>
                      <div className="farm-header">
                        <h4>🏭 Fazenda #{index + 1}</h4>
                        <div className="farm-actions">
                          <StatusBadge isDark={isDark} valid={isValid}>
                            {isValid ? 'OK' : 'Pendente'}
                          </StatusBadge>
                          {produtor.fazendas.length > 1 && (
                            <button
                              className="remove-btn"
                              onClick={() => removeFazenda(fazenda.id)}
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      </div>

                      <CompactGrid>
                        <div>
                          <CompactLabel isDark={isDark}>Nome da Fazenda</CompactLabel>
                          <CompactInput
                            isDark={isDark}
                            value={fazenda.nome}
                            valid={fazendaState?.nomeValid}
                            onChange={(e) => updateFazenda(fazenda.id, 'nome', e.target.value)}
                            placeholder="Nome da fazenda"
                          />
                        </div>

                        <div>
                          <CompactLabel isDark={isDark}>Cidade</CompactLabel>
                          <CompactInput
                            isDark={isDark}
                            value={fazenda.cidade}
                            valid={fazendaState?.cidadeValid}
                            onChange={(e) => updateFazenda(fazenda.id, 'cidade', e.target.value)}
                            placeholder="Cidade"
                          />
                        </div>

                        <div>
                          <CompactLabel isDark={isDark}>Estado</CompactLabel>
                          <CompactSelect
                            isDark={isDark}
                            value={fazenda.estado}
                            valid={fazendaState?.estadoValid}
                            onChange={(e) => updateFazenda(fazenda.id, 'estado', e.target.value)}
                          >
                            <option value="">Selecione</option>
                            {estados.map((estado) => (
                              <option key={estado} value={estado}>
                                {estado}
                              </option>
                            ))}
                          </CompactSelect>
                        </div>

                        <div>
                          <CompactLabel isDark={isDark}>Área Total (ha)</CompactLabel>
                          <CompactInput
                            isDark={isDark}
                            type="number"
                            value={fazenda.areaTotal || ''}
                            valid={fazendaState?.areaTotalValid}
                            onChange={(e) =>
                              updateFazenda(fazenda.id, 'areaTotal', Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <CompactLabel isDark={isDark}>Área Agricultável (ha)</CompactLabel>
                          <CompactInput
                            isDark={isDark}
                            type="number"
                            value={fazenda.areaAgricultavel || ''}
                            valid={fazendaState?.areaAgricultavelValid}
                            onChange={(e) =>
                              updateFazenda(fazenda.id, 'areaAgricultavel', Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <CompactLabel isDark={isDark}>Área Vegetação (ha)</CompactLabel>
                          <CompactInput
                            isDark={isDark}
                            type="number"
                            value={fazenda.areaVegetacao || ''}
                            valid={fazendaState?.areaVegetacaoValid}
                            onChange={(e) =>
                              updateFazenda(fazenda.id, 'areaVegetacao', Number(e.target.value))
                            }
                            placeholder="0"
                          />
                        </div>
                      </CompactGrid>

                      {/* 🌱 CULTURAS */}
                      <SectionDivider isDark={isDark} />

                      <div className="crops-section">
                        <div className="crops-header">
                          <h5>🌱 Culturas ({fazenda.culturas.length})</h5>
                          <button onClick={() => addCultura(fazenda.id)}>+ Cultura</button>
                        </div>

                        {fazenda.culturas.map((cultura, culturaIndex) => (
                          <CropRow key={cultura.id} isDark={isDark}>
                            <div className="crop-header">
                              <span>Cultura #{culturaIndex + 1}</span>
                              <button onClick={() => removeCultura(fazenda.id, cultura.id)}>
                                🗑️
                              </button>
                            </div>

                            <div className="crop-fields">
                              <div>
                                <CompactLabel isDark={isDark}>Tipo</CompactLabel>
                                <CompactSelect
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
                                </CompactSelect>
                              </div>

                              <div>
                                <CompactLabel isDark={isDark}>Área (ha)</CompactLabel>
                                <CompactInput
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
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <CompactLabel isDark={isDark}>Safra</CompactLabel>
                                <CompactInput
                                  isDark={isDark}
                                  value={cultura.safra}
                                  onChange={(e) =>
                                    updateCultura(fazenda.id, cultura.id, 'safra', e.target.value)
                                  }
                                  placeholder="2024"
                                />
                              </div>
                            </div>
                          </CropRow>
                        ))}
                      </div>
                    </FarmRow>

                    {index < produtor.fazendas.length - 1 && <SectionDivider isDark={isDark} />}
                  </div>
                );
              })
            )}
          </CompactCard>
        )}

        {/* 🎯 AÇÕES FLUTUANTES */}
        <FloatingActions isDark={isDark}>
          {hasUnsavedChanges && (
            <ChangesSummary isDark={isDark}>
              <span>Alterações pendentes</span>
              <div className="summary-actions">
                <button onClick={handleRevert} disabled={isLoading}>
                  Descartar
                </button>
                <button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? '⏳' : '💾'} Salvar
                </button>
              </div>
            </ChangesSummary>
          )}
        </FloatingActions>
      </EditContainer>
    </>
  );
};
