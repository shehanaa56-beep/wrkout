import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX } from 'lucide-react';
import ClientDetailsComponent from '../components/clients/ClientDetails';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';

export const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);
  const [progress] = useLocalStorage(STORAGE_KEYS.PROGRESS, []);
  const [activities] = useLocalStorage(STORAGE_KEYS.ACTIVITIES, []);

  const client = clients.find((c) => c.id === id);

  if (!client) {
    return (
      <div style={{ padding: '40px 0' }}>
        <EmptyState
          icon={UserX}
          title="Client Not Found"
          description="The client you are looking for does not exist or has been removed."
          actionText="Back to Clients"
          onAction={() => navigate('/clients')}
        />
      </div>
    );
  }

  return (
    <ClientDetailsComponent
      client={client}
      sessions={sessions}
      payments={payments}
      progressList={progress}
      activities={activities}
      allClients={clients}
    />
  );
};

export default ClientDetails;
