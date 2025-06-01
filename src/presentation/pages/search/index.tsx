import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiEdit3,
  FiHome,
  FiLayers,
  FiMapPin,
  FiSearch,
  FiShuffle,
  FiTrash2,
  FiTrendingUp,
  FiUsers,
} from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineLocationMarker, HiOutlineSparkles } from 'react-icons/hi';
import { IoLeafOutline, IoPeople } from 'react-icons/io5';
import { TbPlant2 } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import { Button, Text } from '@components';
import { SearchService } from '@services';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
import { useThemeMode } from '@theme';

import {
  ActionButton,
  ActionButtonsContainer,
  AllItemsSection,
  DesktopLayout,
  EmptyStateIcon,
  GridContainer,
  HeroImage,
  HeroImageOverlay,
  HeroSection,
  IconWrapper,
  ItemCard,
  ItemDetails,
  ItemGrid,
  ItemHeader,
  ItemImage,
  ItemInfo,
  ItemLocation,
  ItemName,
  ItemNumber,
  ItemSize,
  ItemStats,
  ItemType,
  ItemTypeIcon,
  LeftPanel,
  MiniCard,
  MiniCardImage,
  MiniCardInfo,
  MiniCardName,
  MiniCardType,
  NoResultsContainer,
  ResultsCount,
  RightPanel,
  SearchButton,
  SearchContainer,
  SearchInput,
  SearchInputContainer,
  SearchSection,
  SearchTypeButton,
  SearchTypeSelector,
  ShimmerEffect,
  StatBar,
  StatFill,
  StatLabel,
  StatRow,
  StatValue,
} from './styles';

// 🎯 TIPOS DE PESQUISA
type SearchType = 'all' | 'producers' | 'farms' | 'crops';

// 🔍 HOOK PARA DEBOUNCE SUPREMO
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

// 🚀 FUNÇÃO PARA SCROLL SUAVE ÉPICO
const scrollToTop = () => {
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  } catch (error) {
    window.scrollTo(0, 0);
  }

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

// 🎨 FUNÇÃO PARA PEGAR IMAGEM PADRÃO BASEADA NO TIPO
const getDefaultImage = (type: SearchType) => {
  const images = {
    producers:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop&crop=center',
    farms:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&crop=center',
    crops:
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop&crop=center',
    all: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop&crop=center',
  };
  return images[type];
};

// 🎯 FUNÇÃO PARA PEGAR ÍCONE BASEADO NO TIPO
const getTypeIcon = (type: string) => {
  const iconMap: { [key: string]: JSX.Element } = {
    producer: <IoPeople size={20} />,
    farm: <FiHome size={20} />,
    crop: <TbPlant2 size={20} />,
    producers: <FiUsers size={20} />,
    farms: <HiOutlineLocationMarker size={20} />,
    crops: <IoLeafOutline size={20} />,
  };
  return iconMap[type] || <FiLayers size={20} />;
};

// 🏷️ FUNÇÃO PARA PEGAR COR BASEADA NO TIPO
const getTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    producer: '#3498db',
    farm: '#27ae60',
    crop: '#f39c12',
    producers: '#3498db',
    farms: '#27ae60',
    crops: '#f39c12',
  };
  return colorMap[type] || '#95a5a6';
};

