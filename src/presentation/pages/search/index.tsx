import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { LoadingOverlay, Text } from '@components';
import { Crop, Farm, Producer } from '@entities';
import { CropService, FarmService, ProducerService, SearchService } from '@services';
import { useThemeMode } from '@theme';

import { RenderDesktop } from './components/RenderDesktop';
import { RenderMobileLayout } from './components/RenderMobile';
import { SearchContainer } from './components/styles';
import { SearchType, UnifiedItem } from './types';
import {
  getTypeColor,
  getTypeIcon,
  scrollToTop,
  transformToUnifiedItems,
  useDebounce,
  useScreenSize,
} from './utils';

export const Search = () => {
  const { themeMode: theme } = useThemeMode();
  const isDark = theme === 'dark';
  const isDesktop = useScreenSize();
  const navigate = useNavigate();

  // 🎯 STATES SUPREMOS
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Inicializando...');
  const [loadedCounts, setLoadedCounts] = useState({
    producers: 0,
    farms: 0,
    crops: 0,
  });

  // 🔍 DEBOUNCE PARA PESQUISA
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🧠 BUSCA USANDO APENAS SERVICES - SUPREMO
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      // Cache os dados para evitar recalcular toda vez
      return {
        producers: ProducerService.getAllProducers(),
        farms: FarmService.searchFarms(''),
        crops: CropService.searchCrops(''),
        total: 0,
      };
    }

    return SearchService.globalSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  // 🎯 COMBINAR RESULTADOS E CRIAR ITEMS UNIFICADOS
  const allItems = useMemo(() => {
    const { producers, farms, crops } = searchResults;
    return transformToUnifiedItems(producers, farms, crops);
  }, [searchResults]);

  // 🔍 FILTRO POR TIPO USANDO SERVICES
  const filteredItems = useMemo(() => {
    if (searchType === 'all') return allItems;

    // Filtro direto usando services para performance máxima
    switch (searchType) {
      case 'producers': {
        const producers = debouncedSearchTerm.trim()
          ? ProducerService.searchProducers(debouncedSearchTerm)
          : ProducerService.getAllProducers();
        return transformToUnifiedItems(producers, [], []);
      }

      case 'farms': {
        const farms = FarmService.searchFarms(debouncedSearchTerm);
        return transformToUnifiedItems([], farms, []);
      }

      case 'crops': {
        const crops = CropService.searchCrops(debouncedSearchTerm);
        return transformToUnifiedItems([], [], crops);
      }

      default:
        return allItems;
    }
  }, [allItems, searchType, debouncedSearchTerm]);

  // 🎲 ITEM ALEATÓRIO ÉPICO
  const handleRandomItem = useCallback(() => {
    if (filteredItems.length === 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const randomItem = filteredItems[Math.floor(Math.random() * filteredItems.length)];
      setSelectedItem(randomItem);
      setSearchTerm('');
      setIsLoading(false);
      if (!isDesktop) setTimeout(() => scrollToTop(), 100);
    }, 800);
  }, [filteredItems, isDesktop]);

  // 🔍 BUSCA SUPREMA
  const handleSearch = useCallback(() => {
    if (filteredItems.length > 0) {
      setSelectedItem(filteredItems[0]);
      if (!isDesktop) setTimeout(() => scrollToTop(), 100);
    }
  }, [filteredItems, isDesktop]);

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
    (item: UnifiedItem) => {
      setSelectedItem(item);
      if (searchTerm) setSearchTerm('');
      if (!isDesktop) setTimeout(() => scrollToTop(), 100);
    },
    [searchTerm, isDesktop],
  );

  // ✏️ EDITAR ITEM
  const handleEdit = useCallback(
    (item: UnifiedItem) => {
      const editRoutes = {
        producer: `/produtores/editar/${item.id}`,
        farm: `/fazendas/editar/${item.id}`,
        crop: `/culturas/editar/${item.id}`,
      };
      navigate(editRoutes[item.type]);
    },
    [navigate],
  );

  // 🗑️ EXCLUIR ITEM USANDO SERVICES
  const handleDelete = useCallback(
    async (item: UnifiedItem) => {
      if (!window.confirm(`Tem certeza que deseja excluir ${item.displayName}?`)) {
        return;
      }

      try {
        let success = false;

        // Usando apenas services para exclusão
        switch (item.type) {
          case 'producer':
            success = await ProducerService.deleteProducer(item.id);
            break;
          case 'farm':
            success = await FarmService.deleteFarm(item.id);
            break;
          case 'crop':
            success = await CropService.deleteCrop(item.id);
            break;
        }

        if (!success) {
          throw new Error('Falha ao excluir item');
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
    [selectedItem, filteredItems],
  );

  // 🚀 CARREGAMENTO REAL E OTIMIZADO
  useEffect(() => {
    const loadDataReal = async () => {
      const startTime = performance.now();
      setIsInitialLoading(true);
      setProgress(0);

      try {
        // 🎯 ETAPA 1: Inicialização
        setLoadingMessage('Conectando aos dados...');
        setProgress(5);

        // Pequeno delay para evitar flash muito rápido
        await new Promise((resolve) => setTimeout(resolve, 100));

        // 🎯 ETAPA 2: Carregar dados em paralelo para máxima performance
        setLoadingMessage('Carregando dados...');
        setProgress(15);

        const loadPromises = [
          // Carrega produtores
          (async () => {
            const producers = await Promise.resolve(ProducerService.getAllProducers());
            setLoadedCounts((prev) => ({ ...prev, producers: producers.length }));
            setProgress((prev) => prev + 25);
            return producers;
          })(),

          // Carrega fazendas
          (async () => {
            const farms = await Promise.resolve(FarmService.searchFarms(''));
            setLoadedCounts((prev) => ({ ...prev, farms: farms.length }));
            setProgress((prev) => prev + 25);
            return farms;
          })(),

          // Carrega culturas
          (async () => {
            const crops = await Promise.resolve(CropService.searchCrops(''));
            setLoadedCounts((prev) => ({ ...prev, crops: crops.length }));
            setProgress((prev) => prev + 25);
            return crops;
          })(),
        ];

        // Aguarda todos os dados carregarem
        const [producers, farms, crops] = (await Promise.all(loadPromises)) as [
          Producer[],
          Farm[],
          Crop[],
        ];

        // 🎯 ETAPA 3: Processar dados
        setLoadingMessage('Processando dados...');
        setProgress(75);

        // Simula processamento mínimo para dar feedback
        await new Promise((resolve) => setTimeout(resolve, 50));

        const items = transformToUnifiedItems(producers, farms, crops);
        setProgress(90);

        // 🎯 ETAPA 4: Finalizar
        setLoadingMessage('Finalizando...');

        if (items.length > 0) {
          setSelectedItem(items[0]);
        }

        setProgress(100);
        setLoadingMessage('Carregamento concluído!');

        // 🚀 TEMPO MÍNIMO INTELIGENTE
        const loadTime = performance.now() - startTime;
        const minTime = 400; // Tempo mínimo para não dar flash
        const maxTime = 1000; // Tempo máximo para não demorar

        let remainingTime = 0;

        if (loadTime < minTime) {
          // Se foi muito rápido, adiciona um pouco de delay
          remainingTime = minTime - loadTime;
        } else if (loadTime > maxTime) {
          // Se demorou muito, sai imediatamente
          remainingTime = 0;
        } else {
          // Se foi no tempo ideal, só uma pequena pausa no 100%
          remainingTime = 100;
        }

        if (remainingTime > 0) {
          await new Promise((resolve) => setTimeout(resolve, remainingTime));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        setLoadingMessage('Erro no carregamento');
        setProgress(0);

        // Em caso de erro, sai rapidamente
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } finally {
        setIsInitialLoading(false);
        setProgress(0);
        setLoadingMessage('Inicializando...');
        setLoadedCounts({ producers: 0, farms: 0, crops: 0 });
      }
    };

    loadDataReal();
  }, []); // 🚀 Só executa uma vez na inicialização

  // 🎨 OVERLAY OTIMIZADO
  if (isInitialLoading) {
    return (
      <LoadingOverlay
        isVisible={true}
        isDark={isDark}
        type="search"
        variant="rings"
        title="🚀 Carregando Sistema"
        subtitle="Obtendo dados em tempo real"
        loadingText={loadingMessage}
        showProgress={true}
        progress={progress}
        stats={[
          {
            label: 'Produtores',
            value: loadedCounts.producers > 0 ? loadedCounts.producers.toLocaleString() : '...',
          },
          {
            label: 'Fazendas',
            value: loadedCounts.farms > 0 ? loadedCounts.farms.toLocaleString() : '...',
          },
          {
            label: 'Culturas',
            value: loadedCounts.crops > 0 ? loadedCounts.crops.toLocaleString() : '...',
          },
        ]}
        cancelable={true}
        onCancel={() => {
          setIsInitialLoading(false);
          setProgress(0);
        }}
        estimatedDuration={1000}
        spinnerColor="#27ae60"
        spinnerSize="large"
        blurIntensity="medium"
        icon={<FiSearch size={32} />}
      />
    );
  }

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
        {isDesktop ? (
          <RenderDesktop
            isDark={isDark}
            selectedItem={selectedItem}
            isLoading={isLoading}
            searchType={searchType}
            searchTerm={searchTerm}
            setSearchType={setSearchType}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
            handleRandomItem={handleRandomItem}
            handleSelectItem={handleSelectItem}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            filteredItems={filteredItems}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
          />
        ) : (
          <RenderMobileLayout
            isDark={isDark}
            selectedItem={selectedItem}
            isLoading={isLoading}
            searchType={searchType}
            searchTerm={searchTerm}
            setSearchType={setSearchType}
            setSearchTerm={setSearchTerm}
            handleKeyPress={handleKeyPress}
            handleSearch={handleSearch}
            handleRandomItem={handleRandomItem}
            handleSelectItem={handleSelectItem}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            filteredItems={filteredItems}
            getTypeIcon={getTypeIcon}
            getTypeColor={getTypeColor}
          />
        )}
      </SearchContainer>
    </>
  );
};
