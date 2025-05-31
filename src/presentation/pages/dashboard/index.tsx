import { useCallback, useEffect, useRef, useState } from 'react';

import { FullSizeCentered, Text } from '@components';
import { useThemeMode } from '@theme';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { VictoryLegend, VictoryPie } from 'victory';

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
  const dashboardRef = useRef<HTMLDivElement>(null);
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

  // 🚀 FUNÇÃO DE EXPORTAÇÃO PDF SUPREMA - FORÇA LAYOUT DESKTOP
  const exportToPDF = async () => {
    if (!dashboardRef.current || isExporting) return;

    setIsExporting(true);

    try {
      // 🎯 FORÇA LAYOUT DESKTOP DURANTE A CAPTURA
      const originalWidth = dashboardRef.current.style.width;
      const originalMinWidth = dashboardRef.current.style.minWidth;
      const originalMaxWidth = dashboardRef.current.style.maxWidth;

      // Define largura fixa de desktop durante a captura
      dashboardRef.current.style.width = '1200px';
      dashboardRef.current.style.minWidth = '1200px';
      dashboardRef.current.style.maxWidth = '1200px';

      // Força recálculo do layout
      await new Promise((resolve) => setTimeout(resolve, 300));

      // 🎨 FUNDO CUSTOMIZADO PARA CONTRASTE PERFEITO
      const customBg = isDark ? '#0a0f14' : '#fafbfc';

      const canvas = await html2canvas(dashboardRef.current, {
        scale: 2.5, // Resolução premium
        useCORS: true,
        allowTaint: true,
        backgroundColor: customBg,
        width: 1200, // Força largura desktop
        height: dashboardRef.current.scrollHeight,
        scrollX: 0,
        scrollY: 0,
        foreignObjectRendering: true,
        imageTimeout: 15000,
        logging: false,
        // Força captura em desktop
        windowWidth: 1200,
        windowHeight: 800,
      });

      // 🔄 RESTAURA ESTILOS ORIGINAIS
      dashboardRef.current.style.width = originalWidth;
      dashboardRef.current.style.minWidth = originalMinWidth;
      dashboardRef.current.style.maxWidth = originalMaxWidth;

      const imgData = canvas.toDataURL('image/png', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasHeight / canvasWidth;

      // 🔥 MARGENS OTIMIZADAS - MÁXIMO APROVEITAMENTO
      const headerHeight = 20;
      const footerHeight = 15;
      const sideMargin = 6;

      let imgWidth = pdfWidth - sideMargin * 2;
      let imgHeight = imgWidth * ratio;

      // Ajuste inteligente para caber na página
      const availableHeight = pdfHeight - headerHeight - footerHeight - 8;
      if (imgHeight > availableHeight) {
        imgHeight = availableHeight;
        imgWidth = imgHeight / ratio;
      }

      const x = (pdfWidth - imgWidth) / 2;
      const y = headerHeight + 3;

      // 🎨 HEADER PREMIUM COM GRADIENTE SUAVE
      if (isDark) {
        pdf.setFillColor(10, 15, 20);
        pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

        pdf.setFillColor(20, 28, 35);
        pdf.rect(0, 0, pdfWidth, headerHeight * 0.7, 'F');

        pdf.setFillColor(28, 40, 50);
        pdf.rect(0, 0, pdfWidth, headerHeight * 0.4, 'F');
      } else {
        pdf.setFillColor(250, 251, 252);
        pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

        pdf.setFillColor(243, 246, 250);
        pdf.rect(0, 0, pdfWidth, headerHeight * 0.7, 'F');

        pdf.setFillColor(236, 241, 247);
        pdf.rect(0, 0, pdfWidth, headerHeight * 0.4, 'F');
      }

      // 🏆 TÍTULO PRINCIPAL - CLEAN E PROFISSIONAL
      pdf.setTextColor(isDark ? 60 : 20, isDark ? 220 : 100, isDark ? 140 : 60);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AgroDash', sideMargin, 10);

      // Subtítulo elegante
      pdf.setTextColor(isDark ? 140 : 60, isDark ? 160 : 80, isDark ? 170 : 80);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Relatório Executivo • Sistema de Gestão Agrícola', sideMargin, 16);

      // 📅 DATA E HORA - CLEAN E ELEGANTE
      const now = new Date();
      const dateStr = now.toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeStr = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      pdf.setTextColor(isDark ? 120 : 90, isDark ? 130 : 100, isDark ? 140 : 110);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${dateStr}`, pdfWidth - 60, 9);
      pdf.text(`${timeStr}`, pdfWidth - 60, 14);

      // Linha decorativa sofisticada
      const gradient = isDark ? [55, 203, 131] : [37, 150, 90];
      pdf.setDrawColor(gradient[0], gradient[1], gradient[2]);
      pdf.setLineWidth(1.2);
      pdf.line(sideMargin, headerHeight - 3, pdfWidth - sideMargin, headerHeight - 3);

      pdf.setDrawColor(gradient[0] + 30, gradient[1] + 20, gradient[2] + 30);
      pdf.setLineWidth(0.3);
      pdf.line(sideMargin, headerHeight - 1.5, pdfWidth - sideMargin, headerHeight - 1.5);

      // 🖼️ IMAGEM PRINCIPAL DO DASHBOARD (SEMPRE EM DESKTOP)
      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST');

      // 🎯 FOOTER PREMIUM E ELEGANTE
      const footerY = pdfHeight - footerHeight;

      if (isDark) {
        pdf.setFillColor(10, 15, 20);
        pdf.rect(0, footerY, pdfWidth, footerHeight, 'F');

        pdf.setFillColor(20, 28, 35);
        pdf.rect(0, footerY, pdfWidth, footerHeight * 0.6, 'F');
      } else {
        pdf.setFillColor(250, 251, 252);
        pdf.rect(0, footerY, pdfWidth, footerHeight, 'F');

        pdf.setFillColor(243, 246, 250);
        pdf.rect(0, footerY, pdfWidth, footerHeight * 0.6, 'F');
      }

      // Linha decorativa superior do footer
      pdf.setDrawColor(gradient[0], gradient[1], gradient[2]);
      pdf.setLineWidth(0.8);
      pdf.line(sideMargin, footerY + 2, pdfWidth - sideMargin, footerY + 2);

      // Logo/Nome da empresa no footer
      pdf.setTextColor(isDark ? 60 : 20, isDark ? 220 : 100, isDark ? 140 : 60);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('AgroDash', sideMargin, footerY + 8);

      // Descrição do sistema
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(isDark ? 140 : 60, isDark ? 160 : 80, isDark ? 170 : 80);
      pdf.text('Plataforma Inteligente de Gestão e Análise Agrícola', sideMargin, footerY + 12);

      // Informações do relatório (lado direito)
      pdf.setFontSize(8);
      pdf.setTextColor(isDark ? 120 : 90, isDark ? 130 : 100, isDark ? 140 : 110);
      pdf.text(`Página 1 de 1 • Dados consolidados`, pdfWidth - 65, footerY + 6);
      pdf.text(`Gerado em ${dateStr} às ${timeStr}`, pdfWidth - 65, footerY + 9);
      pdf.text(`Confidencial • © ${now.getFullYear()} AgroDash`, pdfWidth - 65, footerY + 12);

      // 💎 MARCA D'ÁGUA PROFISSIONAL
      pdf.setGState(new pdf.GState({ opacity: isDark ? 0.03 : 0.02 }));
      pdf.setTextColor(gradient[0], gradient[1], gradient[2]);
      pdf.setFontSize(45);
      pdf.setFont('helvetica', 'bold');

      const centerX = pdfWidth / 2;
      const centerY = pdfHeight / 2;
      pdf.text('AGRODASH', centerX, centerY, {
        angle: 45,
        align: 'center',
      });

      // Restaura opacidade
      pdf.setGState(new pdf.GState({ opacity: 1 }));

      // 💾 NOME DO ARQUIVO PROFISSIONAL
      const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
        .getHours()
        .toString()
        .padStart(2, '0')}h${now.getMinutes().toString().padStart(2, '0')}`;

      const fileName = `AgroDash_Relatorio_Executivo_${timestamp}.pdf`;

      pdf.save(fileName);

      // Feedback de sucesso
      setTimeout(() => {
        alert('✅ PDF gerado com sucesso! Layout desktop preservado.');
      }, 500);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('❌ Erro ao gerar PDF. Verifique sua conexão e tente novamente.');

      // Garantia de restaurar estilos em caso de erro
      if (dashboardRef.current) {
        dashboardRef.current.style.width = '';
        dashboardRef.current.style.minWidth = '';
        dashboardRef.current.style.maxWidth = '';
      }
    } finally {
      setIsExporting(false);
    }
  };
  return (
    <>
      <meta name="title" content="Dashboard Agrícola" />

      {isExporting && (
        <LoadingOverlay>
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
        {/* Header com Export */}
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

          <ExportContainer>
            <ExportButton onClick={exportToPDF} disabled={isExporting} isDark={isDark}>
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
