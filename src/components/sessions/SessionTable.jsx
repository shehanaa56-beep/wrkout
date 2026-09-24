import React, { useState } from 'react';
import Badge from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/calculations';
import { updateSession, deleteSession } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';
import { CheckCircle2, Clock, XCircle, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

export const SessionTable = ({
  sessions = [],
  showClientColumn = false,
  onEditSession,
  compact = false
}) => {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleStatusChange = (session, newStatus) => {
    const updated = {
      ...session,
      status: newStatus,
      paymentStatus: newStatus === 'Completed' ? 'Paid' : session.paymentStatus
    };
    updateSession(updated);
    showToast(`Session marked as ${newStatus}`, 'success');
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteSession(deleteTarget.id);
      showToast('Session deleted', 'info');
      setDeleteTarget(null);
    }
  };

  if (!sessions || sessions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 16px', color: '#8B949E', fontSize: '14px' }}>
        No sessions recorded yet.
      </div>
    );
  }

  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          textAlign: 'left',
          fontSize: '13px'
        }}
      >
        <thead>
          <tr
            style={{
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              color: '#8B949E',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <th style={{ padding: '12px 14px', width: '50px' }}>#</th>
            {showClientColumn && <th style={{ padding: '12px 14px' }}>Client</th>}
            <th style={{ padding: '12px 14px' }}>Date</th>
            <th style={{ padding: '12px 14px' }}>Type</th>
            <th style={{ padding: '12px 14px' }}>Duration</th>
            <th style={{ padding: '12px 14px' }}>Status</th>
            <th style={{ padding: '12px 14px' }}>Payment</th>
            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((sess, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0');
            return (
              <tr
                key={sess.id}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px', color: '#8B949E', fontWeight: 600 }}>{indexStr}</td>
                {showClientColumn && (
                  <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                    {sess.clientName}
                  </td>
                )}
                <td style={{ padding: '14px', color: '#FFFFFF' }}>
                  <div>{formatDate(sess.date)}</div>
                  {sess.startTime && (
                    <div style={{ fontSize: '11px', color: '#8B949E' }}>{sess.startTime}</div>
                  )}
                </td>
                <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 500 }}>{sess.type}</td>
                <td style={{ padding: '14px', color: '#8B949E' }}>{sess.duration || 60} min</td>
                <td style={{ padding: '14px' }}>
                  <Badge status={sess.status} />
                </td>
                <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 600 }}>
                  {formatCurrency(sess.fee || 500)}
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {sess.status === 'Scheduled' && (
                      <button
                        title="Mark as Completed"
                        onClick={() => handleStatusChange(sess, 'Completed')}
                        style={{
                          backgroundColor: 'rgba(101, 243, 107, 0.15)',
                          color: '#65F36B',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Complete
                      </button>
                    )}

                    {onEditSession && (
                      <button
                        title="Edit Session"
                        onClick={() => onEditSession(sess)}
                        style={{
                          color: '#8B949E',
                          padding: '4px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
                      >
                        <Edit2 size={15} />
                      </button>
                    )}

                    <button
                      title="Delete Session"
                      onClick={() => setDeleteTarget(sess)}
                      style={{
                        color: '#8B949E',
                        padding: '4px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#FF5C5C')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Session?"
        message={`Are you sure you want to delete session for ${deleteTarget?.clientName || 'this client'} on ${formatDate(deleteTarget?.date)}?`}
        confirmText="Delete Session"
        isDanger={true}
      />
    </div>
  );
};

export default SessionTable;
