export type DataSource = 'google_ads' | 'shopify' | 'paused';

export interface MonthlyData {
  month: string;
  year: number;
  monthIndex: number;
  impressions: number | null;
  clicks: number | null;
  spend: number | null;
  conversions: number | null;
  conversionValue: number | null;
  source: DataSource;
}

export interface FilterState {
  selectedYear: number | 'all';
  selectedMonths: number[];
}

export interface KPIMetrics {
  totalImpressions: number;
  totalClicks: number;
  totalSpend: number;
  totalConversions: number;
  totalConversionValue: number;
  avgConversionRate: number;
  avgOrderValue: number;
  cpa: number;
  roas: number;
}
