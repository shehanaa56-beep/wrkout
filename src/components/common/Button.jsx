import React from 'react';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  style = {},
  className = ''
}) => {
  const getBaseStyles = () => {
    let sizeStyle = {
      padding: '10px 18px',
      fontSize: '14px',
      borderRadius: '8px',
      gap: '8px'
    };

    if (size === 'sm') {
      sizeStyle = {
        padding: '6px 12px',
        fontSize: '13px',
        borderRadius: '6px',
        gap: '6px'
      };
    } else if (size === 'lg') {
      sizeStyle = {
        padding: '14px 24px',
        fontSize: '15px',
        borderRadius: '10px',
        gap: '10px'
      };
    }

    let variantStyle = {};

    switch (variant) {
      case 'primary':
        variantStyle = {
          backgroundColor: '#65F36B',
          color: '#080B0D',
          fontWeight: 700,
          border: '1px solid #65F36B',
          boxShadow: '0 0 16px rgba(101, 243, 107, 0.25)'
        };
        break;
      case 'secondary':
        variantStyle = {
          backgroundColor: '#151C20',
          color: '#FFFFFF',
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.1)'
        };
        break;
      case 'outline':
        variantStyle = {
          backgroundColor: 'transparent',
          color: '#FFFFFF',
          fontWeight: 600,
          border: '1px solid rgba(255, 255, 255, 0.15)'
        };
        break;
      case 'danger':
        variantStyle = {
          backgroundColor: 'rgba(255, 92, 92, 0.15)',
          color: '#FF5C5C',
          fontWeight: 600,
          border: '1px solid rgba(255, 92, 92, 0.3)'
        };
        break;
      case 'ghost':
        variantStyle = {
          backgroundColor: 'transparent',
          color: '#8B949E',
          fontWeight: 500,
          border: '1px solid transparent'
        };
        break;
      default:
        variantStyle = {
          backgroundColor: '#65F36B',
          color: '#080B0D',
          fontWeight: 700
        };
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'all 0.18s ease',
      width: fullWidth ? '100%' : 'auto',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
      ...sizeStyle,
      ...variantStyle,
      ...style
    };
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    if (variant === 'primary') {
      e.currentTarget.style.backgroundColor = '#52e058';
      e.currentTarget.style.boxShadow = '0 0 22px rgba(101, 243, 107, 0.4)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'secondary' || variant === 'outline') {
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
      e.currentTarget.style.transform = 'translateY(-1px)';
    } else if (variant === 'danger') {
      e.currentTarget.style.backgroundColor = 'rgba(255, 92, 92, 0.25)';
      e.currentTarget.style.borderColor = '#FF5C5C';
    } else if (variant === 'ghost') {
      e.currentTarget.style.color = '#FFFFFF';
      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    }
  };

  const handleMouseLeave = (e) => {
    if (disabled) return;
    const base = getBaseStyles();
    e.currentTarget.style.backgroundColor = base.backgroundColor;
    e.currentTarget.style.color = base.color;
    e.currentTarget.style.borderColor = base.border ? base.border.split(' ')[2] || 'transparent' : 'transparent';
    e.currentTarget.style.boxShadow = base.boxShadow || 'none';
    e.currentTarget.style.transform = 'none';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={getBaseStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
    </button>
  );
};

export default Button;
