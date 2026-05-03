import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { MovieCard } from './MovieCard';
import './HorizontalMovieRow.css';

// Distance from the right edge (px) at which we start prefetching the next page.
// Higher = earlier load = smoother scroll, more eager network use.
const LOAD_MORE_THRESHOLD_PX = 600;

export const HorizontalMovieRow = ({
  title,
  movies = [],
  onMovieClick,
  onWatchlistToggle,
  watchlistIds = [],
  onLoadMore,
  hasMore = false,
}) => {
  const scrollRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  // Guards against firing onLoadMore repeatedly while a fetch is in flight
  const loadingMoreRef = useRef(false);

  const triggerLoadMore = useCallback(async () => {
    if (!onLoadMore || !hasMore || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      await onLoadMore();
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [onLoadMore, hasMore]);

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);

    // Pagination trigger — fetch the next page when within threshold of the end
    const distanceToEnd = scrollWidth - clientWidth - scrollLeft;
    if (distanceToEnd < LOAD_MORE_THRESHOLD_PX) {
      triggerLoadMore();
    }
  }, [triggerLoadMore]);

  // If the row's content fits without scrolling but more pages exist,
  // proactively load the next page so the user has something to scroll to.
  useEffect(() => {
    if (!scrollRef.current) return;
    const { scrollWidth, clientWidth } = scrollRef.current;
    if (hasMore && scrollWidth <= clientWidth + 10) {
      triggerLoadMore();
    }
  }, [movies.length, hasMore, triggerLoadMore]);

  const scroll = useCallback((direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 400;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    // Re-check after the smooth scroll lands so arrow visibility + loadMore
    // trigger fire correctly.
    setTimeout(checkScroll, 350);
  }, [checkScroll]);

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

          {/* Load-more spinner placeholder — visible at the end while fetching */}
          {isLoadingMore && (
            <div
              className="horizontal-movie-row__item horizontal-movie-row__loader"
              aria-hidden="true"
            >
              <Loader2 className="horizontal-movie-row__spinner" size={28} />
            </div>
          )}
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
