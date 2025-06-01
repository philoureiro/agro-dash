import React, { JSX } from 'react';
import { FiEdit3, FiMapPin, FiSearch, FiShuffle, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { HiOutlineChartBar, HiOutlineSparkles } from 'react-icons/hi';

import { Typography } from '@mui/material';

import { Button } from '@components';

import { SearchType, UnifiedItem } from '../types';
import {
  ActionButton,
  ActionButtonsContainer,
  AllItemsSection,
  EmptyStateIcon,
  GridContainer,
  HeroImage,
  HeroImageOverlay,
  HeroSection,
  IconWrapper,
  ItemCard,
  ItemDetails,
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
  NoResultsContainer,
  ResultsCount,
  SearchButton,
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

interface RenderMobileLayoutProps {
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
}

export const RenderMobileLayout: React.FC<RenderMobileLayoutProps> = ({
  isDark,
  selectedItem,
  isLoading,
  searchType,
  searchTerm,
  setSearchType,
  setSearchTerm,
  handleKeyPress,
  handleSearch,
  handleRandomItem,
  handleSelectItem,
  handleEdit,
  handleDelete,
  filteredItems,
  getTypeIcon,
  getTypeColor,
}) => (
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
            <ActionButton $isDark={isDark} $variant="edit" onClick={() => handleEdit(selectedItem)}>
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
