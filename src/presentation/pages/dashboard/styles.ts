import styled, { css, keyframes } from 'styled-components';

// 🎬 ANIMAÇÕES ÉPICAS
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const bounce = keyframes`
  0%, 20%, 53%, 80%, 100% {
    animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000);
    transform: translate3d(0,0,0);
  }
  40%, 43% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -30px, 0);
  }
  70% {
    animation-timing-function: cubic-bezier(0.755, 0.050, 0.855, 0.060);
    transform: translate3d(0, -15px, 0);
  }
  90% {
    transform: translate3d(0,-4px,0);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

// ✨ SHIMMER ANIMATION
const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// 🎯 CONTAINER PRINCIPAL
export const DashboardContainer = styled.div<{ isDark: boolean }>`
  min-height: 100vh;
  margin-top: 120px;
  margin-bottom: 100px;
  width: 100%;
  padding: 2rem 1.5rem;

  color: ${({ isDark }) => (isDark ? '#F8FAFC' : '#1E293B')};
  transition: all 0.3s ease;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .dashboard-title {
    background-size: 200% 200%;

    background-clip: text;
    animation: ${gradientShift} 4s ease infinite;
    font-weight: 800;
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1.1;
    margin-bottom: 0.5rem;
  }

  .dashboard-subtitle {
    opacity: 0.8;
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    font-weight: 500;
    margin-left: 14%;

    @media (max-width: 768px) {
      margin-left: 12%;
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

// 🎯 HEADER SECTION
export const HeaderSection = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  gap: 2rem;
  animation: ${fadeInUp} 0.8s ease;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: stretch;
    gap: 1.5rem;
  }
`;

// 📊 GRID DE MÉTRICAS
export const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// 🎨 ÍCONE DA MÉTRICA
export const MetricIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: transform 0.3s ease;
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
`;

// 🎯 CARD DE MÉTRICA
export const MetricCard = styled.div<{ delay?: number }>`
  background: ${({ theme }) => theme.palette?.background?.paper || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.palette?.divider || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.6s ease;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #10b981, #3b82f6, #f59e0b);
    background-size: 200% 100%;
    animation: ${shimmer} 3s ease infinite;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05);

    ${MetricIcon} {
      transform: scale(1.1) rotate(5deg);
    }
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

// 📝 CONTEÚDO DA MÉTRICA
export const MetricContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

// 🔢 VALOR DA MÉTRICA
export const MetricValue = styled.div`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  line-height: 1;
  color: ${({ theme }) => theme.palette?.primary?.main || '#10B981'};
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.2));
`;

// 🏷️ LABEL DA MÉTRICA
export const MetricLabel = styled.div`
  font-size: 1rem;
  font-weight: 600;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

// 📈 INDICADOR DE TENDÊNCIA
export const MetricTrend = styled.div<{ positive?: boolean }>`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ positive }) => (positive ? '#10B981' : '#EF4444')};
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &::before {
    content: '${({ positive }) => (positive ? '↗️' : '↘️')}';
    font-size: 1rem;
  }
`;

// 🌈 BARRA DE GRADIENTE
export const GradientBar = styled.div<{ color: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(
    90deg,
    ${({ color }) => color}00,
    ${({ color }) => color},
    ${({ color }) => color}00
  );
  background-size: 200% 100%;
  animation: ${shimmer} 2s ease infinite;
`;

// 📊 SEÇÃO DE GRÁFICOS
export const ChartsSection = styled.section`
  margin-bottom: 3rem;
`;

// 🎯 GRID DE GRÁFICOS
export const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

// 📈 CARD DO GRÁFICO
export const ChartCard = styled.div<{ delay?: number }>`
  background: ${({ theme }) => theme.palette?.background?.paper || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.palette?.divider || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${fadeInUp} 0.8s ease;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-4px);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 640px) {
    padding: 1rem;
  }
`;

// 🎯 HEADER DO GRÁFICO
export const ChartHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

// 🏷️ TÍTULO DO GRÁFICO
export const ChartTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  background: linear-gradient(135deg, #10b981, #3b82f6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

// 📝 SUBTÍTULO DO GRÁFICO
export const ChartSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.7;
  margin: 0;
`;

