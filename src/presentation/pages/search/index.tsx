import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Text } from '@components';
import { SearchService } from '@services';
import { useCropStore, useFarmStore, useProducerStore } from '@storage';
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

  // 🏪 STORE HOOKS
  const deleteProducer = useProducerStore((state) => state.deleteProducer);
  const deleteFarm = useFarmStore((state) => state.deleteFarm);
  const deleteCrop = useCropStore((state) => state.deleteCrop);

  // 🎯 STATES SUPREMOS
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 🔍 DEBOUNCE PARA PESQUISA
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🧠 BUSCA USANDO SEARCHSERVICE SUPREMO
  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      // Se não há termo de busca, pega todos os dados ativos
      return {
        producers:
          useProducerStore.getState().getActiveProducers?.() ||
          useProducerStore.getState().producers ||
          [],
        farms: useFarmStore.getState().getActiveFarms?.() || useFarmStore.getState().farms || [],
        crops: useCropStore.getState().getActiveCrops?.() || useCropStore.getState().crops || [],
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

  // 🔍 FILTRO POR TIPO
  const filteredItems = useMemo(() => {
    if (searchType === 'all') return allItems;

    const typeMap: Record<SearchType, string> = {
      all: 'all',
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

  // 🗑️ EXCLUIR ITEM
  const handleDelete = useCallback(
    async (item: UnifiedItem) => {
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
