import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { addClient, updateClient } from '../../utils/storage';
import { useToast } from '../../hooks/useToast';

export const ClientForm = ({ isOpen, onClose, clientToEdit = null, onSuccess }) => {
  const { showToast } = useToast();
  const isEditing = Boolean(clientToEdit);

  const initialFormState = {
    name: '',
    phone: '',
    email: '',
    age: 28,
    gender: 'Female',
    height: 165,
    weight: 60,
    emergencyContact: '',
    trainingType: 'Personal Training',
    startDate: new Date().toISOString().split('T')[0],
    totalSessions: 20,
    sessionDuration: 60,
    sessionFee: 500,
    totalPackageAmount: 10000,
    amountPaid: 0,
    paymentMethod: 'UPI',
    paymentDate: new Date().toISOString().split('T')[0],
    status: 'Active',
    notes: '',
    measurements: {
      waist: 28,
      chest: 34,
      arms: 12,
      thighs: 21,
      bodyFat: 22
    }
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        ...initialFormState,
        ...clientToEdit,
        measurements: {
          ...initialFormState.measurements,
          ...(clientToEdit.measurements || {})
        }
      });
    } else {
      setFormData(initialFormState);
    }
  }, [clientToEdit, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      // Auto-update package amount if totalSessions or sessionFee changes and totalPackageAmount matches previous formula
      if (name === 'totalSessions') {
        const fee = Number(prev.sessionFee) || 500;
        return {
          ...prev,
          totalSessions: value,
          totalPackageAmount: Number(value) * fee
        };
      }
      if (name === 'sessionFee') {
        const sess = Number(prev.totalSessions) || 20;
        return {
          ...prev,
          sessionFee: value,
          totalPackageAmount: sess * Number(value)
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('Client name is required.', 'error');
      return;
    }

    if (isEditing) {
      const updated = updateClient({
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        totalSessions: Number(formData.totalSessions),
        sessionDuration: Number(formData.sessionDuration),
        sessionFee: Number(formData.sessionFee),
        totalPackageAmount: Number(formData.totalPackageAmount),
        amountPaid: Number(formData.amountPaid)
      });
      showToast(`✓ ${formData.name} updated successfully!`, 'success');
      if (onSuccess) onSuccess(updated);
    } else {
      const created = addClient({
        ...formData,
        age: Number(formData.age),
        height: Number(formData.height),
        weight: Number(formData.weight),
        startingWeight: Number(formData.weight),
        totalSessions: Number(formData.totalSessions),
        sessionDuration: Number(formData.sessionDuration),
        sessionFee: Number(formData.sessionFee),
        totalPackageAmount: Number(formData.totalPackageAmount),
        amountPaid: Number(formData.amountPaid)
      });
      showToast(`✓ ${formData.name} added successfully!`, 'success');
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

  const sectionHeaderStyle = {
    fontSize: '14px',
    fontWeight: 700,
    color: '#65F36B',
    marginBottom: '14px',
    paddingBottom: '6px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Client Profile' : 'Add New Client'}
      maxWidth="680px"
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* SECTION 1: Personal Information */}
        <div>
          <div style={sectionHeaderStyle}>Personal Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Full Name *</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Age</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} min="10" max="100" />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Height (cm)</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Weight (kg)</label>
              <input type="number" name="weight" value={formData.weight} onChange={handleChange} />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Emergency Contact</label>
              <input
                type="text"
                name="emergencyContact"
                placeholder="Enter contact number & relation"
                value={formData.emergencyContact}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Training Information */}
        <div>
          <div style={sectionHeaderStyle}>Training Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Training Type</label>
              <select name="trainingType" value={formData.trainingType} onChange={handleChange}>
                <option value="Personal Training">Personal Training</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Strength Training">Strength Training</option>
                <option value="Cardio">Cardio</option>
                <option value="General Fitness">General Fitness</option>
                <option value="Functional Training">Functional Training</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Total Sessions</label>
              <input
                type="number"
                name="totalSessions"
                value={formData.totalSessions}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Session Duration</label>
              <select name="sessionDuration" value={formData.sessionDuration} onChange={handleChange}>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Session Fee (₹)</label>
              <input type="number" name="sessionFee" value={formData.sessionFee} onChange={handleChange} />
            </div>

            {isEditing && (
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Status</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Payment Information */}
        <div>
          <div style={sectionHeaderStyle}>Payment Information</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Total Package Amount (₹)</label>
              <input
                type="number"
                name="totalPackageAmount"
                value={formData.totalPackageAmount}
                onChange={handleChange}
              />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Amount Paid (₹)</label>
              <input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleChange} />
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Card">Card</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={inputGroupStyle}>
              <label style={labelStyle}>Payment Date</label>
              <input type="date" name="paymentDate" value={formData.paymentDate} onChange={handleChange} />
            </div>

            <div style={{ ...inputGroupStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Notes</label>
              <textarea
                name="notes"
                rows="2"
                placeholder="Add any training goals, medical conditions, or notes..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
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
            {isEditing ? 'Save Changes' : 'Add Client'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ClientForm;
