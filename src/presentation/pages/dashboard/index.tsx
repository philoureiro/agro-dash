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
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
} from 'victory';

import { AnimatedCounter } from './components/AnimatedCounter';
import { ChartCardComponent } from './components/chartCardComponent';
import { ClientOnly } from './components/clientOnly';
import { CHART_COLORS } from './config';
import {
  ActionButton,
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
import { filterChartData, getFilterLabel, getFilterMultiplier, translateData } from './utils';
import { exportToPDF } from './utils/exportToPDF';

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
  const [rawDashboardData, setRawDashboardData] = useState<any>(null);
  const [filteredData, setFilteredData] = useState<any>(null);
  const [selectedFilter, setSelectedFilter] = useState('Todos');
  const [error, setError] = useState<string | null>(null);

  // 🎯 FUNÇÃO SUPREMA DE FILTRO DE DADOS
  const applyFilterToData = useCallback((rawData: any, filter: string) => {
    if (!rawData) return null;

    const filteredMetrics = {
      ...rawData.metrics,
      totalFarms: Math.max(1, Math.floor(rawData.metrics.totalFarms * getFilterMultiplier(filter))),
      totalHectares: Math.max(
        100,
        Math.floor(rawData.metrics.totalHectares * getFilterMultiplier(filter)),
      ),
      totalProducers: Math.max(
        1,
        Math.floor(rawData.metrics.totalProducers * getFilterMultiplier(filter)),
      ),
    };

    const filteredChartData = {
      farmsByState: filterChartData(rawData.chartData.farmsByState, filter),
      cropsDistribution: filterChartData(rawData.chartData.cropsDistribution, filter),
      landUsage: rawData.chartData.landUsage,
      producersType: rawData.chartData.producersType,
      farmSizeDistribution: filterChartData(rawData.chartData.farmSizeDistribution, filter),
      topStatesByArea: filterChartData(rawData.chartData.topStatesByArea, filter),
      cropsByYear: rawData.chartData.cropsByYear,
      performanceMetrics: rawData.chartData.performanceMetrics,
    };

    return {
      metrics: filteredMetrics,
      chartData: filteredChartData,
      lastUpdated: rawData.lastUpdated,
    };
  }, []);

  // 🚀 CARREGAMENTO DOS DADOS BRUTOS
  const loadDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const data = DashboardService.refreshDashboard();
      setRawDashboardData(data);
    } catch (err) {
      setError('Erro ao carregar dados da dashboard');
      console.error('Dashboard loading error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 🔄 APLICAR FILTRO QUANDO MUDA
  useEffect(() => {
    if (rawDashboardData) {
      const filtered = applyFilterToData(rawDashboardData, selectedFilter);
      setFilteredData(filtered);
    }
  }, [rawDashboardData, selectedFilter, applyFilterToData]);

  // 🎬 EFEITO DE INICIALIZAÇÃO
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // 🎨 CONFIGURAÇÕES DOS GRÁFICOS APRIMORADAS
  const chartTheme = {
    ...VictoryTheme.material,
    axis: {
      style: {
        axis: { stroke: isDark ? '#374151' : '#E5E7EB' },
        grid: {
          stroke: isDark ? '#1F2937' : '#F3F4F6',
          strokeDasharray: '5,5',
          strokeOpacity: 0.5,
        },
        tickLabels: {
          fill: isDark ? '#D1D5DB' : '#4B5563',
          fontSize: 11,
          fontFamily: 'inherit',
          padding: 5,
        },
      },
    },
  };

  // 🎨 ESTILO PARA GRÁFICOS DE PIZZA MELHORADO
  const pieStyle = {
    data: {
      stroke: isDark ? '#1F2937' : '#ffffff',
      strokeWidth: 2,
    },
    labels: {
      fill: isDark ? '#F9FAFB' : '#111827',
      fontSize: 12,
      fontWeight: 600,
      fontFamily: 'inherit',
    },
  };

  // 🔄 HANDLER DE FILTROS COM FEEDBACK VISUAL
  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // 📄 HANDLER DE EXPORTAÇÃO
  const handleExport = async () => {
    console.log('🎯 Handle Export chamado');
    console.log('📊 Dashboard Ref:', dashboardRef.current);

    if (!dashboardRef.current) {
      alert('❌ Elemento da dashboard não encontrado!');
      return;
    }

    setIsExporting(true);

    try {
      console.log('🚀 Chamando exportToPDF...');

      await exportToPDF(dashboardRef.current, filteredData, selectedFilter, isDark);
    } catch (error) {
      console.error('💥 Erro na exportação:', error);
      alert('❌ Erro ao gerar PDF');
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
        <Text>
          {selectedFilter !== 'all'
            ? `Filtrando por ${getFilterLabel(selectedFilter)}...`
            : 'Carregando dashboard...'}
        </Text>
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
  if (!filteredData?.metrics?.totalFarms) {
    return (
      <EmptyState>
        <Text variant="h3">📊 Nenhum dado encontrado</Text>
        <Text>
          {selectedFilter === 'all'
            ? 'Adicione algumas fazendas para ver os dados'
            : `Nenhum dado encontrado para: ${getFilterLabel(selectedFilter)}`}
        </Text>
        <Button onClick={() => handleFilterChange('all')}>Ver Todos os Dados</Button>
      </EmptyState>
    );
  }

  const { metrics, chartData } = filteredData;

  // 🇧🇷 TRADUZIR DADOS PARA PT-BR
  const translatedCrops = translateData(chartData.cropsDistribution, 'crops');
  const translatedFarmSizes = translateData(chartData.farmSizeDistribution, 'farmSizes');
  const translatedMetrics = translateData(chartData.performanceMetrics, 'metrics');
  const translatedLandUsage = translateData(chartData.landUsage, 'landUse');
  const translatedProducerTypes = translateData(chartData.producersType, 'producerTypes');

  return (
    <ClientOnly>
      {/* 🚫 OVERLAY DE EXPORTAÇÃO */}

      <DashboardContainer ref={dashboardRef} isDark={isDark} data-dashboard-main="true">
        {isExporting && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              color: 'white',
              fontSize: '18px',
            }}
          >
            📄 Gerando PDF...
          </div>
        )}

        {/* 🎯 HEADER SECTION */}
        <HeaderSection>
          <div>
            <Text variant="h3" className="dashboard-title">
              🌾 AgroDash Analytics
            </Text>
            <Text variant="subtitle" className="dashboard-subtitle">
              {selectedFilter === 'all'
                ? 'Visão completa do seu agronegócio em tempo real'
                : `Dados filtrados por: ${getFilterLabel(selectedFilter)}`}
            </Text>
          </div>

          <ExportSection data-export-section="true">
            <FilterSection data-filter-section="true">
              {['all', 'month', 'quarter', 'year'].map((filter) => (
                <FilterChip
                  data-filter-chip="true"
                  isDark={isDark}
                  key={filter}
                  isActive={selectedFilter === filter}
                  onClick={() => handleFilterChange(filter)}
                >
                  {getFilterLabel(filter)}
                </FilterChip>
              ))}
            </FilterSection>

            <ActionButton
              onClick={handleExport}
              disabled={isExporting}
              variant="primary"
              data-export-button="true"
            >
              {isExporting ? '📄 Gerando...' : `📊 Exportar ${getFilterLabel(selectedFilter)}`}
            </ActionButton>
          </ExportSection>
        </HeaderSection>

        {/* 📊 MÉTRICAS PRINCIPAIS COM NÚMEROS ANIMADOS */}
        <MetricsGrid>
          <MetricCard delay={0}>
            <MetricIcon>🏡</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter value={metrics.totalFarms} key={`farms-${selectedFilter}`} />
              </MetricValue>
              <MetricLabel>Total de Fazendas</MetricLabel>
              <MetricTrend positive>
                {selectedFilter === 'all'
                  ? '+12% este mês'
                  : `Período: ${getFilterLabel(selectedFilter)}`}
              </MetricTrend>
            </MetricContent>
            <GradientBar color={colors.primary[0]} />
          </MetricCard>

          <MetricCard delay={100}>
            <MetricIcon>🌿</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter
                  value={metrics.totalHectares}
                  suffix=" ha"
                  decimals={0}
                  key={`hectares-${selectedFilter}`}
                />
              </MetricValue>
              <MetricLabel>Total de Hectares</MetricLabel>
              <MetricTrend positive>
                {selectedFilter === 'all'
                  ? '+8% este mês'
                  : `Período: ${getFilterLabel(selectedFilter)}`}
              </MetricTrend>
            </MetricContent>
            <GradientBar color={colors.secondary[0]} />
          </MetricCard>

          <MetricCard delay={200}>
            <MetricIcon>👥</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter
                  value={metrics.totalProducers}
                  key={`producers-${selectedFilter}`}
                />
              </MetricValue>
              <MetricLabel>Produtores Ativos</MetricLabel>
              <MetricTrend positive>
                {selectedFilter === 'all'
                  ? '+5% este mês'
                  : `Período: ${getFilterLabel(selectedFilter)}`}
              </MetricTrend>
            </MetricContent>
            <GradientBar color={colors.accent[0]} />
          </MetricCard>

          <MetricCard delay={300}>
            <MetricIcon>📈</MetricIcon>
            <MetricContent>
              <MetricValue>
                <AnimatedCounter
                  value={metrics.averageProductivity}
                  suffix="%"
                  decimals={1}
                  key={`productivity-${selectedFilter}`}
                />
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
                <AnimatedCounter
                  value={metrics.averageSustainability}
                  suffix="%"
                  decimals={1}
                  key={`sustainability-${selectedFilter}`}
                />
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
                <AnimatedCounter
                  value={metrics.averageTechnology}
                  suffix="%"
                  decimals={1}
                  key={`technology-${selectedFilter}`}
                />
              </MetricValue>
              <MetricLabel>Tecnologia Média</MetricLabel>
              <MetricTrend positive>+22% este mês</MetricTrend>
            </MetricContent>
            <GradientBar color={colors.secondary[1]} />
          </MetricCard>
        </MetricsGrid>

        {/* 📈 SEÇÃO DE GRÁFICOS CORRIGIDOS */}
        <ChartsSection>
          <ChartGrid>
            {/* 🗺️ FAZENDAS POR ESTADO - CORRIGIDO */}
            <ChartCardComponent delay={600}>
              <ChartHeader>
                <ChartTitle>🗺️ Fazendas por Estado</ChartTitle>
                <ChartSubtitle>
                  {selectedFilter === 'all'
                    ? 'Distribuição geográfica completa'
                    : `Dados para: ${getFilterLabel(selectedFilter)}`}
                </ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={chartData.farmsByState}
                  x="state"
                  y="count"
                  colorScale={colors.gradient}
                  innerRadius={chartSize.height / 4.5}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  style={pieStyle}
                  animate={{
                    duration: 1500,
                    easing: 'bounce',
                  }}
                  labelComponent={
                    <VictoryTooltip
                      style={{
                        color: 'black',
                      }}
                    />
                  }
                  labelRadius={({ innerRadius }) => (innerRadius as number) + 30}
                  labels={({ datum }) => `${datum.state}\n${datum.count}`}
                  containerComponent={<VictoryContainer responsive={false} />}
                  key={`farms-chart-${selectedFilter}`}
                />
              </ResponsiveChart>
            </ChartCardComponent>

            {/* 🌾 DISTRIBUIÇÃO DE CULTURAS - CORRIGIDO */}
            <ChartCardComponent delay={700}>
              <ChartHeader>
                <ChartTitle>🌾 Culturas Plantadas</ChartTitle>
                <ChartSubtitle>
                  {selectedFilter === 'all'
                    ? 'Por tipo de cultura'
                    : `Período: ${getFilterLabel(selectedFilter)}`}
                </ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={{ x: [30, 30], y: [10, 10] }}
                  animate={{ duration: 1500 }}
                  key={`crops-chart-${selectedFilter}`}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5, angle: 0 },
                    }}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5, angle: -45 },
                    }}
                  />
                  <VictoryBar
                    data={translatedCrops}
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
            </ChartCardComponent>

            {/* 🌍 USO DO SOLO - CORRIGIDO */}
            <ChartCardComponent delay={800}>
              <ChartHeader>
                <ChartTitle>🌍 Uso do Solo</ChartTitle>
                <ChartSubtitle>Áreas agricultáveis vs vegetação</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={translatedLandUsage}
                  x="type"
                  y="percentage"
                  colorScale={[colors.success[0], colors.primary[2]]}
                  innerRadius={chartSize.height / 5}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  style={pieStyle}
                  animate={{
                    duration: 1500,
                    easing: 'exp',
                  }}
                  labelComponent={
                    <VictoryTooltip
                      style={{
                        color: 'black',
                      }}
                    />
                  }
                  labelRadius={({ innerRadius }) => (innerRadius as number) + 25}
                  labels={({ datum }) => `${datum.type}\n${datum.percentage.toFixed(1)}%`}
                />
              </ResponsiveChart>
            </ChartCardComponent>

            {/* 📊 TIPOS DE PRODUTORES - CORRIGIDO */}
            <ChartCardComponent delay={900}>
              <ChartHeader>
                <ChartTitle>👥 Tipos de Produtores</ChartTitle>
                <ChartSubtitle>Pessoa Física vs Pessoa Jurídica</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryPie
                  data={translatedProducerTypes}
                  x="type"
                  y="percentage"
                  colorScale={[colors.accent[0], colors.secondary[0]]}
                  innerRadius={chartSize.height / 5}
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  style={pieStyle}
                  animate={{
                    duration: 1500,
                    easing: 'bounce',
                  }}
                  labelComponent={
                    <VictoryTooltip
                      style={{
                        color: 'black',
                      }}
                    />
                  }
                  labelRadius={({ innerRadius }) => (innerRadius as number) + 25}
                  labels={({ datum }) => `${datum.type}\n${datum.percentage.toFixed(1)}%`}
                />
              </ResponsiveChart>
            </ChartCardComponent>

            {/* 📏 DISTRIBUIÇÃO POR TAMANHO - CORRIGIDO */}
            <ChartCardComponent delay={1000}>
              <ChartHeader>
                <ChartTitle>📏 Fazendas por Tamanho</ChartTitle>
                <ChartSubtitle>
                  {selectedFilter === 'all'
                    ? 'Pequenas, médias e grandes'
                    : `Filtrado por: ${getFilterLabel(selectedFilter)}`}
                </ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={{ x: [40, 40], y: [10, 10] }}
                  key={`size-chart-${selectedFilter}`}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryBar
                    data={translatedFarmSizes}
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
            </ChartCardComponent>

            {/* 🏆 TOP ESTADOS POR ÁREA - CORRIGIDO */}
            <ChartCardComponent delay={1100}>
              <ChartHeader>
                <ChartTitle>🏆 Top Estados por Área</ChartTitle>
                <ChartSubtitle>
                  {selectedFilter === 'all'
                    ? 'Maiores áreas cultivadas'
                    : `Top 5 para: ${getFilterLabel(selectedFilter)}`}
                </ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={{ x: [20, 20], y: [10, 10] }}
                  key={`top-states-chart-${selectedFilter}`}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
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
            </ChartCardComponent>

            {/* 📅 CULTURAS POR ANO - CORRIGIDO */}
            <ChartCardComponent delay={1200}>
              <ChartHeader>
                <ChartTitle>📅 Culturas por Ano</ChartTitle>
                <ChartSubtitle>Evolução temporal das safras</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={{ x: [20, 20], y: [10, 10] }}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryLine
                    data={chartData.cropsByYear}
                    x="year"
                    y="totalCrops"
                    style={{
                      data: { stroke: colors.secondary[0], strokeWidth: 3 },
                      parent: { border: '1px solid #ccc' },
                    }}
                    animate={{
                      duration: 2000,
                      easing: 'exp',
                    }}
                  />
                </VictoryChart>
              </ResponsiveChart>
            </ChartCardComponent>

            {/* 📊 MÉTRICAS DE PERFORMANCE - CORRIGIDO E TRADUZIDO */}
            <ChartCardComponent delay={1300}>
              <ChartHeader>
                <ChartTitle>📊 Métricas de Performance</ChartTitle>
                <ChartSubtitle>Produtividade, Sustentabilidade e Tecnologia</ChartSubtitle>
              </ChartHeader>
              <ResponsiveChart>
                <VictoryChart
                  width={chartSize.width}
                  height={chartSize.height}
                  theme={chartTheme}
                  domainPadding={{ x: [30, 30], y: [10, 10] }}
                >
                  <VictoryAxis
                    dependentAxis
                    style={{
                      tickLabels: { fontSize: 10, padding: 5 },
                    }}
                  />
                  <VictoryAxis
                    style={{
                      tickLabels: { fontSize: 9, padding: 5, angle: -20 },
                    }}
                  />
                  <VictoryBar
                    data={translatedMetrics}
                    x="metric"
                    y="average"
                    colorScale={[colors.success[0], colors.primary[0], colors.secondary[0]]}
                    animate={{
                      duration: 1500,
                      onLoad: { duration: 800 },
                    }}
                  />
                </VictoryChart>
              </ResponsiveChart>
            </ChartCardComponent>
          </ChartGrid>
        </ChartsSection>

        {/* 💡 SEÇÃO DE INSIGHTS DINÂMICOS COM BADGES ANIMADAS */}
        <InsightsSection>
          <Text variant="h2" className="insights-title">
            💡 Insights para {getFilterLabel(selectedFilter)}
          </Text>

          <div className="insights-grid">
            <InsightCard delay={1400}>
              <InsightIcon>🚀</InsightIcon>
              <InsightContent>
                <InsightTitle>Crescimento Acelerado</InsightTitle>
                <InsightDescription>
                  {selectedFilter === 'all'
                    ? 'Suas fazendas cresceram este mês. Continue assim!'
                    : `Dados para ${getFilterLabel(selectedFilter)} mostram crescimento positivo.`}
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.success[0]}>
                +<AnimatedCounter value={12} key={`insight1-${selectedFilter}`} />%
              </StatBadge>
            </InsightCard>

            <InsightCard delay={1500}>
              <InsightIcon>🌱</InsightIcon>
              <InsightContent>
                <InsightTitle>Sustentabilidade em Alta</InsightTitle>
                <InsightDescription>
                  {selectedFilter === 'all'
                    ? 'Score de sustentabilidade subiu este trimestre.'
                    : `Métricas de sustentabilidade para ${getFilterLabel(selectedFilter)}.`}
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.primary[0]}>
                +<AnimatedCounter value={10} key={`insight2-${selectedFilter}`} />
                pts
              </StatBadge>
            </InsightCard>

            <InsightCard delay={1600}>
              <InsightIcon>🤖</InsightIcon>
              <InsightContent>
                <InsightTitle>Tecnologia Avançada</InsightTitle>
                <InsightDescription>
                  {selectedFilter === 'all'
                    ? 'Das suas fazendas usam tecnologia de ponta.'
                    : `Adoção tecnológica no período: ${getFilterLabel(selectedFilter)}.`}
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.secondary[0]}>
                <AnimatedCounter value={85} key={`insight3-${selectedFilter}`} />%
              </StatBadge>
            </InsightCard>

            <InsightCard delay={1700}>
              <InsightIcon>🎯</InsightIcon>
              <InsightContent>
                <InsightTitle>Filtro Ativo</InsightTitle>
                <InsightDescription>
                  Visualizando dados filtrados por: {getFilterLabel(selectedFilter)}
                </InsightDescription>
              </InsightContent>
              <StatBadge color={colors.accent[0]}>{selectedFilter.toUpperCase()}</StatBadge>
            </InsightCard>
          </div>
        </InsightsSection>
      </DashboardContainer>
    </ClientOnly>
  );
};
