import React from 'react';
import { Star } from 'lucide-react';
import './RatingBadge.css';

export const RatingBadge = ({ rating, size = 'md' }) => {
  if (!rating && rating !== 0) return null;

  const getVariant = () => {
    if (rating >= 8) return 'gold';
    if (rating >= 7) return 'success';
    if (rating >= 5) return 'default';
    return 'error';
  };

  const formattedRating = (rating / 2).toFixed(1);

  return (
    <div className={`rating-badge rating-badge--${size} rating-badge--${getVariant()}`}>
      <Star size={size === 'sm' ? 14 : 16} fill="currentColor" />
      <span>{formattedRating}</span>
    </div>
  );
};
