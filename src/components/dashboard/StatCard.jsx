import React from 'react';

export const StatCard = ({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg = 'rgba(101, 243, 107, 0.15)',
  iconColor = '#65F36B',
  subtextColor = '#65F36B'
}) => {
  return (
    <div
      style={{
        backgroundColor: '#11171B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'all 0.2s ease',
        cursor: 'default'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#8B949E' }}>{title}</span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: iconBg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: iconColor
            }}
          >
            <Icon size={18} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div
        style={{
          fontSize: '28px',
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          lineHeight: 1.1
        }}
      >
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '12px', fontWeight: 600, color: subtextColor, display: 'flex', alignItems: 'center', gap: '4px' }}>
          {subtext}
        </div>
      )}
    </div>
  );
};

export default StatCard;
