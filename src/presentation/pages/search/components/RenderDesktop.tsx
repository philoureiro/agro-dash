import { JSX } from 'react';
import { FiEdit3, FiMapPin, FiSearch, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineSparkles } from 'react-icons/hi';

import { Typography } from '@mui/material';

import { SearchType, UnifiedItem } from '../types';
import {
  ActionButton,
  ActionButtonsContainer,
  DesktopLayout,
  EmptyStateIcon,
  HeroImage,
  HeroImageOverlay,
  HeroSection,
  ItemCard,
  ItemDetails,
  ItemGrid,
  ItemHeader,
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
  ShimmerEffect,
  StatBar,
  StatFill,
  StatLabel,
  StatRow,
  StatValue,
} from './styles';

type RenderDesktopProps = {
  isDark: boolean;
  selectedItem: UnifiedItem | null;
  isLoading: boolean;
  searchType: SearchType;
  searchTerm: string;
  setSearchType: React.Dispatch<React.SetStateAction<SearchType>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  handleSearch: () => void;
  handleRandomItem: () => void;
  handleSelectItem: (item: UnifiedItem) => void;
  handleEdit: (item: UnifiedItem) => void;
  handleDelete: (item: UnifiedItem) => void;
  filteredItems: UnifiedItem[];
  getTypeIcon: (type: string) => JSX.Element;
  getTypeColor: (type: string) => string;
};

export const RenderDesktop: React.FC<RenderDesktopProps> = ({
  isDark,
  isLoading,
  selectedItem,
  filteredItems,

  handleEdit,
  handleDelete,
  handleSelectItem,
  getTypeIcon,
  getTypeColor,
}) => (
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
