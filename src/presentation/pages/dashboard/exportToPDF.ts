import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 🚀 FUNÇÃO DE EXPORTAÇÃO PDF SUPREMA - ESCONDE TODOS OS ELEMENTOS DE UI
export const exportToPDF = async (
  dashboardRef: React.RefObject<HTMLDivElement>,
  isDark: boolean,
  setIsExporting: React.Dispatch<React.SetStateAction<boolean>>,
  isExporting: boolean,
) => {
  if (!dashboardRef.current || isExporting) return;

  setIsExporting(true);

  // 🚫 ESCONDE TODOS OS ELEMENTOS DE INTERFACE ANTES DA CAPTURA
  const elementsToHide = [
    document.querySelector('[data-export-button]'),
    document.querySelector('[data-export-container]'),
    document.querySelector('.loading-overlay'), // Loading overlay genérico
    ...document.querySelectorAll('[class*="loading"]'), // Qualquer classe com loading
    ...document.querySelectorAll('[class*="Loading"]'), // Qualquer classe com Loading
    ...document.querySelectorAll('[class*="overlay"]'), // Qualquer overlay
    ...document.querySelectorAll('[class*="Overlay"]'), // Qualquer Overlay
    ...document.querySelectorAll('[data-loading]'), // Data attributes de loading
  ];

  // Armazena estilos originais para restaurar depois
  const originalStyles: { element: Element; display: string }[] = [];

  try {
    // 🎯 FORÇA LAYOUT DESKTOP DURANTE A CAPTURA
    const originalWidth = dashboardRef.current.style.width;
    const originalMinWidth = dashboardRef.current.style.minWidth;
    const originalMaxWidth = dashboardRef.current.style.maxWidth;

    // Esconde todos os elementos de interface
    elementsToHide.forEach((element) => {
      if (element && element instanceof HTMLElement) {
        originalStyles.push({
          element,
          display: element.style.display,
        });
        element.style.display = 'none';
      }
    });

    // Define largura fixa de desktop durante a captura
    dashboardRef.current.style.width = '1200px';
    dashboardRef.current.style.minWidth = '1200px';
    dashboardRef.current.style.maxWidth = '1200px';

    // ⏱️ AGUARDA MAIS TEMPO PARA GARANTIR QUE TUDO SUMIU
    await new Promise((resolve) => setTimeout(resolve, 600));

    // 🎨 FUNDO CUSTOMIZADO PARA CONTRASTE PERFEITO
    const customBg = isDark ? '#0a0f14' : '#fafbfc';

    const canvas = await html2canvas(dashboardRef.current, {
      scale: 2.5,
      useCORS: true,
      allowTaint: true,
      backgroundColor: customBg,
      width: 1200,
      height: dashboardRef.current.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      foreignObjectRendering: true,
      imageTimeout: 15000,
      logging: false,
      windowWidth: 1200,
      windowHeight: 800,
      // Ignora elementos com certas classes
      ignoreElements: (element) => {
        return (
          element.classList.contains('loading-overlay') ||
          element.classList.contains('LoadingOverlay') ||
          element.hasAttribute('data-loading') ||
          element.hasAttribute('data-export-button') ||
          element.hasAttribute('data-export-container')
        );
      },
    });

    // 🔄 RESTAURA ESTILOS ORIGINAIS
    dashboardRef.current.style.width = originalWidth;
    dashboardRef.current.style.minWidth = originalMinWidth;
    dashboardRef.current.style.maxWidth = originalMaxWidth;

    // Restaura visibilidade de todos os elementos
    originalStyles.forEach(({ element, display }) => {
      if (element instanceof HTMLElement) {
        element.style.display = display;
      }
    });

    const imgData = canvas.toDataURL('image/png', 0.98);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // 🎨 ADICIONA FONTE FEATHER BOLD AO PDF
    try {
      const fontResponse = await fetch('/assets/fonts/Feather-Bold.ttf');
      const fontArrayBuffer = await fontResponse.arrayBuffer();
      const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontArrayBuffer)));

      pdf.addFileToVFS('Feather-Bold.ttf', fontBase64);
      pdf.addFont('Feather-Bold.ttf', 'FeatherBold', 'normal');
    } catch (fontError) {
      console.warn('Erro ao carregar fonte Feather Bold, usando fonte padrão:', fontError);
    }

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasHeight / canvasWidth;

    // 🔥 MARGENS OTIMIZADAS
    const headerHeight = 22;
    const footerHeight = 16;
    const sideMargin = 6;

    let imgWidth = pdfWidth - sideMargin * 2;
    let imgHeight = imgWidth * ratio;

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

    // 🏆 TÍTULO PRINCIPAL COM FEATHER BOLD
    pdf.setTextColor(isDark ? 60 : 20, isDark ? 220 : 100, isDark ? 140 : 60);
    pdf.setFontSize(26);

    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'bold');
    }

    pdf.text('AgroDash', sideMargin, 11);

    // Subtítulo elegante com Feather Bold menor
    pdf.setTextColor(isDark ? 140 : 60, isDark ? 160 : 80, isDark ? 170 : 80);
    pdf.setFontSize(13);

    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'normal');
    }

    pdf.text('Relatório Executivo • Sistema de Gestão Agrícola', sideMargin, 17);

    // 📅 DATA E HORA
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
    pdf.text(`${dateStr}`, pdfWidth - 60, 10);
    pdf.text(`${timeStr}`, pdfWidth - 60, 15);

    // Linha decorativa sofisticada
    const gradient = isDark ? [55, 203, 131] : [37, 150, 90];
    pdf.setDrawColor(gradient[0], gradient[1], gradient[2]);
    pdf.setLineWidth(1.5);
    pdf.line(sideMargin, headerHeight - 3, pdfWidth - sideMargin, headerHeight - 3);

    pdf.setDrawColor(gradient[0] + 30, gradient[1] + 20, gradient[2] + 30);
    pdf.setLineWidth(0.4);
    pdf.line(sideMargin, headerHeight - 1.5, pdfWidth - sideMargin, headerHeight - 1.5);

    // 🖼️ IMAGEM PRINCIPAL DO DASHBOARD
    pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight, '', 'FAST');

    // 🎯 FOOTER PREMIUM COM FEATHER BOLD
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

    pdf.setDrawColor(gradient[0], gradient[1], gradient[2]);
    pdf.setLineWidth(1.0);
    pdf.line(sideMargin, footerY + 2, pdfWidth - sideMargin, footerY + 2);

    // 🏆 LOGO/NOME DA EMPRESA COM FEATHER BOLD
    pdf.setTextColor(isDark ? 60 : 20, isDark ? 220 : 100, isDark ? 140 : 60);
    pdf.setFontSize(12);

    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'bold');
    }

    pdf.text('AgroDash', sideMargin, footerY + 8);

    pdf.setFontSize(9);
    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'normal');
    }

    pdf.setTextColor(isDark ? 140 : 60, isDark ? 160 : 80, isDark ? 170 : 80);
    pdf.text('Plataforma Inteligente de Gestão e Análise Agrícola', sideMargin, footerY + 12);

    // Informações do relatório
    pdf.setFontSize(8);
    pdf.setTextColor(isDark ? 120 : 90, isDark ? 130 : 100, isDark ? 140 : 110);

    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'normal');
    }

    pdf.text(`Página 1 de 1 • Dados consolidados`, pdfWidth - 65, footerY + 6);
    pdf.text(`Gerado em ${dateStr} às ${timeStr}`, pdfWidth - 65, footerY + 9);
    pdf.text(`Confidencial • © ${now.getFullYear()} AgroDash`, pdfWidth - 65, footerY + 12);

    // 💎 MARCA D'ÁGUA COM FEATHER BOLD
    pdf.setGState(new pdf.GState({ opacity: isDark ? 0.03 : 0.02 }));
    pdf.setTextColor(gradient[0], gradient[1], gradient[2]);
    pdf.setFontSize(48);

    try {
      pdf.setFont('FeatherBold', 'normal');
    } catch {
      pdf.setFont('helvetica', 'bold');
    }

    const centerX = pdfWidth / 2;
    const centerY = pdfHeight / 2;
    pdf.text('AGRODASH', centerX, centerY, {
      angle: 45,
      align: 'center',
    });

    pdf.setGState(new pdf.GState({ opacity: 1 }));

    // 💾 SALVA O PDF
    const timestamp = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}_${now
      .getHours()
      .toString()
      .padStart(2, '0')}h${now.getMinutes().toString().padStart(2, '0')}`;

    const fileName = `AgroDash_Relatorio_Executivo_${timestamp}.pdf`;
    pdf.save(fileName);

    setTimeout(() => {
      alert('✅ PDF gerado com sucesso! Interface limpa aplicada.');
    }, 500);
  } catch (error) {
    console.error('Erro ao exportar PDF:', error);
    alert('❌ Erro ao gerar PDF. Verifique sua conexão e tente novamente.');

    // 🔄 RESTAURA TUDO EM CASO DE ERRO
    if (dashboardRef.current) {
      dashboardRef.current.style.width = '';
      dashboardRef.current.style.minWidth = '';
      dashboardRef.current.style.maxWidth = '';
    }

    originalStyles.forEach(({ element, display }) => {
      if (element instanceof HTMLElement) {
        element.style.display = display;
      }
    });
  } finally {
    setIsExporting(false);
  }
};
