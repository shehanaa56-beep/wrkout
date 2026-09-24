import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/calculations';

const CustomTooltip = ({ active, payload, label, mode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: '#151C20',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '8px',
          padding: '10px 14px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ color: '#FFFFFF', fontWeight: 700, fontSize: '12px', marginBottom: '6px' }}>{label}</div>
        {payload.map((entry, index) => (
          <div
            key={index}
            style={{
              color: entry.color,
              fontSize: '12px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: entry.color
              }}
            />
            <span>
              {entry.name}: {mode === 'Revenue' ? formatCurrency(entry.value) : `${entry.value} sessions`}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const MonthlyOverview = ({ data }) => {
  const [viewMode, setViewMode] = useState('Sessions'); // 'Sessions' | 'Revenue'

  const chartData = data || [
    { week: 'Week 1', sessions: 18, total: 22, revenue: 6200 },
    { week: 'Week 2', sessions: 24, total: 26, revenue: 7800 },
    { week: 'Week 3', sessions: 28, total: 30, revenue: 8500 },
    { week: 'Week 4', sessions: 16, total: 20, revenue: 6000 }
  ];

  return (
    <div
      style={{
        backgroundColor: '#11171B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Header & Toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>This Month Overview</h3>

        {/* Toggle Pills */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#151C20',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <button
            onClick={() => setViewMode('Sessions')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              color: viewMode === 'Sessions' ? '#080B0D' : '#8B949E',
              backgroundColor: viewMode === 'Sessions' ? '#65F36B' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Sessions
          </button>
          <button
            onClick={() => setViewMode('Revenue')}
            style={{
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              color: viewMode === 'Revenue' ? '#080B0D' : '#8B949E',
              backgroundColor: viewMode === 'Revenue' ? '#65F36B' : 'transparent',
              transition: 'all 0.15s ease'
            }}
          >
            Revenue
          </button>
        </div>
      </div>

      {/* Chart */}
      <div style={{ width: '100%', height: '200px', flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" vertical={false} />
            <XAxis
              dataKey="week"
              stroke="#8B949E"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
            />
            <YAxis
              stroke="#8B949E"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (viewMode === 'Revenue' ? `₹${v / 1000}k` : v)}
            />
            <Tooltip content={<CustomTooltip mode={viewMode} />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />

            {viewMode === 'Sessions' ? (
              <>
                <Bar dataKey="sessions" name="Completed" fill="#65F36B" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Bar dataKey="total" name="Scheduled" fill="#243038" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </>
            ) : (
              <Bar dataKey="revenue" name="Revenue" fill="#65F36B" radius={[6, 6, 0, 0]} maxBarSize={36} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Summary */}
      <div
        style={{
          marginTop: '20px',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <div style={{ fontSize: '12px', color: '#8B949E', fontWeight: 600 }}>Revenue</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>₹28,500</div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: 'rgba(101, 243, 107, 0.12)',
            color: '#65F36B',
            padding: '4px 10px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700
          }}
        >
          <TrendingUp size={13} />
          <span>+12% vs last month</span>
        </div>
      </div>
    </div>
  );
};

export default MonthlyOverview;
