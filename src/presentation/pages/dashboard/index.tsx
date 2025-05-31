import { useCallback, useEffect, useRef, useState } from 'react';

import { FullSizeCentered, Text } from '@components';
import { useThemeMode } from '@theme';
import { VictoryLegend, VictoryPie } from 'victory';

import { exportToPDF } from './exportToPDF';
import {
  CardKpi,
  ChartCard,
  ChartTitle,
  ChartsGrid,
  ExportButton,
  ExportContainer,
  Grid,
  KpiTitle,
  KpiValue,
  LoadingOverlay,
} from './styles';

const kpis = [
  { title: 'Fazendas', value: 28 },
  { title: 'Total de Hectares', value: 13500 },
];

const fazendasPorEstado = [
  { x: 'MG', y: 10 },
  { x: 'SP', y: 7 },
  { x: 'GO', y: 5 },
  { x: 'BA', y: 6 },
];

const culturasPlantadas = [
  { x: 'Soja', y: 11 },
  { x: 'Milho', y: 8 },
  { x: 'Café', y: 6 },
  { x: 'Algodão', y: 3 },
];

const usoSolo = [
  { x: 'Agricultável', y: 8800 },
  { x: 'Vegetação', y: 4700 },
];

// Defina paletas para cada tema
const COLORS_LIGHT = ['#37CB83', '#2B5A3E', '#5AD0FF', '#FFA63B', '#E95252', '#9181FF'];
const COLORS_DARK = ['#34e899', '#2f9469', '#61dafb', '#ffbc54', '#ff686b', '#d1b3ff'];

// helper para responsive height
const useChartSize = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  const debouncedResize = useCallback(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setWidth(window.innerWidth), 150);
    };
    return handleResize;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const resizeHandler = debouncedResize();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [debouncedResize]);

  return width < 600 ? 150 : 210;
};

export const Dashboard = () => {
  const chartHeight = useChartSize();
  const { themeMode: theme } = useThemeMode();
  const dashboardRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [isExporting, setIsExporting] = useState(false);

  // Troca as cores dos gráficos conforme o tema
  const isDark = theme === 'dark';
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;

  const legendStyle = {
    labels: {
      fill: isDark ? '#fff' : '#333',
      fontSize: 14,
      fontFamily: 'inherit',
      fontWeight: 500,
    },
  };

  const pieStyle = {
    data: {
      stroke: isDark ? '#181f1b' : '#fff',
      strokeWidth: 2,
      filter: 'drop-shadow(0 1.5px 8px rgba(55,203,131,0.08))',
    },
    labels: {
      fill: isDark ? '#fff' : '#333',
      fontWeight: 700,
      fontFamily: 'inherit',
      fontSize: 5,
      filter: 'none',
      padding: 4,
    },
  };

  // 🚀 FUNÇÃO HANDLER PARA CHAMAR O EXPORT
  const handleExportPDF = () => {
    exportToPDF(dashboardRef, isDark, setIsExporting, isExporting);
  };

  return (
    <>
      <meta name="title" content="Dashboard Agrícola" />

      {/* 🚫 LOADING OVERLAY COM DATA-LOADING */}
      {isExporting && (
        <LoadingOverlay data-loading="true" className="loading-overlay">
          <div>Gerando PDF...</div>
        </LoadingOverlay>
      )}

      <FullSizeCentered
        ref={dashboardRef}
        style={{
          marginBottom: 100,
          marginTop: 0,
        }}
      >
        {/* Header com Export - 🚫 ADICIONANDO DATA-ATTRIBUTES */}
        <div
          style={{
            display: 'flex',
            marginTop: 50,
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            marginBottom: 20,
          }}
        >
          <Text weight="bold" variant="h3" style={{ margin: 0 }}>
            Dashboard
          </Text>

          {/* 🚫 CONTAINER COM DATA-EXPORT-CONTAINER */}
          <ExportContainer data-export-container="true">
            {/* 🚫 BOTÃO COM DATA-EXPORT-BUTTON */}
            <ExportButton
              data-export-button="true"
              onClick={handleExportPDF}
              disabled={isExporting}
              isDark={isDark}
            >
              {isExporting ? '📄 Gerando...' : '📊 Exportar PDF'}
            </ExportButton>
          </ExportContainer>
        </div>

        <Grid>
          {kpis.map((kpi, idx) => (
            <CardKpi key={kpi.title} style={{ animationDelay: `${idx * 0.08}s` }}>
              <KpiTitle isDark={isDark}>{kpi.title}</KpiTitle>
              <KpiValue isDark={isDark}> {kpi.value.toLocaleString('pt-BR')}</KpiValue>
            </CardKpi>
          ))}
        </Grid>

        <ChartsGrid>
          {/* Fazendas por Estado */}
          <ChartCard isDark={isDark}>
            <ChartTitle>Fazendas por Estado</ChartTitle>
            <VictoryPie
              data={fazendasPorEstado}
              colorScale={COLORS}
              innerRadius={chartHeight / 2.7}
              animate={{
                duration: 2000,
                easing: 'bounce',
              }}
              style={pieStyle}
              height={chartHeight}
              width={chartHeight}
              padAngle={2}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
            />
            <VictoryLegend
              x={18}
              y={chartHeight - 35}
              orientation="horizontal"
              gutter={18}
              data={fazendasPorEstado.map((f, i) => ({
                name: f.x,
                symbol: { fill: COLORS[i % COLORS.length], type: 'circle' },
              }))}
              style={legendStyle}
              standalone={false}
              itemsPerRow={2}
            />
          </ChartCard>

          {/* Culturas Plantadas */}
          <ChartCard isDark={isDark}>
            <ChartTitle>Culturas Plantadas</ChartTitle>
            <VictoryPie
              data={culturasPlantadas}
              colorScale={COLORS}
              innerRadius={chartHeight / 2.7}
              animate={{
                duration: 2000,
                easing: 'bounce',
              }}
              style={pieStyle}
              height={chartHeight}
              width={chartHeight}
              padAngle={2}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
            />
            <VictoryLegend
              x={18}
              y={chartHeight - 35}
              orientation="horizontal"
              gutter={18}
              data={culturasPlantadas.map((f, i) => ({
                name: f.x,
                symbol: { fill: COLORS[(i + 1) % COLORS.length], type: 'circle' },
              }))}
              style={legendStyle}
              standalone={false}
              itemsPerRow={2}
            />
          </ChartCard>

          {/* Uso do Solo */}
          <ChartCard isDark={isDark}>
            <ChartTitle>Uso do Solo</ChartTitle>
            <VictoryPie
              data={usoSolo}
              colorScale={COLORS}
              innerRadius={chartHeight / 2.7}
              animate={{
                duration: 2000,
                easing: 'bounce',
              }}
              style={pieStyle}
              height={chartHeight}
              width={chartHeight}
              padAngle={2}
              labels={({ datum }) =>
                `${datum.x}: ${datum.y.toLocaleString('pt-BR').replace(/\./g, ',')}`
              }
            />
            <VictoryLegend
              x={18}
              y={chartHeight - 35}
              orientation="horizontal"
              gutter={18}
              data={usoSolo.map((f, i) => ({
                name: f.x,
                symbol: { fill: COLORS[(i + 2) % COLORS.length], type: 'circle' },
              }))}
              style={legendStyle}
              standalone={false}
              itemsPerRow={2}
            />
          </ChartCard>
        </ChartsGrid>
      </FullSizeCentered>
    </>
  );
};
