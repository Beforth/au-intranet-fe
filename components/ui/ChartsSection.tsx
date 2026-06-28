
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { CHART_DATA } from '../../constants';

const formatYAxisValue = (value: number) => {
  if (value >= 1_00_00_000) {
    return `₹${(value / 1_00_00_000).toFixed(1)} Cr`;
  }
  if (value >= 1_00_000) {
    return `₹${(value / 1_00_000).toFixed(0)} L`;
  }
  if (value >= 1_000) {
    return `₹${(value / 1_000).toFixed(0)} K`;
  }
  return String(value);
};

export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-xl shadow-xl">
        {label && (
          <p className="text-xs font-semibold text-slate-500 mb-2 pb-2 border-b border-slate-100">
            {label}
          </p>
        )}
        <div className="space-y-1.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color || entry.fill }} />
                <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">{entry.name || entry.dataKey}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {typeof entry.value === 'number' && entry.value < 1000 && entry.value % 1 !== 0 
                  ? entry.value.toFixed(2) 
                  : typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const RevenueChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 15, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            dy={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            tickFormatter={formatYAxisValue}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e2e8f0', strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const SalesTargetChart: React.FC = () => {
  return (
    <div className="h-[300px] w-full pt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={CHART_DATA} margin={{ top: 10, right: 20, left: 15, bottom: 0 }} barGap={8}>
          <defs>
            <linearGradient id="targetChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#cbd5e1" stopOpacity={0.4} />
            </linearGradient>
            <linearGradient id="achievedChartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.95} />
              <stop offset="100%" stopColor="#2563eb" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            dy={12}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
            tickFormatter={formatYAxisValue}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Legend 
            verticalAlign="top" 
            align="right" 
            iconType="circle"
            iconSize={6}
            wrapperStyle={{ fontSize: '10px', fontWeight: 600, color: '#64748b', paddingBottom: '20px' }}
          />
          <Bar dataKey="target" name="Target" fill="url(#targetChartGrad)" radius={[4, 4, 0, 0]} barSize={18} />
          <Bar dataKey="revenue" name="Achieved" fill="url(#achievedChartGrad)" radius={[4, 4, 0, 0]} barSize={18} animationDuration={2000} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
