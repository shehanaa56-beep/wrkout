import React from 'react';

export const Badge = ({ status, variant, size = 'sm', children }) => {
  const label = children || status;
  const normalized = (variant || status || '').toLowerCase();

  let bg = 'rgba(255, 255, 255, 0.08)';
  let color = '#8B949E';
  let border = '1px solid rgba(255, 255, 255, 0.1)';

  if (['active', 'completed', 'paid', 'success'].includes(normalized)) {
    bg = 'rgba(101, 243, 107, 0.15)';
    color = '#65F36B';
    border = '1px solid rgba(101, 243, 107, 0.3)';
  } else if (['pending', 'warning', 'scheduled'].includes(normalized)) {
    if (normalized === 'scheduled') {
      bg = 'rgba(74, 144, 226, 0.15)';
      color = '#4A90E2';
      border = '1px solid rgba(74, 144, 226, 0.3)';
    } else {
      bg = 'rgba(245, 166, 35, 0.15)';
      color = '#F5A623';
      border = '1px solid rgba(245, 166, 35, 0.3)';
    }
  } else if (['inactive', 'missed', 'cancelled', 'danger', 'failed'].includes(normalized)) {
    bg = 'rgba(255, 92, 92, 0.15)';
    color = '#FF5C5C';
    border = '1px solid rgba(255, 92, 92, 0.3)';
  }

  const isSmall = size === 'sm';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: isSmall ? '3px 8px' : '5px 12px',
        borderRadius: '9999px',
        fontSize: isSmall ? '11px' : '13px',
        fontWeight: 600,
        backgroundColor: bg,
        color: color,
        border: border,
        textTransform: 'capitalize',
        letterSpacing: '0.02em',
        lineHeight: 1
      }}
    >
      {label}
    </span>
  );
};

export default Badge;
