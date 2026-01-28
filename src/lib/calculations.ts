import { MonthlyData, KPIMetrics, PlatformFilter, GroupedMonthData, SortConfig, SortField } from './types';

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

/**
 * Groups data by month, combining multiple platform entries into single rows
 * with combined totals and a breakdown array for expansion
 */
export function groupDataByMonth(data: MonthlyData[]): GroupedMonthData[] {
  // Create a map keyed by "month-year" to group entries
  const monthMap = new Map<string, MonthlyData[]>();

  for (const entry of data) {
    const key = `${entry.year}-${entry.monthIndex}`;
    if (!monthMap.has(key)) {
      monthMap.set(key, []);
    }
    monthMap.get(key)!.push(entry);
  }

  // Convert map to array of GroupedMonthData
  const grouped: GroupedMonthData[] = [];

  for (const [, entries] of monthMap) {
    // Filter out paused entries for calculations
    const activeEntries = entries.filter(e => e.source !== 'paused');

    // If all entries are paused, still include the month but with null/zero values
    const isPaused = activeEntries.length === 0;

    const firstEntry = entries[0];

    // Sum up all metrics from active entries
    const impressions = activeEntries.reduce((sum, e) => sum + (e.impressions || 0), 0);
    const clicks = activeEntries.reduce((sum, e) => sum + (e.clicks || 0), 0);
    const spend = activeEntries.reduce((sum, e) => sum + (e.spend || 0), 0);
    const conversions = activeEntries.reduce((sum, e) => sum + (e.conversions || 0), 0);
    const conversionValue = activeEntries.reduce((sum, e) => sum + (e.conversionValue || 0), 0);

    // Calculate CPA and ROAS from combined values
    const cpa = conversions > 0 ? spend / conversions : 0;
    const roas = spend > 0 ? conversionValue / spend : 0;

    grouped.push({
      month: firstEntry.month,
      year: firstEntry.year,
      monthIndex: firstEntry.monthIndex,
      impressions: isPaused ? 0 : impressions,
      clicks: isPaused ? 0 : clicks,
      spend: isPaused ? 0 : spend,
      conversions: isPaused ? 0 : conversions,
      conversionValue: isPaused ? 0 : conversionValue,
      cpa: isPaused ? 0 : cpa,
      roas: isPaused ? 0 : roas,
      momGrowth: null, // Will be calculated after sorting
      breakdown: entries,
      isExpanded: false,
    });
  }

  // Sort by date (year, monthIndex) for proper MOM calculation
  grouped.sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.monthIndex - b.monthIndex;
  });

  // Calculate MOM growth based on combined conversion values
  for (let i = 1; i < grouped.length; i++) {
    const current = grouped[i];
    const previous = grouped[i - 1];

    // Skip MOM for paused months
    const currentPaused = current.breakdown.every(e => e.source === 'paused');
    const previousPaused = previous.breakdown.every(e => e.source === 'paused');

    if (!currentPaused && !previousPaused && previous.conversionValue > 0) {
      current.momGrowth = calculateMOMGrowth(current.conversionValue, previous.conversionValue);
    }
  }

  return grouped;
}

/**
 * Sorts grouped data by the specified field and direction
 */
export function sortGroupedData(data: GroupedMonthData[], config: SortConfig): GroupedMonthData[] {
  const sorted = [...data];

  sorted.sort((a, b) => {
    let aVal: number;
    let bVal: number;

    switch (config.field) {
      case 'month':
        // Sort by year then monthIndex
        if (a.year !== b.year) {
          aVal = a.year;
          bVal = b.year;
        } else {
          aVal = a.monthIndex;
          bVal = b.monthIndex;
        }
        break;
      case 'impressions':
        aVal = a.impressions;
        bVal = b.impressions;
        break;
      case 'clicks':
        aVal = a.clicks;
        bVal = b.clicks;
        break;
      case 'spend':
        aVal = a.spend;
        bVal = b.spend;
        break;
      case 'conversions':
        aVal = a.conversions;
        bVal = b.conversions;
        break;
      case 'conversionValue':
        aVal = a.conversionValue;
        bVal = b.conversionValue;
        break;
      case 'cpa':
        aVal = a.cpa;
        bVal = b.cpa;
        break;
      case 'roas':
        aVal = a.roas;
        bVal = b.roas;
        break;
      case 'momGrowth':
        // Handle null values - put them at the end
        aVal = a.momGrowth ?? (config.direction === 'asc' ? Infinity : -Infinity);
        bVal = b.momGrowth ?? (config.direction === 'asc' ? Infinity : -Infinity);
        break;
      default:
        aVal = 0;
        bVal = 0;
    }

    if (config.direction === 'asc') {
      return aVal - bVal;
    } else {
      return bVal - aVal;
    }
  });

  return sorted;
}
