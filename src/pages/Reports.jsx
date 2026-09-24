import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { Users, TrendingUp, Calendar, Award, DollarSign } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';
import { formatCurrency } from '../utils/calculations';

export const Reports = () => {
  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);

  // 1. Client Growth Data
  const growthData = [
    { month: 'Apr', clients: 8, active: 7 },
    { month: 'May', clients: 12, active: 10 },
    { month: 'Jun', clients: 15, active: 13 },
    { month: 'Jul', clients: 19, active: 16 },
    { month: 'Aug', clients: 22, active: 18 },
    { month: 'Sep', clients: 24, active: 19 }
  ];

  // 2. Sessions by Month
  const sessionChartData = [
    { month: 'Apr', completed: 42, missed: 4 },
    { month: 'May', completed: 58, missed: 5 },
    { month: 'Jun', completed: 64, missed: 3 },
    { month: 'Jul', completed: 76, missed: 6 },
    { month: 'Aug', completed: 82, missed: 4 },
    { month: 'Sep', completed: 86, missed: 5 }
  ];

  // 3. Revenue Trend
  const revenueData = [
    { month: 'Apr', revenue: 16000 },
    { month: 'May', revenue: 21000 },
    { month: 'Jun', revenue: 24500 },
    { month: 'Jul', revenue: 26000 },
    { month: 'Aug', revenue: 27200 },
    { month: 'Sep', revenue: 28500 }
  ];

  // 4. Client Status Breakdown
  const activeCount = clients.filter((c) => c.status === 'Active').length || 18;
  const inactiveCount = clients.filter((c) => c.status === 'Inactive').length || 3;
  const completedCount = clients.filter((c) => c.status === 'Completed').length || 3;

  const statusDonutData = [
    { name: 'Active', value: activeCount, color: '#65F36B' },
    { name: 'Inactive', value: inactiveCount, color: '#FF5C5C' },
    { name: 'Completed', value: completedCount, color: '#4A90E2' }
  ];

  // 5. Training Type Breakdown
  const typeMap = {};
  clients.forEach((c) => {
    const t = c.trainingType || 'Personal Training';
    typeMap[t] = (typeMap[t] || 0) + 1;
  });
  const typeChartData = Object.entries(typeMap).map(([type, count]) => ({
    type,
    count
  }));

  const tooltipStyle = {
    backgroundColor: '#151C20',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    color: '#FFFFFF',
    fontSize: '12px'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Reports & Analytics
        </h1>
        <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
          Insights on client growth, attendance rate, and revenue performance
        </p>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          title="Retention Rate"
          value="88.5%"
          subtext="+4.2% this quarter"
          icon={Award}
          iconBg="rgba(101, 243, 107, 0.15)"
          iconColor="#65F36B"
        />

        <StatCard
          title="Session Attendance"
          value="94.2%"
          subtext="High client compliance"
          icon={Calendar}
          iconBg="rgba(74, 144, 226, 0.15)"
          iconColor="#4A90E2"
        />

        <StatCard
          title="Avg Revenue / Client"
          value="₹11,875"
          subtext="+8% year over year"
          icon={DollarSign}
          iconBg="rgba(245, 166, 35, 0.15)"
          iconColor="#F5A623"
        />

        <StatCard
          title="Total Workouts Logged"
          value={sessions.length > 0 ? `${sessions.length} hrs` : '86 hrs'}
          subtext="Coached on the floor"
          icon={TrendingUp}
          iconBg="rgba(167, 139, 250, 0.15)"
          iconColor="#A78BFA"
        />
      </div>

      {/* Grid of 4 Charts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '22px'
        }}
      >
        {/* Chart 1: Client Growth */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Client Growth (Total vs Active)</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#8B949E" fontSize={12} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="clients" name="Total Clients" stroke="#4A90E2" strokeWidth={2.5} />
                <Line type="monotone" dataKey="active" name="Active Clients" stroke="#65F36B" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Sessions Completed vs Missed */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Monthly Sessions (Completed vs Missed)</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sessionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="#8B949E" fontSize={12} tickLine={false} />
                <YAxis stroke="#8B949E" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="completed" name="Completed" fill="#65F36B" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Bar dataKey="missed" name="Missed" fill="#FF5C5C" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Revenue Trend */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Monthly Revenue Trend (₹)</h3>
          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65F36B" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#65F36B" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="month" stroke="#8B949E" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#8B949E"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  formatter={(val) => [formatCurrency(val), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#65F36B" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Client Status Donut */}
        <div style={chartCardStyle}>
          <h3 style={chartTitleStyle}>Client Status Distribution</h3>
          <div style={{ width: '100%', height: '260px', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDonutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusDonutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const chartCardStyle = {
  backgroundColor: '#11171B',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '16px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column'
};

const chartTitleStyle = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#FFFFFF',
  marginBottom: '16px'
};

export default Reports;
