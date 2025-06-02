// src/components/AddFarmer/components/PhotoPreview.tsx
import React from 'react';

import { HeroContainer, PhotoImage, PhotoLabel, PhotoOverlay, PlaceholderContent } from './styles';

export interface PhotoPreviewProps {
  photoUrl: string | undefined;
  isDark: boolean;
  type: 'producer' | 'farm' | 'crop';
}

export const PhotoPreview: React.FC<PhotoPreviewProps> = ({ photoUrl, isDark, type }) => {
  const getPlaceholderText = () => {
    switch (type) {
      case 'producer':
        return { icon: '👨‍🌾', text: 'Foto do Produtor' };
      case 'farm':
        return { icon: '🏭', text: 'Foto da Fazenda' };
      case 'crop':
        return { icon: '🌱', text: 'Foto da Cultura' };
    }
  };

  const placeholder = getPlaceholderText();

  return (
    <HeroContainer $isDark={isDark} $hasPhoto={!!photoUrl}>
      {photoUrl ? (
        <>
          <PhotoImage
            src={photoUrl}
            alt={placeholder.text}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <PhotoOverlay $isDark={isDark}>
            <PhotoLabel $isDark={isDark}>
              {placeholder.icon} {placeholder.text}
            </PhotoLabel>
          </PhotoOverlay>
        </>
      ) : (
        <PlaceholderContent $isDark={isDark}>
          <div className="icon">{placeholder.icon}</div>
          <div>{placeholder.text}</div>
          <small>Cole uma URL de imagem válida</small>
        </PlaceholderContent>
      )}
    </HeroContainer>
  );
};
