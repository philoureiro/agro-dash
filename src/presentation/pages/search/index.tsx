import { useCallback, useEffect, useMemo, useState } from 'react';

import { Typography } from '@mui/material';

import { Text } from '@components';
import { useThemeMode } from '@theme';

import {
  AllFarmsSection,
  DesktopLayout,
  FarmCard,
  FarmDetails,
  FarmGrid,
  FarmImage,
  FarmInfo,
  FarmLocation,
  FarmName,
  FarmNumber,
  FarmSize,
  FarmStats,
  FarmType,
  GridContainer,
  HeroImage,
  HeroImageOverlay,
  HeroSection,
  LeftPanel,
  MiniCard,
  MiniCardImage,
  MiniCardInfo,
  MiniCardName,
  MiniCardType,
  NoResultsContainer,
  RandomButton,
  RightPanel,
  SearchButton,
  SearchContainer,
  SearchInput,
  SearchInputContainer,
  SearchSection,
  SectionTitle,
  ShimmerEffect,
  StatBar,
  StatFill,
  StatLabel,
  StatRow,
  StatValue,
} from './styles';

// 🚜 MOCK DE FAZENDAS ÉPICAS
const fazendas = [
  {
    id: 1,
    name: 'Fazenda Sol Dourado',
    type: 'Soja Premium',
    image:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center',
    size: '1,250 hectares',
    location: 'Mato Grosso',
    typeColor: '#F7DC6F',
    stats: {
      produtividade: 85,
      sustentabilidade: 92,
      tecnologia: 78,
    },
  },
  {
    id: 2,
    name: 'Fazenda Verde Esperança',
    type: 'Milho Orgânico',
    image:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&crop=center',
    size: '890 hectares',
    location: 'Goiás',
    typeColor: '#82E0AA',
    stats: {
      produtividade: 78,
      sustentabilidade: 95,
      tecnologia: 82,
    },
  },
  {
    id: 3,
    name: 'Fazenda Terra Nova',
    type: 'Café Especial',
    image:
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center',
    size: '340 hectares',
    location: 'Minas Gerais',
    typeColor: '#D2691E',
    stats: {
      produtividade: 90,
      sustentabilidade: 88,
      tecnologia: 75,
    },
  },
  {
    id: 4,
    name: 'Fazenda Águas Claras',
    type: 'Algodão Premium',
    image:
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=600&fit=crop&crop=center',
    size: '2,100 hectares',
    location: 'Bahia',
    typeColor: '#F8F8FF',
    stats: {
      produtividade: 87,
      sustentabilidade: 84,
      tecnologia: 91,
    },
  },
  {
    id: 5,
    name: 'Fazenda Horizonte Azul',
    type: 'Cana-de-Açúcar',
    image:
      'https://images.unsplash.com/photo-1464207687429-7505649dae38?w=800&h=600&fit=crop&crop=center',
    size: '3,500 hectares',
    location: 'São Paulo',
    typeColor: '#98FB98',
    stats: {
      produtividade: 93,
      sustentabilidade: 79,
      tecnologia: 88,
    },
  },
];

// 🔍 HOOK PARA DEBOUNCE
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 📱 HOOK PARA DETECTAR TAMANHO DA TELA
const useScreenSize = () => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return isDesktop;
};

// 🚀 FUNÇÃO PARA SCROLL SUAVE ATÉ O TOPO
const scrollToTop = () => {
  // Múltiplas estratégias para garantir que funciona em todos os browsers
  const scrollTargets = [document.documentElement, document.body, window];

  // Scroll suave usando comportamento nativo
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    // Fallback para browsers mais antigos
    window.scrollTo(0, 0);
  }

  // Garante que elementos específicos também scrollem para o topo
  scrollTargets.forEach((target) => {
    if (target && typeof target.scrollTo === 'function') {
      try {
        target.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      } catch {
        // Se for um HTMLElement, tenta acessar scrollTop
        if (target instanceof HTMLElement) {
          target.scrollTop = 0;
        }
      }
    }
  });

  // Força scroll para containers específicos que podem ter overflow
  const containers = document.querySelectorAll('[data-scroll-container]');
  containers.forEach((container) => {
    if (container && typeof container.scrollTo === 'function') {
      container.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  });
};

