import React from 'react';

export default function Badge({ children, variant = 'lime', icon: Icon, style = {} }) {
  const variantClass = {
    lime: 'badge-lime',
    gray: 'badge-gray',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger'
  }[variant] || 'badge-lime';

  return (
    <span className={`forge-badge ${variantClass}`} style={style}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

