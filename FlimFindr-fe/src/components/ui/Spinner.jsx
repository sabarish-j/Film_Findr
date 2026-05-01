import React from 'react';
import './Spinner.css';

export const Spinner = ({ size = 'md', color = 'var(--color-brand-red)' }) => {
  const sizeClass = {
    sm: 'spinner--sm',
    md: 'spinner--md',
    lg: 'spinner--lg',
  }[size] || 'spinner--md';

  return (
    <div
      className={`spinner ${sizeClass}`}
      style={{ borderTopColor: color }}
      role="status"
      aria-label="Loading"
    />
  );
};
