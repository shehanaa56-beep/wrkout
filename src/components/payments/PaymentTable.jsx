import React, { useState } from 'react';
import Badge from '../common/Badge';
import { formatDate, formatCurrency } from '../../utils/calculations';
import { updatePayment, deletePayment } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog';

export const PaymentTable = ({
  payments = [],
  showClientColumn = true,
  onEditPayment
}) => {
  const { showToast } = useToast();
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleMarkAsPaid = (payment) => {
    updatePayment({ ...payment, status: 'Paid' });
    showToast(`✓ Payment of ${formatCurrency(payment.amount)} marked as Paid!`, 'success');
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deletePayment(deleteTarget.id);
      showToast('Payment record removed', 'info');
      setDeleteTarget(null);
    }
  };

  if (!payments || payments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '36px 16px', color: '#8B949E', fontSize: '14px' }}>
        No payment records found.
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
            <th style={{ padding: '12px 14px' }}>Session</th>
            <th style={{ padding: '12px 14px' }}>Amount</th>
            <th style={{ padding: '12px 14px' }}>Method</th>
            <th style={{ padding: '12px 14px' }}>Status</th>
            <th style={{ padding: '12px 14px' }}>Transaction ID</th>
            <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((pay, idx) => {
            const indexStr = String(idx + 1).padStart(2, '0');
            return (
              <tr
                key={pay.id}
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
                    {pay.clientName}
                  </td>
                )}
                <td style={{ padding: '14px', color: '#FFFFFF' }}>{formatDate(pay.date)}</td>
                <td style={{ padding: '14px', color: '#8B949E', fontWeight: 500 }}>
                  {pay.sessionNumber || '#01'}
                </td>
                <td style={{ padding: '14px', color: '#FFFFFF', fontWeight: 700 }}>
                  {formatCurrency(pay.amount)}
                </td>
                <td style={{ padding: '14px', color: '#8B949E' }}>{pay.method || 'UPI'}</td>
                <td style={{ padding: '14px' }}>
                  <Badge status={pay.status} />
                </td>
                <td style={{ padding: '14px', color: '#8B949E', fontFamily: 'monospace', fontSize: '12px' }}>
                  {pay.transactionId || '-'}
                </td>
                <td style={{ padding: '14px', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    {pay.status === 'Pending' && (
                      <button
                        title="Mark as Paid"
                        onClick={() => handleMarkAsPaid(pay)}
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
                        Mark Paid
                      </button>
                    )}

                    {onEditPayment && (
                      <button
                        title="Edit Payment"
                        onClick={() => onEditPayment(pay)}
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
                      title="Delete Record"
                      onClick={() => setDeleteTarget(pay)}
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
        title="Delete Payment Record?"
        message={`Are you sure you want to delete payment record of ${formatCurrency(deleteTarget?.amount)} for ${deleteTarget?.clientName}?`}
        confirmText="Delete Payment"
        isDanger={true}
      />
    </div>
  );
};

export default PaymentTable;
