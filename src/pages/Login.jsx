import React, { useState } from 'react';
import { Eye, EyeOff, Dumbbell, Lock, Mail, AlertCircle } from 'lucide-react';

const DEFAULT_CREDENTIALS = {
  email: 'hilal22@gmail.com',
  password: 'hilal22'
};

const STORAGE_KEY = 'fitcoach_auth';

export const getStoredCredentials = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_CREDENTIALS;
  } catch {
    return DEFAULT_CREDENTIALS;
  }
};

export const isLoggedIn = () => {
  return localStorage.getItem('fitcoach_session') === 'true';
};

export const login = (email, password) => {
  const creds = getStoredCredentials();
  if (email === creds.email && password === creds.password) {
    localStorage.setItem('fitcoach_session', 'true');
    return true;
  }
  return false;
};

export const logout = () => {
  localStorage.removeItem('fitcoach_session');
};

export const changePassword = (currentPassword, newPassword) => {
  const creds = getStoredCredentials();
  if (currentPassword !== creds.password) {
    return { success: false, error: 'Current password is incorrect.' };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...creds, password: newPassword }));
  return { success: true };
};

export const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = login(email.trim(), password);
      if (success) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#080B0D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background decorative blobs */}
      <div
        style={{
          position: 'absolute',
          top: '-120px',
          left: '-120px',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,243,107,0.06) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '360px',
          height: '360px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(101,243,107,0.04) 0%, transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
          animation: 'fadeIn 0.4s ease-out'
        }}
      >
        {/* Brand */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              backgroundColor: 'rgba(101, 243, 107, 0.12)',
              border: '1px solid rgba(101, 243, 107, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#65F36B',
              margin: '0 auto 16px'
            }}
          >
            <Dumbbell size={26} strokeWidth={2.2} />
          </div>
          <h1
            style={{
              fontSize: '28px',
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '6px'
            }}
          >
            FitCoach
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E' }}>
            Sign in to your trainer dashboard
          </p>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#11171B',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '18px',
            padding: '32px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)'
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label
                style={{ fontSize: '13px', fontWeight: 600, color: '#8B949E' }}
              >
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8B949E',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  required
                  autoComplete="email"
                  style={{ paddingLeft: '38px', height: '46px', fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              <label
                style={{ fontSize: '13px', fontWeight: 600, color: '#8B949E' }}
              >
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '13px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8B949E',
                    pointerEvents: 'none'
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  required
                  autoComplete="current-password"
                  style={{ paddingLeft: '38px', paddingRight: '44px', height: '46px', fontSize: '14px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#8B949E',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 14px',
                  backgroundColor: 'rgba(255, 92, 92, 0.1)',
                  border: '1px solid rgba(255, 92, 92, 0.3)',
                  borderRadius: '8px',
                  color: '#FF5C5C',
                  fontSize: '13px',
                  fontWeight: 500
                }}
              >
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '48px',
                backgroundColor: loading ? 'rgba(101, 243, 107, 0.6)' : '#65F36B',
                color: '#080B0D',
                fontWeight: 800,
                fontSize: '15px',
                borderRadius: '10px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.18s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: loading ? 'none' : '0 0 20px rgba(101, 243, 107, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#52e058';
                  e.currentTarget.style.boxShadow = '0 0 28px rgba(101, 243, 107, 0.5)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.backgroundColor = '#65F36B';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(101, 243, 107, 0.3)';
                  e.currentTarget.style.transform = 'none';
                }
              }}
            >
              {loading ? (
                <>
                  <div
                    style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(8,11,13,0.4)',
                      borderTop: '2px solid #080B0D',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite'
                    }}
                  />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '12px', color: '#5d6773' }}>
          FitCoach — Personal Trainer Management Dashboard
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Login;
