import React from 'react';
import { Search, Filter, X } from 'lucide-react';

export const ClientFilters = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  onClearFilters
}) => {
  const statusOptions = ['All', 'Active', 'Inactive', 'Payment Pending', 'Completed'];
  const trainingTypes = [
    'All Types',
    'Personal Training',
    'Weight Loss',
    'Muscle Gain',
    'Strength Training',
    'Cardio',
    'General Fitness',
    'Functional Training'
  ];

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || typeFilter !== 'All Types';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px'
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search Bar */}
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#8B949E'
            }}
          />
          <input
            type="text"
            placeholder="Search clients by name, phone or email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              paddingLeft: '38px',
              backgroundColor: '#11171B',
              borderColor: 'rgba(255, 255, 255, 0.08)',
              height: '42px',
              borderRadius: '10px',
              fontSize: '13px'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#8B949E',
                cursor: 'pointer'
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Training Type Select */}
        <div style={{ width: '200px' }}>
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            style={{
              backgroundColor: '#11171B',
              height: '42px',
              borderRadius: '10px',
              fontSize: '13px'
            }}
          >
            {trainingTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: '#FF5C5C',
              fontSize: '12px',
              fontWeight: 600,
              padding: '8px 12px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 92, 92, 0.08)',
              border: '1px solid rgba(255, 92, 92, 0.2)',
              cursor: 'pointer'
            }}
          >
            <X size={14} /> Clear Filters
          </button>
        )}
      </div>

      {/* Status Filter Pills */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {statusOptions.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                color: isActive ? '#080B0D' : '#8B949E',
                backgroundColor: isActive ? '#65F36B' : '#11171B',
                border: isActive ? '1px solid #65F36B' : '1px solid rgba(255, 255, 255, 0.08)',
                transition: 'all 0.15s ease'
              }}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClientFilters;
