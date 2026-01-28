'use client';

import { useState } from 'react';
import Image from 'next/image';
import { monthlyData } from '@/lib/data';
import { calculateKPIs, filterDataByYear, filterDataByPlatform } from '@/lib/calculations';
import { PlatformFilter } from '@/lib/types';
import { MetricsCards } from './MetricsCards';
import { YearMonthFilter } from './YearMonthFilter';
import { PlatformTabs } from './PlatformTabs';
import { PerformanceChart } from './PerformanceChart';
import { DataTable } from './DataTable';

export function Dashboard() {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformFilter>('all');

  const yearFilteredData = filterDataByYear(monthlyData, selectedYear);
  const filteredData = filterDataByPlatform(yearFilteredData, selectedPlatform);
  const metrics = calculateKPIs(filteredData);

  const totalActiveMonths = filteredData.filter((d) => d.source !== 'paused').length;
  const pausedMonths = filteredData.filter((d) => d.source === 'paused').length;
  const shopifyMonths = filteredData.filter((d) => d.source === 'shopify').length;
  const metaMonths = filteredData.filter((d) => d.source === 'meta_ads').length;

  return (
    <div className="min-h-screen bg-[#0b2430]">
      {/* Header */}
      <header className="bg-[#132d3d] border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Logo */}
              <img
                src="https://cdn.shopify.com/s/files/1/0828/1214/1878/files/Stone-Crab-Whosale-Logo-Hori-white.png?v=1694444071"
                alt="Stone Crab Wholesale"
                className="h-12 w-auto"
              />
              <div className="border-l border-white/20 pl-6">
                <h1 className="text-3xl font-bold text-white tracking-wide">
                  Paid Media Report
                </h1>
                <p className="text-sm text-[#7a8f9d] mt-1">
                  Google Ads Performance | Nov 2024 - Jan 2026
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="bg-[#1a3648] px-3 py-1.5 rounded-lg text-white border border-white/10">
                {totalActiveMonths} active months
              </div>
              {pausedMonths > 0 && (
                <div className="bg-[#1a3648] px-3 py-1.5 rounded-lg text-[#7a8f9d] border border-white/10">
                  {pausedMonths} paused
                </div>
              )}
              {shopifyMonths > 0 && (
                <div className="bg-[#EC6A2A]/20 px-3 py-1.5 rounded-lg text-[#EC6A2A] border border-[#EC6A2A]/30">
                  {shopifyMonths} Shopify
                </div>
              )}
              {metaMonths > 0 && (
                <div className="bg-[#9b59b6]/20 px-3 py-1.5 rounded-lg text-[#9b59b6] border border-[#9b59b6]/30">
                  {metaMonths} Meta
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <YearMonthFilter selectedYear={selectedYear} onYearChange={setSelectedYear} />
        <PlatformTabs selectedPlatform={selectedPlatform} onPlatformChange={setSelectedPlatform} />

        <MetricsCards metrics={metrics} />

        <DataTable data={filteredData} />

        <PerformanceChart data={filteredData} />

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-[#7a8f9d]">
          <p>
            Data sources: Google Ads (Nov 2024 - Jun 2025, Dec 2025 - Jan 2026) |
            Shopify Attribution (Oct - Nov 2025) | Meta Ads (Jan 2024 - Jan 2026)
          </p>
          <p className="mt-1">
            Jul - Sep 2025: Campaign paused for seasonal product
          </p>
        </footer>
      </main>
    </div>
  );
}
