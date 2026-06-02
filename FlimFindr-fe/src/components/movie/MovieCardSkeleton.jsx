import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import './MovieCard.css';

export const MovieCardSkeleton = ({ size = 'md' }) => {
  const sizeClass = `movie-card--${size}`;

  return (
    <div className={`movie-card ${sizeClass}`}>
      <Skeleton width="100%" borderRadius="var(--radius-lg)" />
    </div>
  );
};
