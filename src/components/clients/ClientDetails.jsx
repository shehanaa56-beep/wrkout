import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Mail,
  Edit2,
  Plus,
  Trash2,
  TrendingDown,
  TrendingUp,
  Calendar,
  CreditCard,
  CheckCircle2,
  Activity as ActivityIcon,
  Scale
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import SessionTable from '../sessions/SessionTable';
import PaymentTable from '../payments/PaymentTable';
import ActivityTimeline from '../activity/ActivityTimeline';
import SessionForm from '../sessions/SessionForm';
import PaymentForm from '../payments/PaymentForm';
import ClientForm from './ClientForm';
import Modal from '../common/Modal';
import {
  getClientStats,
  formatCurrency,
  formatDate
} from '../../utils/calculations';
import {
  deleteClient,
  addProgress,
  getProgress
} from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

export const ClientDetails = ({
  client,
  sessions = [],
  payments = [],
  progressList = [],
  activities = [],
  allClients = []
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isLogProgressOpen, setIsLogProgressOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // New Progress State
  const [newProgress, setNewProgress] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: client.weight || 60,
    waist: client.measurements?.waist || 28,
    chest: client.measurements?.chest || 34,
    arms: client.measurements?.arms || 12,
    thighs: client.measurements?.thighs || 21,
    bodyFat: client.measurements?.bodyFat || 22,
    notes: ''
  });

  const stats = getClientStats(client, sessions, payments);

  const clientSessions = sessions.filter((s) => s.clientId === client.id);
  const clientPayments = payments.filter((p) => p.clientId === client.id);
  const clientProgress = progressList
    .filter((pr) => pr.clientId === client.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Weight progress calculations
  const startingWeight = client.startingWeight || client.weight || 60;
  const currentWeight = client.weight || 60;
  const weightDiff = +(currentWeight - startingWeight).toFixed(1);

  // Weight chart data
  const chartData = clientProgress.length > 0
    ? clientProgress.map((pr) => ({
        date: formatDate(pr.date),
        weight: Number(pr.weight)
      }))
    : [
        { date: 'Intake', weight: startingWeight },
        { date: 'Current', weight: currentWeight }
      ];

  const handleDeleteClient = () => {
    deleteClient(client.id);
    showToast(`✓ Client ${client.name} deleted successfully!`, 'info');
    navigate('/clients');
  };

  const handleSaveProgress = (e) => {
    e.preventDefault();
    addProgress({
      clientId: client.id,
      date: newProgress.date,
      weight: Number(newProgress.weight),
      waist: Number(newProgress.waist),
      chest: Number(newProgress.chest),
      arms: Number(newProgress.arms),
      thighs: Number(newProgress.thighs),
      bodyFat: Number(newProgress.bodyFat),
      notes: newProgress.notes
    });
    showToast('✓ Progress logged successfully!', 'success');
    setIsLogProgressOpen(false);
  };

  const tabs = ['Overview', 'Sessions', 'Payments', 'Progress', 'Activity'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 1. Profile Header Card */}
      <div
        style={{
          backgroundColor: '#11171B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <img
            src={client.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(client.name)}`}
            alt={client.name}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid rgba(101, 243, 107, 0.4)'
            }}
          />

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
                {client.name}
              </h2>
              <Badge status={client.status} />
            </div>

            <div style={{ fontSize: '14px', color: '#65F36B', fontWeight: 600, marginBottom: '8px' }}>
              {client.trainingType}
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '13px',
                color: '#8B949E'
              }}
            >
              {client.phone && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="#65F36B" /> {client.phone}
                </span>
              )}
              {client.email && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="#65F36B" /> {client.email}
                </span>
              )}
              {client.age && <span>{client.age} years</span>}
              {client.height && <span>{client.height} cm</span>}
              {client.weight && <span>{client.weight} kg</span>}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <Button
            variant="secondary"
            size="md"
            icon={Edit2}
            onClick={() => setIsEditClientOpen(true)}
          >
            Edit Client
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setIsAddSessionOpen(true)}
          >
            + Add Session
          </Button>

          <Button
            variant="primary"
            size="md"
            icon={CreditCard}
            onClick={() => setIsAddPaymentOpen(true)}
          >
            + Payment
          </Button>

          <Button
            variant="danger"
            size="md"
            icon={Trash2}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {/* 2. Six Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '14px'
        }}
      >
        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Total Sessions</span>
          <span style={summaryValueStyle}>{stats.totalSessions}</span>
        </div>

        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Completed</span>
          <span style={{ ...summaryValueStyle, color: '#65F36B' }}>{stats.completedSessions}</span>
        </div>

        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Remaining</span>
          <span style={summaryValueStyle}>{stats.remainingSessions}</span>
        </div>

        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Total Package</span>
          <span style={summaryValueStyle}>{formatCurrency(stats.totalPackage)}</span>
        </div>

        <div style={summaryCardStyle}>
          <span style={summaryLabelStyle}>Total Paid</span>
          <span style={{ ...summaryValueStyle, color: '#65F36B' }}>{formatCurrency(stats.totalPaid)}</span>
        </div>

        <div style={{ ...summaryCardStyle, borderColor: 'rgba(245, 166, 35, 0.25)' }}>
          <span style={summaryLabelStyle}>Balance</span>
          <span style={{ ...summaryValueStyle, color: stats.balance > 0 ? '#F5A623' : '#65F36B' }}>
            {formatCurrency(stats.balance)}
          </span>
        </div>
      </div>

      {/* 3. Client Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          gap: '8px',
          overflowX: 'auto'
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 18px',
                fontSize: '14px',
                fontWeight: 600,
                color: isActive ? '#65F36B' : '#8B949E',
                borderBottom: isActive ? '2px solid #65F36B' : '2px solid transparent',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 4. Tab Content */}
      {activeTab === 'Overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Left: Session History Preview */}
          <div
            style={{
              backgroundColor: '#11171B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '22px'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Session History</h3>
              <Button size="sm" icon={Plus} onClick={() => setIsAddSessionOpen(true)}>
                Add Session
              </Button>
            </div>

            <SessionTable sessions={clientSessions} compact={true} />
          </div>

          {/* Right: Payment Summary & Recent Payments */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Payment Summary Circular Progress */}
            <div
              style={{
                backgroundColor: '#11171B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '22px'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}
              >
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Payment Summary</h3>
                <Button size="sm" icon={Plus} onClick={() => setIsAddPaymentOpen(true)}>
                  Add Payment
                </Button>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  padding: '16px 0',
                  gap: '16px'
                }}
              >
                {/* Donut SVG Indicator */}
                <div style={{ position: 'relative', width: '110px', height: '110px' }}>
                  <svg width="110" height="110" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#1A2328"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke="#65F36B"
                      strokeWidth="10"
                      strokeDasharray="251.2"
                      strokeDashoffset={
                        251.2 - (251.2 * (stats.totalPackage > 0 ? stats.totalPaid / stats.totalPackage : 0))
                      }
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF' }}>
                      {stats.totalPackage > 0 ? Math.round((stats.totalPaid / stats.totalPackage) * 100) : 0}%
                    </span>
                    <span style={{ fontSize: '10px', color: '#65F36B', fontWeight: 600 }}>Paid</span>
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#8B949E' }}>Paid Amount</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#65F36B' }}>
                      {formatCurrency(stats.totalPaid)}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '12px', color: '#8B949E' }}>Pending Balance</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#F5A623' }}>
                      {formatCurrency(stats.balance)}
                    </div>
                  </div>

                  <div style={{ paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>Total Package</div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                      {formatCurrency(stats.totalPackage)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Payments List */}
            <div
              style={{
                backgroundColor: '#11171B',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '22px'
              }}
            >
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '14px' }}>
                Recent Payments
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {clientPayments.slice(0, 4).map((pay) => (
                  <div
                    key={pay.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      backgroundColor: '#151C20',
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.04)'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                        {formatCurrency(pay.amount)}{' '}
                        <span style={{ fontSize: '11px', color: '#8B949E', fontWeight: 400 }}>
                          ({pay.sessionNumber || 'Payment'})
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '2px' }}>
                        {formatDate(pay.date)} • {pay.method}
                      </div>
                    </div>
                    <Badge status={pay.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Sessions' && (
        <div
          style={{
            backgroundColor: '#11171B',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>All Sessions</h3>
              <p style={{ fontSize: '13px', color: '#8B949E', marginTop: '2px' }}>
                Total {clientSessions.length} recorded workouts
              </p>
            </div>
            <Button icon={Plus} onClick={() => setIsAddSessionOpen(true)}>
              Schedule Session
            </Button>
          </div>
          <SessionTable sessions={clientSessions} />
        </div>
      )}

      {activeTab === 'Payments' && (
        <div
          style={{
            backgroundColor: '#11171B',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>Payment History</h3>
              <p style={{ fontSize: '13px', color: '#8B949E', marginTop: '2px' }}>
                Total Paid: {formatCurrency(stats.totalPaid)} | Balance: {formatCurrency(stats.balance)}
              </p>
            </div>
            <Button icon={Plus} onClick={() => setIsAddPaymentOpen(true)}>
              Record Payment
            </Button>
          </div>
          <PaymentTable payments={clientPayments} showClientColumn={false} />
        </div>
      )}

      {activeTab === 'Progress' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Top Weight KPIs */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}
          >
            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Starting Weight</span>
              <span style={summaryValueStyle}>{startingWeight} kg</span>
            </div>

            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Current Weight</span>
              <span style={{ ...summaryValueStyle, color: '#65F36B' }}>{currentWeight} kg</span>
            </div>

            <div style={summaryCardStyle}>
              <span style={summaryLabelStyle}>Weight Change</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                {weightDiff < 0 ? (
                  <span
                    style={{
                      color: '#65F36B',
                      fontSize: '22px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <TrendingDown size={22} /> {weightDiff} kg
                  </span>
                ) : weightDiff > 0 ? (
                  <span
                    style={{
                      color: '#4A90E2',
                      fontSize: '22px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <TrendingUp size={22} /> +{weightDiff} kg
                  </span>
                ) : (
                  <span style={{ color: '#8B949E', fontSize: '22px', fontWeight: 800 }}>0 kg</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Button fullWidth size="lg" icon={Scale} onClick={() => setIsLogProgressOpen(true)}>
                + Log Progress
              </Button>
            </div>
          </div>

          {/* Line Chart of Weight Progress */}
          <div
            style={{
              backgroundColor: '#11171B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
              Weight Over Time
            </h3>
            <div style={{ width: '100%', height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                  <XAxis dataKey="date" stroke="#8B949E" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8B949E" fontSize={12} domain={['dataMin - 2', 'dataMax + 2']} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#151C20',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      color: '#FFFFFF'
                    }}
                    formatter={(val) => [`${val} kg`, 'Weight']}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#65F36B"
                    strokeWidth={3}
                    dot={{ fill: '#65F36B', r: 5 }}
                    activeDot={{ r: 7, stroke: '#FFFFFF', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Measurements Cards */}
          <div
            style={{
              backgroundColor: '#11171B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              padding: '24px'
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '16px' }}>
              Latest Body Measurements
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '14px'
              }}
            >
              <div style={measureCardStyle}>
                <span style={summaryLabelStyle}>Waist</span>
                <span style={summaryValueStyle}>{client.measurements?.waist || 28}"</span>
              </div>
              <div style={measureCardStyle}>
                <span style={summaryLabelStyle}>Chest</span>
                <span style={summaryValueStyle}>{client.measurements?.chest || 34}"</span>
              </div>
              <div style={measureCardStyle}>
                <span style={summaryLabelStyle}>Arms</span>
                <span style={summaryValueStyle}>{client.measurements?.arms || 12}"</span>
              </div>
              <div style={measureCardStyle}>
                <span style={summaryLabelStyle}>Thighs</span>
                <span style={summaryValueStyle}>{client.measurements?.thighs || 21}"</span>
              </div>
              <div style={measureCardStyle}>
                <span style={summaryLabelStyle}>Body Fat</span>
                <span style={{ ...summaryValueStyle, color: '#65F36B' }}>
                  {client.measurements?.bodyFat || 22}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Activity' && (
        <div
          style={{
            backgroundColor: '#11171B',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF', marginBottom: '20px' }}>
            Client Activity Log
          </h3>
          <ActivityTimeline activities={activities} filterClientId={client.id} />
        </div>
      )}

      {/* Modals */}
      <ClientForm
        isOpen={isEditClientOpen}
        onClose={() => setIsEditClientOpen(false)}
        clientToEdit={client}
      />

      <SessionForm
        isOpen={isAddSessionOpen}
        onClose={() => setIsAddSessionOpen(false)}
        defaultClientId={client.id}
        clients={allClients}
      />

      <PaymentForm
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        defaultClientId={client.id}
        clients={allClients}
      />

      {/* Log Progress Modal */}
      <Modal
        isOpen={isLogProgressOpen}
        onClose={() => setIsLogProgressOpen(false)}
        title="Log Fitness Progress"
        maxWidth="500px"
      >
        <form onSubmit={handleSaveProgress} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={modalLabelStyle}>Date</label>
              <input
                type="date"
                required
                value={newProgress.date}
                onChange={(e) => setNewProgress({ ...newProgress, date: e.target.value })}
              />
            </div>
            <div>
              <label style={modalLabelStyle}>Weight (kg) *</label>
              <input
                type="number"
                step="0.1"
                required
                value={newProgress.weight}
                onChange={(e) => setNewProgress({ ...newProgress, weight: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
            <div>
              <label style={modalLabelStyle}>Waist (in)</label>
              <input
                type="number"
                step="0.5"
                value={newProgress.waist}
                onChange={(e) => setNewProgress({ ...newProgress, waist: e.target.value })}
              />
            </div>
            <div>
              <label style={modalLabelStyle}>Chest (in)</label>
              <input
                type="number"
                step="0.5"
                value={newProgress.chest}
                onChange={(e) => setNewProgress({ ...newProgress, chest: e.target.value })}
              />
            </div>
            <div>
              <label style={modalLabelStyle}>Arms (in)</label>
              <input
                type="number"
                step="0.5"
                value={newProgress.arms}
                onChange={(e) => setNewProgress({ ...newProgress, arms: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={modalLabelStyle}>Thighs (in)</label>
              <input
                type="number"
                step="0.5"
                value={newProgress.thighs}
                onChange={(e) => setNewProgress({ ...newProgress, thighs: e.target.value })}
              />
            </div>
            <div>
              <label style={modalLabelStyle}>Body Fat %</label>
              <input
                type="number"
                step="0.1"
                value={newProgress.bodyFat}
                onChange={(e) => setNewProgress({ ...newProgress, bodyFat: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label style={modalLabelStyle}>Notes / Observations</label>
            <textarea
              rows="2"
              placeholder="E.g. Feeling lighter, energy levels high..."
              value={newProgress.notes}
              onChange={(e) => setNewProgress({ ...newProgress, notes: e.target.value })}
            />
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <Button variant="secondary" onClick={() => setIsLogProgressOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Progress
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteClient}
        title="Delete Client?"
        message={`Are you sure you want to delete ${client.name}? This action cannot be undone and will remove all their associated sessions and payments.`}
        confirmText="Delete Client"
        isDanger={true}
      />
    </div>
  );
};

const summaryCardStyle = {
  backgroundColor: '#11171B',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '12px',
  padding: '16px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const measureCardStyle = {
  backgroundColor: '#151C20',
  border: '1px solid rgba(255, 255, 255, 0.06)',
  borderRadius: '10px',
  padding: '14px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const summaryLabelStyle = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#8B949E'
};

const summaryValueStyle = {
  fontSize: '20px',
  fontWeight: 800,
  color: '#FFFFFF',
  letterSpacing: '-0.02em'
};

const modalLabelStyle = {
  fontSize: '12px',
  fontWeight: 600,
  color: '#8B949E',
  marginBottom: '4px',
  display: 'block'
};

export default ClientDetails;
