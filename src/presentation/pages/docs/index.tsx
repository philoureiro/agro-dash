import React, { useCallback, useEffect, useState } from 'react';
import { FaListOl } from 'react-icons/fa6';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs, vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { useTheme } from '@mui/material/styles';

import { LoadingOverlay } from '@components';
import remarkGfm from 'remark-gfm';

import {
  CloseDrawerButton,
  DocsContainer,
  DocsWrapper,
  ErrorMessage,
  LoadingSpinner,
  MarkdownContent,
  MobileTocButton,
  MobileTocDrawer,
  MobileTocHeader,
  MobileTocList,
  MobileTocOverlay,
  ScrollToTop,
  TableOfContents,
} from './styles';

export const Markdown: React.FC = () => {
  const theme = useTheme();
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [tocItems, setTocItems] = useState<Array<{ id: string; title: string; level: number }>>([]);
  const [isMobileTocOpen, setIsMobileTocOpen] = useState(false);

  // Carrega o README.md e extrai o TOC
  useEffect(() => {
    const loadReadme = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/README.md');
        if (!response.ok) {
          throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const markdownContent = await response.text();
        setContent(markdownContent);

        // Extrai headers para TOC
        const headerRegex = /^(#{1,6})\s+(.+)$/gm;
        const headers: Array<{ id: string; title: string; level: number }> = [];
        let match;

        while ((match = headerRegex.exec(markdownContent)) !== null) {
          const level = match[1].length;
          const title = match[2].trim();
          const id = title
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .toLowerCase()
            .trim();

          if (level <= 3) {
            headers.push({ id, title, level });
          }
        }

        setTocItems(headers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido ao carregar README.md');
      } finally {
        setLoading(false);
      }
    };

    loadReadme();
  }, []);

  // Atualiza botão de scroll e seção ativa
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      // Atualiza seção ativa
      let current = '';
      for (const item of tocItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            current = item.id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  // Fecha drawer mobile ao pressionar ESC
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileTocOpen) {
        setIsMobileTocOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isMobileTocOpen]);

  // Previne scroll do body quando drawer está aberto
  useEffect(() => {
    if (isMobileTocOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileTocOpen]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileTocOpen(false); // Fecha drawer no mobile
    }
  }, []);

  const toggleMobileToc = useCallback(() => {
    setIsMobileTocOpen((prev) => !prev);
  }, []);

  const closeMobileToc = useCallback(() => {
    setIsMobileTocOpen(false);
  }, []);

  // Custom components para o ReactMarkdown
  const components = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={theme.palette.mode === 'dark' ? vscDarkPlus : vs}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    h1: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join('');
      const id = text
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      return (
        <h1 id={id} {...props}>
          {children}
        </h1>
      );
    },
    h2: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join('');
      const id = text
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      return (
        <h2 id={id} {...props}>
          {children}
        </h2>
      );
    },
    h3: ({ children, ...props }: any) => {
      const text = React.Children.toArray(children).join('');
      const id = text
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .toLowerCase();
      return (
        <h3 id={id} {...props}>
          {children}
        </h3>
      );
    },
    a: ({ href, children, ...props }: any) => {
      const isExternal = href?.startsWith('http') || href?.startsWith('//');
      return (
        <a
          href={href}
          target={isExternal ? '_blank' : undefined}
          rel={isExternal ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    img: ({ src, alt, ...props }: any) => (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{ maxWidth: '100%', height: 'auto' }}
        {...props}
      />
    ),
  };

  if (loading) {
    return (
      <LoadingOverlay
        isVisible={loading}
        isDark={theme.palette.mode === 'dark'}
        type="generating"
        variant="bounce"
        title="📚 Carregando Documentação"
        subtitle="Preparando informações úteis"
        loadingText={'Carregando documentação...'}
        stats={[
          { label: 'Seções Encontradas', value: tocItems.length.toString() },
          { label: 'Formato', value: 'Markdown (.md)' },
          { label: 'Fonte', value: 'README.md' },
        ]}
        spinnerColor="#27ae60"
        spinnerSize="large"
      />
    );
  }

  if (error) {
    return (
      <DocsContainer theme={theme}>
        <DocsWrapper>
          <ErrorMessage theme={theme}>
            <h3>❌ Erro ao Carregar Documentação</h3>
            <p>{error}</p>
            <p>
              <strong>Dica:</strong> Certifique-se de que o arquivo <code>README.md</code>
              está na pasta <code>public/</code> do seu projeto.
            </p>
          </ErrorMessage>
        </DocsWrapper>
      </DocsContainer>
    );
  }

  return (
    <DocsContainer theme={theme}>
      <DocsWrapper>
        {/* TOC Desktop - Fixo na lateral */}
        {tocItems.length > 0 && (
          <TableOfContents theme={theme}>
            <h4>📑 Navegação</h4>
            <ul>
              {tocItems.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className={activeSection === item.id ? 'active' : ''}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }}
                    title={item.title}
                  >
                    {item.title.length > 25 ? `${item.title.substring(0, 25)}...` : item.title}
                  </a>
                </li>
              ))}
            </ul>
          </TableOfContents>
        )}

        {/* Botão TOC Mobile */}
        {tocItems.length > 0 && (
          <MobileTocButton theme={theme} onClick={toggleMobileToc} title="Índice">
            <FaListOl />
          </MobileTocButton>
        )}

        {/* Overlay para fechar drawer */}
        <MobileTocOverlay isOpen={isMobileTocOpen} onClick={closeMobileToc} />

        {/* Drawer Mobile TOC */}
        <MobileTocDrawer theme={theme} isOpen={isMobileTocOpen}>
          <MobileTocHeader theme={theme}>
            <h4>📑 Navegação</h4>
            <CloseDrawerButton theme={theme} onClick={closeMobileToc}>
              ✕
            </CloseDrawerButton>
          </MobileTocHeader>

          <MobileTocList theme={theme}>
            {tocItems.map((item) => (
              <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 16}px` }}>
                <a
                  href={`#${item.id}`}
                  className={activeSection === item.id ? 'active' : ''}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.id);
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </MobileTocList>
        </MobileTocDrawer>

        {/* Markdown Content */}
        <MarkdownContent theme={theme}>
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
            {content}
          </ReactMarkdown>
        </MarkdownContent>
      </DocsWrapper>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <ScrollToTop theme={theme} onClick={scrollToTop} title="Voltar ao topo">
          ↑
        </ScrollToTop>
      )}
    </DocsContainer>
  );
};
