import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { addSession, updateSession } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

export const SessionForm = ({
  isOpen,
  onClose,
  sessionToEdit = null,
  defaultClientId = null,
  clients = [],
  onSuccess
}) => {
  const { showToast } = useToast();
  const isEditing = Boolean(sessionToEdit);

  const defaultClient = defaultClientId
    ? clients.find((c) => c.id === defaultClientId)
    : clients[0];

  const initialFormState = {
    clientId: defaultClient ? defaultClient.id : '',
    clientName: defaultClient ? defaultClient.name : '',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    type: defaultClient ? defaultClient.trainingType : 'Strength Training',
    duration: 60,
    status: 'Scheduled',
    fee: defaultClient ? defaultClient.sessionFee || 500 : 500,
    paymentStatus: 'Pending',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (sessionToEdit) {
      setFormData(sessionToEdit);
    } else if (defaultClientId) {
      const matched = clients.find((c) => c.id === defaultClientId);
      setFormData({
        ...initialFormState,
        clientId: defaultClientId,
        clientName: matched ? matched.name : '',
        type: matched ? matched.trainingType : 'Strength Training',
        fee: matched ? matched.sessionFee || 500 : 500
      });
    } else if (clients.length > 0) {
      setFormData({
        ...initialFormState,
        clientId: clients[0].id,
        clientName: clients[0].name
      });
    }
  }, [sessionToEdit, defaultClientId, clients, isOpen]);

  const handleClientChange = (e) => {
    const selectedId = e.target.value;
    const client = clients.find((c) => c.id === selectedId);
    setFormData((prev) => ({
      ...prev,
      clientId: selectedId,
      clientName: client ? client.name : '',
      type: client?.trainingType || prev.type,
      fee: client?.sessionFee || prev.fee
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      showToast('Please select a client for the session.', 'error');
      return;
    }

    if (isEditing) {
      const updated = updateSession({
        ...formData,
        duration: Number(formData.duration),
        fee: Number(formData.fee)
      });
      showToast('✓ Session updated successfully!', 'success');
      if (onSuccess) onSuccess(updated);
    } else {
      const created = addSession({
        ...formData,
        duration: Number(formData.duration),
        fee: Number(formData.fee)
      });
      showToast('✓ Session saved successfully!', 'success');
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
      title={isEditing ? 'Edit Session' : 'Schedule New Session'}
      maxWidth="540px"
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
            <label style={labelStyle}>Date *</label>
            <input type="date" name="date" required value={formData.date} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Session Type</label>
            <select name="type" value={formData.type} onChange={handleChange}>
              <option value="Strength Training">Strength Training</option>
              <option value="Personal Training">Personal Training</option>
              <option value="Cardio">Cardio</option>
              <option value="Cardio Session">Cardio Session</option>
              <option value="HIIT">HIIT</option>
              <option value="Muscle Gain">Muscle Gain</option>
              <option value="Functional Training">Functional Training</option>
              <option value="Mobility & Recovery">Mobility & Recovery</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Duration (mins)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="15"
              step="15"
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Missed">Missed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Fee (₹)</label>
            <input type="number" name="fee" value={formData.fee} onChange={handleChange} />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Payment Status</label>
            <select name="paymentStatus" value={formData.paymentStatus} onChange={handleChange}>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
        </div>

        <div style={inputGroupStyle}>
          <label style={labelStyle}>Workout Notes</label>
          <textarea
            name="notes"
            rows="2"
            placeholder="E.g. Upper body press focus, 4x10 bench, 3x12 lateral raises..."
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
            {isEditing ? 'Save Session' : 'Save Session'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SessionForm;
