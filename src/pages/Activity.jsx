import React, { useState } from 'react';
import { Activity as ActivityIcon, Filter } from 'lucide-react';
import ActivityTimeline from '../components/activity/ActivityTimeline';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../utils/seedData';

export const Activity = () => {
  const [activities] = useLocalStorage(STORAGE_KEYS.ACTIVITIES, []);
  const [typeFilter, setTypeFilter] = useState('All');

  const filteredActivities = activities.filter((act) => {
    if (typeFilter === 'All') return true;
    if (typeFilter === 'Sessions') return act.type?.includes('session');
    if (typeFilter === 'Payments') return act.type?.includes('payment');
    if (typeFilter === 'Clients') return act.type?.includes('client');
    return true;
  });

  const filterOptions = ['All', 'Sessions', 'Payments', 'Clients'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Activity Feed
          </h1>
          <p style={{ fontSize: '14px', color: '#8B949E', marginTop: '4px' }}>
            Real-time feed of workout completions, payments, and client updates
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {filterOptions.map((opt) => {
            const isActive = typeFilter === opt;
            return (
              <button
                key={opt}
                onClick={() => setTypeFilter(opt)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: isActive ? '#080B0D' : '#8B949E',
                  backgroundColor: isActive ? '#65F36B' : '#11171B',
                  border: isActive ? '1px solid #65F36B' : '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Timeline Card */}
      <div
        style={{
          backgroundColor: '#11171B',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '24px'
        }}
      >
        <ActivityTimeline activities={filteredActivities} />
      </div>
    </div>
  );
};

export default Activity;
