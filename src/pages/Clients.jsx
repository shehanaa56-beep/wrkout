import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import ClientCard from '../components/clients/ClientCard';
import ClientFilters from '../components/clients/ClientFilters';
import ClientForm from '../components/clients/ClientForm';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';
import { getClientStats } from '../utils/calculations';

export const Clients = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('search') || '';

  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);

  // Filter clients
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // 1. Search Query (name, phone, email)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (client.name && client.name.toLowerCase().includes(q)) ||
        (client.phone && client.phone.toLowerCase().includes(q)) ||
        (client.email && client.email.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      // 2. Training Type Filter
      if (typeFilter !== 'All Types' && client.trainingType !== typeFilter) {
        return false;
      }

      // 3. Status Filter
      if (statusFilter === 'All') return true;

      if (statusFilter === 'Payment Pending') {
        const stats = getClientStats(client, sessions, payments);
        return stats.balance > 0;
      }

      return client.status === statusFilter;
    });
  }, [clients, sessions, payments, searchQuery, statusFilter, typeFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setTypeFilter('All Types');
    setSearchParams({});
  };

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
            My Clients
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
            Manage your personal training clients
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

      {/* Search and Filters */}
      <ClientFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        onClearFilters={handleClearFilters}
      />

      {/* 2-Column Responsive Client Card Grid */}
      {filteredClients.length > 0 ? (
        <div
          className="clients-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '18px'
          }}
        >
          {filteredClients.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              sessions={sessions}
              payments={payments}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title={searchQuery || statusFilter !== 'All' ? 'No clients match your filter' : 'No clients yet'}
          description={
            searchQuery || statusFilter !== 'All'
              ? 'Try adjusting your search terms or filters.'
              : 'Add your first client to start managing your training sessions and payments.'
          }
          actionText={searchQuery || statusFilter !== 'All' ? 'Clear Filters' : '+ Add Client'}
          onAction={searchQuery || statusFilter !== 'All' ? handleClearFilters : () => setIsAddClientOpen(true)}
        />
      )}

      {/* Add Client Modal */}
      <ClientForm
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
      />
    </div>
  );
};

export default Clients;
