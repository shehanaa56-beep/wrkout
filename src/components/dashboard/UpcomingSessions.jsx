import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check } from 'lucide-react';
import { updateSession } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

export const UpcomingSessions = ({ sessions = [], clients = [] }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleStartOrComplete = (e, session) => {
    e.stopPropagation();
    if (session.status === 'Completed') {
      showToast(`Session for ${session.clientName} is already completed.`, 'info');
      return;
    }

    const updated = {
      ...session,
      status: 'Completed',
      paymentStatus: 'Paid' // Also mark session payment as received
    };
    updateSession(updated);
    showToast(`✓ Session #${session.id.slice(-3)} for ${session.clientName} marked as Completed!`, 'success');
  };

  const getClientAvatar = (clientId) => {
    const client = clients.find((c) => c.id === clientId);
    return client?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(clientId)}`;
  };

  return (
    <div
      style={{
        backgroundColor: '#11171B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Upcoming Sessions</h3>
        <Link
          to="/sessions"
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#8B949E',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#65F36B')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
        >
          View all <ChevronRight size={14} />
        </Link>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#8B949E', padding: '30px 0', fontSize: '14px' }}>
            No upcoming sessions scheduled for today.
          </div>
        ) : (
          sessions.map((sess) => {
            const isCompleted = sess.status === 'Completed';
            const isToday = sess.date === '2026-09-24' || sess.date?.includes('24');
            const dateLabel = isToday ? `Today, ${sess.startTime || '10:00 AM'}` : `${sess.date}, ${sess.startTime || '9:00 AM'}`;

            return (
              <div
                key={sess.id}
                onClick={() => navigate(`/clients/${sess.clientId}`)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: '#151C20',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#182126';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#151C20';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img
                    src={getClientAvatar(sess.clientId)}
                    alt={sess.clientName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                  />
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{sess.clientName}</div>
                    <div style={{ fontSize: '12px', color: '#8B949E', marginTop: '2px' }}>
                      {sess.type} • <span style={{ color: '#abb6c2' }}>{dateLabel}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCompleted ? (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(101, 243, 107, 0.1)',
                        color: '#65F36B',
                        fontSize: '12px',
                        fontWeight: 600
                      }}
                    >
                      <Check size={14} /> Done
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleStartOrComplete(e, sess)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        backgroundColor: isToday ? '#65F36B' : 'rgba(255, 255, 255, 0.08)',
                        color: isToday ? '#080B0D' : '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (isToday) {
                          e.currentTarget.style.backgroundColor = '#52e058';
                          e.currentTarget.style.boxShadow = '0 0 12px rgba(101, 243, 107, 0.3)';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isToday) {
                          e.currentTarget.style.backgroundColor = '#65F36B';
                          e.currentTarget.style.boxShadow = 'none';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                        }
                      }}
                    >
                      {isToday ? 'Start' : 'View'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingSessions;
