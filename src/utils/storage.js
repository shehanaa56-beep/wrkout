import { STORAGE_KEYS, seedStorageIfEmpty } from './seedData';
import {
  DEMO_CLIENTS,
  DEMO_SESSIONS,
  DEMO_PAYMENTS,
  DEMO_PROGRESS,
  DEMO_ACTIVITIES,
  DEMO_SETTINGS
} from '../data/demoData';

// Ensure storage is seeded initially
seedStorageIfEmpty();

// Helper to notify other components in same window
export const notifyStorageChange = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('fitcoach_storage_update'));
  }
};

// Generic read
const getStoredItem = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return fallback;
  }
};

// Generic write
const setStoredItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notifyStorageChange();
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
};

// ==========================================
// CLIENTS
// ==========================================
export const getClients = () => getStoredItem(STORAGE_KEYS.CLIENTS, []);

export const saveClients = (clients) => setStoredItem(STORAGE_KEYS.CLIENTS, clients);

export const addClient = (clientData) => {
  const clients = getClients();
  const newClient = {
    id: `client_${Date.now()}`,
    startDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientData.name)}`,
    ...clientData
  };
  const updated = [newClient, ...clients];
  saveClients(updated);

  // Add initial activity
  addActivity({
    clientId: newClient.id,
    clientName: newClient.name,
    type: 'client_added',
    title: 'New client onboarded',
    description: `${newClient.name} joined for ${newClient.trainingType} (${newClient.totalSessions} sessions).`
  });

  // If initial amount paid was entered, record payment too
  if (Number(newClient.amountPaid) > 0) {
    addPayment({
      clientId: newClient.id,
      clientName: newClient.name,
      date: newClient.paymentDate || new Date().toISOString().split('T')[0],
      sessionNumber: 'Advance',
      amount: Number(newClient.amountPaid),
      method: newClient.paymentMethod || 'UPI',
      status: 'Paid',
      transactionId: `INIT-${Math.floor(100000 + Math.random() * 900000)}`,
      notes: 'Initial package advance payment'
    }, false); // prevent double activity if not needed or allow it
  }

  // Also record initial progress record if weight is given
  if (newClient.weight) {
    addProgress({
      clientId: newClient.id,
      date: newClient.startDate,
      weight: Number(newClient.weight),
      waist: Number(newClient.measurements?.waist) || 30,
      chest: Number(newClient.measurements?.chest) || 36,
      arms: Number(newClient.measurements?.arms) || 12,
      thighs: Number(newClient.measurements?.thighs) || 22,
      bodyFat: Number(newClient.measurements?.bodyFat) || 22,
      notes: 'Initial intake baseline measurement.'
    });
  }

  return newClient;
};

export const updateClient = (updatedClient) => {
  const clients = getClients();
  const index = clients.findIndex((c) => c.id === updatedClient.id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updatedClient };
    saveClients(clients);

    addActivity({
      clientId: updatedClient.id,
      clientName: updatedClient.name,
      type: 'client_updated',
      title: 'Client profile updated',
      description: `Updated profile details for ${updatedClient.name}.`
    });
    return clients[index];
  }
  return null;
};

export const deleteClient = (id) => {
  const clients = getClients();
  const clientToDelete = clients.find((c) => c.id === id);
  const updated = clients.filter((c) => c.id !== id);
  saveClients(updated);

  // Clean up associated sessions, payments, and progress
  const sessions = getSessions().filter((s) => s.clientId !== id);
  saveSessions(sessions);

  const payments = getPayments().filter((p) => p.clientId !== id);
  savePayments(payments);

  const progress = getProgress().filter((pr) => pr.clientId !== id);
  saveProgress(progress);

  if (clientToDelete) {
    addActivity({
      clientId: id,
      clientName: clientToDelete.name,
      type: 'client_deleted',
      title: 'Client profile removed',
      description: `${clientToDelete.name} was removed from active clients.`
    });
  }

  return updated;
};

// ==========================================
// SESSIONS
// ==========================================
export const getSessions = () => getStoredItem(STORAGE_KEYS.SESSIONS, []);

export const saveSessions = (sessions) => setStoredItem(STORAGE_KEYS.SESSIONS, sessions);

export const addSession = (sessionData) => {
  const sessions = getSessions();
  const newSession = {
    id: `sess_${Date.now()}`,
    status: 'Scheduled',
    duration: 60,
    ...sessionData
  };
  const updated = [newSession, ...sessions];
  saveSessions(updated);

  addActivity({
    clientId: newSession.clientId,
    clientName: newSession.clientName,
    type: 'session_scheduled',
    title: `Session scheduled`,
    description: `${newSession.type} on ${newSession.date} at ${newSession.startTime || 'TBD'}.`
  });

  return newSession;
};

export const updateSession = (updatedSession) => {
  const sessions = getSessions();
  const index = sessions.findIndex((s) => s.id === updatedSession.id);
  if (index !== -1) {
    const prevStatus = sessions[index].status;
    sessions[index] = { ...sessions[index], ...updatedSession };
    saveSessions(sessions);

    if (updatedSession.status === 'Completed' && prevStatus !== 'Completed') {
      addActivity({
        clientId: updatedSession.clientId,
        clientName: updatedSession.clientName,
        type: 'session_completed',
        title: `Session completed`,
        description: `${updatedSession.type} marked completed.`
      });
    } else if (updatedSession.status === 'Missed' && prevStatus !== 'Missed') {
      addActivity({
        clientId: updatedSession.clientId,
        clientName: updatedSession.clientName,
        type: 'session_missed',
        title: `Session missed`,
        description: `${updatedSession.type} was missed.`
      });
    }

    return sessions[index];
  }
  return null;
};

export const deleteSession = (id) => {
  const sessions = getSessions();
  const updated = sessions.filter((s) => s.id !== id);
  saveSessions(updated);
  return updated;
};

// ==========================================
// PAYMENTS
// ==========================================
export const getPayments = () => getStoredItem(STORAGE_KEYS.PAYMENTS, []);

export const savePayments = (payments) => setStoredItem(STORAGE_KEYS.PAYMENTS, payments);

export const addPayment = (paymentData, logActivity = true) => {
  const payments = getPayments();
  const newPayment = {
    id: `pay_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    status: 'Paid',
    transactionId: paymentData.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    ...paymentData
  };
  const updated = [newPayment, ...payments];
  savePayments(updated);

  // Synchronize client's amountPaid if status is Paid
  if (newPayment.status === 'Paid') {
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.id === newPayment.clientId);
    if (clientIndex !== -1) {
      const currentPaid = Number(clients[clientIndex].amountPaid || 0);
      clients[clientIndex].amountPaid = currentPaid + Number(newPayment.amount);
      saveClients(clients);
    }
  }

  if (logActivity) {
    addActivity({
      clientId: newPayment.clientId,
      clientName: newPayment.clientName,
      type: 'payment_received',
      title: `₹${Number(newPayment.amount).toLocaleString('en-IN')} payment recorded`,
      description: `Method: ${newPayment.method} • Status: ${newPayment.status}`
    });
  }

  return newPayment;
};

