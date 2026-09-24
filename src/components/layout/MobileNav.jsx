import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, CreditCard,
  Activity, BarChart3, Settings, LogOut, Dumbbell, X
} from 'lucide-react';
import { getSettings } from '../../utils/storage';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients',   path: '/clients',   icon: Users },
  { name: 'Sessions',  path: '/sessions',  icon: Calendar },
  { name: 'Payments',  path: '/payments',  icon: CreditCard },
  { name: 'Activity',  path: '/activity',  icon: Activity },
  { name: 'Reports',   path: '/reports',   icon: BarChart3 },
  { name: 'Settings',  path: '/settings',  icon: Settings }
];

export const MobileNav = ({ isOpen, onClose, onLogout }) => {
  const navigate = useNavigate();
  const settings = getSettings();

  const handleLogout = () => { onClose(); if (onLogout) onLogout(); };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        animation: 'slideInOverlay 0.22s ease-out'
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Drawer */}
      <div style={{
        width: '280px', height: '100%',
        backgroundColor: '#0B0F12',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideInLeft 0.22s ease-out'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'rgba(101,243,107,0.15)',
              border: '1px solid rgba(101,243,107,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#65F36B'
            }}>
              <Dumbbell size={18} strokeWidth={2.4} />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>FitCoach</span>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#8B949E', cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav Links */}
        <nav style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 14px', borderRadius: '10px',
                  fontSize: '14px', fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#FFFFFF' : '#8B949E',
                  backgroundColor: isActive ? 'rgba(101,243,107,0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(101,243,107,0.25)' : '1px solid transparent',
                  textDecoration: 'none', transition: 'all 0.15s ease'
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon size={19} color={isActive ? '#65F36B' : '#8B949E'} strokeWidth={isActive ? 2.3 : 1.8} />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile + Logout */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#090D0F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            {(() => {
              const name = settings.trainerName || 'Coach Arjun';
              const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
              return (
                <div style={{
                  width: '42px', height: '42px', borderRadius: '50%',
                  backgroundColor: 'rgba(101,243,107,0.15)',
                  border: '2px solid rgba(101,243,107,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#65F36B', fontSize: '15px', fontWeight: 800, flexShrink: 0
                }}>
                  {initials}
                </div>
              );
            })()}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {settings.trainerName || 'Coach Arjun'}
              </div>
              <div style={{ fontSize: '12px', color: '#8B949E' }}>
                {settings.trainerTitle || 'Personal Trainer'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              width: '100%', padding: '10px 12px', borderRadius: '8px',
              fontSize: '14px', fontWeight: 500,
              color: '#FF5C5C',
              backgroundColor: 'rgba(255,92,92,0.08)',
              border: '1px solid rgba(255,92,92,0.2)',
              cursor: 'pointer'
            }}
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        @keyframes slideInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default MobileNav;