export const Search = () => {
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const isDesktop = useScreenSize();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFarm, setSelectedFarm] = useState(fazendas[0]);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 DEBOUNCE PARA PESQUISA
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🔍 FILTRO INTELIGENTE COM DEBOUNCE
  const filteredFarms = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return fazendas;

    return fazendas.filter(
      (farm) =>
        farm.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        farm.type.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        farm.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
    );
  }, [debouncedSearchTerm]);

  // 🎲 FAZENDA ALEATÓRIA
  const handleRandomFarm = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      const randomFarm = fazendas[Math.floor(Math.random() * fazendas.length)];
      setSelectedFarm(randomFarm);
      setSearchTerm('');
      setIsLoading(false);

      // 🚀 SCROLL PARA O TOPO APÓS SELECIONAR FAZENDA ALEATÓRIA
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }, 800);
  }, []);

  // 🔍 BUSCA POR FAZENDA
  const handleSearch = useCallback(() => {
    if (filteredFarms.length > 0) {
      setSelectedFarm(filteredFarms[0]);

      // 🚀 SCROLL PARA O TOPO APÓS BUSCA
      setTimeout(() => {
        scrollToTop();
      }, 100);
    }
  }, [filteredFarms]);

  // ⌨️ BUSCA COM ENTER
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  // 🖱️ SELECIONAR FAZENDA - COM SCROLL TO TOP
  const handleSelectFarm = useCallback(
    (farm: (typeof fazendas)[0]) => {
      setSelectedFarm(farm);
      if (searchTerm) setSearchTerm('');

      // 🚀 SCROLL SUAVE PARA O TOPO DA PÁGINA
      setTimeout(() => {
        scrollToTop();
      }, 100);
    },
    [searchTerm],
  );

  // 🎨 RENDERIZAÇÃO MOBILE
  const renderMobileLayout = () => (
    <>
      {/* 🌄 SEÇÃO HERO COM IMAGEM DA FAZENDA */}
      <HeroSection isDark={isDark}>
        <HeroImage src={selectedFarm.image} alt={selectedFarm.name} loading="lazy" />
        <HeroImageOverlay isDark={isDark} />
        {isLoading && <ShimmerEffect />}
      </HeroSection>

      {/* 🔍 SEÇÃO DE PESQUISA */}
      <SearchSection>
        <SearchInputContainer isDark={isDark}>
          <SearchInput
            isDark={isDark}
            type="text"
            placeholder="Digite o nome da fazenda..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton isDark={isDark} onClick={handleSearch} disabled={isLoading}>
            🔍
          </SearchButton>
        </SearchInputContainer>

        <RandomButton isDark={isDark} onClick={handleRandomFarm} disabled={isLoading}>
          🎲 Fazenda Aleatória
        </RandomButton>
      </SearchSection>

      {/* 📊 CARD DA FAZENDA SELECIONADA */}
      {selectedFarm && (
        <FarmCard isDark={isDark}>
          <FarmNumber isDark={isDark}>#{selectedFarm.id.toString().padStart(3, '0')}</FarmNumber>
          <FarmName isDark={isDark}>{selectedFarm.name}</FarmName>
          <FarmType typeColor={selectedFarm.typeColor} isDark={isDark}>
            {selectedFarm.type}
          </FarmType>

          <FarmDetails>
            <FarmSize isDark={isDark}>📏 {selectedFarm.size}</FarmSize>
            <FarmLocation isDark={isDark}>📍 {selectedFarm.location}</FarmLocation>
          </FarmDetails>

          <FarmStats>
            <Typography
              variant="h6"
              style={{
                marginBottom: '1rem',
                color: isDark ? '#fff' : '#2c3e50',
                fontWeight: 'bold',
              }}
            >
              Estatísticas da Fazenda
            </Typography>

            {Object.entries(selectedFarm.stats).map(([key, value]) => (
              <StatRow key={key}>
                <StatLabel isDark={isDark}>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                <StatValue isDark={isDark}>{value}</StatValue>
                <StatBar isDark={isDark}>
                  <StatFill percentage={value} isDark={isDark} />
                </StatBar>
              </StatRow>
            ))}
          </FarmStats>
        </FarmCard>
      )}

      {/* 🌾 GRID DE FAZENDAS FILTRADAS */}
      <AllFarmsSection>
        <SectionTitle isDark={isDark}>
          {searchTerm
            ? `${filteredFarms.length} fazenda(s) encontrada(s)`
            : `Todas as ${fazendas.length} fazendas`}
        </SectionTitle>

        {filteredFarms.length > 0 ? (
          <GridContainer>
            {filteredFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                isDark={isDark}
                onClick={() => handleSelectFarm(farm)}
                style={{
                  cursor: 'pointer',
                  transform: selectedFarm.id === farm.id ? 'scale(1.05)' : 'scale(1)',
                  border:
                    selectedFarm.id === farm.id
                      ? `2px solid ${isDark ? '#37cb83' : '#27ae60'}`
                      : undefined,
                }}
              >
                <FarmImage src={farm.image} alt={farm.name} />
                <FarmInfo>
                  <FarmNumber isDark={isDark}>#{farm.id.toString().padStart(3, '0')}</FarmNumber>
                  <FarmName isDark={isDark} style={{ fontSize: '1.2rem' }}>
                    {farm.name}
                  </FarmName>
                  <FarmType typeColor={farm.typeColor} isDark={isDark}>
                    {farm.type}
                  </FarmType>
                </FarmInfo>
              </FarmCard>
            ))}
          </GridContainer>
        ) : (
          <NoResultsContainer isDark={isDark}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
            <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
              Ops! Nenhuma fazenda encontrada
            </Typography>
            <Typography variant="body1" style={{ opacity: 0.7 }}>
              Tente buscar por nome, tipo de cultivo ou localização
            </Typography>
            <RandomButton isDark={isDark} onClick={handleRandomFarm} style={{ marginTop: '1rem' }}>
              🎲 Que tal uma fazenda aleatória?
            </RandomButton>
          </NoResultsContainer>
        )}
      </AllFarmsSection>
    </>
  );

  // 🖥️ RENDERIZAÇÃO DESKTOP
  const renderDesktopLayout = () => (
    <DesktopLayout>
      {/* 🎯 PAINEL ESQUERDO - FAZENDA SELECIONADA */}
      <LeftPanel isDark={isDark}>
        <HeroSection isDark={isDark} isDesktop>
          <HeroImage src={selectedFarm.image} alt={selectedFarm.name} loading="lazy" />
          <HeroImageOverlay isDark={isDark} />
          {isLoading && <ShimmerEffect />}
        </HeroSection>

        <SearchSection>
          <SearchInputContainer isDark={isDark}>
            <SearchInput
              isDark={isDark}
              type="text"
              placeholder="Buscar fazendas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchButton isDark={isDark} onClick={handleSearch} disabled={isLoading}>
              🔍
            </SearchButton>
          </SearchInputContainer>

          <RandomButton isDark={isDark} onClick={handleRandomFarm} disabled={isLoading}>
            🎲 Fazenda Aleatória
          </RandomButton>
        </SearchSection>

        <FarmCard isDark={isDark} isDesktop>
          <FarmNumber isDark={isDark}>#{selectedFarm.id.toString().padStart(3, '0')}</FarmNumber>
          <FarmName isDark={isDark}>{selectedFarm.name}</FarmName>
          <FarmType typeColor={selectedFarm.typeColor} isDark={isDark}>
            {selectedFarm.type}
          </FarmType>

          <FarmDetails>
            <FarmSize isDark={isDark}>📏 {selectedFarm.size}</FarmSize>
            <FarmLocation isDark={isDark}>📍 {selectedFarm.location}</FarmLocation>
          </FarmDetails>

          <FarmStats>
            <Typography
              variant="h6"
              style={{
                marginBottom: '1rem',
                color: isDark ? '#fff' : '#2c3e50',
                fontWeight: 'bold',
              }}
            >
              Estatísticas da Fazenda
            </Typography>

            {Object.entries(selectedFarm.stats).map(([key, value]) => (
              <StatRow key={key}>
                <StatLabel isDark={isDark}>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                <StatValue isDark={isDark}>{value}</StatValue>
                <StatBar isDark={isDark}>
                  <StatFill percentage={value} isDark={isDark} />
                </StatBar>
              </StatRow>
            ))}
          </FarmStats>
        </FarmCard>
      </LeftPanel>

      {/* 🌾 PAINEL DIREITO - TODAS AS FAZENDAS */}
      <RightPanel isDark={isDark}>
        <SectionTitle isDark={isDark}>
          {searchTerm
            ? `${filteredFarms.length} fazenda(s) encontrada(s)`
            : `Todas as ${fazendas.length} fazendas`}
        </SectionTitle>

        <FarmGrid>
          {filteredFarms.length > 0 ? (
            filteredFarms.map((farm) => (
              <MiniCard
                key={farm.id}
                isDark={isDark}
                isSelected={selectedFarm.id === farm.id}
                onClick={() => handleSelectFarm(farm)}
              >
                <MiniCardImage src={farm.image} alt={farm.name} />
                <MiniCardInfo>
                  <FarmNumber isDark={isDark} style={{ fontSize: '0.8rem', margin: 0 }}>
                    #{farm.id.toString().padStart(3, '0')}
                  </FarmNumber>
                  <MiniCardName isDark={isDark}>{farm.name}</MiniCardName>
                  <MiniCardType typeColor={farm.typeColor} isDark={isDark}>
                    {farm.type}
                  </MiniCardType>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)',
                      marginTop: '0.5rem',
                    }}
                  >
                    📍 {farm.location}
                  </div>
                </MiniCardInfo>
              </MiniCard>
            ))
          ) : (
            <NoResultsContainer isDark={isDark}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
                Nenhuma fazenda encontrada
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.7 }}>
                Tente buscar por nome, tipo ou localização
              </Typography>
            </NoResultsContainer>
          )}
        </FarmGrid>
      </RightPanel>
    </DesktopLayout>
  );

  return (
    <>
      <meta name="title" content="Explorador de Fazendas" />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          marginBottom: 30,
          marginTop: 100,
        }}
      >
        <Text variant="h3" style={{ fontWeight: 'bold', textAlign: 'center' }}>
          Pesquisar
        </Text>
      </div>

      <SearchContainer isDark={isDark} data-scroll-container>
        {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
      </SearchContainer>
    </>
  );
};
