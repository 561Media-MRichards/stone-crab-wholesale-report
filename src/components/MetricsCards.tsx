'use client';

import { KPIMetrics } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';

interface MetricsCardsProps {
  metrics: KPIMetrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  // Primary acquisition metrics - highlighted prominently
  const primaryCards = [
    {
      label: 'Revenue Generated',
      value: formatCurrency(metrics.totalConversionValue),
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      highlight: 'green',
    },
    {
      label: 'Cost Per Acquisition',
      value: formatCurrency(metrics.cpa),
      subtext: 'per conversion',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      highlight: 'orange',
    },
    {
      label: 'Return on Ad Spend',
      value: `${metrics.roas.toFixed(2)}x`,
      subtext: 'ROAS',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      highlight: 'green',
    },
  ];

  // Secondary metrics
  const secondaryCards = [
    {
      label: 'Total Ad Spend',
      value: formatCurrency(metrics.totalSpend),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Conversions',
      value: formatNumber(metrics.totalConversions),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Total Clicks',
      value: formatNumber(metrics.totalClicks),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
        </svg>
      ),
    },
    {
      label: 'Total Impressions',
      value: formatNumber(metrics.totalImpressions),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: 'Avg Order Value',
      value: formatCurrency(metrics.avgOrderValue),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      label: 'Conversion Rate',
      value: `${metrics.avgConversionRate.toFixed(2)}%`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  const getHighlightClasses = (highlight?: string) => {
    switch (highlight) {
      case 'orange':
        return {
          bg: 'bg-[#EC6A2A]/10 border-[#EC6A2A]/40',
          icon: 'text-[#EC6A2A]',
          value: 'text-[#EC6A2A]',
        };
      case 'green':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/40',
          icon: 'text-emerald-400',
          value: 'text-emerald-400',
        };
      case 'blue':
        return {
          bg: 'bg-[#54baf8]/10 border-[#54baf8]/40',
          icon: 'text-[#54baf8]',
          value: 'text-[#54baf8]',
        };
      default:
        return {
          bg: 'bg-[#132d3d] border-white/10',
          icon: 'text-[#54baf8]',
          value: 'text-white',
        };
    }
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Primary Acquisition Metrics */}
      <div>
        <h3 className="text-sm font-medium text-[#7a8f9d] uppercase tracking-wide mb-3">
          Acquisition Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {primaryCards.map((card) => {
            const classes = getHighlightClasses(card.highlight);
            return (
              <div
                key={card.label}
                className={`rounded-xl p-5 border transition-all hover:border-white/30 ${classes.bg}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={classes.icon}>{card.icon}</div>
                  <p className="text-sm text-[#7a8f9d] uppercase tracking-wide">{card.label}</p>
                </div>
                <p className={`text-3xl font-bold ${classes.value}`}>{card.value}</p>
                {card.subtext && (
                  <p className="text-xs text-[#7a8f9d] mt-1">{card.subtext}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Secondary Metrics */}
      <div>
        <h3 className="text-sm font-medium text-[#7a8f9d] uppercase tracking-wide mb-3">
          Performance Details
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {secondaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl p-4 border bg-[#132d3d] border-white/10 transition-all hover:border-white/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="text-[#54baf8]">{card.icon}</div>
                <p className="text-xs text-[#7a8f9d] uppercase tracking-wide">{card.label}</p>
              </div>
              <p className="text-xl font-bold text-white">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
