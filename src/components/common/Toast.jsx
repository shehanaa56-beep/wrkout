import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastItem = ({ id, message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3800);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={18} color="#65F36B" />;
      case 'error':
      case 'danger':
        return <AlertCircle size={18} color="#FF5C5C" />;
      case 'warning':
        return <AlertTriangle size={18} color="#F5A623" />;
      default:
        return <Info size={18} color="#4A90E2" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'rgba(101, 243, 107, 0.4)';
      case 'error':
      case 'danger':
        return 'rgba(255, 92, 92, 0.4)';
      case 'warning':
        return 'rgba(245, 166, 35, 0.4)';
      default:
        return 'rgba(74, 144, 226, 0.4)';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: '#11171B',
        border: `1px solid ${getBorderColor()}`,
        borderRadius: '10px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 0, 0, 0.4)',
        color: '#FFFFFF',
        fontSize: '14px',
        minWidth: '280px',
        maxWidth: '380px',
        position: 'relative',
        overflow: 'hidden',
        animation: 'slideIn 0.25s ease-out'
      }}
    >
      <div style={{ flexShrink: 0 }}>{getIcon()}</div>
      <div style={{ flex: 1, fontWeight: 500, lineHeight: 1.4 }}>{message}</div>
      <button
        onClick={() => onClose(id)}
        style={{
          color: '#8B949E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2px',
          borderRadius: '4px',
          transition: 'color 0.15s ease'
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = '#FFFFFF')}
        onMouseLeave={(e) => (e.currentTarget.style.color = '#8B949E')}
      >
        <X size={16} />
      </button>

      {/* Progress countdown indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          height: '2px',
          backgroundColor: type === 'success' ? '#65F36B' : type === 'error' ? '#FF5C5C' : '#4A90E2',
          width: '100%',
          animation: 'shrink 3.8s linear forwards'
        }}
      />
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}
    >
      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <ToastItem id={toast.id} message={toast.message} type={toast.type} onClose={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
