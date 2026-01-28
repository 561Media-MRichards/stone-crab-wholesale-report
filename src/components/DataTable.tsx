'use client';

import { useState, useMemo } from 'react';
import { MonthlyData, SortConfig, SortField, SortDirection, GroupedMonthData } from '@/lib/types';
import { formatCurrency, formatNumber, formatPercent, groupDataByMonth, sortGroupedData } from '@/lib/calculations';
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface DataTableProps {
  data: MonthlyData[];
}

interface SortableHeaderProps {
  field: SortField;
  label: string;
  sortConfig: SortConfig;
  onSort: (field: SortField) => void;
  align?: 'left' | 'right';
  colorClass?: string;
}

function SortableHeader({ field, label, sortConfig, onSort, align = 'right', colorClass = 'text-[#7a8f9d]' }: SortableHeaderProps) {
  const isActive = sortConfig.field === field;

  return (
    <th
      className={`px-4 py-4 text-${align} text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#132d3d] transition-colors select-none ${colorClass}`}
      onClick={() => onSort(field)}
    >
      <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
        <span>{label}</span>
        <span className="w-4 h-4 flex items-center justify-center">
          {isActive ? (
            sortConfig.direction === 'desc' ? (
              <ArrowDown className="w-3 h-3" />
            ) : (
              <ArrowUp className="w-3 h-3" />
            )
          ) : (
            <span className="w-3 h-3 opacity-0 group-hover:opacity-50">
              <ArrowDown className="w-3 h-3" />
            </span>
          )}
        </span>
      </div>
    </th>
  );
}

function PlatformBadge({ source }: { source: string }) {
  switch (source) {
    case 'paused':
      return (
        <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#1a3648] text-[#7a8f9d] border border-white/10">
          Paused
        </span>
      );
    case 'shopify':
      return (
        <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#EC6A2A]/20 text-[#EC6A2A] border border-[#EC6A2A]/30">
          Shopify
        </span>
      );
    case 'meta_ads':
      return (
        <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]/30">
          Meta Ads
        </span>
      );
    case 'google_ads':
    default:
      return (
        <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#54baf8]/20 text-[#54baf8] border border-[#54baf8]/30">
          Google Ads
        </span>
      );
  }
}

function getPlatformBorderColor(source: string): string {
  switch (source) {
    case 'meta_ads':
      return 'border-l-[#9b59b6]';
    case 'shopify':
      return 'border-l-[#EC6A2A]';
    case 'google_ads':
      return 'border-l-[#54baf8]';
    default:
      return 'border-l-[#7a8f9d]';
  }
}

