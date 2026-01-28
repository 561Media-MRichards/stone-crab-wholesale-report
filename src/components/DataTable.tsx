'use client';

import { MonthlyData } from '@/lib/types';
import { formatCurrency, formatNumber, calculateMOMGrowth, formatPercent } from '@/lib/calculations';

interface DataTableProps {
  data: MonthlyData[];
}

export function DataTable({ data }: DataTableProps) {
  const dataWithMOM = data.map((item, index) => {
    const previous = index > 0 ? data[index - 1] : null;
    const momGrowth =
      previous && previous.source !== 'paused' && item.source !== 'paused'
        ? calculateMOMGrowth(item.conversionValue, previous.conversionValue)
        : null;
    return { ...item, momGrowth };
  });

  return (
    <div className="bg-[#132d3d] rounded-xl border border-white/10 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white tracking-wide">Monthly Breakdown</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-[#1a3648]">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Month
              </th>
              <th className="px-4 py-4 text-left text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Source
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#54baf8] uppercase tracking-wider">
                Ad Spend
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Conversions
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                Revenue
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#EC6A2A] uppercase tracking-wider">
                CPA
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                ROAS
              </th>
              <th className="px-4 py-4 text-right text-xs font-semibold text-[#7a8f9d] uppercase tracking-wider">
                MOM Growth
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {dataWithMOM.map((row) => {
              const isPaused = row.source === 'paused';
              const isShopify = row.source === 'shopify';
              const isMeta = row.source === 'meta_ads';

              // Calculate per-row metrics
              const cpa = row.conversions && row.spend
                ? row.spend / row.conversions
                : null;
              const roas = row.spend && row.conversionValue
                ? row.conversionValue / row.spend
                : null;

              return (
                <tr
                  key={`${row.month}-${row.source}`}
                  className={`transition-colors ${
                    isPaused
                      ? 'bg-[#1a3648]/30'
                      : isShopify
                      ? 'bg-[#EC6A2A]/5 hover:bg-[#EC6A2A]/10'
                      : isMeta
                      ? 'bg-[#9b59b6]/5 hover:bg-[#9b59b6]/10'
                      : 'hover:bg-[#1a3648]/50'
                  }`}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {row.month}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    {isPaused ? (
                      <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#1a3648] text-[#7a8f9d] border border-white/10">
                        Paused
                      </span>
                    ) : isShopify ? (
                      <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#EC6A2A]/20 text-[#EC6A2A] border border-[#EC6A2A]/30">
                        Shopify
                      </span>
                    ) : isMeta ? (
                      <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#9b59b6]/20 text-[#9b59b6] border border-[#9b59b6]/30">
                        Meta Ads
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 text-xs rounded-full bg-[#54baf8]/20 text-[#54baf8] border border-[#54baf8]/30">
                        Google Ads
                      </span>
                    )}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                    {isPaused ? '—' : formatNumber(row.impressions || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                    {isPaused ? '—' : formatNumber(row.clicks || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-[#54baf8]'}`}>
                    {isPaused ? '—' : formatCurrency(row.spend || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                    {isPaused ? '—' : formatNumber(row.conversions || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-semibold ${isPaused ? 'text-[#7a8f9d]' : 'text-white'}`}>
                    {isPaused ? '—' : formatCurrency(row.conversionValue || 0)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-[#EC6A2A]'}`}>
                    {isPaused || cpa === null ? '—' : formatCurrency(cpa)}
                  </td>
                  <td className={`px-4 py-4 whitespace-nowrap text-sm text-right font-medium ${isPaused ? 'text-[#7a8f9d]' : 'text-emerald-400'}`}>
                    {isPaused || roas === null ? '—' : `${roas.toFixed(2)}x`}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
