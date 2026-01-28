'use client';

import { availableYears } from '@/lib/data';

interface YearMonthFilterProps {
  selectedYear: number | 'all';
  onYearChange: (year: number | 'all') => void;
}

export function YearMonthFilter({ selectedYear, onYearChange }: YearMonthFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-[#132d3d] rounded-xl border border-white/10">
      <div className="flex items-center gap-3">
        <label htmlFor="year-select" className="text-sm font-medium text-[#7a8f9d] uppercase tracking-wide">
          Year:
        </label>
        <select
          id="year-select"
          value={selectedYear}
          onChange={(e) => onYearChange(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          className="px-4 py-2 bg-[#1a3648] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EC6A2A] focus:border-transparent cursor-pointer hover:bg-[#1a3648]/80 transition-colors"
        >
          <option value="all">All Years</option>
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-4 text-sm ml-auto">
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#54baf8]"></span>
          <span className="text-[#7a8f9d]">Google Ads</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#9b59b6]"></span>
          <span className="text-[#7a8f9d]">Meta Ads</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#EC6A2A]"></span>
          <span className="text-[#7a8f9d]">Shopify Data</span>
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7a8f9d]"></span>
          <span className="text-[#7a8f9d]">Paused</span>
        </span>
      </div>
    </div>
  );
}
