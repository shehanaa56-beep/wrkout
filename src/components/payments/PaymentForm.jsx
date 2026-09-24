import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { addPayment, updatePayment } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

export const PaymentForm = ({
  isOpen,
  onClose,
  paymentToEdit = null,
  defaultClientId = null,
  clients = [],
  onSuccess
}) => {
  const { showToast } = useToast();
  const isEditing = Boolean(paymentToEdit);

  const defaultClient = defaultClientId
    ? clients.find((c) => c.id === defaultClientId)
    : clients[0];

  const initialFormState = {
    clientId: defaultClient ? defaultClient.id : '',
    clientName: defaultClient ? defaultClient.name : '',
    sessionNumber: '#01',
    amount: defaultClient ? defaultClient.sessionFee || 500 : 500,
    date: new Date().toISOString().split('T')[0],
    method: 'UPI',
    status: 'Paid',
    transactionId: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (paymentToEdit) {
      setFormData(paymentToEdit);
    } else if (defaultClientId) {
      const matched = clients.find((c) => c.id === defaultClientId);
      setFormData({
        ...initialFormState,
        clientId: defaultClientId,
        clientName: matched ? matched.name : '',
        amount: matched ? matched.sessionFee || 500 : 500
      });
    } else if (clients.length > 0) {
      setFormData({
        ...initialFormState,
        clientId: clients[0].id,
        clientName: clients[0].name
      });
    }
  }, [paymentToEdit, defaultClientId, clients, isOpen]);

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    const client = clients.find((c) => c.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      clientId: selectedId,
      clientName: client ? client.name : '',
      amount: client ? client.sessionFee || 500 : 500
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      showToast('Please select a client for payment.', 'error');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      showToast('Please enter a valid payment amount.', 'error');
      return;
    }

    const generatedTxn = formData.transactionId.trim()
      ? formData.transactionId
      : formData.method === 'UPI'
      ? `UPI${Math.floor(1000000 + Math.random() * 9000000)}`
      : '-';

    if (isEditing) {
      const updated = updatePayment({
        ...formData,
        amount: Number(formData.amount),
        transactionId: generatedTxn
      });
      showToast('✓ Payment updated successfully!', 'success');
      if (onSuccess) onSuccess(updated);
    } else {
      const created = addPayment({
        ...formData,
        amount: Number(formData.amount),
        transactionId: generatedTxn
      });
      showToast('✓ Payment recorded successfully!', 'success');
      if (onSuccess) onSuccess(created);
    }

    onClose();
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8B949E'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Payment' : 'Record New Payment'}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={inputGroupStyle}>
          <label style={labelStyle}>Client *</label>
          <select
            name="clientId"
            value={formData.clientId}
            onChange={handleClientChange}
            disabled={Boolean(defaultClientId && !isEditing)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.trainingType})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Session / Reference</label>
            <input
              type="text"
              name="sessionNumber"
              placeholder="e.g. #03 or Advance"
              value={formData.sessionNumber}
              onChange={handleChange}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Amount (₹) *</label>
            <input
              type="number"
              name="amount"
              required
              min="1"
              value={formData.amount}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Payment Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Payment Method</label>
            <select name="method" value={formData.method} onChange={handleChange}>
              <option value="UPI">UPI</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Card">Card</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Transaction ID</label>
            <input
              type="text"
              name="transactionId"
              placeholder="e.g. UPI8234567"
              value={formData.transactionId}
              onChange={handleChange}
            />
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Notes</label>
          <textarea
            name="notes"
            rows="2"
            placeholder="Payment note, bank name, etc."
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Payment' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PaymentForm;
