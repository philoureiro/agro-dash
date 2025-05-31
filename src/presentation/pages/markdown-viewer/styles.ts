import styled from 'styled-components';

export const DocsContainer = styled.div<{ theme?: any }>`
  margin-top: 30px;
  margin-bottom: 100px;

  min-height: 100vh;
  background: ${({ theme }) => theme.palette.background.default};
  color: ${({ theme }) => theme.palette.text.primary};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  overflow-x: hidden;
  position: relative;
`;

export const DocsWrapper = styled.div`
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const MarkdownContent = styled.div<{ theme?: any }>`
  max-width: 100%;

  @media (min-width: 1400px) {
    margin-right: 280px;
  }

  /* Wrapper para tabelas responsivas */
  .table-wrapper {
    width: 100%;
    display: block;
    overflow-x: auto;
    margin: 1.5rem 0;
  }

  /* TABELA SUPREMA */
  table {
    min-width: 340px;
    border-collapse: separate;
    border-spacing: 0;
    margin: 1.5rem 0;
    background: ${({ theme }) =>
      theme.palette.mode === 'dark' ? 'rgba(30,30,32,0.97)' : 'rgba(255,255,255,0.99)'};
    border-radius: 18px;
    overflow: hidden;
    box-shadow:
      0 4px 32px 0 rgba(80, 80, 80, 0.09),
      0 1.5px 8px 0 rgba(80, 80, 80, 0.07);
    border: 1.5px solid
      ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'rgba(52, 217, 114, 0.18)' : 'rgba(35, 45, 52, 0.08)'};
  }

  thead {
    background: ${({ theme }) =>
      theme.palette.mode === 'dark' ? 'rgba(25,25,28,0.97)' : 'rgba(246,248,250,1)'};
  }
  th {
    font-weight: 700;
    padding: 1.1rem 1.6rem;
    color: ${({ theme }) => theme.palette.text.primary};
    border-bottom: 1.5px solid
      ${({ theme }) => (theme.palette.mode === 'dark' ? 'rgba(52, 217, 114, 0.18)' : '#E2E6EA')};
    background: none;
    text-align: left;
    font-size: 1.09rem;
    letter-spacing: 0.01em;
  }

  tbody {
    background: none;
  }
  td {
    padding: 0.98rem 1.6rem;
    border-bottom: 1px solid
      ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'rgba(120, 255, 170, 0.08)' : 'rgba(0,0,0,0.025)'};
    font-size: 0.99rem;
    background: none;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: ${({ theme }) =>
      theme.palette.mode === 'dark' ? 'rgba(45, 65, 60, 0.09)' : 'rgba(55, 220, 112, 0.045)'};
  }
  tr:last-child td {
    border-bottom: none;
  }

  /* Bordas arredondadas da tabela */
  table tr:first-child th:first-child {
    border-top-left-radius: 18px;
  }
  table tr:first-child th:last-child {
    border-top-right-radius: 18px;
  }
  table tr:last-child td:first-child {
    border-bottom-left-radius: 18px;
  }
  table tr:last-child td:last-child {
    border-bottom-right-radius: 18px;
  }

  /* Row highlight on hover */
  tr:hover td {
    background: ${({ theme }) =>
      theme.palette.mode === 'dark' ? 'rgba(52, 217, 114, 0.12)' : 'rgba(52, 217, 114, 0.065)'};
    transition: background 0.17s;
  }

  /* Responsivo mobile */
  @media (max-width: 700px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
      width: 100%;
    }
    table {
      box-shadow: 0 1.5px 10px rgba(80, 80, 80, 0.09);
      border-radius: 16px;
      margin: 1.1rem 0;
      min-width: unset;
    }
    thead {
      display: none;
    }
    tr {
      margin-bottom: 1.2rem;
      box-shadow: 0 2px 8px rgba(80, 80, 80, 0.07);
      border-radius: 10px;
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.96)' : 'rgba(255,255,255,0.99)'};
    }
    td {
      border: none;
      padding: 0.62rem 1rem;
      position: relative;
      font-size: 0.98rem;
      min-width: unset;
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;
    }
    /* Opcional: label no td se quiser data-label pelo ReactMarkdown */
    /* td:before {
      content: attr(data-label);
      font-weight: 700;
      color: ${({ theme }) => theme.palette.text.secondary};
      display: inline-block;
      min-width: 90px;
      font-size: 0.92rem;
      flex-shrink: 0;
      padding-right: 0.7rem;
    } */
  }

  /* Headers */
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin: 2rem 0 1.5rem 0;
    color: ${({ theme }) => theme.palette.primary.main};
    border-bottom: 3px solid ${({ theme }) => theme.palette.primary.main};
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    &::before {
      content: '';
      font-size: 2.5rem;
    }

    @media (max-width: 768px) {
      font-size: 2rem;
      &::before {
        font-size: 1.8rem;
      }
    }
  }
  h2 {
    font-size: 2rem;
    font-weight: 600;
    margin: 2rem 0 1rem 0;
    color: ${({ theme }) => theme.palette.text.primary};
    border-bottom: 2px solid ${({ theme }) => theme.palette.divider};
    padding-bottom: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 1.5rem 0 1rem 0;
    color: ${({ theme }) => theme.palette.text.primary};
    @media (max-width: 768px) {
      font-size: 1.25rem;
    }
  }
  h4 {
    font-size: 1.25rem;
    font-weight: 600;
    margin: 1rem 0 0.5rem 0;
    color: ${({ theme }) => theme.palette.text.secondary};
    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }

  p {
    margin: 1rem 0;
    font-size: 1rem;
    line-height: 1.7;
    @media (max-width: 768px) {
      font-size: 0.95rem;
    }
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.palette.primary.main};
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: all 0.2s ease;
    &:hover {
      border-bottom-color: ${({ theme }) => theme.palette.primary.main};
      background: ${({ theme }) =>
        theme.palette.mode === 'dark' ? 'rgba(52, 217, 114, 0.1)' : 'rgba(52, 217, 114, 0.05)'};
      padding: 0 4px;
      border-radius: 4px;
    }
  }

  ul,
  ol {
    margin: 1rem 0;
    padding-left: 2rem;
    @media (max-width: 768px) {
      padding-left: 1.5rem;
    }
  }
  li {
    margin: 0.5rem 0;
    &::marker {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }

  blockquote {
    margin: 1.5rem 0;
    padding: 1rem 1.5rem;
    border-left: 4px solid ${({ theme }) => theme.palette.primary.main};
    background: ${({ theme }) =>
      theme.palette.mode === 'dark' ? 'rgba(52, 217, 114, 0.1)' : 'rgba(52, 217, 114, 0.05)'};
    border-radius: 0 8px 8px 0;
    font-style: italic;

    p {
      margin: 0;
    }

    &::before {
      content: '💡';
      font-size: 1.2rem;
      margin-right: 0.5rem;
    }

    @media (max-width: 768px) {
      padding: 0.8rem 1rem;
      margin: 1rem 0;
    }
  }

  /* Code blocks */
  pre {
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? '#1e1e1e' : '#e0e5eb')};
    border: 1px solid ${({ theme }) => (theme.palette.mode === 'dark' ? '#333' : '#d3d9de')};
    border-radius: 8px;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-family: 'Fira Code', Consolas, 'Courier New', monospace;
    font-size: 0.96rem;
    line-height: 1.5;
    color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#cdd9e5' : '#24324d')};
    code {
      background: none;
      padding: 0;
      border: none;
      border-radius: 0;
      color: inherit;
    }
    @media (max-width: 768px) {
      padding: 1rem;
      font-size: 0.85rem;
      border-radius: 6px;
    }
  }

  code {
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f3f5f7')};
    color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#98fb98' : '#18781c')};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', Consolas, 'Courier New', monospace;
    font-size: 0.98em;
    border: 1px solid ${({ theme }) => theme.palette.divider};
  }

  img[alt*='Status'],
  img[alt*='React'],
  img[alt*='TypeScript'],
  img[alt*='Redux'] {
    margin: 0 0.25rem;
    vertical-align: middle;
    @media (max-width: 768px) {
      margin: 0 0.1rem;
    }
  }

  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.palette.primary.main}, transparent);
    margin: 2rem 0;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  input[type='checkbox'] {
    margin-right: 0.5rem;
    transform: scale(1.2);
  }
