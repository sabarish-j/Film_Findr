import React from 'react';
import './Skeleton.css';

export const Skeleton = ({ width = '100%', height = '16px', borderRadius = 'var(--radius-md)', className = '' }) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
      }}
      role="status"
      aria-label="Loading"
    />
  );
};
