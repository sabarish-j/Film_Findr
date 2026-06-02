import React from 'react';
import { Skeleton } from '../ui/Skeleton';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import './HorizontalMovieRow.css';

/**
 * Skeleton placeholder for a horizontal movie row — matches HorizontalMovieRow's
 * exact layout so the user sees the page structure immediately while data loads.
 */
export const HorizontalMovieRowSkeleton = ({ count = 6, showTitle = true }) => {
  return (
    <div className="horizontal-movie-row" aria-busy="true">
      {showTitle && (
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <Skeleton width="220px" height="32px" />
        </div>
      )}

      <div className="horizontal-movie-row__container">
        <div className="horizontal-movie-row__scroll" style={{ overflow: 'hidden' }}>
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="horizontal-movie-row__item">
              <MovieCardSkeleton size="md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
