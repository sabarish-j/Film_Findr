import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';
import './HorizontalMovieRow.css';

export const HorizontalMovieRow = ({
  title,
  movies = [],
  onMovieClick,
  onWatchlistToggle,
  watchlistIds = [],
}) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <motion.div
      className="horizontal-movie-row"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true, margin: '-100px' }}
    >
      {title && <h3 className="horizontal-movie-row__title">{title}</h3>}

      <div className="horizontal-movie-row__container">
        {/* Left Arrow */}
        {showLeftButton && (
          <button
            className="horizontal-movie-row__button horizontal-movie-row__button--left"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="horizontal-movie-row__scroll"
          onScroll={checkScroll}
          onMouseEnter={checkScroll}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="horizontal-movie-row__item">
              <MovieCard
                movie={movie}
                size="md"
                onClick={onMovieClick}
                onWatchlistToggle={onWatchlistToggle}
                isInWatchlist={watchlistIds.includes(movie.id)}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {showRightButton && (
          <button
            className="horizontal-movie-row__button horizontal-movie-row__button--right"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
