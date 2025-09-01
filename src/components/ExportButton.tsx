import { useState, forwardRef, useImperativeHandle } from 'react';
import {
  Button,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Typography,
} from '@mui/material';
import { PictureAsPdf, Close } from '@mui/icons-material';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { DashboardStats, ChartDataPoint } from '../types';
// Import removed as not used

interface ExportButtonProps {
  stats: DashboardStats | null;
  chartData: ChartDataPoint[];
  disabled?: boolean;
}

export interface ExportButtonRef {
  handleExportClick: () => void;
}

type ReportType = 'global' | 'weekly';

export const ExportButton = forwardRef<ExportButtonRef, ExportButtonProps>(({
  stats,
  chartData,
  disabled,
}, ref) => {
  const [exporting, setExporting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reportType, setReportType] = useState<ReportType>('global');
  const [selectedWeek, setSelectedWeek] = useState<string>('');
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Get available weeks for selection
  const availableWeeks = chartData.map(item => ({
    value: item.week,
    label: item.date
  })).reverse(); // Most recent first

  useImperativeHandle(ref, () => ({
    handleExportClick
  }));

  const handleExportClick = () => {
    if (!stats || chartData.length === 0) {
      setNotification({
        open: true,
        message: 'Aucune donnée à exporter',
        severity: 'error',
      });
      return;
    }
    setSelectedWeek(availableWeeks[0]?.value || '');
    setDialogOpen(true);
  };

  // Helper function to format currency for PDF (no symbols, clean)
  const formatCurrencyPDF = (amount: number): string => {
    return `${amount.toFixed(2)} EUR`;
  };

  const addLogo = async (pdf: jsPDF, x: number, y: number, maxWidth: number) => {
    try {
      // Try to add logo - in browser context only
      const logoElement = document.querySelector('img[alt="ACADI Logo"]') as HTMLImageElement;
      if (logoElement && logoElement.complete) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = logoElement.naturalWidth;
        canvas.height = logoElement.naturalHeight;
        ctx?.drawImage(logoElement, 0, 0);
        const logoData = canvas.toDataURL('image/png');
        
        // Keep aspect ratio
        const aspectRatio = logoElement.naturalHeight / logoElement.naturalWidth;
        const width = maxWidth;
        const height = width * aspectRatio;
        
        pdf.addImage(logoData, 'PNG', x, y, width, height);
        return height;
      }
    } catch (e) {
      console.log('Logo not available for PDF');
    }
    return 0;
  };

  const generateGlobalReport = async (pdf: jsPDF, pageWidth: number, pageHeight: number, margin: number) => {
    if (!stats) return;
    
    let currentY = 40;

    // Helper function to add new page if needed
    const checkPageBreak = (neededSpace: number) => {
      if (currentY + neededSpace > pageHeight - 30) {
        pdf.addPage();
        currentY = 30;
        return true;
      }
      return false;
    };

    // Header with new design - no blue banner
    // Add logo with proper aspect ratio
    const logoHeight = await addLogo(pdf, margin, 15, 30);
    
    // Title next to logo - aligned with logo center
    const logoCenter = 15 + (logoHeight / 2);
    pdf.setTextColor(4, 150, 255); // ACADI blue for title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACADI', margin + 35, logoCenter - 2);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Rapport Exécutif Global', margin + 35, logoCenter + 6);
    
    // Horizontal line under header
    pdf.setDrawColor(4, 150, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 35, pageWidth - margin, 35);
    
    currentY = 50;

    // Document info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Les principes fondamentaux de la stratégie d\'entreprise', margin, currentY);
    currentY += 8;
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Avec Xavier Fontanet', margin, currentY);
    currentY += 7;
    
    pdf.setFontSize(10);
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleDateString('fr-FR', { month: 'long' });
    const year = today.getFullYear();
    pdf.text(`Généré le ${day} ${month} ${year}`, margin, currentY);
    currentY += 20;

    // Executive Summary Box
    pdf.setFillColor(248, 250, 252);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 25, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 25, 'S');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Résumé Exécutif', margin + 5, currentY + 10);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Performance globale: ${formatCurrencyPDF(stats.netRevenue)} de CA net`, margin + 5, currentY + 18);
    currentY += 35;

    // Financial KPIs Section
    checkPageBreak(80);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Indicateurs Financiers', margin, currentY);
    currentY += 12;

    // KPI Grid Layout with better contrast
    const kpiBoxWidth = (pageWidth - 2 * margin - 10) / 2;
    const kpiBoxHeight = 22;
    
    let kpiY = currentY;
    
    // CA Brut
    pdf.setFillColor(240, 253, 244); // Light green background
    pdf.rect(margin, kpiY, kpiBoxWidth, kpiBoxHeight, 'F');
    pdf.setDrawColor(16, 185, 129);
    pdf.rect(margin, kpiY, kpiBoxWidth, kpiBoxHeight, 'S');
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CA Brut:', margin + 3, kpiY + 10);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatCurrencyPDF(stats.grossRevenue), margin + 3, kpiY + 17);
    
    // CA Net (right column)
    pdf.setFillColor(239, 246, 255); // Light blue background
    pdf.rect(margin + kpiBoxWidth + 5, kpiY, kpiBoxWidth, kpiBoxHeight, 'F');
    pdf.setDrawColor(4, 150, 255);
    pdf.rect(margin + kpiBoxWidth + 5, kpiY, kpiBoxWidth, kpiBoxHeight, 'S');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CA Net:', margin + kpiBoxWidth + 8, kpiY + 10);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatCurrencyPDF(stats.netRevenue), margin + kpiBoxWidth + 8, kpiY + 17);
    kpiY += 27;
    
    // Remboursements
    pdf.setFillColor(254, 242, 242); // Light red background
    pdf.rect(margin, kpiY, kpiBoxWidth, kpiBoxHeight, 'F');
    pdf.setDrawColor(239, 68, 68);
    pdf.rect(margin, kpiY, kpiBoxWidth, kpiBoxHeight, 'S');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Remboursements:', margin + 3, kpiY + 10);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatCurrencyPDF(stats.totalRefunds), margin + 3, kpiY + 17);
    
    // Frais Stripe (right column)
    pdf.setFillColor(255, 251, 235); // Light orange background
    pdf.rect(margin + kpiBoxWidth + 5, kpiY, kpiBoxWidth, kpiBoxHeight, 'F');
    pdf.setDrawColor(245, 158, 11);
    pdf.rect(margin + kpiBoxWidth + 5, kpiY, kpiBoxWidth, kpiBoxHeight, 'S');
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Frais Stripe:', margin + kpiBoxWidth + 8, kpiY + 10);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(formatCurrencyPDF(stats.totalFees), margin + kpiBoxWidth + 8, kpiY + 17);
    
    currentY = kpiY + 35;

    // Table section
    checkPageBreak(50);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Détail par Semaine', margin, currentY);
    currentY += 12;

    // Professional table with borders
    const tableStartY = currentY;
    const colWidths = [50, 18, 32, 28, 32];
    const colX = [
      margin,
      margin + colWidths[0],
      margin + colWidths[0] + colWidths[1],
      margin + colWidths[0] + colWidths[1] + colWidths[2],
      margin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]
    ];
    
    // Table header background
    pdf.setFillColor(4, 150, 255); // ACADI blue
    pdf.rect(margin, tableStartY, pageWidth - 2 * margin, 10, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Période', colX[0] + 2, tableStartY + 7);
    pdf.text('Ventes', colX[1] + 2, tableStartY + 7);
    pdf.text('CA Brut', colX[2] + 2, tableStartY + 7);
    pdf.text('Remb.', colX[3] + 2, tableStartY + 7);
    pdf.text('CA Net', colX[4] + 2, tableStartY + 7);
    
    pdf.setTextColor(0, 0, 0);
    currentY = tableStartY + 15;

    // Table rows - reversed for antichronological order
    const reversedData = [...chartData].reverse();
    reversedData.forEach((row, index) => {
      checkPageBreak(8);
      
      if (index % 2 === 0) {
        pdf.setFillColor(248, 250, 252);
        pdf.rect(margin, currentY - 3, pageWidth - 2 * margin, 8, 'F');
      }
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      const weeklyData = stats!.weeklyStats.find(w => w.week === row.week);
      
      pdf.text(row.date, colX[0] + 2, currentY + 3);
      pdf.text(row.sales.toString(), colX[1] + 2, currentY + 3);
      pdf.text(formatCurrencyPDF(weeklyData?.grossRevenue || row.revenue), colX[2] + 2, currentY + 3);
      pdf.text(formatCurrencyPDF(weeklyData?.refunds || 0), colX[3] + 2, currentY + 3);
      pdf.text(formatCurrencyPDF(weeklyData?.netRevenue || row.revenue), colX[4] + 2, currentY + 3);
      
      currentY += 8;
    });

    // Add charts page
    try {
      const salesChart = document.querySelector('[data-testid="sales-chart"]') as HTMLElement;
      const revenueChart = document.querySelector('[data-testid="revenue-chart"]') as HTMLElement;

      if (salesChart && revenueChart) {
        pdf.addPage();
        
        // Add logo to charts page
        const chartLogoHeight = await addLogo(pdf, margin, 10, 25);
        
        // Align title with logo center
        const chartLogoCenter = 10 + (chartLogoHeight / 2);
        pdf.setTextColor(4, 150, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Graphiques de Performance', margin + 30, chartLogoCenter + 2);
        pdf.setTextColor(0, 0, 0);
        
        // Sales chart
        const salesCanvas = await html2canvas(salesChart, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const salesImgData = salesCanvas.toDataURL('image/png');
        // Use natural dimensions to preserve exact proportions
        const maxPageWidth = pageWidth - 2 * margin;
        const maxChartHeight = 120; // Increased for larger charts
        
        const salesNaturalWidth = salesCanvas.width / 2; // Account for scale=2
        const salesNaturalHeight = salesCanvas.height / 2;
        
        // Scale to fit within page while preserving exact aspect ratio
        const salesWidthScale = maxPageWidth / salesNaturalWidth;
        const salesHeightScale = maxChartHeight / salesNaturalHeight;
        const salesScale = Math.min(salesWidthScale, salesHeightScale);
        
        const salesFinalWidth = salesNaturalWidth * salesScale;
        const salesFinalHeight = salesNaturalHeight * salesScale;
        
        pdf.addImage(salesImgData, 'PNG', margin, 45, salesFinalWidth, salesFinalHeight);

        // Revenue chart
        const revenueCanvas = await html2canvas(revenueChart, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const revenueImgData = revenueCanvas.toDataURL('image/png');
        const revenueNaturalWidth = revenueCanvas.width / 2; // Account for scale=2
        const revenueNaturalHeight = revenueCanvas.height / 2;
        
        const revenueWidthScale = maxPageWidth / revenueNaturalWidth;
        const revenueHeightScale = maxChartHeight / revenueNaturalHeight;
        const revenueScale = Math.min(revenueWidthScale, revenueHeightScale);
        
        const revenueFinalWidth = revenueNaturalWidth * revenueScale;
        const revenueFinalHeight = revenueNaturalHeight * revenueScale;
        
        pdf.addImage(revenueImgData, 'PNG', margin, 55 + salesFinalHeight, revenueFinalWidth, revenueFinalHeight);
      }
    } catch (chartError) {
      console.warn('Could not capture charts for PDF:', chartError);
    }
  };

  const generateWeeklyReport = async (pdf: jsPDF, pageWidth: number, _pageHeight: number, margin: number) => {
    if (!stats) return;
    
    let currentY = 40;

    const selectedWeekData = chartData.find(item => item.week === selectedWeek);
    const weeklyStats = stats.weeklyStats.find(w => w.week === selectedWeek);
    
    if (!selectedWeekData || !weeklyStats) return;

    // Header with new design - no blue banner
    const logoHeight = await addLogo(pdf, margin, 15, 30);
    
    // Title next to logo - aligned with logo center
    const logoCenter = 15 + (logoHeight / 2);
    pdf.setTextColor(4, 150, 255); // ACADI blue for title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ACADI', margin + 35, logoCenter - 2);
    
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Rapport Exécutif Hebdomadaire', margin + 35, logoCenter + 6);
    
    // Horizontal line under header
    pdf.setDrawColor(4, 150, 255);
    pdf.setLineWidth(0.5);
    pdf.line(margin, 35, pageWidth - margin, 35);
    
    currentY = 45;

    // Week info
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Semaine du ${selectedWeekData.date}`, margin, currentY);
    currentY += 10;
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Les principes fondamentaux de la stratégie d\'entreprise', margin, currentY);
    currentY += 7;
    
    pdf.setFontSize(10);
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = today.toLocaleDateString('fr-FR', { month: 'long' });
    const year = today.getFullYear();
    pdf.text(`Généré le ${day} ${month} ${year}`, margin, currentY);
    currentY += 20;

    // Week Performance Box
    pdf.setFillColor(239, 246, 255); // Light ACADI blue
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 55, 'F');
    pdf.setDrawColor(4, 150, 255);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 55, 'S');
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Performance de la Semaine', margin + 5, currentY + 12);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Nouveaux Clients: ${selectedWeekData.sales}`, margin + 5, currentY + 25);
    pdf.text(`CA Brut: ${formatCurrencyPDF(weeklyStats.grossRevenue || selectedWeekData.revenue)}`, margin + 5, currentY + 35);
    pdf.text(`CA Net: ${formatCurrencyPDF(weeklyStats.netRevenue || selectedWeekData.revenue)}`, margin + 5, currentY + 45);
    pdf.text(`Remboursements: ${formatCurrencyPDF(weeklyStats.refunds || 0)}`, margin + 90, currentY + 25);
    pdf.text(`Frais Stripe: ${formatCurrencyPDF(weeklyStats.fees || 0)}`, margin + 90, currentY + 35);
    
    currentY += 65;

    // Global Context (compact) - Fixed spacing
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Contexte Global', margin, currentY);
    currentY += 10;
    
    pdf.setFillColor(248, 250, 252);
    pdf.rect(margin, currentY, pageWidth - 2 * margin, 35, 'F');
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Total periode: ${formatCurrencyPDF(stats.netRevenue)} CA net`, margin + 5, currentY + 10);
    pdf.text(`${stats.totalCustomers} clients sur ${chartData.length} semaines`, margin + 5, currentY + 18);
    pdf.text(`Nombre total de clients: ${stats.totalCustomers}`, margin + 5, currentY + 26);
    
    currentY += 45;

    // Recent weeks context (5 weeks)
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Tendance Récente (5 dernières semaines)', margin, currentY);
    currentY += 12;

    const recentWeeks = chartData.slice(-5);
    const tableY = currentY;
    
    // Mini table header
    pdf.setFillColor(4, 150, 255); // ACADI blue
    pdf.rect(margin, tableY, pageWidth - 2 * margin, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Semaine', margin + 2, tableY + 6);
    pdf.text('Ventes', margin + 60, tableY + 6);
    pdf.text('CA Net', margin + 100, tableY + 6);
    
    pdf.setTextColor(0, 0, 0);
    currentY = tableY + 12;

    recentWeeks.forEach((week) => {
      const weekStats = stats!.weeklyStats.find(w => w.week === week.week);
      const isSelectedWeek = week.week === selectedWeek;
      
      if (isSelectedWeek) {
        pdf.setFillColor(239, 246, 255); // Light ACADI blue highlight
        pdf.rect(margin, currentY - 2, pageWidth - 2 * margin, 8, 'F');
      }
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', isSelectedWeek ? 'bold' : 'normal');
      pdf.text(week.date, margin + 2, currentY + 4);
      pdf.text(week.sales.toString(), margin + 60, currentY + 4);
      pdf.text(formatCurrencyPDF(weekStats?.netRevenue || week.revenue), margin + 100, currentY + 4);
      
      currentY += 8;
    });

    // Add charts for weekly report too
    try {
      const salesChart = document.querySelector('[data-testid="sales-chart"]') as HTMLElement;
      const revenueChart = document.querySelector('[data-testid="revenue-chart"]') as HTMLElement;

      if (salesChart && revenueChart) {
        pdf.addPage();
        
        // Add logo to charts page
        const chartLogoHeight = await addLogo(pdf, margin, 10, 25);
        
        // Align title with logo center
        const chartLogoCenter = 10 + (chartLogoHeight / 2);
        pdf.setTextColor(4, 150, 255);
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Graphiques de Performance', margin + 30, chartLogoCenter + 2);
        pdf.setTextColor(0, 0, 0);
        
        // Sales chart
        const salesCanvas = await html2canvas(salesChart, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const salesImgData = salesCanvas.toDataURL('image/png');
        // Use natural dimensions to preserve exact proportions
        const maxPageWidth = pageWidth - 2 * margin;
        const maxChartHeight = 120; // Increased for larger charts
        
        const salesNaturalWidth = salesCanvas.width / 2; // Account for scale=2
        const salesNaturalHeight = salesCanvas.height / 2;
        
        // Scale to fit within page while preserving exact aspect ratio
        const salesWidthScale = maxPageWidth / salesNaturalWidth;
        const salesHeightScale = maxChartHeight / salesNaturalHeight;
        const salesScale = Math.min(salesWidthScale, salesHeightScale);
        
        const salesFinalWidth = salesNaturalWidth * salesScale;
        const salesFinalHeight = salesNaturalHeight * salesScale;
        
        pdf.addImage(salesImgData, 'PNG', margin, 45, salesFinalWidth, salesFinalHeight);

        // Revenue chart
        const revenueCanvas = await html2canvas(revenueChart, {
          backgroundColor: '#ffffff',
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });
        const revenueImgData = revenueCanvas.toDataURL('image/png');
        const revenueNaturalWidth = revenueCanvas.width / 2; // Account for scale=2
        const revenueNaturalHeight = revenueCanvas.height / 2;
        
        const revenueWidthScale = maxPageWidth / revenueNaturalWidth;
        const revenueHeightScale = maxChartHeight / revenueNaturalHeight;
        const revenueScale = Math.min(revenueWidthScale, revenueHeightScale);
        
        const revenueFinalWidth = revenueNaturalWidth * revenueScale;
        const revenueFinalHeight = revenueNaturalHeight * revenueScale;
        
        pdf.addImage(revenueImgData, 'PNG', margin, 55 + salesFinalHeight, revenueFinalWidth, revenueFinalHeight);
      }
    } catch (chartError) {
      console.warn('Could not capture charts for PDF:', chartError);
    }
  };

  const handleExport = async () => {
    if (!stats || chartData.length === 0) return;

    setExporting(true);

    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      if (reportType === 'global') {
        await generateGlobalReport(pdf, pageWidth, pageHeight, margin);
      } else {
        await generateWeeklyReport(pdf, pageWidth, pageHeight, margin);
      }

      // Footer on all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const footerY = pageHeight - 15;
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'italic');
        pdf.setTextColor(100, 116, 139);
        pdf.text('Rapport Exécutif - Les principes fondamentaux de la stratégie d\'entreprise', margin, footerY);
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = today.toLocaleDateString('fr-FR', { month: 'long' });
        const year = today.getFullYear();
        pdf.text(`Page ${i}/${totalPages} - ${day} ${month} ${year}`, pageWidth - margin - 50, footerY);
      }

      // Save PDF with appropriate naming
      const dateStr = new Date().toISOString().split('T')[0];
      const filename = reportType === 'global' 
        ? `ACADI-Rapport-Global-${dateStr}.pdf`
        : `ACADI-Rapport-Semaine-${selectedWeek}-${dateStr}.pdf`;
      
      pdf.save(filename);

      setNotification({
        open: true,
        message: `Rapport ${reportType === 'global' ? 'global' : 'hebdomadaire'} généré avec succès !`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      setNotification({
        open: true,
        message: 'Erreur lors de la génération du PDF',
        severity: 'error',
      });
    } finally {
      setExporting(false);
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        color="primary"
        startIcon={exporting ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdf />}
        onClick={handleExportClick}
        disabled={disabled || exporting || !stats}
        sx={{
          minWidth: 200,
          py: 1.5,
          px: 3,
          fontWeight: 600,
        }}
      >
        {exporting ? 'Génération...' : 'Exporter PDF'}
      </Button>

      {/* Export Options Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Options d'Export PDF
          <Button onClick={() => setDialogOpen(false)} size="small">
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <FormControl component="fieldset" fullWidth sx={{ mb: 3 }}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Type de Rapport
              </FormLabel>
              <RadioGroup
                value={reportType}
                onChange={(e) => setReportType(e.target.value as ReportType)}
              >
                <FormControlLabel
                  value="global"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Rapport Global
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Toutes les données avec graphiques complets
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="weekly"
                  control={<Radio />}
                  label={
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        Rapport Hebdomadaire
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Focus sur une semaine + résumé global + graphiques
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>

            {reportType === 'weekly' && (
              <FormControl fullWidth>
                <InputLabel>Sélectionner la semaine</InputLabel>
                <Select
                  value={selectedWeek}
                  onChange={(e) => setSelectedWeek(e.target.value)}
                  label="Sélectionner la semaine"
                >
                  {availableWeeks.map((week) => (
                    <MenuItem key={week.value} value={week.value}>
                      {week.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={() => {
              setDialogOpen(false);
              handleExport();
            }}
            variant="contained"
            disabled={reportType === 'weekly' && !selectedWeek}
            startIcon={<PictureAsPdf />}
          >
            Générer PDF
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setNotification({ ...notification, open: false })}
          severity={notification.severity}
          variant="filled"
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
});