export function DataTable({ data }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'month',
    direction: 'asc',
  });
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  // Group and sort data
  const groupedData = useMemo(() => {
    const grouped = groupDataByMonth(data);
    return sortGroupedData(grouped, sortConfig);
  }, [data, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig((prev) => {
      if (prev.field === field) {
        // Toggle direction
        return {
          field,
          direction: prev.direction === 'desc' ? 'asc' : 'desc',
        };
      }
      // New field - start with descending (highest first)
      return { field, direction: 'desc' };
    });
  };

  const toggleExpand = (monthKey: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(monthKey)) {
        next.delete(monthKey);
      } else {
        next.add(monthKey);
      }
      return next;
    });
  };

  const getMonthKey = (row: GroupedMonthData) => `${row.year}-${row.monthIndex}`;

  return (
    <div className="bg-[#132d3d] rounded-xl border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-wide">Monthly Breakdown</h2>
        <p className="text-sm text-[#7a8f9d] mt-1">Click column headers to sort. Click rows with multiple platforms to expand.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#1a3648]">
            <tr>
              <SortableHeader
                field="month"
                label="Month"
                sortConfig={sortConfig}
                onSort={handleSort}
                align="left"
              />
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Source
              </th>
              <SortableHeader
                field="impressions"
                label="Impressions"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                field="clicks"
                label="Clicks"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                field="spend"
                label="Ad Spend"
                sortConfig={sortConfig}
                onSort={handleSort}
                colorClass="text-[#54baf8]"
              />
              <SortableHeader
                field="conversions"
                label="Conversions"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                field="conversionValue"
                label="Revenue"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
              <SortableHeader
                field="cpa"
                label="CPA"
                sortConfig={sortConfig}
                onSort={handleSort}
                colorClass="text-[#EC6A2A]"
              />
              <SortableHeader
                field="roas"
                label="ROAS"
                sortConfig={sortConfig}
                onSort={handleSort}
                colorClass="text-emerald-400"
              />
              <SortableHeader
                field="momGrowth"
                label="MOM Growth"
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {groupedData.map((row) => {
              const monthKey = getMonthKey(row);
              const isExpanded = expandedMonths.has(monthKey);
              const hasMultiplePlatforms = row.breakdown.length > 1;
              const isPaused = row.breakdown.every((e) => e.source === 'paused');

              return (
                <>
                  {/* Parent/Combined Row */}
                  <tr
                    key={monthKey}
                    className={`transition-colors ${
                      isPaused
                        ? 'bg-[#1a3648]/30'
                        : hasMultiplePlatforms
                        ? 'bg-[#1a3648]/40 hover:bg-[#1a3648]/60 cursor-pointer'
                        : 'hover:bg-[#1a3648]/50'
                    } ${hasMultiplePlatforms ? 'font-medium' : ''}`}
                    onClick={() => hasMultiplePlatforms && toggleExpand(monthKey)}
                  >
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-white">
                      <div className="flex items-center gap-2">
                        {hasMultiplePlatforms && (
                          <span className="text-[#7a8f9d]">
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </span>
                        )}
                        <span className={hasMultiplePlatforms ? 'font-semibold' : ''}>
                          {row.month}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      {isPaused ? (
                        <PlatformBadge source="paused" />
                      ) : hasMultiplePlatforms ? (
                        <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-white/10 text-white border border-white/20">
                          Combined ({row.breakdown.filter(e => e.source !== 'paused').length})
                        </span>
                      ) : (
                        <PlatformBadge source={row.breakdown[0].source} />
                      )}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                      {isPaused ? '—' : formatNumber(row.impressions)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                      {isPaused ? '—' : formatNumber(row.clicks)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-[#54baf8]'}`}>
                      {isPaused ? '—' : formatCurrency(row.spend)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                      {isPaused ? '—' : formatNumber(row.conversions)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-semibold ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                      {isPaused ? '—' : formatCurrency(row.conversionValue)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-[#EC6A2A]'}`}>
                      {isPaused || row.cpa === 0 ? '—' : formatCurrency(row.cpa)}
                    </td>
                    <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-emerald-400'}`}>
                      {isPaused || row.roas === 0 ? '—' : `${row.roas.toFixed(2)}x`}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-right">
                      {row.momGrowth !== null ? (
                        <span
                          className={`font-semibold ${
                            row.momGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {formatPercent(row.momGrowth)}
                        </span>
                      ) : (
                        <span className="text-[#7a8f9d]">—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Breakdown Rows */}
                  {isExpanded &&
                    row.breakdown
                      .filter((entry) => entry.source !== 'paused')
                      .map((entry, idx) => {
                        const entryCpa =
                          entry.conversions && entry.spend
                            ? entry.spend / entry.conversions
                            : null;
                        const entryRoas =
                          entry.spend && entry.conversionValue
                            ? entry.conversionValue / entry.spend
                            : null;

                        return (
                          <tr
                            key={`${monthKey}-${entry.source}-${idx}`}
                            className={`bg-[#0b2430]/50 border-l-4 ${getPlatformBorderColor(entry.source)}`}
                          >
                            <td className="px-4 py-3 pl-12 whitespace-nowrap text-sm text-[#b8c7d1]">
                              <span className="opacity-70">{row.month}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <PlatformBadge source={entry.source} />
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#b8c7d1]">
                              {formatNumber(entry.impressions || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#b8c7d1]">
                              {formatNumber(entry.clicks || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#54baf8]/80">
                              {formatCurrency(entry.spend || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#b8c7d1]">
                              {formatNumber(entry.conversions || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#b8c7d1]">
                              {formatCurrency(entry.conversionValue || 0)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#EC6A2A]/80">
                              {entryCpa !== null ? formatCurrency(entryCpa) : '—'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-emerald-400/80">
                              {entryRoas !== null ? `${entryRoas.toFixed(2)}x` : '—'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-[#7a8f9d]">
                              —
                            </td>
                          </tr>
                        );
                      })}
                </>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
