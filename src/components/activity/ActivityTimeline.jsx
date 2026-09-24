import React from 'react';
import { CheckCircle2, DollarSign, UserCheck, AlertCircle, Calendar, PlusCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ActivityTimeline = ({ activities = [], filterClientId = null }) => {
  const navigate = useNavigate();

  const filtered = filterClientId
    ? activities.filter((a) => a.clientId === filterClientId)
    : activities;

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: 'center', color: '#8B949E', padding: '40px 0', fontSize: '14px' }}>
        No recent activities logged.
      </div>
    );
  }

  // Group by dateGroup (or calculate from timestamp)
  const grouped = filtered.reduce((acc, act) => {
    const groupName = act.dateGroup || 'Earlier';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(act);
    return acc;
  }, {});

  const getActivityIcon = (type) => {
    switch (type) {
      case 'session_completed':
        return { icon: CheckCircle2, color: '#65F36B', bg: 'rgba(101, 243, 107, 0.15)' };
      case 'payment_received':
        return { icon: DollarSign, color: '#65F36B', bg: 'rgba(101, 243, 107, 0.15)' };
      case 'session_missed':
        return { icon: AlertCircle, color: '#FF5C5C', bg: 'rgba(255, 92, 92, 0.15)' };
      case 'session_scheduled':
        return { icon: Calendar, color: '#4A90E2', bg: 'rgba(74, 144, 226, 0.15)' };
      case 'client_added':
        return { icon: PlusCircle, color: '#65F36B', bg: 'rgba(101, 243, 107, 0.15)' };
      default:
        return { icon: UserCheck, color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.15)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {Object.entries(grouped).map(([groupTitle, items]) => (
        <div key={groupTitle}>
          {/* Date Header */}
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: '#8B949E',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <span>{groupTitle}</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.06)' }} />
          </div>

          {/* Timeline Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '8px' }}>
            {items.map((act) => {
              const { icon: Icon, color, bg } = getActivityIcon(act.type);
              return (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'flex-start',
                    padding: '14px 16px',
                    backgroundColor: '#11171B',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '12px',
                    transition: 'all 0.18s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                    e.currentTarget.style.backgroundColor = '#141B20';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                    e.currentTarget.style.backgroundColor = '#11171B';
                  }}
                >
                  {/* Icon badge */}
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: color,
                      flexShrink: 0
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>{act.title}</span>
                      {act.timestamp && (
                        <span style={{ fontSize: '11px', color: '#8B949E' }}>
                          {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '3px'
                      }}
                    >
                      <span
                        onClick={() => act.clientId && navigate(`/clients/${act.clientId}`)}
                        style={{
                          fontSize: '13px',
                          color: '#65F36B',
                          fontWeight: 600,
                          cursor: act.clientId ? 'pointer' : 'default',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                      >
                        {act.clientName}
                        {act.clientId && <ArrowUpRight size={12} />}
                      </span>
                    </div>

                    {act.description && (
                      <p style={{ fontSize: '13px', color: '#8B949E', marginTop: '4px', lineHeight: 1.4 }}>
                        {act.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;
