import React from 'react';
import './Badge.css';

export const Badge = ({ variant = 'default', size = 'md', children, className = '' }) => {
  const variantClass = `badge--${variant}`;
  const sizeClass = `badge--${size}`;

  return (
    <span className={`badge ${variantClass} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};
