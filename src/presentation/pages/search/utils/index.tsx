import { JSX, useEffect, useState } from 'react';
import { FiHome, FiLayers, FiUsers } from 'react-icons/fi';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoLeafOutline, IoPeople } from 'react-icons/io5';
import { TbPlant2 } from 'react-icons/tb';

import { Crop, Farm, Producer } from '@entities';
import { CropService, FarmService } from '@services';

import { UnifiedItem } from '../types';

// 🔍 HOOK PARA DEBOUNCE SUPREMO
export const useDebounce = (value: string, delay: number) => {
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
export const useScreenSize = () => {
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
export const scrollToTop = () => {
  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  } catch {
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

// 🎨 FUNÇÃO PARA PEGAR IMAGEM DO STORE OU FALLBACK
export const getItemImage = (item: UnifiedItem): string => {
  const { originalData, type } = item;

  try {
    // 1️⃣ TENTAR PEGAR IMAGEM REAL COM TYPE GUARDS SEGUROS
    let imageUrl = '';

    if (type === 'producer' && originalData && 'profilePhoto' in originalData) {
      imageUrl = (originalData as Producer).profilePhoto || '';
    } else if (type === 'farm' && originalData && 'farmPhoto' in originalData) {
      imageUrl = (originalData as Farm).farmPhoto || '';
    } else if (type === 'crop' && originalData && 'cropPhoto' in originalData) {
      imageUrl = (originalData as Crop).cropPhoto || '';
    }

    // 2️⃣ SE TEM IMAGEM VÁLIDA, RETORNA ELA
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
      return imageUrl;
    }
  } catch (error) {
    console.warn('Erro ao obter imagem do item:', error);
  }

  // 3️⃣ FALLBACK SEMPRE FUNCIONAL
  const fallbackImages = {
    producer: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=600&fit=crop',
    farm: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
    crop: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=600&fit=crop',
  };

  return fallbackImages[type] || fallbackImages.crop;
};

// 🎯 FUNÇÃO PARA PEGAR ÍCONE BASEADO NO TIPO
export const getTypeIcon = (type: string) => {
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
export const getTypeColor = (type: string) => {
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

// 🔧 FUNÇÃO SUPREMA PARA TRANSFORMAR DADOS EM ITENS UNIFICADOS USANDO SERVICES
export const transformToUnifiedItems = (
  producers: Producer[],
  farms: Farm[],
  crops: Crop[],
): UnifiedItem[] => {
  const producerItems: UnifiedItem[] = producers.map((p) => {
    try {
      // Usa service para buscar fazendas do produtor
      const producerFarms = FarmService.searchFarms('', { producerId: p.id });
      const totalArea = producerFarms.reduce((acc, f) => acc + (f.totalArea || 0), 0);

      // Busca culturas das fazendas do produtor usando service
      const producerCrops = producerFarms.flatMap((farm) =>
        CropService.searchCrops('', { farmId: farm.id }),
      );

      return {
        id: p.id,
        type: 'producer' as const,
        displayName: p.name,
        displayType: 'Produtor',
        displayLocation:
          producerFarms.length > 0
            ? `${producerFarms[0].city || 'N/A'}, ${producerFarms[0].state || 'N/A'}`
            : 'N/A',
        displaySize: `${p.document || 'N/A'}`,
        image: '', // Será preenchida depois
        stats: {
          fazendas: producerFarms.length,
          área: totalArea,
          culturas: producerCrops.length,
          documento: p.documentType === 'CPF' ? 'CPF' : 'CNPJ',
          telefone: p.phone || 'N/A',
          email: p.email || 'N/A',
        },
        originalData: p,
      };
    } catch (error) {
      console.warn('Erro ao processar producer:', p.id, error);
      return {
        id: p.id,
        type: 'producer' as const,
        displayName: p.name || 'Produtor',
        displayType: 'Produtor',
        displayLocation: 'N/A',
        displaySize: 'N/A',
        image: '',
        stats: {
          fazendas: 0,
          área: 0,
          culturas: 0,
          documento: 'N/A',
          telefone: 'N/A',
          email: 'N/A',
        },
        originalData: p,
      };
    }
  });

  const farmItems: UnifiedItem[] = farms.map((f) => {
    try {
      // Usa service para obter detalhes completos da fazenda
      const farmDetails = FarmService.getFarmWithDetails(f.id);

      return {
        id: f.id,
        type: 'farm' as const,
        displayName: f.name,
        displayType: 'Fazenda',
        displayLocation: `${f.city || 'N/A'}, ${f.state || 'N/A'}`,
        displaySize: `${(f.totalArea || 0).toLocaleString()} hectares`,
        image: '',
        stats: {
          'área total': f.totalArea || 0,
          'área agrícola': f.agriculturalArea || 0,
          'área vegetação': f.vegetationArea || 0,
          produtividade: f.productivity || 0,
          sustentabilidade: f.sustainability || 0,
          tecnologia: f.technology || 0,
          utilização: farmDetails?.utilizationPercentage || 0,
        },
        originalData: f,
      };
    } catch (error) {
      console.warn('Erro ao processar farm:', f.id, error);
      return {
        id: f.id,
        type: 'farm' as const,
        displayName: f.name || 'Fazenda',
        displayType: 'Fazenda',
        displayLocation: 'N/A',
        displaySize: 'N/A',
        image: '',
        stats: {
          'área total': 0,
          'área agrícola': 0,
          'área vegetação': 0,
          produtividade: 0,
          sustentabilidade: 0,
          tecnologia: 0,
          utilização: 0,
        },
        originalData: f,
      };
    }
  });

  const cropItems: UnifiedItem[] = crops.map((c) => {
    try {
      const farm = farms.find((f) => f.id === c.farmId);

      // 🔥 CORREÇÃO: Tratamento seguro de datas
      let harvestInfo = {};
      try {
        const cropDetails = CropService.getCropWithDetails(c.id);
        harvestInfo = {
          produção: cropDetails?.expectedProduction || 0,
          status: cropDetails?.cropStatus || 'planted',
          'dias para colheita': cropDetails?.daysToHarvest || 'N/A',
        };
      } catch (detailsError) {
        console.warn('Erro ao obter detalhes da cultura:', c.id, detailsError);
      }

      return {
        id: c.id,
        type: 'crop' as const,
        displayName: c.type,
        displayType: 'Cultura',
        displayLocation: farm ? `${farm.city || 'N/A'}, ${farm.state || 'N/A'}` : 'N/A',
        displaySize: `${(c.plantedArea || 0).toLocaleString()} hectares`,
        image: '',
        stats: {
          'área plantada': c.plantedArea || 0,
          safra: parseInt(c.harvestYear) || new Date().getFullYear(),
          fazenda: farm?.name || 'N/A',
          'produtividade esperada': c.expectedYield || 'N/A',
          ...harvestInfo,
        },
        originalData: c,
      };
    } catch (error) {
      console.warn('Erro ao processar crop:', c.id, error);
      return {
        id: c.id,
        type: 'crop' as const,
        displayName: c.type || 'Cultura',
        displayType: 'Cultura',
        displayLocation: 'N/A',
        displaySize: 'N/A',
        image: '',
        stats: {},
        originalData: c,
      };
    }
  });

  return [...producerItems, ...farmItems, ...cropItems];
};
export const loadDataReal = async ({
  setIsInitialLoading,
  setProgress,
  setLoadingMessage,
  setLoadedCounts,
  setSelectedItem,
  transformToUnifiedItems,
  ProducerService,
  FarmService,
  CropService,
}: {
  setIsInitialLoading: (value: boolean) => void;
  setProgress: (value: number | ((prev: number) => number)) => void;
  setLoadingMessage: (msg: string) => void;
  setLoadedCounts: (
    value:
      | { producers: number; farms: number; crops: number }
      | ((prev: { producers: number; farms: number; crops: number }) => {
          producers: number;
          farms: number;
          crops: number;
        }),
  ) => void;
  setSelectedItem: (item: UnifiedItem) => void;
  transformToUnifiedItems: (producers: Producer[], farms: Farm[], crops: Crop[]) => UnifiedItem[];
  ProducerService: { getAllProducers: () => Promise<Producer[]> };
  FarmService: { searchFarms: (query: string, options?: Record<string, unknown>) => Farm[] };
  CropService: { searchCrops: (query: string, options?: Record<string, unknown>) => Crop[] };
}) => {
  const startTime = performance.now();
  setIsInitialLoading(true);
  setProgress(0);

  try {
    setLoadingMessage('Conectando aos dados...');
    setProgress(5);

    await new Promise((resolve) => setTimeout(resolve, 100));

    setLoadingMessage('Carregando dados...');
    setProgress(15);

    const loadPromises = [
      (async () => {
        const producers = await Promise.resolve(ProducerService.getAllProducers());
        setLoadedCounts((prev) => ({ ...prev, producers: producers.length }));
        setProgress((prev: number) => prev + 25);
        return producers;
      })(),
      (async () => {
        const farms = await Promise.resolve(FarmService.searchFarms(''));
        setLoadedCounts((prev) => ({ ...prev, farms: farms.length }));
        setProgress((prev: number) => prev + 25);
        return farms;
      })(),
      (async () => {
        const crops = await Promise.resolve(CropService.searchCrops(''));
        setLoadedCounts((prev) => ({ ...prev, crops: crops.length }));
        setProgress((prev: number) => prev + 25);
        return crops;
      })(),
    ];

    const [producers, farms, crops] = (await Promise.all(loadPromises)) as [
      Producer[],
      Farm[],
      Crop[],
    ];

    setLoadingMessage('Processando dados...');
    setProgress(75);

    await new Promise((resolve) => setTimeout(resolve, 50));

    const items = transformToUnifiedItems(producers, farms, crops);
    setProgress(90);

    setLoadingMessage('Finalizando...');

    if (items.length > 0) {
      setSelectedItem(items[0]);
    }

    setProgress(100);
    setLoadingMessage('Carregamento concluído!');

    const loadTime = performance.now() - startTime;
    const minTime = 400;
    const maxTime = 1000;

    let remainingTime = 0;

    if (loadTime < minTime) {
      remainingTime = minTime - loadTime;
    } else if (loadTime > maxTime) {
      remainingTime = 0;
    } else {
      remainingTime = 100;
    }

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    setLoadingMessage('Erro no carregamento');
    setProgress(0);

    await new Promise((resolve) => setTimeout(resolve, 1000));
  } finally {
    setIsInitialLoading(false);
    setProgress(0);
    setLoadingMessage('Inicializando...');
    setLoadedCounts({ producers: 0, farms: 0, crops: 0 });
  }
};
