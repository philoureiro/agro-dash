import { useEffect, useState } from 'react';

import { FullSizeCentered, Text } from '@components';
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

const COLORS = ['#37CB83', '#2B5A3E', '#5AD0FF', '#FFA63B', '#E95252', '#9181FF'];

// helper para responsive height
const useChartSize = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return width < 600 ? 170 : 250;
};

export const Dashboard = () => {
  const chartHeight = useChartSize();
  const legendStyle = {
    labels: { fill: '#fff', fontSize: 16, fontFamily: 'inherit' },
  };

  return (
    <>
      <meta
        name="title"
        content="
          Edit Farmer"
      />
      <FullSizeCentered
        style={{
          marginBottom: 100,
          marginTop: 0,
        }}
      >
        <Text
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
              <KpiTitle>{kpi.title}</KpiTitle>
              <KpiValue>{kpi.value.toLocaleString('pt-BR')}</KpiValue>
            </CardKpi>
          ))}
        </Grid>
        <ChartsGrid>
          {/* Fazendas por Estado */}
          <ChartCard>
            <ChartTitle>Fazendas por Estado</ChartTitle>
            <VictoryPie
              data={fazendasPorEstado}
              colorScale={COLORS}
              innerRadius={40}
              animate={{
                duration: 1000,
                easing: 'bounce',
              }}
              style={{
                data: { stroke: '#151f1b', strokeWidth: 2 },
                labels: {
                  fill: '#fff',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: 15,
                },
              }}
              height={chartHeight}
              padAngle={2}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
            />
            <VictoryLegend
              x={30}
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
          <ChartCard>
            <ChartTitle>Culturas Plantadas</ChartTitle>
            <VictoryPie
              data={culturasPlantadas}
              colorScale={COLORS}
              innerRadius={40}
              animate={{
                duration: 1000,
                easing: 'bounce',
              }}
              style={{
                data: { stroke: '#151f1b', strokeWidth: 2 },
                labels: {
                  fill: '#fff',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: 15,
                },
              }}
              height={chartHeight}
              padAngle={2}
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
            />
            <VictoryLegend
              x={30}
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
          <ChartCard>
            <ChartTitle>Uso do Solo</ChartTitle>
            <VictoryPie
              data={usoSolo}
              colorScale={COLORS}
              innerRadius={40}
              animate={{
                duration: 1000,
                easing: 'bounce',
              }}
              style={{
                data: { stroke: '#151f1b', strokeWidth: 2 },
                labels: {
                  fill: '#fff',
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  fontSize: 15,
                },
              }}
              height={chartHeight}
              padAngle={2}
              labels={({ datum }) =>
                `${datum.x}: ${datum.y.toLocaleString('pt-BR').replace(/\./g, ',')}`
              }
            />
            <VictoryLegend
              x={30}
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