export const updatePayment = (updatedPayment) => {
  const payments = getPayments();
  const index = payments.findIndex((p) => p.id === updatedPayment.id);
  if (index !== -1) {
    const prevPayment = payments[index];
    payments[index] = { ...payments[index], ...updatedPayment };
    savePayments(payments);

    // If payment status changed from Pending to Paid, update client's amountPaid
    if (prevPayment.status === 'Pending' && updatedPayment.status === 'Paid') {
      const clients = getClients();
      const clientIndex = clients.findIndex((c) => c.id === updatedPayment.clientId);
      if (clientIndex !== -1) {
        clients[clientIndex].amountPaid = Number(clients[clientIndex].amountPaid || 0) + Number(updatedPayment.amount);
        saveClients(clients);
      }
    }

    return payments[index];
  }
  return null;
};

export const deletePayment = (id) => {
  const payments = getPayments();
  const payment = payments.find((p) => p.id === id);
  const updated = payments.filter((p) => p.id !== id);
  savePayments(updated);

  // If deleted a paid payment, adjust client paid amount
  if (payment && payment.status === 'Paid') {
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.id === payment.clientId);
    if (clientIndex !== -1) {
      clients[clientIndex].amountPaid = Math.max(0, Number(clients[clientIndex].amountPaid || 0) - Number(payment.amount));
      saveClients(clients);
    }
  }

  return updated;
};

