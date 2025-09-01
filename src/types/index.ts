export interface Payment {
  id: string;
  amount: number;
  currency: string;
  created: number;
  description: string;
  customerEmail: string;
  status: string;
}

export interface WeeklyStats {
  week: string;
  sales: number;
  revenue: number;
  grossRevenue?: number;
  refunds?: number;
  fees?: number;
  netRevenue?: number;
}

export interface DashboardStats {
  // Legacy compatibility
  totalRevenue: number; // This is now netRevenue
  
  // Comprehensive metrics
  grossRevenue: number;
  totalRefunds: number;
  totalFees: number;
  netRevenue: number;
  
  totalCustomers: number;
  lastUpdate: string;
  weeklyStats: WeeklyStats[];
  averageOrderValue: number;
  
  // Current week stats
  currentWeekSales: number;
  currentWeekGrossRevenue: number;
  currentWeekRefunds: number;
  currentWeekFees: number;
  currentWeekNetRevenue: number;
  
  // Satisfaction data from Google Sheets
  averageRating: number;
  totalReviews: number;
  
  // Survey response data
  columnE: string[]; // Ancienneté professionnelle
  columnF: string[]; // Secteur d'activité
  columnG: string[]; // Taille entreprise
  columnY: string[]; // Témoignages
  columnAD: string[]; // Canal d'acquisition
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface ChartDataPoint {
  week: string;
  sales: number;
  revenue: number;
  cumulativeRevenue?: number;
  date: string; // Formatted date for display
}

export interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export interface ExportData {
  stats: DashboardStats;
  chartData: ChartDataPoint[];
  exportDate: string;
}