'use client';

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { MonthlyData } from '@/lib/types';
import { formatCurrency, formatNumber } from '@/lib/calculations';

interface PerformanceChartProps {
  data: MonthlyData[];
}

const getBarColor = (source: string) => {
  switch (source) {
    case 'google_ads':
      return '#54baf8';
    case 'meta_ads':
      return '#9b59b6';
    case 'shopify':
      return '#EC6A2A';
    case 'paused':
      return '#1a3648';
    default:
      return '#54baf8';
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0]?.payload;
    return (
      <div className="bg-[#132d3d] p-4 border border-white/10 rounded-xl shadow-xl">
        <p className="font-semibold text-white mb-2">{label}</p>
        {data.source === 'paused' ? (
          <p className="text-[#7a8f9d] italic">Campaign Paused (Seasonal)</p>
        ) : (
          <>
            <p className="text-sm">
              <span className="text-[#7a8f9d]">Revenue:</span>{' '}
              <span className="font-medium text-white">{formatCurrency(data.conversionValue || 0)}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#7a8f9d]">Conversions:</span>{' '}
              <span className="font-medium text-white">{formatNumber(data.conversions || 0)}</span>
            </p>
            <p className="text-sm">
              <span className="text-[#7a8f9d]">Impressions:</span>{' '}
              <span className="font-medium text-white">{formatNumber(data.impressions || 0)}</span>
            </p>
            <p className="text-sm mt-2">
              <span className={`inline-block px-2 py-0.5 rounded text-xs ${
                data.source === 'shopify'
                  ? 'bg-[#EC6A2A]/20 text-[#EC6A2A]'
                  : data.source === 'meta_ads'
                  ? 'bg-[#9b59b6]/20 text-[#9b59b6]'
                  : 'bg-[#54baf8]/20 text-[#54baf8]'
              }`}>
                {data.source === 'shopify' ? 'Shopify Data' : data.source === 'meta_ads' ? 'Meta Ads' : 'Google Ads'}
              </span>
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  const chartData = data.map((d) => ({
    ...d,
    shortMonth: d.month.split(' ')[0].slice(0, 3) + ' ' + d.month.split(' ')[1].slice(2),
    displayValue: d.source === 'paused' ? 0 : d.conversionValue,
    displayConversions: d.source === 'paused' ? 0 : d.conversions,
  }));

  return (
    <div className="bg-[#132d3d] p-6 rounded-xl border border-white/10 mb-8">
      <h2 className="text-xl font-bold text-white mb-6 tracking-wide">Monthly Performance</h2>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="shortMonth"
              tick={{ fontSize: 12, fill: '#7a8f9d' }}
              angle={-45}
              textAnchor="end"
              height={60}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 12, fill: '#7a8f9d' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              label={{ value: 'Revenue', angle: -90, position: 'insideLeft', fontSize: 12, fill: '#7a8f9d' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: '#7a8f9d' }}
              label={{ value: 'Conversions', angle: 90, position: 'insideRight', fontSize: 12, fill: '#7a8f9d' }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span style={{ color: '#7a8f9d' }}>{value}</span>}
            />
            <Bar
              yAxisId="left"
              dataKey="displayValue"
              name="Revenue"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.source)} />
              ))}
            </Bar>
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="displayConversions"
              name="Conversions"
              stroke="#ff7a3a"
              strokeWidth={3}
              dot={{ fill: '#ff7a3a', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#ff7a3a' }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
