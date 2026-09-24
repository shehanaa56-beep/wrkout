import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import Badge from '../common/Badge';
import { getClientStats, formatCurrency, formatDate } from '../../utils/calculations';

export const ClientCard = ({ client, sessions = [], payments = [] }) => {
  const navigate = useNavigate();
  const stats = getClientStats(client, sessions, payments);

  const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(client.name)}`;

  return (
    <div
      onClick={() => navigate(`/clients/${client.id}`)}
      style={{
        backgroundColor: '#11171B',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        cursor: 'pointer',
        transition: 'all 0.22s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.borderColor = 'rgba(101, 243, 107, 0.35)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.5), 0 0 15px rgba(101, 243, 107, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'none';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header: Avatar, Name, Training Type & Status */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img
            src={client.avatar || fallbackAvatar}
            alt={client.name}
            onError={(e) => {
              e.currentTarget.src = fallbackAvatar;
            }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '1.5px solid rgba(255, 255, 255, 0.12)'
            }}
          />
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              {client.name}
            </div>
            <div style={{ fontSize: '12px', color: '#8B949E', marginTop: '2px' }}>
              {client.trainingType || 'Personal Training'}
            </div>
          </div>
        </div>

        <Badge status={client.status || 'Active'} />
      </div>

      {/* Sessions Count & Progress Bar */}
      <div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '13px',
            marginBottom: '6px'
          }}
        >
          <span style={{ fontWeight: 600, color: '#FFFFFF' }}>
            {stats.completedSessions} / {stats.totalSessions} Sessions
          </span>
          <span style={{ fontWeight: 700, color: '#65F36B' }}>{stats.progressPercentage}%</span>
        </div>

        {/* Progress Track */}
        <div
          style={{
            height: '6px',
            backgroundColor: '#1A2328',
            borderRadius: '9999px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${stats.progressPercentage}%`,
              backgroundColor: '#65F36B',
              borderRadius: '9999px',
              transition: 'width 0.4s ease'
            }}
          />
        </div>
      </div>

      {/* Payment & Last Session Info */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          paddingTop: '6px',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)'
        }}
      >
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
            {formatCurrency(stats.totalPaid)}{' '}
            <span style={{ color: '#8B949E', fontWeight: 400 }}>/ {formatCurrency(stats.totalPackage)} Paid</span>
          </div>
          <div style={{ fontSize: '11px', color: '#8B949E', marginTop: '3px' }}>
            Last session: {formatDate(stats.lastSessionDate)}
          </div>
        </div>

        <div
          style={{
            color: '#8B949E',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.15s ease'
          }}
        >
          <ChevronRight size={18} />
        </div>
      </div>
    </div>
  );
};

export default ClientCard;
