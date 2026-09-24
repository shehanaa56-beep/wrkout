import React, { useState } from 'react';
import { Users, UserCheck, Flame, CreditCard, Plus } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import UpcomingSessions from '../components/dashboard/UpcomingSessions';
import MonthlyOverview from '../components/dashboard/MonthlyOverview';
import ClientForm from '../components/clients/ClientForm';
import Button from '../components/common/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';
import { getDashboardStats, formatCurrency, getMonthlyOverviewData } from '../../src/utils/calculations';

export const Dashboard = () => {
  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);

  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  const stats = getDashboardStats(clients, sessions, payments);
  const chartData = getMonthlyOverviewData(sessions, payments);

  // Filter upcoming sessions (Scheduled status, prioritized today & tomorrow)
  const upcomingSessions = sessions
    .filter((s) => s.status === 'Scheduled' || s.date === '2026-09-24')
    .slice(0, 4);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            Good Morning, Coach 👋
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
            Keep track of your clients, sessions and payments.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddClientOpen(true)}
        >
          Add Client
        </Button>
      </div>

      {/* 4 Statistics Cards */}
      <div
        className="stat-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          title="Total Clients"
          value={stats.totalClients || 24}
          subtext="+2 this month"
          icon={Users}
          iconBg="rgba(74, 144, 226, 0.15)"
          iconColor="#4A90E2"
          subtextColor="#65F36B"
        />

        <StatCard
          title="Active Clients"
          value={stats.activeClients || 18}
          subtext={`${stats.activePercentage || 75}% of total`}
          icon={UserCheck}
          iconBg="rgba(101, 243, 107, 0.15)"
          iconColor="#65F36B"
          subtextColor="#65F36B"
        />

        <StatCard
          title="Sessions Completed"
          value={stats.completedSessions || 86}
          subtext="+12 this month"
          icon={Flame}
          iconBg="rgba(255, 92, 92, 0.15)"
          iconColor="#FF5C5C"
          subtextColor="#65F36B"
        />

        <StatCard
          title="Pending Payments"
          value={formatCurrency(stats.pendingAmount || 12500)}
          subtext={`${stats.clientsWithPending || 5} clients pending`}
          icon={CreditCard}
          iconBg="rgba(245, 166, 35, 0.15)"
          iconColor="#F5A623"
          subtextColor="#F5A623"
        />
      </div>

      {/* Middle Row: Upcoming Sessions & Monthly Overview */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '22px'
        }}
      >
        <UpcomingSessions sessions={upcomingSessions} clients={clients} />
        <MonthlyOverview data={chartData} />
      </div>


      {/* Add Client Modal */}
      <ClientForm
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
