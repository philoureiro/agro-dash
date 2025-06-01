import { use } from 'react';

import { useToast } from '@hooks';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportToPDF = async (
  dashboardElement: HTMLDivElement | null,
  filteredData: any,
  selectedFilter: string,
  isDark: boolean,
) => {
  const { toast } = useToast();
  if (!dashboardElement) {
    console.error('❌ Dashboard element não encontrado');
    return;
  }

  console.log('🚀 Iniciando exportação SIMPLES...', {
    element: dashboardElement,
    children: dashboardElement.children.length,
  });

  try {
    // 🎯 ESCONDE APENAS OS ELEMENTOS ESSENCIAIS (SEM data-attributes)
    const buttonsToHide = Array.from(document.querySelectorAll('button')).filter(
      (btn) =>
        btn.textContent?.includes('Exportar') ||
        btn.textContent?.includes('Gerando') ||
        btn.textContent?.includes('Todos') ||
        btn.textContent?.includes('Este Mês') ||
        btn.textContent?.includes('Este Trimestre') ||
        btn.textContent?.includes('Este Ano'),
    );

    const overlaysToHide = document.querySelectorAll('[class*="LoadingOverlay"]');

    console.log(`🎯 Escondendo ${buttonsToHide.length} botões e ${overlaysToHide.length} overlays`);

    // 💾 SALVA ESTILOS ORIGINAIS
    const originalStyles: { element: HTMLElement; display: string }[] = [];

    // 🚫 ESCONDE APENAS BOTÕES E OVERLAYS
    [...buttonsToHide, ...Array.from(overlaysToHide)].forEach((element) => {
      if (element instanceof HTMLElement) {
        originalStyles.push({
          element,
          display: element.style.display,
        });
        element.style.display = 'none';
      }
    });

    // 🖥️ FORÇA LAYOUT DESKTOP TEMPORARIAMENTE
    const originalWidth = dashboardElement.style.width;
    dashboardElement.style.width = '1200px';

    // ⏱️ AGUARDA UM POUCO
    console.log('⏳ Aguardando 2 segundos...');
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('📸 Capturando...');

    // 📸 CAPTURA ULTRA SIMPLES
    const canvas = await html2canvas(dashboardElement, {
      scale: 1.5, // 🔥 SCALE MENOR PARA TESTE
      useCORS: true,
      allowTaint: false,
      backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
      width: 1200,
      height: dashboardElement.scrollHeight,
      logging: true,
      foreignObjectRendering: true, // 🔥 VOLTA PARA TRUE
      imageTimeout: 15000,

      // 🔥 FUNÇÃO MAIS SIMPLES
      ignoreElements: (element) => {
        // 🎯 IGNORA APENAS BOTÕES E OVERLAYS
        if (element.tagName === 'BUTTON') {
          console.log('🚫 Ignorando botão:', element.textContent);
          return true;
        }

        if (element.classList.contains('LoadingOverlay')) {
          console.log('🚫 Ignorando overlay');
          return true;
        }

        return false;
      },
    });

    console.log('✅ Captura concluída!', {
      width: canvas.width,
      height: canvas.height,
    });

    // 🔄 RESTAURA TUDO
    dashboardElement.style.width = originalWidth;

    originalStyles.forEach(({ element, display }) => {
      element.style.display = display;
    });

    // 📄 CRIA PDF SIMPLES
    const imgData = canvas.toDataURL('image/png', 0.9);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth - 20; // 10mm margem de cada lado
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const x = 10;
    const y = 10;

    // 🎨 HEADER SIMPLES
    pdf.setFontSize(20);
    pdf.setTextColor(0, 150, 100);
    pdf.text('🌾 AgroDash Analytics', x, y + 5);

    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    const now = new Date();
    pdf.text(`Relatório gerado em ${now.toLocaleDateString('pt-BR')}`, x, y + 15);

    // 🖼️ ADICIONA IMAGEM
    pdf.addImage(imgData, 'PNG', x, y + 25, imgWidth, Math.min(imgHeight, pdfHeight - 40));

    // 💾 SALVA
    const timestamp = now.toISOString().slice(0, 10);
    const fileName = `AgroDash_${timestamp}.pdf`;

    pdf.save(fileName);

    console.log('✅ PDF salvo:', fileName);

    toast.success('Sucesso!', `✅ PDF "${fileName}" gerado!`);
  } catch (error) {
    console.error('❌ Erro:', error);

    toast.success('Erro!', `Erro ao gerar PDF.`);
  }
};
