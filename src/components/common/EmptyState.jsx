import React from 'react';
import { Users, Calendar, CreditCard, Activity, TrendingUp, Plus } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: IconComponent = Users,
  title = 'No items found',
  description = 'Get started by creating your first entry.',
  actionText,
  onAction
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '50px 24px',
        backgroundColor: '#11171B',
        border: '1px dashed rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        margin: '20px 0'
      }}
    >
      <div
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: 'rgba(101, 243, 107, 0.1)',
          border: '1px solid rgba(101, 243, 107, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#65F36B',
          marginBottom: '16px'
        }}
      >
        <IconComponent size={26} />
      </div>

      <h4
        style={{
          fontSize: '17px',
          fontWeight: 700,
          color: '#FFFFFF',
          marginBottom: '8px'
        }}
      >
        {title}
      </h4>

      <p
        style={{
          fontSize: '14px',
          color: '#8B949E',
          maxWidth: '360px',
          lineHeight: 1.5,
          marginBottom: actionText ? '20px' : '0'
        }}
      >
        {description}
      </p>

      {actionText && onAction && (
        <Button variant="primary" size="md" icon={Plus} onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
