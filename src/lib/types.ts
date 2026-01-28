export type DataSource = 'google_ads' | 'shopify' | 'paused' | 'meta_ads';

export type PlatformFilter = 'all' | 'google_ads' | 'meta_ads';

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

// Sorting types
export type SortField = 'month' | 'impressions' | 'clicks' | 'spend' | 'conversions' | 'conversionValue' | 'cpa' | 'roas' | 'momGrowth';
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

// Grouped data for combining multiple platforms in the same month
export interface GroupedMonthData {
  month: string;
  year: number;
  monthIndex: number;
  // Combined totals
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  conversionValue: number;
  // Calculated metrics
  cpa: number;
  roas: number;
  momGrowth: number | null;
  // Breakdown by platform
  breakdown: MonthlyData[];
  // UI state
  isExpanded?: boolean;
}
