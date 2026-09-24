import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, CreditCard, MoreHorizontal } from 'lucide-react';

const tabs = [
  { name: 'Home',     path: '/dashboard', icon: LayoutDashboard },
  { name: 'Clients',  path: '/clients',   icon: Users },
  { name: 'Sessions', path: '/sessions',  icon: Calendar },
  { name: 'Payments', path: '/payments',  icon: CreditCard },
  { name: 'More',     path: null,         icon: MoreHorizontal }
];

export const BottomNav = ({ onMoreClick }) => (
  <nav style={{
    position: 'fixed',
    bottom: 0, left: 0, right: 0,
    height: '64px',
    backgroundColor: '#0B0F12',
    borderTop: '1px solid rgba(255,255,255,0.08)',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 200,
    paddingBottom: 'env(safe-area-inset-bottom)'
  }} className="bottom-nav">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      if (tab.path === null) {
        return (
          <button
            key="more"
            onClick={onMoreClick}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', color: '#8B949E', cursor: 'pointer',
              background: 'none', border: 'none', padding: '8px 12px', fontSize: '10px', fontWeight: 500
            }}
          >
            <Icon size={22} strokeWidth={1.8} />
            <span>More</span>
          </button>
        );
      }
      return (
        <NavLink
          key={tab.path}
          to={tab.path}
          style={({ isActive }) => ({
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: '4px', padding: '8px 12px', borderRadius: '8px',
            color: isActive ? '#65F36B' : '#8B949E',
            fontSize: '10px', fontWeight: isActive ? 700 : 500,
            textDecoration: 'none', minWidth: '48px', textAlign: 'center'
          })}
        >
          {({ isActive }) => (
            <>
              <div style={{ position: 'relative' }}>
                <Icon size={22} strokeWidth={isActive ? 2.3 : 1.8} color={isActive ? '#65F36B' : '#8B949E'} />
                {isActive && (
                  <div style={{
                    position: 'absolute', bottom: '-4px', left: '50%',
                    transform: 'translateX(-50%)',
                    width: '4px', height: '4px',
                    borderRadius: '50%', backgroundColor: '#65F36B'
                  }} />
                )}
              </div>
              <span>{tab.name}</span>
            </>
          )}
        </NavLink>
      );
    })}
  </nav>
);

export default BottomNav;