// ==========================================
// PROGRESS
// ==========================================
export const getProgress = () => getStoredItem(STORAGE_KEYS.PROGRESS, []);

export const saveProgress = (progress) => setStoredItem(STORAGE_KEYS.PROGRESS, progress);

export const addProgress = (progressData) => {
  const progressList = getProgress();
  const newProgress = {
    id: `prog_${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...progressData
  };
  const updated = [newProgress, ...progressList];
  saveProgress(updated);

  // Also update client's current weight in client record
  if (newProgress.weight && newProgress.clientId) {
    const clients = getClients();
    const clientIndex = clients.findIndex((c) => c.id === newProgress.clientId);
    if (clientIndex !== -1) {
      clients[clientIndex].weight = newProgress.weight;
      if (newProgress.waist || newProgress.chest || newProgress.arms) {
        clients[clientIndex].measurements = {
          ...clients[clientIndex].measurements,
          waist: newProgress.waist ?? clients[clientIndex].measurements?.waist,
          chest: newProgress.chest ?? clients[clientIndex].measurements?.chest,
          arms: newProgress.arms ?? clients[clientIndex].measurements?.arms,
          thighs: newProgress.thighs ?? clients[clientIndex].measurements?.thighs,
          bodyFat: newProgress.bodyFat ?? clients[clientIndex].measurements?.bodyFat
        };
      }
      saveClients(clients);
    }
  }

  return newProgress;
};

// ==========================================
// ACTIVITIES
// ==========================================
export const getActivities = () => getStoredItem(STORAGE_KEYS.ACTIVITIES, []);

export const saveActivities = (activities) => setStoredItem(STORAGE_KEYS.ACTIVITIES, activities);

export const addActivity = (activityData) => {
  const activities = getActivities();
  const todayDate = new Date().toISOString().split('T')[0];
  const newActivity = {
    id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    dateGroup: 'Today',
    ...activityData
  };
  const updated = [newActivity, ...activities];
  saveActivities(updated);
  return newActivity;
};

// ==========================================
// SETTINGS
// ==========================================
export const getSettings = () => getStoredItem(STORAGE_KEYS.SETTINGS, DEMO_SETTINGS);

export const saveSettings = (settings) => setStoredItem(STORAGE_KEYS.SETTINGS, settings);

// ==========================================
// SYSTEM ACTIONS: EXPORT, RESET, CLEAR
// ==========================================
export const exportAllData = () => {
  const exportPayload = {
    fitcoach_export_version: '1.0',
    export_date: new Date().toISOString(),
    clients: getClients(),
    sessions: getSessions(),
    payments: getPayments(),
    progress: getProgress(),
    activities: getActivities(),
    settings: getSettings()
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `fitcoach_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

export const resetToDemoData = () => {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(DEMO_CLIENTS));
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEMO_SESSIONS));
  localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEMO_PAYMENTS));
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEMO_PROGRESS));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEMO_ACTIVITIES));
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEMO_SETTINGS));
  notifyStorageChange();
};

export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.CLIENTS);
  localStorage.removeItem(STORAGE_KEYS.SESSIONS);
  localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  notifyStorageChange();
};