`;

export const ScrollToTop = styled.button<{ theme?: any }>`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.palette.primary.main};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1000;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    bottom: 7rem; /* Espaço para a bottom bar */
    right: 1rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

/* TOC Desktop - Fixo na lateral */
export const TableOfContents = styled.nav<{ theme?: any }>`
  position: fixed;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  background: ${({ theme }) => theme.palette.background.paper};
  border: 1px solid ${({ theme }) => theme.palette.divider};
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  max-width: 250px;
  max-height: 60vh;
  overflow-y: auto;
  z-index: 100;

  h4 {
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.palette.text.secondary};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  li {
    margin: 0.5rem 0;
  }

  a {
    color: ${({ theme }) => theme.palette.text.secondary};
    text-decoration: none;
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
    border-radius: 6px;
    display: block;
    transition: all 0.2s ease;

    &:hover {
      background: ${({ theme }) => theme.palette.primary.main};
      color: white;
      transform: translateX(4px);
    }

    &.active {
      background: ${({ theme }) => theme.palette.primary.main};
      color: white;
    }
  }

  /* Esconde no mobile e tablets */
  @media (max-width: 1399px) {
    display: none;
  }
`;

/* TOC Mobile - Botão flutuante que abre drawer */
export const MobileTocButton = styled.button<{ theme?: any }>`
  position: fixed;
  top: 15%;
  right: 1rem;
  transform: translateY(-50%);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: none;
  background: ${({ theme }) => theme.palette.primary.main};
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 1001;
  display: none;

  &:hover {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  @media (max-width: 1399px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    right: 0.5rem;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
`;

