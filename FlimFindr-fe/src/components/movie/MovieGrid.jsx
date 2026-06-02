import React from 'react';
import { MovieCard } from './MovieCard';
import { MovieCardSkeleton } from './MovieCardSkeleton';
import './MovieGrid.css';

export const MovieGrid = ({
  movies = [],
  isLoading = false,
  onMovieClick,
  onWatchlistToggle,
  watchlistIds = [],
  skeletonCount = 12,
}) => {
  if (isLoading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <MovieCardSkeleton key={`skeleton-${i}`} size="md" />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="movie-grid movie-grid--empty">
        <p>No movies found</p>
      </div>
    );
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          size="md"
          onClick={onMovieClick}
          onWatchlistToggle={onWatchlistToggle}
          isInWatchlist={watchlistIds.includes(movie.id)}
        />
      ))}
    </div>
  );
};
