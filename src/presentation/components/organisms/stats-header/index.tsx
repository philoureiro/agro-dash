import React from 'react';

import { ProgressBar } from '@components';

import {
  BackgroundImageContainer,
  ContentOverlay,
  ProgressSection,
  StatCard,
  StatLabel,
  StatValue,
  StatsGrid,
  StatsHeaderContainer,
} from './styles';

interface StatItem {
  label: string;
  value: string | number;
}

interface StatsHeaderProps {
  progress: number;
  stats: StatItem[];
  backgroundImage?: string;
  isDark: boolean;
  className?: string;
  progressLabel?: string;
}

export const StatsHeader: React.FC<StatsHeaderProps> = ({
  progress,
  stats,
  backgroundImage,
  isDark,
  className,
  progressLabel,
}) => {
  return (
    <StatsHeaderContainer $isDark={isDark} className={className}>
      {/* 🖼️ IMAGEM DE FUNDO COM ZOOM NO HOVER */}
      {backgroundImage && (
        <BackgroundImageContainer>
          <img src={backgroundImage} alt="Background" />
        </BackgroundImageContainer>
      )}

      <ContentOverlay $isDark={isDark} $hasBackground={!!backgroundImage}>
        {stats.length > 0 && (
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatCard key={index} $isDark={isDark}>
                <StatValue $isDark={isDark}>{stat.value}</StatValue>
                <StatLabel $isDark={isDark}>{stat.label}</StatLabel>
              </StatCard>
            ))}
          </StatsGrid>
        )}

        <ProgressSection>
          <ProgressBar
            progress={progress}
            isDark={isDark}
            label={progressLabel}
            textColor={backgroundImage ? '#ffffff' : undefined} // 🔥 BRANCO COM IMAGEM
            color={
              backgroundImage
                ? 'linear-gradient(90deg, #166534, #4ade80)'
                : isDark
                  ? 'linear-gradient(90deg, #4ade80, #22c55e)'
                  : 'linear-gradient(90deg, #0e4222, #146a32)'
            }
          />
        </ProgressSection>
      </ContentOverlay>
    </StatsHeaderContainer>
  );
};
