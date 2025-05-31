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

  /* No desktop, deixa espaço para o TOC */
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

  /* Tables */
  table {
    min-width: 400px;
    border-collapse: collapse;
    margin: 1.5rem 0;
    background: ${({ theme }) => theme.palette.background.paper};
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

    /* Remove width: 100%! */
  }

  @media (max-width: 600px) {
    .table-wrapper {
      margin: 1rem 0;
    }
    table {
      min-width: 320px;
      font-size: 0.9rem;
    }
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

  /* Paragraphs */
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

  /* Lists */
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

  /* Blockquotes */
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
    /*     cor no dark            cor mais escura no light  ↑    */
    border: 1px solid ${({ theme }) => (theme.palette.mode === 'dark' ? '#333' : '#d3d9de')};
    border-radius: 8px;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
    font-family: 'Fira Code', Consolas, 'Courier New', monospace;
    font-size: 0.96rem;
    line-height: 1.5;

    color: ${({ theme }) =>
      theme.palette.mode === 'dark' ? '#cdd9e5' : '#24324d'}; /* texto dark/light */
    /* Tweak: no tema claro, texto mais escuro para contraste */
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

  /* Inline code */
  code {
    background: ${({ theme }) => (theme.palette.mode === 'dark' ? '#2d2d2d' : '#f3f5f7')};
    color: ${({ theme }) => (theme.palette.mode === 'dark' ? '#98fb98' : '#18781c')};
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: 'Fira Code', Consolas, 'Courier New', monospace;
    font-size: 0.98em;
    border: 1px solid ${({ theme }) => theme.palette.divider};
  }

  /* Badges */
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

  /* Horizontal rule */
  hr {
    border: none;
    height: 2px;
    background: linear-gradient(90deg, ${({ theme }) => theme.palette.primary.main}, transparent);
    margin: 2rem 0;
  }

  /* Images */
  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 1rem 0;
  }

  /* Checkbox lists (GitHub style) */
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
  top: 10%;
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
