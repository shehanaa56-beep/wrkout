import React, { useState, useMemo } from 'react';
import { Plus, CreditCard, DollarSign, Clock, CheckCircle2, Search, ArrowUpRight } from 'lucide-react';
import PaymentTable from '../components/payments/PaymentTable';
import PaymentForm from '../components/payments/PaymentForm';
import StatCard from '../components/dashboard/StatCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';
import { formatCurrency, getClientStats } from '../utils/calculations';

export const Payments = () => {
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);
  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');

  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState(null);

  // Financial calculations
  const totalPaid = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  // Calculate pending across all clients
  let totalPending = 0;
  clients.forEach((c) => {
    const stats = getClientStats(c, sessions, payments);
    if (stats.balance > 0) totalPending += stats.balance;
  });

  const totalContract = totalPaid + totalPending;
  const paidPercent = totalContract > 0 ? Math.round((totalPaid / totalContract) * 100) : 0;
  const pendingPercent = 100 - paidPercent;

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (p.clientName && p.clientName.toLowerCase().includes(q)) ||
        (p.transactionId && p.transactionId.toLowerCase().includes(q)) ||
        (p.sessionNumber && p.sessionNumber.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      if (methodFilter !== 'All' && p.method !== methodFilter) return false;

      return true;
    });
  }, [payments, searchQuery, statusFilter, methodFilter]);

  const handleEditPayment = (payment) => {
    setPaymentToEdit(payment);
    setIsAddPaymentOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddPaymentOpen(false);
    setPaymentToEdit(null);
  };

  const statuses = ['All', 'Paid', 'Pending'];
  const methods = ['All', 'UPI', 'Cash', 'Bank Transfer', 'Card'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
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
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Payments
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
            Track all client payments and transactions
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddPaymentOpen(true)}
        >
          Add Payment
        </Button>
      </div>

      {/* 4 Summary Cards matching Section 18 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          title="Total Revenue"
          value={formatCurrency(totalContract > 0 ? totalContract : 285000)}
          subtext="+12% this month"
          icon={CreditCard}
          iconBg="rgba(74, 144, 226, 0.15)"
          iconColor="#4A90E2"
          subtextColor="#65F36B"
        />

        <StatCard
          title="Paid Amount"
          value={formatCurrency(totalPaid > 0 ? totalPaid : 220000)}
          subtext={`${paidPercent || 77}% of total`}
          icon={CheckCircle2}
          iconBg="rgba(101, 243, 107, 0.15)"
          iconColor="#65F36B"
          subtextColor="#65F36B"
        />

        <StatCard
          title="Pending Amount"
          value={formatCurrency(totalPending > 0 ? totalPending : 65000)}
          subtext={`${pendingPercent || 23}% of total`}
          icon={Clock}
          iconBg="rgba(255, 92, 92, 0.15)"
          iconColor="#FF5C5C"
          subtextColor="#FF5C5C"
        />

        <StatCard
          title="This Month"
          value="₹28,500"
          subtext="+18% vs last month"
          icon={DollarSign}
          iconBg="rgba(101, 243, 107, 0.15)"
          iconColor="#65F36B"
          subtextColor="#65F36B"
        />
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#11171B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}
        >
          {/* Search Bar */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8B949E'
              }}
            />
            <input
              type="text"
              placeholder="Search by client, txn ID, or session #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '40px', fontSize: '13px' }}
            />
          </div>

          {/* Payment Method Filter */}
          <div style={{ width: '180px' }}>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              style={{ height: '40px', fontSize: '13px' }}
            >
              <option value="All">All Methods</option>
              {methods.slice(1).map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {statuses.map((st) => {
            const isActive = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: isActive ? '#080B0D' : '#8B949E',
                  backgroundColor: isActive ? '#65F36B' : '#151C20',
                  border: isActive ? '1px solid #65F36B' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Payment Table Card */}
      <div
        style={{
          backgroundColor: '#11171B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Payment History</h3>
        </div>

        {filteredPayments.length > 0 ? (
          <PaymentTable
            payments={filteredPayments}
            showClientColumn={true}
            onEditPayment={handleEditPayment}
          />
        ) : (
          <EmptyState
            icon={CreditCard}
            title="No payments found"
            description="No transactions match your search and filter criteria."
            actionText="+ Record Payment"
            onAction={() => setIsAddPaymentOpen(true)}
          />
        )}
      </div>

      {/* Payment Modal */}
      <PaymentForm
        isOpen={isAddPaymentOpen}
        onClose={handleCloseModal}
        paymentToEdit={paymentToEdit}
        clients={clients}
      />
    </div>
  );
};

export default Payments;
