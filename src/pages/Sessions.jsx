import React, { useState, useMemo } from 'react';
import { Plus, Calendar, CheckCircle2, Clock, AlertCircle, Search, X } from 'lucide-react';
import SessionTable from '../components/sessions/SessionTable';
import SessionForm from '../components/sessions/SessionForm';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';

export const Sessions = () => {
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [clientFilter, setClientFilter] = useState('All');

  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState(null);

  // Statistics
  const totalSessions = sessions.length;
  const completedCount = sessions.filter((s) => s.status === 'Completed').length;
  const scheduledCount = sessions.filter((s) => s.status === 'Scheduled').length;
  const missedCount = sessions.filter((s) => s.status === 'Missed').length;

  // Filtered list
  const filteredSessions = useMemo(() => {
    return sessions.filter((sess) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (sess.clientName && sess.clientName.toLowerCase().includes(q)) ||
        (sess.type && sess.type.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (statusFilter !== 'All' && sess.status !== statusFilter) return false;
      if (clientFilter !== 'All' && sess.clientId !== clientFilter) return false;

      return true;
    });
  }, [sessions, searchQuery, statusFilter, clientFilter]);

  const handleEditSession = (session) => {
    setSessionToEdit(session);
    setIsAddSessionOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddSessionOpen(false);
    setSessionToEdit(null);
  };

  const statuses = ['All', 'Scheduled', 'Completed', 'Missed', 'Cancelled'];

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
            Sessions
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
            Schedule and manage client training workouts
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={() => setIsAddSessionOpen(true)}
        >
          Add Session
        </Button>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px'
        }}
      >
        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={kpiLabelStyle}>Total Sessions</span>
            <Calendar size={18} color="#8B949E" />
          </div>
          <span style={kpiValueStyle}>{totalSessions}</span>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={kpiLabelStyle}>Completed</span>
            <CheckCircle2 size={18} color="#65F36B" />
          </div>
          <span style={{ ...kpiValueStyle, color: '#65F36B' }}>{completedCount}</span>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={kpiLabelStyle}>Scheduled</span>
            <Clock size={18} color="#4A90E2" />
          </div>
          <span style={{ ...kpiValueStyle, color: '#4A90E2' }}>{scheduledCount}</span>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={kpiLabelStyle}>Missed</span>
            <AlertCircle size={18} color="#FF5C5C" />
          </div>
          <span style={{ ...kpiValueStyle, color: '#FF5C5C' }}>{missedCount}</span>
        </div>
      </div>

      {/* Search and Filters */}
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
          {/* Search */}
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
              placeholder="Search by client or workout type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', height: '40px', fontSize: '13px' }}
            />
          </div>

          {/* Client Filter */}
          <div style={{ width: '220px' }}>
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              style={{ height: '40px', fontSize: '13px' }}
            >
              <option value="All">All Clients</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status filter pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '2px' }}>
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
                  whiteSpace: 'nowrap',
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

      {/* Sessions Table Card */}
      <div
        style={{
          backgroundColor: '#11171B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        {filteredSessions.length > 0 ? (
          <SessionTable
            sessions={filteredSessions}
            showClientColumn={true}
            onEditSession={handleEditSession}
          />
        ) : (
          <EmptyState
            icon={Calendar}
            title="No sessions found"
            description="No workout sessions match your filter criteria."
            actionText="+ Schedule Session"
            onAction={() => setIsAddSessionOpen(true)}
          />
        )}
      </div>

      {/* Session Modal */}
      <SessionForm
        isOpen={isAddSessionOpen}
        onClose={handleCloseModal}
        sessionToEdit={sessionToEdit}
        clients={clients}
      />
    </div>
  );
};

const kpiCardStyle = {
  backgroundColor: '#11171B',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '18px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const kpiLabelStyle = {
  fontSize: '13px',
  fontWeight: 600,
  color: '#8B949E'
};

const kpiValueStyle = {
  fontSize: '24px',
  fontWeight: 800,
  color: '#FFFFFF',
  letterSpacing: '-0.02em'
};

export default Sessions;
