import React from 'react';
import { X, Dumbbell } from 'lucide-react';
import Sidebar from './Sidebar';

export const MobileNav = ({ isOpen, onClose, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        animation: 'fadeInOverlay 0.2s ease-out'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          width: '280px',
          height: '100%',
          backgroundColor: '#0B0F12',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '16px',
            color: '#8B949E',
            backgroundColor: 'rgba(255,255,255,0.05)',
            border: 'none',
            borderRadius: '6px',
            padding: '6px',
            cursor: 'pointer',
            zIndex: 110
          }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        <Sidebar onCloseMobile={onClose} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default MobileNav;
