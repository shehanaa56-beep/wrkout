import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, Dumbbell } from 'lucide-react';
import { getSettings, getActivities } from '../../utils/storage';

export const Header = ({ onOpenMobile, title, breadcrumbs }) => {
  const navigate = useNavigate();
  const settings = getSettings();
  const activities = getActivities().slice(0, 4);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/clients?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  return (
    <header style={{
      height: '64px',
      backgroundColor: '#080B0D',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* ── LEFT: hamburger (mobile) + logo (mobile) / breadcrumb (desktop) ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
        {/* Hamburger — visible on mobile only */}
        <button
          onClick={onOpenMobile}
          className="mobile-menu-btn"
          aria-label="Open menu"
          style={{
            display: 'none',
            width: '36px', height: '36px',
            borderRadius: '8px',
            backgroundColor: '#11171B',
            border: '1px solid rgba(255,255,255,0.1)',
            alignItems: 'center', justifyContent: 'center',
            color: '#FFFFFF', cursor: 'pointer', flexShrink: 0
          }}
        >
          <Menu size={20} />
        </button>

        {/* Mobile brand logo — shown next to hamburger on small screens */}
        <div className="mobile-brand" style={{ display: 'none', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            backgroundColor: 'rgba(101,243,107,0.15)',
            border: '1px solid rgba(101,243,107,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#65F36B'
          }}>
            <Dumbbell size={16} strokeWidth={2.4} />
          </div>
          <span style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>FitCoach</span>
        </div>

        {/* Desktop: breadcrumbs / title */}
        <div className="desktop-title">
          {breadcrumbs ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              {breadcrumbs.map((b, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ color: '#5d6773' }}>›</span>}
                  {b.path ? (
                    <span onClick={() => navigate(b.path)}
                      style={{ color: i === breadcrumbs.length - 1 ? '#FFFFFF' : '#8B949E', fontWeight: i === breadcrumbs.length - 1 ? 600 : 400, cursor: 'pointer' }}>
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
      </div>

      {/* ── RIGHT: search (desktop) + bell + avatar ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        {/* Search — hidden on mobile */}
        <form onSubmit={handleSearchSubmit}
          className="header-search-box"
          style={{ position: 'relative', width: '220px' }}>
          <Search size={15} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#8B949E' }} />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '34px', height: '36px', fontSize: '13px', backgroundColor: '#11171B', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}
          />
        </form>

        {/* Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#11171B',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#FFFFFF', cursor: 'pointer', position: 'relative'
            }}
          >
            <Bell size={18} />
            <span style={{
              position: 'absolute', top: '7px', right: '7px',
              width: '7px', height: '7px',
              backgroundColor: '#65F36B', borderRadius: '50%'
            }} />
          </button>

          {showNotifications && (
            <div style={{
              position: 'absolute', right: 0, top: '44px',
              width: '290px', backgroundColor: '#11171B',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              padding: '12px', zIndex: 100,
              animation: 'fadeIn 0.15s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>Recent Activity</span>
                <span onClick={() => { setShowNotifications(false); navigate('/activity'); }}
                  style={{ fontSize: '11px', color: '#65F36B', cursor: 'pointer', fontWeight: 600 }}>View All</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {activities.map((act) => (
                  <div key={act.id} style={{ padding: '8px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.02)', fontSize: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#FFFFFF', marginBottom: '2px' }}>{act.title}</div>
                    <div style={{ color: '#8B949E', fontSize: '11px' }}>{act.clientName}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar — initials based */}
        {(() => {
          const name = settings.trainerName || 'Coach Arjun';
          const initials = name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
          return (
            <div
              onClick={() => navigate('/settings')}
              title={name}
              style={{
                width: '36px', height: '36px',
                borderRadius: '8px',
                backgroundColor: 'rgba(101,243,107,0.15)',
                border: '1.5px solid rgba(101,243,107,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#65F36B', fontSize: '13px', fontWeight: 800,
                cursor: 'pointer', letterSpacing: '0.02em', flexShrink: 0
              }}
            >
              {initials}
            </div>
          );
        })()}
      </div>
    </header>
  );
};

export default Header;
