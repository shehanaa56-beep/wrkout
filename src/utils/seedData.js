import {
  DEMO_CLIENTS,
  DEMO_SESSIONS,
  DEMO_PAYMENTS,
  DEMO_PROGRESS,
  DEMO_ACTIVITIES,
  DEMO_SETTINGS
} from '../data/demoData';

export const STORAGE_KEYS = {
  CLIENTS: 'fitcoach_clients',
  SESSIONS: 'fitcoach_sessions',
  PAYMENTS: 'fitcoach_payments',
  PROGRESS: 'fitcoach_progress',
  ACTIVITIES: 'fitcoach_activities',
  SETTINGS: 'fitcoach_settings'
};

export const seedStorageIfEmpty = () => {
  if (typeof window === 'undefined') return;

  const existingClients = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  if (!existingClients) {
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(DEMO_CLIENTS));
  }

  const existingSessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
  if (!existingSessions) {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(DEMO_SESSIONS));
  }

  const existingPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
  if (!existingPayments) {
    localStorage.setItem(STORAGE_KEYS.PAYMENTS, JSON.stringify(DEMO_PAYMENTS));
  }

  const existingProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  if (!existingProgress) {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(DEMO_PROGRESS));
  }

  const existingActivities = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!existingActivities) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(DEMO_ACTIVITIES));
  }

  const existingSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  if (!existingSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEMO_SETTINGS));
  }
};
