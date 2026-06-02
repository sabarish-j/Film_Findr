import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkX } from 'lucide-react';
import { Button } from '../ui/Button';
import { RatingBadge } from './RatingBadge';
import { TMDB_POSTER_MD, GENRES } from '../../constants';
import './MovieCard.css';

const MovieCardImpl = ({
  movie,
  size = 'md',
  onClick,
  onWatchlistToggle,
  isInWatchlist = false,
  loading = 'lazy',
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const posterUrl = `${TMDB_POSTER_MD}${movie.poster_path}`;

  const genres =
    movie.genre_ids
      ?.slice(0, 2)
      .map((id) => GENRES[id] || 'Unknown')
      .join(' • ') || 'N/A';

  const handleCardClick = useCallback(() => {
    if (onClick) onClick(movie.id);
  }, [onClick, movie.id]);

  const handleWatchlistClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (onWatchlistToggle) onWatchlistToggle(movie.id);
    },
    [onWatchlistToggle, movie.id]
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => setIsHovering(false), []);

  return (
    <motion.div
      className={`movie-card movie-card--${size}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <img
        src={posterUrl}
        alt={movie.title || movie.name}
        className="movie-card__poster"
        loading={loading}
        decoding="async"
      />

      {/* Hover Overlay */}
      <motion.div
        className="movie-card__overlay"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isHovering ? 1 : 0, y: isHovering ? 0 : 20 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isHovering ? 'auto' : 'none' }}
      >
        <div className="movie-card__overlay-content">
          <h3 className="movie-card__title">{movie.title || movie.name}</h3>

          <div className="movie-card__meta">
            <RatingBadge rating={movie.vote_average} size="sm" />
            <span className="movie-card__genres">{genres}</span>
          </div>

          <p className="movie-card__overview">{movie.overview}</p>

          <div className="movie-card__actions">
            <Button size="sm" variant="primary" fullWidth onClick={handleCardClick}>
              View Details
            </Button>
            <button
              className="movie-card__watchlist-btn"
              onClick={handleWatchlistClick}
              aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              {isInWatchlist ? <BookmarkX size={20} /> : <Bookmark size={20} />}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Re-render only when the data that actually affects this card changes.
// Stops Home/Search re-renders (search input, language toggle, etc.) from
// cascading into hundreds of cards.
export const MovieCard = memo(MovieCardImpl, (prev, next) => {
  return (
    prev.movie.id === next.movie.id &&
    prev.isInWatchlist === next.isInWatchlist &&
    prev.size === next.size &&
    prev.loading === next.loading &&
    prev.onClick === next.onClick &&
    prev.onWatchlistToggle === next.onWatchlistToggle
  );
});
