import { MonthlyData, KPIMetrics, PlatformFilter } from './types';

export function calculateKPIs(data: MonthlyData[]): KPIMetrics {
  const activeData = data.filter(d => d.source !== 'paused' && d.conversions !== null);

  const totalImpressions = activeData.reduce((sum, d) => sum + (d.impressions || 0), 0);
  const totalClicks = activeData.reduce((sum, d) => sum + (d.clicks || 0), 0);
  const totalSpend = activeData.reduce((sum, d) => sum + (d.spend || 0), 0);
  const totalConversions = activeData.reduce((sum, d) => sum + (d.conversions || 0), 0);
  const totalConversionValue = activeData.reduce((sum, d) => sum + (d.conversionValue || 0), 0);

  const avgConversionRate = totalImpressions > 0
    ? (totalConversions / totalImpressions) * 100
    : 0;

  const avgOrderValue = totalConversions > 0
    ? totalConversionValue / totalConversions
    : 0;

  // Cost Per Acquisition (CPA) = Total Spend / Total Conversions
  const cpa = totalConversions > 0
    ? totalSpend / totalConversions
    : 0;

  // Return on Ad Spend (ROAS) = Total Conversion Value / Total Spend
  const roas = totalSpend > 0
    ? totalConversionValue / totalSpend
    : 0;

  return {
    totalImpressions,
    totalClicks,
    totalSpend,
    totalConversions,
    totalConversionValue,
    avgConversionRate,
    avgOrderValue,
    cpa,
    roas,
  };
}

export function calculateMOMGrowth(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function filterDataByYear(data: MonthlyData[], year: number | 'all'): MonthlyData[] {
  if (year === 'all') return data;
  return data.filter(d => d.year === year);
}

export function filterDataByMonths(data: MonthlyData[], months: number[]): MonthlyData[] {
  if (months.length === 0) return data;
  return data.filter(d => months.includes(d.monthIndex));
}

export function filterDataByPlatform(data: MonthlyData[], platform: PlatformFilter): MonthlyData[] {
  if (platform === 'all') return data;
  return data.filter(d => d.source === platform || d.source === 'paused');
}

export function calculateKPIsByPlatform(data: MonthlyData[]): Record<string, KPIMetrics> {
  const platforms = ['google_ads', 'meta_ads', 'shopify'] as const;
  const result: Record<string, KPIMetrics> = {};

  for (const platform of platforms) {
    const platformData = data.filter(d => d.source === platform);
    if (platformData.length > 0) {
      result[platform] = calculateKPIs(platformData);
    }
  }

  return result;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}

export function getDataWithMOM(data: MonthlyData[]): (MonthlyData & { momGrowth: number | null })[] {
  return data.map((item, index) => {
    const previous = index > 0 ? data[index - 1] : null;
    const momGrowth = previous && previous.source !== 'paused' && item.source !== 'paused'
      ? calculateMOMGrowth(item.conversionValue, previous.conversionValue)
      : null;
    return { ...item, momGrowth };
  });
}
