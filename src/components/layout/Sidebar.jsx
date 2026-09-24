import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  CreditCard,
  Activity,
  BarChart3,
  Settings,
  LogOut,
  Dumbbell,
  X
} from 'lucide-react';
import { getSettings } from '../../utils/storage';

// ─── Desktop Sidebar ───────────────────────────────────────────────────────────
export const Sidebar = ({ onCloseMobile, onLogout }) => {
  const navigate = useNavigate();
  const settings = getSettings();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clients',   path: '/clients',   icon: Users },
    { name: 'Sessions',  path: '/sessions',  icon: Calendar },
    { name: 'Payments',  path: '/payments',  icon: CreditCard },
    { name: 'Activity',  path: '/activity',  icon: Activity },
    { name: 'Reports',   path: '/reports',   icon: BarChart3 },
    { name: 'Settings',  path: '/settings',  icon: Settings }
  ];

  const handleLogout = () => { if (onLogout) onLogout(); else navigate('/dashboard'); };

  return (
    <aside style={{
      width: '240px',
      backgroundColor: '#0B0F12',
      borderRight: '1px solid rgba(255,255,255,0.08)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
      zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        {onCloseMobile && (
          <button onClick={onCloseMobile} style={{ color: '#8B949E', marginRight: 4, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <X size={20} />
          </button>
        )}
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

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink key={item.path} to={item.path} onClick={onCloseMobile}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', borderRadius: '8px',
                fontSize: '14px', fontWeight: isActive ? 600 : 500,
                color: isActive ? '#FFFFFF' : '#8B949E',
                backgroundColor: isActive ? 'rgba(101,243,107,0.12)' : 'transparent',
                border: isActive ? '1px solid rgba(101,243,107,0.25)' : '1px solid transparent',
                transition: 'all 0.15s ease'
              })}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} color={isActive ? '#65F36B' : '#8B949E'} strokeWidth={isActive ? 2.3 : 1.8} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', backgroundColor: '#090D0F' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          {/* Initials avatar */}
          {(() => {
            const name = settings.trainerName || 'Coach Arjun';
            const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
            return (
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                backgroundColor: 'rgba(101,243,107,0.15)',
                border: '2px solid rgba(101,243,107,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#65F36B', fontSize: '14px', fontWeight: 800,
                flexShrink: 0
              }}>
                {initials}
              </div>
            );
          })()}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {settings.trainerName || 'Coach Arjun'}
            </div>
            <div style={{ fontSize: '12px', color: '#8B949E', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {settings.trainerTitle || 'Personal Trainer'}
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', padding: '8px 10px', borderRadius: '6px', fontSize: '13px', color: '#8B949E', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FF5C5C'; e.currentTarget.style.backgroundColor = 'rgba(255,92,92,0.08)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#8B949E'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
