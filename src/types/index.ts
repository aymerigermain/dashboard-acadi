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
  columnW: number[]; // Net Promoter Score (NPS)
  columnY: string[]; // Témoignages
  columnAD: string[]; // Canal d'acquisition
  
  // NPS metrics
  netPromoterScore: number; // Calculated NPS score
  npsPromotors: number; // Number of promotors (9-10)
  npsDetractors: number; // Number of detractors (0-6)
  npsPassives: number; // Number of passives (7-8)

  // External revenues data
  externalRevenues: ExternalRevenue[];
  externalRevenuesMetrics: ExternalRevenuesMetrics;
}

export interface ExternalRevenue {
  produit: string;
  prixUnitaire: number;
  quantite: number;
  total: number;
  acheteur: string;
  contactFormateur: string;
  contactFinanceur: string;
  cadre: string;
  date: string | null;  // ISO format ou null
  remarques: string;
}

export interface ExternalRevenuesMetrics {
  totalRevenue: number;
  totalPurchases: number;
  totalLicenses: number;
  averagePurchase: number;
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