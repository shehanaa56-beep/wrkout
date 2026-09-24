import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Menu, Dumbbell, Check } from 'lucide-react';
import { getSettings, getActivities } from '../../utils/storage';

export const Header = ({ onOpenMobile, title, breadcrumbs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const settings = getSettings();
  const activities = getActivities().slice(0, 4);

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/clients?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header
      style={{
        height: '70px',
        backgroundColor: '#080B0D',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}
    >
      {/* Left: Mobile Toggle & Page Title / Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onOpenMobile}
          style={{
            display: 'none',
            color: '#FFFFFF',
            backgroundColor: '#11171B',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        {breadcrumbs ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            {breadcrumbs.map((b, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span style={{ color: '#5d6773' }}>&gt;</span>}
                {b.path ? (
                  <span
                    onClick={() => navigate(b.path)}
                    style={{
                      color: index === breadcrumbs.length - 1 ? '#FFFFFF' : '#8B949E',
                      fontWeight: index === breadcrumbs.length - 1 ? 600 : 400,
                      cursor: 'pointer'
                    }}
                  >
                    {b.name}
                  </span>
                ) : (
                  <span style={{ color: '#FFFFFF', fontWeight: 600 }}>{b.name}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#FFFFFF' }}>{title || 'Dashboard'}</h2>
        )}
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '240px' }} className="header-search-box">
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B949E'
            }}
          />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              paddingLeft: '36px',
              height: '38px',
              backgroundColor: '#11171B',
              borderRadius: '8px',
              fontSize: '13px',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}
          />
        </form>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              backgroundColor: '#11171B',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              position: 'relative',
              cursor: 'pointer'
            }}
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span
              style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
                backgroundColor: '#65F36B',
                borderRadius: '50%'
              }}
            />
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '300px',
                backgroundColor: '#11171B',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                padding: '12px',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingBottom: '8px',
                  marginBottom: '8px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)'
                }}
              >
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Recent Activity</span>
                <span
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/activity');
                  }}
                  style={{ fontSize: '11px', color: '#65F36B', cursor: 'pointer', fontWeight: 600 }}
                >
                  View All
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activities.map((act) => (
                  <div
                    key={act.id}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(255,255,255,0.02)',
                      fontSize: '12px'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>{act.title}</div>
                    <div style={{ color: '#8B949E', fontSize: '11px' }}>{act.clientName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <div
          onClick={() => navigate('/settings')}
          style={{
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <img
            src={settings.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"}
            alt="Profile"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              objectFit: 'cover',
              border: '1.5px solid rgba(101, 243, 107, 0.4)'
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
