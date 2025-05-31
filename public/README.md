# 🚜 AgroDash - Plano de Desenvolvimento Frontend (Brain Agriculture)

![Status](https://img.shields.io/badge/Status-Pronto-brightgreen)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-Latest-purple)

---

## 📋 Índice

- [🎯 Visão Geral do Projeto](#-visão-geral-do-projeto)
- [🛠️ Stack Tecnológica](#️-stack-tecnológica)
- [🏛️ Arquitetura](#️-arquitetura)
- [✨ Features por Tela](#-features-por-tela)
- [📊 Requisitos de Negócio](#-requisitos-de-negócio)
- [🧪 Estratégia de Testes](#-estratégia-de-testes)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [🚀 Como Executar](#-como-executar)
- [📈 Roadmap](#-roadmap)

---

## 🎯 Visão Geral do Projeto

A **AgroDash** é uma aplicação web robusta para o gerenciamento completo de **produtores rurais**, desenvolvida como parte do teste técnico da **Brain Agriculture**. O sistema permite:

- 🌾 **Gestão de Produtores**: Cadastro, edição e exclusão de produtores rurais
- 🏡 **Gestão de Fazendas**: Controle de propriedades rurais e suas características
- 🌱 **Gestão de Culturas**: Registro de culturas plantadas por safra
- 📊 **Dashboard Analítico**: Visualização de dados consolidados e KPIs
- ✅ **Validações Inteligentes**: CPF/CNPJ, áreas de plantio e regras de negócio

> **Objetivo**: Criar uma solução escalável, mantível e testável que atenda 100% dos requisitos do teste técnico.

---

## 🛠️ Stack Tecnológica

### Core Technologies

| Tecnologia            | Versão | Propósito                      |
| --------------------- | ------ | ------------------------------ |
| **TypeScript**        | 5.0+   | Linguagem principal            |
| **React.js**          | 18+    | Framework frontend             |
| **Redux Toolkit**     | Latest | Gerenciamento de estado global |
| **Styled Components** | Latest | CSS-in-JS e temas              |
| **React Hook Form**   | Latest | Gerenciamento de formulários   |
| **Zod**               | Latest | Validação de schemas           |

### Testing & Quality

| Ferramenta   | Propósito            |
| ------------ | -------------------- |
| **Jest**     | Framework de testes  |
| **ESLint**   | Análise estática     |
| **Prettier** | Formatação de código |
| **Husky**    | Git hooks            |

### DevOps & Deployment

| Ferramenta         | Propósito               |
| ------------------ | ----------------------- |
| **Vite**           | Build tool e dev server |
| **Docker**         | Containerização         |
| **GitHub Actions** | CI/CD                   |
| **Heroku**         | Deploy frontend         |

---

## 🏛️ Arquitetura

### Atomic Design Pattern

```
src/
├── components/
│   ├── atoms/           # Blocos básicos (Button, Input, Icon)
│   ├── molecules/       # Grupos funcionais (InputField, SearchBar)
│   ├── organisms/       # Seções complexas (Header, Forms, Tables)
│   ├── templates/       # Layouts de páginas
│   └── pages/          # Páginas da aplicação
```

### Clean Architecture Layers

```
src/
├── domain/             # Entidades e regras de negócio
│   ├── entities/       # Modelos de dados
│   ├── repositories/   # Interfaces de dados
│   └── services/      # Casos de uso
├── infrastructure/    # Implementações externas
│   ├── api/           # Clientes HTTP
│   ├── storage/       # LocalStorage, SessionStorage
│   └── validators/    # Schemas de validação
├── presentation/      # Interface do usuário
│   ├── components/    # Componentes React
│   ├── hooks/         # Custom hooks
│   ├── pages/         # Páginas
│   └── store/         # Redux store
└── shared/           # Utilitários compartilhados
    ├── utils/        # Funções auxiliares
    ├── constants/    # Constantes
    └── types/        # Tipos TypeScript
```

---

## ✨ Features por Tela

### 🏠 Tela 1: Dashboard Geral (`/`)

**Objetivo**: Fornecer visão macro dos dados através de KPIs e gráficos interativos.

| Status | Feature                 | Prioridade | Componentes-Chave           | Requisito Teste |
| :----: | ----------------------- | :--------: | --------------------------- | :-------------: |
|  `🚧`  | **Total de Fazendas**   |     P0     | `KPICard`, `CounterDisplay` |       ✅        |
|  `🚧`  | **Total de Hectares**   |     P0     | `KPICard`, `AreaDisplay`    |       ✅        |
|  `🚧`  | **Gráfico por Estado**  |     P0     | `ChartCard`, `PieChart`     |       ✅        |
|  `🚧`  | **Gráfico por Cultura** |     P0     | `ChartCard`, `PieChart`     |       ✅        |
|  `🚧`  | **Gráfico Uso do Solo** |     P0     | `ChartCard`, `PieChart`     |       ✅        |
|  `📝`  | **Filtros Temporais**   |     P1     | `DateRangePicker`           |       ⚡        |
|  `📝`  | **Export de Dados**     |     P1     | `ExportButton`              |       ⚡        |

**Dados Mockados**:

```typescript
interface DashboardData {
  totalFazendas: number;
  totalHectares: number;
  distribuicaoEstados: EstadoDistribuicao[];
  distribuicaoCulturas: CulturaDistribuicao[];
  usoSolo: {
    agricultavel: number;
    vegetacao: number;
  };
}
```

---

### 📋 Tela 2: Listar Produtores (`/produtores`)

**Objetivo**: Exibir todos os produtores com busca e ações CRUD.

| Status | Feature                  | Prioridade | Componentes-Chave               | Requisito Teste |
| :----: | ------------------------ | :--------: | ------------------------------- | :-------------: |
|  `🚧`  | **Tabela de Produtores** |     P0     | `DataTable`, `ProducerRow`      |       ✅        |
|  `🚧`  | **Busca por Nome/Doc**   |     P0     | `SearchInput`, `FilterBar`      |       ✅        |
|  `🚧`  | **Ações CRUD**           |     P0     | `ActionButtons`, `ConfirmModal` |       ✅        |
|  `🚧`  | **Paginação**            |     P0     | `Pagination`                    |       ✅        |
|  `📝`  | **Filtros Avançados**    |     P1     | `FilterPanel`                   |       ⚡        |
|  `📝`  | **Ordenação Colunas**    |     P1     | `SortableHeader`                |       ⚡        |
|  `📝`  | **Seleção Múltipla**     |     P2     | `CheckboxGroup`                 |       ⚡        |

**Validações**:

- ✅ CPF/CNPJ válidos
- ✅ Campos obrigatórios
- ✅ Duplicação de documentos

---

### 📝 Tela 3: Cadastro de Produtor (`/produtores/cadastrar`)

**Objetivo**: Formulário completo para novo produtor com validações inteligentes.

| Status | Feature                  | Prioridade | Componentes-Chave                 | Requisito Teste |
| :----: | ------------------------ | :--------: | --------------------------------- | :-------------: |
|  `🚧`  | **Dados Básicos**        |     P0     | `ProducerForm`, `DocumentInput`   |       ✅        |
|  `🚧`  | **Validação CPF/CNPJ**   |     P0     | `DocumentValidator`               |       ✅        |
|  `🚧`  | **Fazendas Dinâmicas**   |     P0     | `FarmSection`, `AddRemoveButtons` |       ✅        |
|  `🚧`  | **Validação de Áreas**   |     P0     | `AreaValidator`                   |       ✅        |
|  `🚧`  | **Culturas por Safra**   |     P0     | `CultureManager`, `SafraSelector` |       ✅        |
|  `🚧`  | **Auto-save/Draft**      |     P1     | `DraftManager`                    |       ⚡        |
|  `📝`  | **Upload de Documentos** |     P2     | `FileUpload`                      |       ⚡        |

**Regras de Negócio**:

```typescript
// Validação de áreas
if (areaAgricultavel + areaVegetacao > areaTotal) {
  throw new Error('Soma das áreas não pode exceder área total');
}

// Múltiplas fazendas por produtor
interface Produtor {
  id: string;
  nome: string;
  documento: string;
  fazendas: Fazenda[]; // 0 a N fazendas
}

// Múltiplas culturas por safra
interface Fazenda {
  culturasPorSafra: {
    [safra: string]: Cultura[]; // 0 a N culturas por safra
  };
}
```

---

### ✏️ Tela 4: Edição de Produtor (`/produtores/editar/:id`)

**Objetivo**: Edição completa reutilizando componentes do cadastro.

| Status | Feature                     | Prioridade | Componentes-Chave            | Requisito Teste |
| :----: | --------------------------- | :--------: | ---------------------------- | :-------------: |
|  `🚧`  | **Carregamento de Dados**   |     P0     | `DataLoader`, `LoadingState` |       ✅        |
|  `🚧`  | **Reutilização de Form**    |     P0     | `ProducerForm` (modo edit)   |       ✅        |
|  `🚧`  | **Histórico de Alterações** |     P1     | `ChangeHistory`              |       ⚡        |
|  `📝`  | **Comparação de Versões**   |     P2     | `DiffViewer`                 |       ⚡        |

---

## 📊 Requisitos de Negócio

### ✅ Checklist de Conformidade com o Teste

| Requisito                 | Status | Implementação                              |
| ------------------------- | :----: | ------------------------------------------ |
| **1. CRUD de Produtores** |   ✅   | Telas 2, 3, 4                              |
| **2. Validação CPF/CNPJ** |   ✅   | `DocumentValidator` com algoritmo oficial  |
| **3. Validação de Áreas** |   ✅   | `AreaValidator` em tempo real              |
| **4. Múltiplas Culturas** |   ✅   | `CultureManager` com safras                |
| **5. Múltiplas Fazendas** |   ✅   | Array dinâmico no formulário               |
| **6. Culturas por Safra** |   ✅   | Relacionamento fazenda → safra → culturas  |
| **7. Dashboard Completo** |   ✅   | 5 KPIs + 3 gráficos conforme especificação |

### 📐 Modelos de Dados

```typescript
// Modelo principal que atende 100% dos requisitos
interface Produtor {
  id: string;
  cpfCnpj: string; // ✅ CPF ou CNPJ
  nome: string; // ✅ Nome do produtor
  fazendas: Fazenda[]; // ✅ 0 a N fazendas
  createdAt: Date;
  updatedAt: Date;
}

interface Fazenda {
  id: string;
  nome: string; // ✅ Nome da fazenda
  cidade: string; // ✅ Cidade
  estado: string; // ✅ Estado
  areaTotal: number; // ✅ Área total (hectares)
  areaAgricultavel: number; // ✅ Área agricultável (hectares)
  areaVegetacao: number; // ✅ Área de vegetação (hectares)
  safras: {
    // ✅ Safras (ex: 2021, 2022)
    [ano: string]: {
      culturas: Cultura[]; // ✅ Culturas plantadas por safra
    };
  };
}

interface Cultura {
  id: string;
  nome: 'Soja' | 'Milho' | 'Café' | 'Cana' | 'Algodão';
  area: number; // Área plantada desta cultura
}
```

---

## 🧪 Estratégia de Testes

### Pirâmide de Testes

```
    🔺 E2E Tests (5%)
      Cypress/Playwright
      Fluxos críticos completos

  🔺🔺 Integration Tests (25%)
    React Testing Library
    Interação entre componentes

🔺🔺🔺 Unit Tests (70%)
  Jest + RTL
  Componentes isolados
  Funções utilitárias
```

### Cobertura de Testes por Camada

| Camada             | Cobertura Alvo | Ferramentas      |
| ------------------ | :------------: | ---------------- |
| **Atoms**          |      95%+      | Jest + RTL       |
| **Molecules**      |      90%+      | Jest + RTL + MSW |
| **Organisms**      |      85%+      | Jest + RTL + MSW |
| **Pages**          |      80%+      | Jest + RTL + E2E |
| **Utils/Services** |      98%+      | Jest             |

### Cenários de Teste Críticos

```typescript
// 1. Validação de CPF/CNPJ
describe('DocumentValidator', () => {
  it('should validate CPF correctly');
  it('should validate CNPJ correctly');
  it('should reject invalid documents');
});

// 2. Validação de áreas
describe('AreaValidator', () => {
  it('should reject when sum exceeds total area');
  it('should accept valid area distribution');
});

// 3. Fluxo completo de cadastro
describe('Producer Registration Flow', () => {
  it('should create producer with multiple farms');
  it('should add cultures per harvest season');
  it('should update dashboard after creation');
});
```

---

## 📁 Estrutura do Projeto

```
agro-dash/
├── 📁 public/
│   ├── favicon.ico
│   └── manifest.json
├── 📁 src/
│   ├── 📁 components/           # Atomic Design
│   │   ├── 📁 atoms/
│   │   │   ├── Button/
│   │   │   ├── Input/
│   │   │   └── Icon/
│   │   ├── 📁 molecules/
│   │   │   ├── InputField/
│   │   │   ├── SearchBar/
│   │   │   └── KPICard/
│   │   ├── 📁 organisms/
│   │   │   ├── ProducerForm/
│   │   │   ├── DataTable/
│   │   │   └── Dashboard/
│   │   ├── 📁 templates/
│   │   │   └── MainLayout/
│   │   └── 📁 pages/
│   │       ├── HomePage/
│   │       ├── ProducersPage/
│   │       └── ProducerFormPage/
│   ├── 📁 domain/              # Business Logic
│   │   ├── 📁 entities/
│   │   ├── 📁 repositories/
│   │   └── 📁 services/
│   ├── 📁 infrastructure/      # External Concerns
│   │   ├── 📁 api/
│   │   ├── 📁 storage/
│   │   └── 📁 validators/
│   ├── 📁 presentation/        # UI Layer
│   │   ├── 📁 hooks/
│   │   ├── 📁 store/
│   │   └── 📁 themes/
│   ├── 📁 shared/             # Common Utils
│   │   ├── 📁 utils/
│   │   ├── 📁 constants/
│   │   └── 📁 types/
│   └── 📁 __tests__/          # Test Utilities
│       ├── 📁 mocks/
│       ├── 📁 fixtures/
│       └── setup.ts
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 vite.config.ts
├── 📄 jest.config.js
├── 📄 docker-compose.yml
└── 📄 README.md
```

---

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Git

### Instalação Local

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/agro-dash.git
cd agro-dash

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Execute os testes
npm run test

# Build para produção
npm run build
```

### Scripts Disponíveis

```json
{
  "dev": "vite",
  "build": "tsc && vite build",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage",
  "lint": "eslint src --ext ts,tsx",
  "lint:fix": "eslint src --ext ts,tsx --fix",
  "type-check": "tsc --noEmit"
}
```

---

## 📈 Roadmap

### Sprint 1 (Semana 1) - MVP Core

- [x] Setup do projeto e arquitetura
- [x] Atoms e Molecules básicos
- [ ] CRUD básico de produtores
- [ ] Validações CPF/CNPJ

### Sprint 2 (Semana 2) - Features Completas

- [ ] Dashboard com gráficos
- [ ] Gestão de fazendas múltiplas
- [ ] Culturas por safra
- [ ] Testes unitários (80%+)

### Sprint 3 (Semana 3) - Polish & Deploy

- [ ] Testes de integração
- [ ] Responsividade completa
- [ ] Deploy em produção
- [ ] Documentação final

### Funcionalidades Futuras (Pós-MVP)

- [ ] Autenticação e autorização
- [ ] API real integrada
- [ ] Relatórios avançados
- [ ] Notificações push
- [ ] Modo offline (PWA)

---

## 🎯 Critérios de Sucesso

### Técnicos

- ✅ **100% dos requisitos** do teste implementados
- ✅ **80%+ cobertura** de testes
- ✅ **TypeScript strict** mode
- ✅ **Performance** otimizada (Lighthouse 90+)
- ✅ **Responsivo** em todos os dispositivos
- ✅ **Acessibilidade** (WCAG 2.1 AA)

### Funcionais

- ✅ **CRUD completo** de produtores
- ✅ **Validações** conforme regras de negócio
- ✅ **Dashboard** interativo e informativo
- ✅ **UX intuitiva** e amigável
- ✅ **Dados consistentes** entre todas as telas

---

## 👥 Contribuindo

Este projeto segue as melhores práticas de desenvolvimento:

- **Conventional Commits**: Para mensagens de commit padronizadas
- **Semantic Versioning**: Para versionamento do projeto
- **Code Review**: Todos os PRs passam por revisão
- **CI/CD**: Deploy automatizado via GitHub Actions

---

## 📄 Licença

Este projeto foi desenvolvido como parte do teste técnico da **Brain Agriculture** e é propriedade intelectual de Philipe Loureiro.

---

**AgroDash** - Desenvolvido com ❤️ por Philipe Loureiro para a Brain Agriculture

[🏠 Home](/) • [📊 Dashboard](/dashboard) • [👥 Produtores](/produtores) • [📝 Docs](https://github.com/repo/wiki)