export const Search = () => {
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const isDesktop = useScreenSize();
  const navigate = useNavigate();

  // 🏪 STORE HOOKS
  const deleteProducer = useProducerStore((state) => state.deleteProducer);
  const deleteFarm = useFarmStore((state) => state.deleteFarm);
  const deleteCrop = useCropStore((state) => state.deleteCrop);

  // 🎯 STATES SUPREMOS
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 DEBOUNCE PARA PESQUISA
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🧠 BUSCA USANDO SEARCHSERVICE SUPREMO
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      // Se não há termo de busca, usa busca global vazia para pegar todos
      return SearchService.globalSearch('');
    }

    return SearchService.globalSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // 🎯 COMBINAR RESULTADOS E CRIAR ITEMS UNIFICADOS
  const allItems = useMemo(() => {
    const { producers, farms, crops } = searchResults;

    const producerItems = producers.map((p) => ({
      ...p,
      type: 'producer' as const,
      displayName: p.name,
      displayType: 'Produtor',
      displayLocation: `${p.city}, ${p.state}`,
      displaySize: `${p.document}`,
      image: getDefaultImage('producers'),
      stats: {
        fazendas: farms.filter((f) => f.producerId === p.id).length,
        área: farms.filter((f) => f.producerId === p.id).reduce((acc, f) => acc + f.totalArea, 0),
        culturas: crops.filter((c) => farms.find((f) => f.id === c.farmId && f.producerId === p.id))
          .length,
      },
    }));

    const farmItems = farms.map((f) => ({
      ...f,
      type: 'farm' as const,
      displayName: f.name,
      displayType: 'Fazenda',
      displayLocation: `${f.city}, ${f.state}`,
      displaySize: `${f.totalArea.toLocaleString()} hectares`,
      image: getDefaultImage('farms'),
      stats: {
        produtividade: f.productivity,
        sustentabilidade: f.sustainability,
        tecnologia: f.technology,
      },
    }));

    const cropItems = crops.map((c) => {
      const farm = farms.find((f) => f.id === c.farmId);
      return {
        ...c,
        type: 'crop' as const,
        displayName: c.type,
        displayType: 'Cultura',
        displayLocation: farm ? `${farm.city}, ${farm.state}` : 'N/A',
        displaySize: `${c.plantedArea.toLocaleString()} hectares`,
        image: getDefaultImage('crops'),
        stats: {
          área: c.plantedArea,
          safra: parseInt(c.harvestYear),
          fazenda: farm?.name || 'N/A',
        },
      };
    });

    return [...producerItems, ...farmItems, ...cropItems];
  }, [searchResults]);

  // 🔍 FILTRO POR TIPO
  const filteredItems = useMemo(() => {
    if (searchType === 'all') return allItems;

    const typeMap = {
      producers: 'producer',
      farms: 'farm',
      crops: 'crop',
    };

    return allItems.filter((item) => item.type === typeMap[searchType]);
  }, [allItems, searchType]);

  // 🎲 ITEM ALEATÓRIO ÉPICO
  const handleRandomItem = useCallback(() => {
    if (filteredItems.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
      setSelectedItem(randomItem);
      setSearchTerm('');
      setIsLoading(false);
      setTimeout(() => scrollToTop(), 100);
    }, 800);
  }, [filteredItems]);

  // 🔍 BUSCA SUPREMA
  const handleSearch = useCallback(() => {
    if (filteredItems.length > 0) {
      setSelectedItem(filteredItems[0]);
      setTimeout(() => scrollToTop(), 100);
    }
  }, [filteredItems]);

  // ⌨️ BUSCA COM ENTER
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSearch();
      }
    },
    [handleSearch],
  );

  // 🖱️ SELECIONAR ITEM
  const handleSelectItem = useCallback(
    (item: any) => {
      setSelectedItem(item);
      if (searchTerm) setSearchTerm('');
      setTimeout(() => scrollToTop(), 100);
    },
    [searchTerm],
  );

  // ✏️ EDITAR ITEM
  const handleEdit = useCallback(
    (item: any) => {
      const editRoutes = {
        producer: `/produtores/editar/${item.id}`,
        farm: `/fazendas/editar/${item.id}`,
        crop: `/culturas/editar/${item.id}`,
      };
      navigate(editRoutes[item.type]);
    },
    [navigate],
  );

  // 🗑️ EXCLUIR ITEM
  const handleDelete = useCallback(
    async (item: any) => {
      if (!window.confirm(`Tem certeza que deseja excluir ${item.displayName}?`)) {
        return;
      }

      try {
        switch (item.type) {
          case 'producer':
            await deleteProducer(item.id);
            break;
          case 'farm':
            await deleteFarm(item.id);
            break;
          case 'crop':
            await deleteCrop(item.id);
            break;
        }

        // Se o item excluído era o selecionado, seleciona outro
        if (selectedItem?.id === item.id) {
          const remainingItems = filteredItems.filter((i) => i.id !== item.id);
          setSelectedItem(remainingItems.length > 0 ? remainingItems[0] : null);
        }
      } catch (error) {
        console.error('Erro ao excluir item:', error);
        alert('Erro ao excluir item. Tente novamente.');
      }
    },
    [deleteProducer, deleteFarm, deleteCrop, selectedItem, filteredItems],
  );

  // 🎯 INICIALIZAR COM PRIMEIRO ITEM
  useEffect(() => {
    if (!selectedItem && filteredItems.length > 0) {
      setSelectedItem(filteredItems[0]);
    }
  }, [filteredItems, selectedItem]);

  // 🎨 RENDERIZAÇÃO MOBILE SUPREMA
  const renderMobileLayout = () => (
    <>
      {/* 🌄 SEÇÃO HERO ÉPICA */}
      {selectedItem && (
        <HeroSection $isDark={isDark}>
          <HeroImage src={selectedItem.image} alt={selectedItem.displayName} loading="lazy" />
          <HeroImageOverlay $isDark={isDark} />
          {isLoading && <ShimmerEffect />}
        </HeroSection>
      )}

      {/* 🔍 SEÇÃO DE PESQUISA SUPREMA */}
      <SearchSection>
        <SearchTypeSelector>
          {(['all', 'producers', 'farms', 'crops'] as SearchType[]).map((type) => (
            <SearchTypeButton
              key={type}
              $isDark={isDark}
              $isActive={searchType === type}
              onClick={() => setSearchType(type)}
            >
              <IconWrapper>{getTypeIcon(type)}</IconWrapper>
              {type === 'all'
                ? 'Todos'
                : type === 'producers'
                  ? 'Produtores'
                  : type === 'farms'
                    ? 'Fazendas'
                    : 'Culturas'}
            </SearchTypeButton>
          ))}
        </SearchTypeSelector>

        <SearchInputContainer $isDark={isDark}>
          <SearchInput
            $isDark={isDark}
            type="text"
            placeholder={`Buscar ${
              searchType === 'all'
                ? 'tudo'
                : searchType === 'producers'
                  ? 'produtores'
                  : searchType === 'farms'
                    ? 'fazendas'
                    : 'culturas'
            }...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <SearchButton $isDark={isDark} onClick={handleSearch} disabled={isLoading}>
            <FiSearch size={18} />
          </SearchButton>
        </SearchInputContainer>

        <Button isDark={isDark} onClick={handleRandomItem} disabled={isLoading}>
          <FiShuffle size={16} />
          Item Aleatório
        </Button>
      </SearchSection>

      {/* 📊 CARD DO ITEM SELECIONADO */}
      {selectedItem && (
        <ItemCard $isDark={isDark}>
          <ItemHeader>
            <ItemNumber $isDark={isDark}>#{selectedItem.id.toString().padStart(3, '0')}</ItemNumber>
            <ActionButtonsContainer>
              <ActionButton
                $isDark={isDark}
                $variant="edit"
                onClick={() => handleEdit(selectedItem)}
              >
                <FiEdit3 size={16} />
              </ActionButton>
              <ActionButton
                $isDark={isDark}
                $variant="delete"
                onClick={() => handleDelete(selectedItem)}
              >
                <FiTrash2 size={16} />
              </ActionButton>
            </ActionButtonsContainer>
          </ItemHeader>

          <ItemName $isDark={isDark}>{selectedItem.displayName}</ItemName>
          <ItemType $typeColor={getTypeColor(selectedItem.type)} $isDark={isDark}>
            <ItemTypeIcon>{getTypeIcon(selectedItem.type)}</ItemTypeIcon>
            {selectedItem.displayType}
          </ItemType>

          <ItemDetails>
            <ItemSize $isDark={isDark}>
              <FiTrendingUp size={16} />
              {selectedItem.displaySize}
            </ItemSize>
            <ItemLocation $isDark={isDark}>
              <FiMapPin size={16} />
              {selectedItem.displayLocation}
            </ItemLocation>
          </ItemDetails>

          <ItemStats>
            <Typography
              variant="h6"
              style={{
                marginBottom: '1rem',
                color: isDark ? '#fff' : '#2c3e50',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <HiOutlineChartBar size={20} />
              Estatísticas
            </Typography>

            {Object.entries(selectedItem.stats).map(([key, value]) => (
              <StatRow key={key}>
                <StatLabel $isDark={isDark}>{key.charAt(0).toUpperCase() + key.slice(1)}</StatLabel>
                <StatValue $isDark={isDark}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </StatValue>
                {typeof value === 'number' && value <= 100 && (
                  <StatBar $isDark={isDark}>
                    <StatFill $percentage={value} $isDark={isDark} />
                  </StatBar>
                )}
              </StatRow>
            ))}
          </ItemStats>
        </ItemCard>
      )}

      {/* 🌾 GRID DE TODOS OS ITENS */}
      <AllItemsSection>
        <ResultsCount $isDark={isDark}>
          <HiOutlineSparkles size={20} />
          {filteredItems.length}{' '}
          {filteredItems.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
        </ResultsCount>

        {filteredItems.length > 0 ? (
          <GridContainer>
            {filteredItems.map((item) => (
              <ItemCard
                key={`${item.type}-${item.id}`}
                $isDark={isDark}
                onClick={() => handleSelectItem(item)}
                style={{
                  cursor: 'pointer',
                  transform:
                    selectedItem?.id === item.id && selectedItem?.type === item.type
                      ? 'scale(1.02)'
                      : 'scale(1)',
                  border:
                    selectedItem?.id === item.id && selectedItem?.type === item.type
                      ? `2px solid ${getTypeColor(item.type)}`
                      : undefined,
                }}
              >
                <ItemImage src={item.image} alt={item.displayName} />
                <ItemInfo>
                  <ItemNumber $isDark={isDark}>#{item.id.toString().padStart(3, '0')}</ItemNumber>
                  <ItemName $isDark={isDark} style={{ fontSize: '1.2rem' }}>
                    {item.displayName}
                  </ItemName>
                  <ItemType $typeColor={getTypeColor(item.type)} $isDark={isDark}>
                    <ItemTypeIcon>{getTypeIcon(item.type)}</ItemTypeIcon>
                    {item.displayType}
                  </ItemType>
                  <ActionButtonsContainer style={{ marginTop: '1rem' }}>
                    <ActionButton
                      $isDark={isDark}
                      $variant="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      <FiEdit3 size={14} />
                    </ActionButton>
                    <ActionButton
                      $isDark={isDark}
                      $variant="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      <FiTrash2 size={14} />
                    </ActionButton>
                  </ActionButtonsContainer>
                </ItemInfo>
              </ItemCard>
            ))}
          </GridContainer>
        ) : (
          <NoResultsContainer $isDark={isDark}>
            <EmptyStateIcon>
              <FiSearch size={48} />
            </EmptyStateIcon>
            <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
              Ops! Nenhum resultado encontrado
            </Typography>
            <Typography variant="body1" style={{ opacity: 0.7, textAlign: 'center' }}>
              Tente buscar por nome, tipo ou localização
            </Typography>
            <Button isDark={isDark} onClick={handleRandomItem} style={{ marginTop: '1rem' }}>
              <FiShuffle size={16} />
              Que tal um item aleatório?
            </Button>
          </NoResultsContainer>
        )}
      </AllItemsSection>
    </>
  );

  // 🖥️ RENDERIZAÇÃO DESKTOP SUPREMA
  const renderDesktopLayout = () => (
    <DesktopLayout>
      {/* 🎯 PAINEL ESQUERDO - ITEM SELECIONADO */}
      <LeftPanel $isDark={isDark}>
        {selectedItem && (
          <>
            <HeroSection $isDark={isDark} $isDesktop>
              <HeroImage src={selectedItem.image} alt={selectedItem.displayName} loading="lazy" />
              <HeroImageOverlay $isDark={isDark} />
              {isLoading && <ShimmerEffect />}
            </HeroSection>

            <SearchSection>
              <SearchTypeSelector>
                {(['all', 'producers', 'farms', 'crops'] as SearchType[]).map((type) => (
                  <SearchTypeButton
                    key={type}
                    $isDark={isDark}
                    $isActive={searchType === type}
                    onClick={() => setSearchType(type)}
                  >
                    <IconWrapper>{getTypeIcon(type)}</IconWrapper>
                    {type === 'all'
                      ? 'Todos'
                      : type === 'producers'
                        ? 'Produtores'
                        : type === 'farms'
                          ? 'Fazendas'
                          : 'Culturas'}
                  </SearchTypeButton>
                ))}
              </SearchTypeSelector>

              <SearchInputContainer $isDark={isDark}>
                <SearchInput
                  $isDark={isDark}
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <SearchButton $isDark={isDark} onClick={handleSearch} disabled={isLoading}>
                  <FiSearch size={18} />
                </SearchButton>
              </SearchInputContainer>

              <Button isDark={isDark} onClick={handleRandomItem} disabled={isLoading}>
                <FiShuffle size={16} />
                Item Aleatório
              </Button>
            </SearchSection>

            <ItemCard $isDark={isDark} $isDesktop>
              <ItemHeader>
                <ItemNumber $isDark={isDark}>
                  #{selectedItem.id.toString().padStart(3, '0')}
                </ItemNumber>
                <ActionButtonsContainer>
                  <ActionButton
                    $isDark={isDark}
                    $variant="edit"
                    onClick={() => handleEdit(selectedItem)}
                  >
                    <FiEdit3 size={16} />
                  </ActionButton>
                  <ActionButton
                    $isDark={isDark}
                    $variant="delete"
                    onClick={() => handleDelete(selectedItem)}
                  >
                    <FiTrash2 size={16} />
                  </ActionButton>
                </ActionButtonsContainer>
              </ItemHeader>

              <ItemName $isDark={isDark}>{selectedItem.displayName}</ItemName>
              <ItemType $typeColor={getTypeColor(selectedItem.type)} $isDark={isDark}>
                <ItemTypeIcon>{getTypeIcon(selectedItem.type)}</ItemTypeIcon>
                {selectedItem.displayType}
              </ItemType>

              <ItemDetails>
                <ItemSize $isDark={isDark}>
                  <FiTrendingUp size={16} />
                  {selectedItem.displaySize}
                </ItemSize>
                <ItemLocation $isDark={isDark}>
                  <FiMapPin size={16} />
                  {selectedItem.displayLocation}
                </ItemLocation>
              </ItemDetails>

              <ItemStats>
                <Typography
                  variant="h6"
                  style={{
                    marginBottom: '1rem',
                    color: isDark ? '#fff' : '#2c3e50',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <HiOutlineChartBar size={20} />
                  Estatísticas
                </Typography>

                {Object.entries(selectedItem.stats).map(([key, value]) => (
                  <StatRow key={key}>
                    <StatLabel $isDark={isDark}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </StatLabel>
                    <StatValue $isDark={isDark}>
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </StatValue>
                    {typeof value === 'number' && value <= 100 && (
                      <StatBar $isDark={isDark}>
                        <StatFill $percentage={value} $isDark={isDark} />
                      </StatBar>
                    )}
                  </StatRow>
                ))}
              </ItemStats>
            </ItemCard>
          </>
        )}
      </LeftPanel>

      {/* 🌾 PAINEL DIREITO - TODOS OS ITENS */}
      <RightPanel $isDark={isDark}>
        <ResultsCount $isDark={isDark}>
          <HiOutlineSparkles size={20} />
          {filteredItems.length} {filteredItems.length === 1 ? 'resultado' : 'resultados'}
        </ResultsCount>

        <ItemGrid>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <MiniCard
                key={`${item.type}-${item.id}`}
                $isDark={isDark}
                $isSelected={selectedItem?.id === item.id && selectedItem?.type === item.type}
                onClick={() => handleSelectItem(item)}
              >
                <MiniCardImage src={item.image} alt={item.displayName} />
                <MiniCardInfo>
                  <ItemNumber $isDark={isDark} style={{ fontSize: '0.8rem', margin: 0 }}>
                    #{item.id.toString().padStart(3, '0')}
                  </ItemNumber>
                  <MiniCardName $isDark={isDark}>{item.displayName}</MiniCardName>
                  <MiniCardType $typeColor={getTypeColor(item.type)} $isDark={isDark}>
                    <ItemTypeIcon>{getTypeIcon(item.type)}</ItemTypeIcon>
                    {item.displayType}
                  </MiniCardType>
                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,62,80,0.7)',
                      marginTop: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <FiMapPin size={12} />
                    {item.displayLocation}
                  </div>
                  <ActionButtonsContainer style={{ marginTop: '0.8rem' }}>
                    <ActionButton
                      $isDark={isDark}
                      $variant="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(item);
                      }}
                    >
                      <FiEdit3 size={12} />
                    </ActionButton>
                    <ActionButton
                      $isDark={isDark}
                      $variant="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                    >
                      <FiTrash2 size={12} />
                    </ActionButton>
                  </ActionButtonsContainer>
                </MiniCardInfo>
              </MiniCard>
            ))
          ) : (
            <NoResultsContainer $isDark={isDark}>
              <EmptyStateIcon>
                <FiSearch size={36} />
              </EmptyStateIcon>
              <Typography variant="h6" style={{ marginBottom: '0.5rem' }}>
                Nenhum resultado encontrado
              </Typography>
              <Typography variant="body2" style={{ opacity: 0.7 }}>
                Tente buscar por nome, tipo ou localização
              </Typography>
            </NoResultsContainer>
          )}
        </ItemGrid>
      </RightPanel>
    </DesktopLayout>
  );

  return (
    <>
      <meta name="title" content="Explorador Supremo" />
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
          🔍 Pesquisar
        </Text>
      </div>

      <SearchContainer $isDark={isDark} data-scroll-container>
        {isDesktop ? renderDesktopLayout() : renderMobileLayout()}
      </SearchContainer>
    </>
  );
};
