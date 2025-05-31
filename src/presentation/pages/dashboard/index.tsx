import { useEffect, useState } from 'react';

import { FullSizeCentered, Text } from '@components';
import { useThemeMode } from '@theme';
import { VictoryLegend, VictoryPie } from 'victory';

import { CardKpi, ChartCard, ChartTitle, ChartsGrid, Grid, KpiTitle, KpiValue } from './styles';

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
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width < 600 ? 150 : 210;
};

export const Dashboard = () => {
  const chartHeight = useChartSize();
  const { themeMode: theme } = useThemeMode();

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

  return (
    <>
      <meta name="title" content="Edit Farmer" />
      <FullSizeCentered
        style={{
          marginBottom: 100,
          marginTop: 0,
        }}
      >
        <Text
          weight="bold"
          variant="h3"
          style={{
            marginBottom: 20,
          }}
        >
          Dashboard
        </Text>
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
