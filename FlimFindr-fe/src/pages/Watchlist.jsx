import React, { useEffect, useState, useContext } from 'react';
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
    getWatchlist,
    getMovieDetails,
    removeFromWatchlist,
  } = useContext(MovieContext);

  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch watchlist on mount
  useEffect(() => {
    const initializeWatchlist = async () => {
      try {
        setIsLoading(true);
        await getWatchlist();
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to load watchlist',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeWatchlist();
  }, []);

  // Fetch movie details for each watchlist item
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (watchlist.length === 0) {
        setWatchlistMovies([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const movies = await Promise.all(
          watchlist.map((movieId) =>
            getMovieDetails(movieId).catch(() => null)
          )
        );
        setWatchlistMovies(movies.filter((movie) => movie !== null));
      } catch (error) {
        addToast({
          type: 'error',
          message: 'Failed to fetch watchlist movies',
        });
        setWatchlistMovies([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [watchlist]);

  const handleWatchlistToggle = async (movieId) => {
    try {
      await removeFromWatchlist(movieId);
      addToast({
        type: 'success',
        message: 'Removed from watchlist',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to remove from watchlist',
      });
    }
  };

  const handleNavigateToSearch = () => {
    navigate('/search');
  };

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
            onMovieClick={(id) => navigate(`/movie/${id}`)}
            onWatchlistToggle={handleWatchlistToggle}
            watchlistIds={watchlist}
          />
        )}
      </div>
    </PageWrapper>
  );
};