// 📱 CONTAINER RESPONSIVO DO GRÁFICO
export const ResponsiveChart = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;

  svg {
    max-width: 100%;
    height: auto;
  }

  /* Touch optimization for mobile */
  @media (max-width: 768px) {
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
`;

// 💡 SEÇÃO DE INSIGHTS
export const InsightsSection = styled.section`
  margin-top: 3rem;

  .insights-title {
    margin-bottom: 2rem;
    text-align: center;
    background-clip: text;
    font-weight: 800;
  }

  .insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
`;

// 💡 CARD DE INSIGHT
export const InsightCard = styled.div<{ delay?: number }>`
  background: ${({ theme }) => theme.palette?.background?.paper || 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: 1px solid ${({ theme }) => theme.palette?.divider || 'rgba(255, 255, 255, 0.1)'};
  border-radius: 1.5rem;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: ${slideInRight} 0.6s ease;
  animation-delay: ${({ delay = 0 }) => delay}ms;
  animation-fill-mode: both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #10b981, #3b82f6, #f59e0b);
    background-size: 100% 200%;
    animation: ${shimmer} 3s ease infinite;
  }

  &:hover {
    transform: translateX(8px);
    box-shadow:
      0 10px 30px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }

  @media (max-width: 640px) {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }
`;

// 🎨 ÍCONE DO INSIGHT
export const InsightIcon = styled.div`
  font-size: 3rem;
  flex-shrink: 0;
  filter: drop-shadow(0 0 10px rgba(16, 185, 129, 0.3));
`;

// 📝 CONTEÚDO DO INSIGHT
export const InsightContent = styled.div`
  flex: 1;
`;

// 🏷️ TÍTULO DO INSIGHT
export const InsightTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.palette?.primary?.main || '#10B981'};
`;

// 📝 DESCRIÇÃO DO INSIGHT
export const InsightDescription = styled.p`
  font-size: 0.875rem;
  opacity: 0.8;
  margin: 0;
  line-height: 1.5;
`;

// 🏆 BADGE DE ESTATÍSTICA
export const StatBadge = styled.div<{ color: string }>`
  background: ${({ color }) => `${color}20`};
  color: ${({ color }) => color};
  border: 1px solid ${({ color }) => `${color}40`};
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
`;

// 🎬 CONTADOR ANIMADO
export const AnimatedCounter = styled.span`
  display: inline-block;
  font-variant-numeric: tabular-nums;
`;

// 🔄 INDICADOR DE TENDÊNCIA
export const TrendIndicator = styled.span<{ trend: 'up' | 'down' | 'stable' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;

  ${({ trend }) => {
    switch (trend) {
      case 'up':
        return css`
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          &::before {
            content: '↗️';
          }
        `;
      case 'down':
        return css`
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          &::before {
            content: '↘️';
          }
        `;
      default:
        return css`
          background: rgba(107, 114, 128, 0.1);
          color: #6b7280;
          &::before {
            content: '➡️';
          }
        `;
    }
  }}
`;

// 🎯 SEÇÃO DE EXPORTAÇÃO
export const ExportSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    justify-content: center;
    width: 100%;
  }
`;

// 🔍 SEÇÃO DE FILTROS
export const FilterSection = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

// 🏷️ CHIP DE FILTRO
export const FilterChip = styled.button<{ isActive?: boolean; isDark?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  border: 1px solid ${({ theme }) => theme.palette?.divider || '#E5E7EB'};
  background: ${({ isActive, theme }) =>
    isActive
      ? theme.palette?.primary?.main || '#10B981'
      : theme.palette?.background?.paper || 'transparent'};

  color: ${({ isDark }) => (isDark ? '#F8FAFC' : '#1E293B')};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

// 🎯 BOTÃO DE AÇÃO
export const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  border: none;
  background: ${({ variant, theme }) =>
    variant === 'primary'
      ? `linear-gradient(135deg, ${theme.palette?.primary?.main || '#10B981'}, ${theme.palette?.secondary?.main || '#3B82F6'})`
      : theme.palette?.background?.paper || 'rgba(255, 255, 255, 0.1)'};
  color: ${({ variant }) => (variant === 'primary' ? '#ffffff' : 'inherit')};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

// 🔄 OVERLAY DE LOADING
export const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  z-index: 9999;
  animation: ${fadeInUp} 0.3s ease;

  p {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
  }
`;

// ⭕ SPINNER DE LOADING
export const LoadingSpinner = styled.div`
  display: flex;
  gap: 0.5rem;

  div {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: linear-gradient(45deg, #10b981, #3b82f6, #f59e0b);
    animation: ${bounce} 1.4s ease-in-out infinite both;

    &:nth-child(1) {
      animation-delay: -0.32s;
    }
    &:nth-child(2) {
      animation-delay: -0.16s;
    }
    &:nth-child(3) {
      animation-delay: 0s;
    }
  }
`;

// 📭 ESTADO VAZIO
export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 1.5rem;
  opacity: 0.8;

  h3 {
    font-size: 2rem;
    margin: 0;
  }

  p {
    font-size: 1.125rem;
    margin: 0;
    opacity: 0.7;
  }
`;

// ❌ BOUNDARY DE ERRO
export const ErrorBoundary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 2rem;
  padding: 2rem;

  h3 {
    color: #ef4444;
    font-size: 1.5rem;
    margin: 0;
  }
`;
