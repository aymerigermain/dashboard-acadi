import type { WeeklyStats, ChartDataPoint } from '../types';
import { getWeekLabel } from './dateUtils';

export const processWeeklyData = (weeklyStats: WeeklyStats[]): ChartDataPoint[] => {
  let cumulativeRevenue = 0;
  
  return weeklyStats
    .sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime())
    .map((week) => {
      cumulativeRevenue += week.netRevenue || week.revenue;
      
      return {
        week: week.week,
        sales: week.sales,
        revenue: week.netRevenue || week.revenue,
        cumulativeRevenue,
        date: getWeekLabel(week.week),
      };
    });
};

export const calculateGrowthRate = (
  current: number,
  previous: number
): { rate: number; isPositive: boolean } => {
  if (previous === 0) {
    return { rate: current > 0 ? 100 : 0, isPositive: current > 0 };
  }
  
  const rate = ((current - previous) / previous) * 100;
  return { rate: Math.abs(rate), isPositive: rate >= 0 };
};

export const getMostRecentWeeks = (
  weeklyStats: WeeklyStats[],
  count: number = 8
): WeeklyStats[] => {
  return weeklyStats
    .sort((a, b) => new Date(b.week).getTime() - new Date(a.week).getTime())
    .slice(0, count)
    .reverse(); // Return in chronological order
};

export const generateExportFilename = (): string => {
  const now = new Date();
  const dateString = now.toISOString().split('T')[0];
  return `rapport-formation-strategie-${dateString}.pdf`;
};

export const formatTableData = (chartData: ChartDataPoint[]) => {
  return chartData.map((item, index) => ({
    ...item,
    weekNumber: index + 1,
    formattedRevenue: new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(item.revenue),
    formattedCumulativeRevenue: new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(item.cumulativeRevenue || 0),
  }));
};