import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { ConfirmModal, LoadingOverlay, Text } from '@components';
import { useToast } from '@hooks';
import { CropService, FarmService, ProducerService, SearchService } from '@services';
import { useThemeMode } from '@theme';

import { RenderDesktop } from './components/RenderDesktop';
import { RenderMobileLayout } from './components/RenderMobile';
import { SearchContainer } from './components/styles';
import { SearchType, UnifiedItem } from './types';
import {
  getItemImage, // 🔥 NOVA FUNÇÃO PARA IMAGENS
  getTypeColor,
  getTypeIcon,
  loadDataReal,
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

  const { toast } = useToast();

  // 🎯 STATES SUPREMOS
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [selectedItem, setSelectedItem] = useState<UnifiedItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Inicializando...');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [loadedCounts, setLoadedCounts] = useState({
    producers: 0,
    farms: 0,
    crops: 0,
  });

  // 🔍 DEBOUNCE PARA PESQUISA
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 🧠 BUSCA USANDO APENAS SERVICES - SUPREMO
  const searchResults = useMemo(() => {
    // Force refresh usando o trigger
    const _ = refreshTrigger;

    if (!debouncedSearchTerm.trim()) {
      return {
        producers: ProducerService.getAllProducers(),
        farms: FarmService.searchFarms(''),
        crops: CropService.searchCrops(''),
        total: 0,
      };
    }

    return SearchService.globalSearch(debouncedSearchTerm);
  }, [debouncedSearchTerm, refreshTrigger]);

  // 🎯 COMBINAR RESULTADOS E CRIAR ITEMS UNIFICADOS
  const allItems = useMemo(() => {
    const { producers, farms, crops } = searchResults;
    return transformToUnifiedItems(producers, farms, crops);
  }, [searchResults]);

  // 🔍 FILTRO POR TIPO USANDO SERVICES
  const filteredItems = useMemo(() => {
    if (searchType === 'all') return allItems;

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

  // ✏️ EDITAR ITEM - CORRIGIDO COM PARÂMETROS CORRETOS
  const handleEdit = useCallback(
    (item: UnifiedItem) => {
      const typeParams = {
        producer: 'user',
        farm: 'farm',
        crop: 'crop',
      };

      navigate(`/editar?type=${typeParams[item.type]}&id=${item.id}`);
    },
    [navigate],
  );

  // 🗑️ EXCLUIR ITEM COM LÓGICA DE RELACIONAMENTO
  const [deleteModalData, setDeleteModalData] = useState<{
    isVisible: boolean;
    item: UnifiedItem | null;
    loading: boolean;
  }>({
    isVisible: false,
    item: null,
    loading: false,
  });

  const handleDelete = useCallback((item: UnifiedItem) => {
    setDeleteModalData({
      isVisible: true,
      item,
      loading: false,
    });
  }, []);

  // 🔥 EXCLUSÃO COM LÓGICA DE RELACIONAMENTO SUPREMA
  const confirmDelete = useCallback(async () => {
    if (!deleteModalData.item) return;

    setDeleteModalData((prev) => ({ ...prev, loading: true }));

    try {
      const item = deleteModalData.item;
      let success = false;

      switch (item.type) {
        case 'producer': {
          // 🎯 EXCLUIR PRODUTOR: Remove produtor + fazendas + culturas
          const producer = ProducerService.getProducerById(item.id);
          if (producer?.farmsIds?.length > 0) {
            // Primeiro deletar todas as culturas de todas as fazendas
            for (const farmId of producer.farmsIds) {
              const crops = CropService.searchCrops('', { farmId });
              for (const crop of crops) {
                await CropService.deleteCrop(crop.id);
              }
            }

            // Depois deletar todas as fazendas
            for (const farmId of producer.farmsIds) {
              await FarmService.deleteFarm(farmId);
            }
          }

          // Por último deletar o produtor
          success = await ProducerService.deleteProducer(item.id);
          break;
        }

        case 'farm': {
          // 🎯 EXCLUIR FAZENDA: Remove fazenda + culturas
          const crops = CropService.searchCrops('', { farmId: item.id });

          // Primeiro deletar todas as culturas da fazenda
          for (const crop of crops) {
            await CropService.deleteCrop(crop.id);
          }

          // Depois deletar a fazenda
          success = await FarmService.deleteFarm(item.id);
          break;
        }

        case 'crop': {
          // 🎯 EXCLUIR CULTURA: Remove apenas a cultura
          success = await CropService.deleteCrop(item.id);
          break;
        }
      }

      if (!success) {
        throw new Error('Falha ao excluir item');
      }

      // 🚀 FORÇAR REFRESH COMPLETO DOS DADOS
      setRefreshTrigger((prev) => prev + 1);

      // Limpar seleção
      setSelectedItem(null);

      // Fechar modal
      setDeleteModalData({
        isVisible: false,
        item: null,
        loading: false,
      });

      // Toast de sucesso
      const itemTypeNames = {
        producer: 'Produtor',
        farm: 'Fazenda',
        crop: 'Cultura',
      };

      toast.success(
        'Sucesso!',
        `${itemTypeNames[item.type]} "${item.displayName}" foi excluído com sucesso.`,
      );
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast.error('Erro!', 'Erro ao excluir item. Tente novamente.');

      setDeleteModalData({
        isVisible: false,
        item: null,
        loading: false,
      });
    }
  }, [deleteModalData.item, toast]);

  const cancelDelete = useCallback(() => {
    setDeleteModalData({
      isVisible: false,
      item: null,
      loading: false,
    });
  }, []);

  // 🚀 CARREGAMENTO REAL E OTIMIZADO
  useEffect(() => {
    loadDataReal({
      setIsInitialLoading,
      setProgress,
      setLoadingMessage,
      setLoadedCounts,
      setSelectedItem,
      transformToUnifiedItems,
      ProducerService: {
        ...ProducerService,
        getAllProducers: async () => ProducerService.getAllProducers(),
      },
      FarmService,
      CropService,
    });
  }, []);

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

        <ConfirmModal
          isVisible={deleteModalData.isVisible}
          isDark={isDark}
          type="danger"
          title="Confirmar Exclusão"
          subtitle={`Você está prestes a excluir ${deleteModalData.item?.displayName}`}
          message={getDeleteMessage(deleteModalData.item)}
          confirmText="Sim, Excluir"
          cancelText="Cancelar"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          loading={deleteModalData.loading}
        />
      </SearchContainer>
    </>
  );
};

// 🎯 FUNÇÃO HELPER PARA MENSAGEM DE EXCLUSÃO
const getDeleteMessage = (item: UnifiedItem | null): string => {
  if (!item) return 'Esta ação não pode ser desfeita. Tem certeza que deseja continuar?';

  switch (item.type) {
    case 'producer':
      return 'Esta ação excluirá o produtor e TODAS as suas fazendas e culturas. Esta ação não pode ser desfeita!';
    case 'farm':
      return 'Esta ação excluirá a fazenda e TODAS as suas culturas. Esta ação não pode ser desfeita!';
    case 'crop':
      return 'Esta ação excluirá apenas esta cultura. Esta ação não pode ser desfeita!';
    default:
      return 'Esta ação não pode ser desfeita. Tem certeza que deseja continuar?';
  }
};
