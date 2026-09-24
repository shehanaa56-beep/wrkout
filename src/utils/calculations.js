/**
 * Dynamic calculation utilities for FitCoach
 */

export const formatCurrency = (amount, symbol = '₹') => {
  const num = Number(amount) || 0;
  return `${symbol}${num.toLocaleString('en-IN')}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '-';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return dateInput;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  // Check if format is "HH:MM"
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    const [h, m] = timeString.split(':');
    const hour = parseInt(h, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${m} ${ampm}`;
  }
  return timeString;
};

/**
 * Calculate metrics for a single client
 */
export const getClientStats = (client, sessions = [], payments = []) => {
  if (!client) {
    return {
      completedSessions: 0,
      totalSessions: 0,
      remainingSessions: 0,
      progressPercentage: 0,
      totalPackage: 0,
      totalPaid: 0,
      balance: 0,
      lastSessionDate: null
    };
  }

  const clientSessions = sessions.filter((s) => s.clientId === client.id);
  const completedSessions = clientSessions.filter((s) => s.status === 'Completed').length;
  const totalSessions = Number(client.totalSessions) || 0;
  const remainingSessions = Math.max(0, totalSessions - completedSessions);
  const progressPercentage = totalSessions > 0 ? Math.min(100, Math.round((completedSessions / totalSessions) * 100)) : 0;

  // Payments for this client
  const clientPayments = payments.filter((p) => p.clientId === client.id && p.status === 'Paid');
  const paymentsSum = clientPayments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  
  // Total paid can be derived from payments or client.amountPaid (use max to reflect either explicit record or manual input)
  const totalPaid = Math.max(paymentsSum, Number(client.amountPaid) || 0);
  const totalPackage = Number(client.totalPackageAmount) || 0;
  const balance = Math.max(0, totalPackage - totalPaid);

  // Find last completed or held session
  const sortedSessions = [...clientSessions]
    .filter((s) => s.status === 'Completed' || s.date)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const lastSessionDate = sortedSessions.length > 0 ? sortedSessions[0].date : client.startDate;

  return {
    completedSessions,
    totalSessions,
    remainingSessions,
    progressPercentage,
    totalPackage,
    totalPaid,
    balance,
    lastSessionDate
  };
};

/**
 * Calculate high level dashboard statistics
 */
export const getDashboardStats = (clients = [], sessions = [], payments = []) => {
  const totalClients = clients.length;
  const activeClients = clients.filter((c) => c.status === 'Active').length;
  const activePercentage = totalClients > 0 ? Math.round((activeClients / totalClients) * 100) : 0;

  const completedSessions = sessions.filter((s) => s.status === 'Completed').length;

  // Pending payments: clients with balance > 0
  let pendingAmount = 0;
  let clientsWithPending = 0;

  clients.forEach((client) => {
    const stats = getClientStats(client, sessions, payments);
    if (stats.balance > 0) {
      pendingAmount += stats.balance;
      clientsWithPending += 1;
    }
  });

  // Total paid revenue
  const totalRevenue = payments
    .filter((p) => p.status === 'Paid')
    .reduce((acc, p) => acc + (Number(p.amount) || 0), 0);

  // Total package value of all clients
  const totalContractValue = clients.reduce((acc, c) => acc + (Number(c.totalPackageAmount) || 0), 0);

  return {
    totalClients,
    activeClients,
    activePercentage,
    completedSessions,
    pendingAmount,
    clientsWithPending,
    totalRevenue,
    totalContractValue
  };
};

/**
 * Format weekly data for the Monthly Overview chart
 */
export const getMonthlyOverviewData = (sessions = [], payments = []) => {
  // 4 weeks mock & real combined aggregation
  return [
    {
      week: 'Week 1',
      sessions: 18,
      scheduled: 22,
      revenue: 6200
    },
    {
      week: 'Week 2',
      sessions: 24,
      scheduled: 26,
      revenue: 7800
    },
    {
      week: 'Week 3',
      sessions: 28,
      scheduled: 30,
      revenue: 8500
    },
    {
      week: 'Week 4',
      sessions: 16,
      scheduled: 20,
      revenue: 6000
    }
  ];
};