/* Drawer Mobile para TOC */
export const MobileTocDrawer = styled.div<{ theme?: any; isOpen: boolean }>`
  position: fixed;
  top: 50;
  right: 0;
  height: 100vh;
  width: 320px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-left: 1px solid ${({ theme }) => theme.palette.divider};
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1002;
  transform: translateX(${({ isOpen }) => (isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  padding: 2rem 1.5rem;

  @media (max-width: 768px) {
    width: 280px;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 400px) {
    width: 100vw;
    border-left: none;
  }
`;

/* Header do drawer mobile */
export const MobileTocHeader = styled.div<{ theme?: any }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};

  h4 {
    margin: 0;
    font-size: 1.1rem;
    color: ${({ theme }) => theme.palette.text.primary};
    font-weight: 600;
  }
`;

/* Botão fechar drawer */
export const CloseDrawerButton = styled.button<{ theme?: any }>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.palette.action.hover};
    color: ${({ theme }) => theme.palette.text.primary};
  }
`;

/* Lista do TOC no mobile */
export const MobileTocList = styled.ul<{ theme?: any }>`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-bottom: 200px;

  li {
    margin: 0.75rem 0;
  }

  a {
    color: ${({ theme }) => theme.palette.text.secondary};
    text-decoration: none;
    font-size: 0.95rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    display: block;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;

    &:hover {
      background: ${({ theme }) => theme.palette.action.hover};
      color: ${({ theme }) => theme.palette.text.primary};
      border-left-color: ${({ theme }) => theme.palette.primary.main};
    }

    &.active {
      background: ${({ theme }) => theme.palette.primary.main}20;
      color: ${({ theme }) => theme.palette.primary.main};
      border-left-color: ${({ theme }) => theme.palette.primary.main};
      font-weight: 600;
    }
  }
`;

/* Overlay para fechar o drawer */
export const MobileTocOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: all 0.3s ease;
`;

export const LoadingSpinner = styled.div<{ theme?: any }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;

  &::after {
    content: '';
    width: 3rem;
    height: 3rem;
    border: 3px solid ${({ theme }) => theme.palette.divider};
    border-top: 3px solid ${({ theme }) => theme.palette.primary.main};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const ErrorMessage = styled.div<{ theme?: any }>`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.palette.error.main};
  background: ${({ theme }) =>
    theme.palette.mode === 'dark' ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)'};
  border: 1px solid ${({ theme }) => theme.palette.error.main};
  border-radius: 8px;
  margin: 2rem 0;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    h3 {
      font-size: 1.1rem;
    }
  }
`;
