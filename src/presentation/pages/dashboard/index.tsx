import { useCallback, useEffect, useRef, useState } from 'react';

import { Button, Text } from '@components';
import { DashboardService } from '@services';
import { useThemeMode } from '@theme';
import {
  VictoryArea,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryContainer,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

import { ClientOnly } from './clientOnly';
import {
  ActionButton,
  AnimatedCounter,
  ChartCard,
  ChartGrid,
  ChartHeader,
  ChartSubtitle,
  ChartTitle,
  ChartsSection,
  DashboardContainer,
  EmptyState,
  ErrorBoundary,
  ExportSection,
  FilterChip,
  FilterSection,
  GradientBar,
  HeaderSection,
  InsightCard,
  InsightContent,
  InsightDescription,
  InsightIcon,
  InsightTitle,
  InsightsSection,
  LoadingOverlay,
  LoadingSpinner,
  MetricCard,
  MetricContent,
  MetricIcon,
  MetricLabel,
  MetricTrend,
  MetricValue,
  MetricsGrid,
  ResponsiveChart,
  StatBadge,
} from './styles';

// 🎨 PALETAS DE CORES SUPREMAS
const CHART_COLORS = {
  light: {
    primary: ['#10B981', '#059669', '#047857', '#065F46', '#064E3B'],
    secondary: ['#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A'],
    accent: ['#F59E0B', '#D97706', '#B45309', '#92400E', '#78350F'],
    success: ['#10B981', '#059669', '#047857'],
    warning: ['#F59E0B', '#D97706', '#B45309'],
    danger: ['#EF4444', '#DC2626', '#B91C1C'],
    gradient: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'],
  },
  dark: {
    primary: ['#34D399', '#10B981', '#059669', '#047857', '#065F46'],
    secondary: ['#60A5FA', '#3B82F6', '#2563EB', '#1D4ED8', '#1E40AF'],
    accent: ['#FBBF24', '#F59E0B', '#D97706', '#B45309', '#92400E'],
    success: ['#34D399', '#10B981', '#059669'],
    warning: ['#FBBF24', '#F59E0B', '#D97706'],
    danger: ['#F87171', '#EF4444', '#DC2626'],
    gradient: ['#34D399', '#60A5FA', '#FBBF24', '#F87171', '#A78BFA'],
  },
};

// 🔄 HOOK PARA TAMANHO RESPONSIVO DOS GRÁFICOS
const useResponsiveChartSize = () => {
  const [dimensions, setDimensions] = useState({ width: 350, height: 280 });

  const updateDimensions = useCallback(() => {
    const width = window.innerWidth;

    if (width < 480) {
      setDimensions({ width: 280, height: 220 });
    } else if (width < 768) {
      setDimensions({ width: 320, height: 250 });
    } else if (width < 1024) {
      setDimensions({ width: 340, height: 270 });
    } else {
      setDimensions({ width: 380, height: 300 });
    }
  }, []);

  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  return dimensions;
};

// 📊 COMPONENTE PRINCIPAL DA DASHBOARD
export const Dashboard = () => {
  const { themeMode } = useThemeMode();
  const isDark = themeMode === 'dark';
  const colors = CHART_COLORS[isDark ? 'dark' : 'light'];
  const chartSize = useResponsiveChartSize();
  const dashboardRef = useRef<HTMLDivElement>(null);

  // 🎯 ESTADOS DA DASHBOARD
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  // 🚀 CARREGAMENTO DOS DADOS
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Simula delay de carregamento para animações
      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = DashboardService.refreshDashboard();
      setDashboardData(data);
    } catch (err) {
      setError('Erro ao carregar dados da dashboard');
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🎬 EFEITO DE INICIALIZAÇÃO
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 🎨 CONFIGURAÇÕES DOS GRÁFICOS
  const chartTheme = {
    ...VictoryTheme.material,
    axis: {
      style: {
        axis: { stroke: isDark ? '#374151' : '#E5E7EB' },
        grid: { stroke: isDark ? '#1F2937' : '#F3F4F6', strokeDasharray: '5,5' },
        tickLabels: { fill: isDark ? '#D1D5DB' : '#4B5563', fontSize: 12 },
      },
    },
  };

  // 🔄 HANDLER DE FILTROS
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    // Aqui você pode implementar a lógica de filtro
  };

  // 📄 HANDLER DE EXPORTAÇÃO
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Implementar exportação PDF aqui
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } finally {
      setIsExporting(false);
    }
  };

  // ⚡ LOADING STATE
  if (isLoading) {
    return (
      <LoadingOverlay>
        <LoadingSpinner>
          <div />
          <div />
          <div />
        </LoadingSpinner>
        <Text>Carregando dashboard...</Text>
      </LoadingOverlay>
    );
  }

  // ❌ ERROR STATE
  if (error) {
    return (
      <ErrorBoundary>
        <Text variant="h3">⚠️ {error}</Text>
        <Button onClick={loadDashboardData}>Tentar Novamente</Button>
      </ErrorBoundary>
    );
  }

  // 📊 DADOS VAZIOS
  if (!dashboardData?.metrics?.totalFarms) {
    return (
      <EmptyState>
        <Text variant="h3">📊 Dashboard Vazia</Text>
        <Text>Adicione algumas fazendas para ver os dados</Text>
        <Button>Adicionar Fazenda</Button>
      </EmptyState>
    );
  }

  const { metrics, chartData } = dashboardData;

  return (
    <ClientOnly>
      <DashboardContainer ref={dashboardRef} isDark={isDark}>
        {/* 🚫 OVERLAY DE EXPORTAÇÃO */}
        {isExporting && (
          <LoadingOverlay>
            <LoadingSpinner>
              <div />
              <div />
              <div />
            </LoadingSpinner>
            <Text>Gerando relatório PDF...</Text>
          </LoadingOverlay>
        )}

        {/* 🎯 HEADER SECTION */}
        <HeaderSection>
          <div>
            <Text variant="h1" className="dashboard-title">
              🌾 AgroDash Analytics
            </Text>
            <Text variant="subtitle" className="dashboard-subtitle">
              Visão completa do seu agronegócio em tempo real
            </Text>
          </div>

          <ExportSection>
            <FilterSection>
              {['all', 'month', 'quarter', 'year'].map((filter) => (
                <FilterChip
                  key={filter}
                  isActive={selectedFilter === filter}
                  onClick={() => handleFilterChange(filter)}
                >
                  {filter === 'all'
                    ? 'Todos'
                    : filter === 'month'
                      ? 'Mês'
                      : filter === 'quarter'
                        ? 'Trimestre'
                        : 'Ano'}
                </FilterChip>
              ))}
            </FilterSection>

            <ActionButton onClick={handleExport} disabled={isExporting} variant="primary">
              {isExporting ? '📄 Gerando...' : '📊 Exportar PDF'}
            </ActionButton>
          </ExportSection>
        </HeaderSection>

        {/* 📊 MÉTRICAS PRINCIPAIS */}
        <MetricsGrid>
          <MetricCard delay={0}>
            <MetricIcon>🏡</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.totalFarms} />
              </MetricValue>
              <MetricLabel>Total de Fazendas</MetricLabel>
              <MetricTrend positive>+12% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.primary[0]} />
          </MetricCard>

          <MetricCard delay={100}>
            <MetricIcon>🌿</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.totalHectares} suffix=" ha" decimals={0} />
              </MetricValue>
              <MetricLabel>Total de Hectares</MetricLabel>
              <MetricTrend positive>+8% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.secondary[0]} />
          </MetricCard>

          <MetricCard delay={200}>
            <MetricIcon>👥</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.totalProducers} />
              </MetricValue>
              <MetricLabel>Produtores Ativos</MetricLabel>
              <MetricTrend positive>+5% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.accent[0]} />
          </MetricCard>

          <MetricCard delay={300}>
            <MetricIcon>📈</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.averageProductivity} suffix="%" decimals={1} />
              </MetricValue>
              <MetricLabel>Produtividade Média</MetricLabel>
              <MetricTrend positive>+15% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.success[0]} />
          </MetricCard>

          <MetricCard delay={400}>
            <MetricIcon>🌱</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.averageSustainability} suffix="%" decimals={1} />
              </MetricValue>
              <MetricLabel>Sustentabilidade</MetricLabel>
              <MetricTrend positive>+10% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.primary[1]} />
          </MetricCard>

          <MetricCard delay={500}>
            <MetricIcon>🤖</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.averageTechnology} suffix="%" decimals={1} />
              </MetricValue>
              <MetricLabel>Tecnologia Média</MetricLabel>
              <MetricTrend positive>+22% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.secondary[1]} />
          </MetricCard>
        </MetricsGrid>

        {/* 📈 SEÇÃO DE GRÁFICOS */}
        <ChartsSection>
          <ChartGrid>
            {/* 🗺️ FAZENDAS POR ESTADO */}
            <ChartCard delay={600}>
              <ChartHeader>
                <ChartTitle>🗺️ Fazendas por Estado</ChartTitle>
                <ChartSubtitle>Distribuição geográfica</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={chartData.farmsByState}
                  x="state"
                  y="count"
                  colorScale={colors.gradient}
                  innerRadius={chartSize.height / 3.5}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  animate={{
                    duration: 1500,
                    easing: 'bounce',
                  }}
                  labelComponent={<VictoryTooltip />}
                  containerComponent={<VictoryContainer responsive={false} />}
                />
              </ResponsiveChart>
            </ChartCard>

            {/* 🌾 DISTRIBUIÇÃO DE CULTURAS */}
            <ChartCard delay={700}>
              <ChartHeader>
                <ChartTitle>🌾 Culturas Plantadas</ChartTitle>
                <ChartSubtitle>Por tipo de cultura</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={20}
                  animate={{ duration: 1500 }}
                >
                  <VictoryAxis dependentAxis />
                  <VictoryAxis />
                  <VictoryBar
                    data={chartData.cropsDistribution}
                    x="crop"
                    y="count"
                    colorScale={colors.primary}
                    animate={{
                      duration: 1500,
                      onLoad: { duration: 500 },
                    }}
                  />
                </VictoryChart>
              </ResponsiveChart>
            </ChartCard>

            {/* 🌍 USO DO SOLO */}
            <ChartCard delay={800}>
              <ChartHeader>
                <ChartTitle>🌍 Uso do Solo</ChartTitle>
                <ChartSubtitle>Áreas agricultáveis vs vegetação</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={chartData.landUsage}
                  x="type"
                  y="percentage"
                  colorScale={[colors.success[0], colors.primary[2]]}
                  innerRadius={chartSize.height / 4}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  animate={{
                    duration: 1500,
                    easing: 'exp',
                  }}
                  labelComponent={<VictoryTooltip />}
                />
              </ResponsiveChart>
            </ChartCard>

            {/* 📊 TIPOS DE PRODUTORES */}
            <ChartCard delay={900}>
              <ChartHeader>
                <ChartTitle>👥 Tipos de Produtores</ChartTitle>
                <ChartSubtitle>CPF vs CNPJ</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={chartData.producersType}
                  x="type"
                  y="percentage"
                  colorScale={[colors.accent[0], colors.secondary[0]]}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  animate={{
                    duration: 1500,
                    easing: 'bounce',
                  }}
                  labelComponent={<VictoryTooltip />}
                />
              </ResponsiveChart>
            </ChartCard>

            {/* 📏 DISTRIBUIÇÃO POR TAMANHO */}
            <ChartCard delay={1000}>
              <ChartHeader>
                <ChartTitle>📏 Fazendas por Tamanho</ChartTitle>
                <ChartSubtitle>Pequenas, médias e grandes</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={30}
                >
                  <VictoryAxis dependentAxis />
                  <VictoryAxis />
                  <VictoryBar
                    data={chartData.farmSizeDistribution}
                    x="size"
                    y="count"
                    colorScale={colors.gradient}
                    animate={{
                      duration: 1500,
                      onLoad: { duration: 800 },
                    }}
                  />
                </VictoryChart>
              </ResponsiveChart>
            </ChartCard>

            {/* 🏆 TOP ESTADOS POR ÁREA */}
            <ChartCard delay={1100}>
              <ChartHeader>
                <ChartTitle>🏆 Top Estados por Área</ChartTitle>
                <ChartSubtitle>Maiores áreas cultivadas</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={20}
                >
                  <VictoryAxis dependentAxis />
                  <VictoryAxis />
                  <VictoryArea
                    data={chartData.topStatesByArea.slice(0, 5)}
                    x="state"
                    y="totalArea"
                    style={{
                      data: { fill: colors.primary[0], fillOpacity: 0.7 },
                    }}
                    animate={{
                      duration: 2000,
                      easing: 'exp',
                    }}
                  />
                </VictoryChart>
              </ResponsiveChart>
            </ChartCard>
          </ChartGrid>
        </ChartsSection>

        {/* 💡 SEÇÃO DE INSIGHTS */}
        <InsightsSection>
          <Text variant="h2" className="insights-title">
            💡 Insights Inteligentes
          </Text>

          <div className="insights-grid">
            <InsightCard delay={1200}>
              <InsightIcon>🚀</InsightIcon>
              <InsightContent>
                <InsightTitle>Crescimento Acelerado</InsightTitle>
                <InsightDescription>
                  Suas fazendas cresceram 12% este mês. Continue assim!
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.success[0]}>+12%</StatBadge>
            </InsightCard>

            <InsightCard delay={1300}>
              <InsightIcon>🌱</InsightIcon>
              <InsightContent>
                <InsightTitle>Sustentabilidade em Alta</InsightTitle>
                <InsightDescription>
                  Score de sustentabilidade subiu 10 pontos este trimestre.
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.primary[0]}>+10pts</StatBadge>
            </InsightCard>

            <InsightCard delay={1400}>
              <InsightIcon>🤖</InsightIcon>
              <InsightContent>
                <InsightTitle>Tecnologia Avançada</InsightTitle>
                <InsightDescription>
                  85% das suas fazendas usam tecnologia de ponta.
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.secondary[0]}>85%</StatBadge>
            </InsightCard>
          </div>
        </InsightsSection>
      </DashboardContainer>
    </ClientOnly>
  );
};
