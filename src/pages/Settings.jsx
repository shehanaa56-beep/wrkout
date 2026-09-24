import React, { useState } from 'react';
import { User, FileDown, FileText, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '../components/common/Button';
import { getSettings, saveSettings } from '../utils/storage';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';
import { generateFitCoachPDF } from '../utils/pdfGenerator';
import { changePassword } from './Login';
import { useToast } from '../hooks/useToast';

export const Settings = ({ onLogout }) => {
  const { showToast } = useToast();
  const [profile, setProfile] = useState(getSettings());

  const [clients] = useLocalStorage(STORAGE_KEYS.CLIENTS, []);
  const [sessions] = useLocalStorage(STORAGE_KEYS.SESSIONS, []);
  const [payments] = useLocalStorage(STORAGE_KEYS.PAYMENTS, []);
  const [progress] = useLocalStorage(STORAGE_KEYS.PROGRESS, []);

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    saveSettings(profile);
    showToast('✓ Profile updated successfully!', 'success');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setPwError('');

    if (!pwForm.current || !pwForm.newPw || !pwForm.confirm) {
      setPwError('Please fill in all password fields.');
      return;
    }
    if (pwForm.newPw.length < 6) {
      setPwError('New password must be at least 6 characters.');
      return;
    }
    if (pwForm.newPw !== pwForm.confirm) {
      setPwError('New password and confirm password do not match.');
      return;
    }

    const result = changePassword(pwForm.current, pwForm.newPw);
    if (!result.success) {
      setPwError(result.error);
      return;
    }

    showToast('✓ Password changed successfully! Please log in again.', 'success');
    setPwForm({ current: '', newPw: '', confirm: '' });
    setTimeout(() => {
      if (onLogout) onLogout();
    }, 1800);
  };

  const handleDownloadPdf = () => {
    try {
      setIsGeneratingPdf(true);
      const filename = generateFitCoachPDF({
        clients,
        sessions,
        payments,
        progress,
        settings: profile
      });
      showToast(`✓ Downloaded ${filename} successfully!`, 'success');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      showToast('Error generating PDF. Please try again.', 'error');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const sectionCardStyle = {
    backgroundColor: '#11171B',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '16px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  };

  const sectionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 600,
    color: '#8B949E'
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px', maxWidth: '800px' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Settings
        </h1>
        <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
          Manage your personal trainer profile, preferences, and download reports
        </p>
      </div>

      {/* 1. Trainer Profile Form */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(101, 243, 107, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#65F36B'
            }}
          >
            <User size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Trainer Profile</h3>
            <p style={{ fontSize: '12px', color: '#8B949E' }}>Information displayed in your dashboard and reports</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="trainerName"
                value={profile.trainerName || ''}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Title / Role</label>
              <input
                type="text"
                name="trainerTitle"
                value={profile.trainerTitle || ''}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={profile.email || ''}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone || ''}
                onChange={handleProfileChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Specialization & Certifications</label>
              <input
                type="text"
                name="specialization"
                value={profile.specialization || ''}
                onChange={handleProfileChange}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
            <Button variant="primary" type="submit">
              Save Profile
            </Button>
          </div>
        </form>
      </div>


      {/* 2. Change Password */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(101, 243, 107, 0.12)',
              border: '1px solid rgba(101, 243, 107, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#65F36B'
            }}
          >
            <Lock size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Change Password</h3>
            <p style={{ fontSize: '12px', color: '#8B949E' }}>Update your login credentials</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Current Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={pwForm.current}
                onChange={(e) => { setPwForm((p) => ({ ...p, current: e.target.value })); setPwError(''); }}
                placeholder="Enter current password"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B949E',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
              >
                {showCurrent ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                value={pwForm.newPw}
                onChange={(e) => { setPwForm((p) => ({ ...p, newPw: e.target.value })); setPwError(''); }}
                placeholder="Min 6 characters"
                style={{ paddingRight: '40px' }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#8B949E',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
              >
                {showNew ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={labelStyle}>Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => { setPwForm((p) => ({ ...p, confirm: e.target.value })); setPwError(''); }}
              placeholder="Re-enter new password"
            />
          </div>

          {/* Error message */}
          {pwError && (
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: 'rgba(255, 92, 92, 0.1)',
                border: '1px solid rgba(255, 92, 92, 0.3)',
                borderRadius: '8px',
                color: '#FF5C5C',
                fontSize: '13px'
              }}
            >
              {pwError}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '4px' }}>
            <Button variant="primary" type="submit">
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* 3. Data Management: Download as PDF */}
      <div style={sectionCardStyle}>
        <div style={sectionHeaderStyle}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: 'rgba(101, 243, 107, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#65F36B'
            }}
          >
            <FileText size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF' }}>Data Management</h3>
            <p style={{ fontSize: '12px', color: '#8B949E' }}>
              Download a complete PDF report of all your clients, workout sessions, and payments
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#151C20',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
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
              gap: '16px'
            }}
          >
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                Download All Data as PDF
              </div>
              <p style={{ fontSize: '13px', color: '#8B949E', maxWidth: '440px', lineHeight: 1.5 }}>
                Generates a multi-page PDF document containing your executive summary, all client profiles, workout session logs, payment receipts, and fitness progress measurements.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              icon={FileDown}
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
            >
              {isGeneratingPdf ? 'Generating...' : 'Download PDF'}
            </Button>
          </div>

          {/* Included Data Badges */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(255, 255, 255, 0.06)'
            }}
          >
            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#65F36B',
                backgroundColor: 'rgba(101, 243, 107, 0.1)',
                border: '1px solid rgba(101, 243, 107, 0.25)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              ✓ {clients.length} Clients Included
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#4A90E2',
                backgroundColor: 'rgba(74, 144, 226, 0.1)',
                border: '1px solid rgba(74, 144, 226, 0.25)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              ✓ {sessions.length} Workout Sessions Included
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#F5A623',
                backgroundColor: 'rgba(245, 166, 35, 0.1)',
                border: '1px solid rgba(245, 166, 35, 0.25)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              ✓ {payments.length} Payment Records Included
            </span>

            <span
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: '#A78BFA',
                backgroundColor: 'rgba(167, 139, 250, 0.1)',
                border: '1px solid rgba(167, 139, 250, 0.25)',
                padding: '4px 10px',
                borderRadius: '6px'
              }}
            >
              ✓ Body Measurements & Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
