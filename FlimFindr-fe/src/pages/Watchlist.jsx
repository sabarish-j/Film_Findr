import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, Search as SearchIcon } from 'lucide-react';
import { MovieContext } from '../context/MovieContext';
import { useToast } from '../hooks/useToast';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Spinner } from '../components/ui/Spinner';
import './Watchlist.css';

export const Watchlist = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    watchlist,
    watchlistMovies,
    watchlistFetched,
    getWatchlist,
    fetchWatchlistMovies,
    removeFromWatchlist,
  } = useContext(MovieContext);

  // Show loading only on first-ever load, not when navigating back to a populated watchlist
  const [isLoading, setIsLoading] = useState(!watchlistFetched);

  // Fetch watchlist IDs on mount (skipped by context if already cached)
  useEffect(() => {
    const initializeWatchlist = async () => {
      try {
        await getWatchlist();
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to load watchlist',
        });
      }
    };

    initializeWatchlist();
  }, []);

  // Resolve movie details when watchlist IDs change
  useEffect(() => {
    const resolve = async () => {
      try {
        if (!watchlistFetched) setIsLoading(true);
        await fetchWatchlistMovies();
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to fetch watchlist movies',
        });
      } finally {
        setIsLoading(false);
      }
    };

    resolve();
  }, [watchlist]);

  const handleWatchlistToggle = useCallback(
    async (movieId) => {
      try {
        await removeFromWatchlist(movieId);
        addToast({ type: 'success', message: 'Removed from watchlist' });
      } catch (error) {
        addToast({ type: 'error', message: 'Failed to remove from watchlist' });
      }
    },
    [removeFromWatchlist, addToast]
  );

  const handleNavigateToSearch = useCallback(() => navigate('/search'), [navigate]);

  const handleMovieClick = useCallback((id) => navigate(`/movie/${id}`), [navigate]);

  return (
    <PageWrapper maxWidth="content">
      <div className="watchlist">
        {/* Header */}
        <div className="watchlist__header">
          <h1 className="watchlist__title">My Watchlist</h1>
          {watchlistMovies.length > 0 && (
            <p className="watchlist__count">
              {watchlistMovies.length} movie{watchlistMovies.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="watchlist__loading">
            <Spinner size="lg" />
            <p>Loading your watchlist...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && watchlistMovies.length === 0 && (
          <div className="watchlist__empty">
            <BookmarkX size={64} />
            <h2>Your Watchlist is Empty</h2>
            <p>Add movies to your watchlist to keep track of them</p>
            <Button
              variant="primary"
              size="lg"
              icon={<SearchIcon size={20} />}
              onClick={handleNavigateToSearch}
            >
              Explore Movies
            </Button>
          </div>
        )}

        {/* Results */}
        {!isLoading && watchlistMovies.length > 0 && (
          <MovieGrid
            movies={watchlistMovies}
            isLoading={false}
            onMovieClick={handleMovieClick}
            onWatchlistToggle={handleWatchlistToggle}
            watchlistIds={watchlist}
          />
        )}
      </div>
    </PageWrapper>
  );
};
