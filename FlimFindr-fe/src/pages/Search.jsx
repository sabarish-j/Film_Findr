import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { MovieContext } from '../context/MovieContext';
import { useToast } from '../hooks/useToast';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Spinner } from '../components/ui/Spinner';
import './Search.css';

export const Search = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const { addToast } = useToast();
  const {
    movies,
    loading,
    error,
    watchlist,
    searchMovies,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
  } = useContext(MovieContext);

  // Debounced auto-search as the user types
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        await searchMovies(trimmed);
        setHasSearched(true);
        await getWatchlist();
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Search failed. Please try again.',
        });
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleClear = () => {
    setQuery('');
    setHasSearched(false);
  };

  const handleWatchlistToggle = async (movieId) => {
    try {
      if (watchlist.includes(movieId)) {
        await removeFromWatchlist(movieId);
        addToast({
          type: 'success',
          message: 'Removed from watchlist',
        });
      } else {
        await addToWatchlist(movieId);
        addToast({
          type: 'success',
          message: 'Added to watchlist',
        });
      }
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to update watchlist',
      });
    }
  };

  return (
    <PageWrapper maxWidth="content">
      <div className="search">
        {/* Header */}
        <div className="search__header">
          <h1 className="search__title">
            <SearchIcon size={32} />
            Search Movies
          </h1>
          <p className="search__subtitle">Discover thousands of movies</p>
        </div>

        {/* Search Form */}
        <form className="search__form" onSubmit={(e) => e.preventDefault()}>
          <div className="search__input-wrapper">
            <Input
              type="text"
              placeholder="Search for movies, actors, directors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              leftIcon={SearchIcon}
              autoFocus
            />
          </div>

          <div className="search__actions">
            {hasSearched && (
              <Button variant="ghost" size="md" type="button" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </form>

        {/* Error State */}
        {error && (
          <div className="search__error">
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="search__loading">
            <Spinner size="lg" />
            <p>Searching movies...</p>
          </div>
        )}

        {/* Empty State - No Search */}
        {!hasSearched && !loading && (
          <div className="search__empty">
            <SearchIcon size={48} />
            <h2>Start Searching</h2>
            <p>Enter a movie title, actor name, or director to find movies</p>
          </div>
        )}

        {/* Empty State - No Results */}
        {hasSearched && !loading && movies.length === 0 && (
          <div className="search__empty">
            <SearchIcon size={48} />
            <h2>No Results Found</h2>
            <p>We couldn't find any movies matching "{query}"</p>
            <p className="search__empty-hint">Try a different search term</p>
          </div>
        )}

        {/* Results */}
        {movies.length > 0 && (
          <div className="search__results">
            <div className="search__results-header">
              <p className="search__results-count">
                Found <strong>{movies.length}</strong> movie{movies.length !== 1 ? 's' : ''} for "<strong>{query}</strong>"
              </p>
            </div>

            <MovieGrid
              movies={movies}
              isLoading={false}
              onMovieClick={(id) => navigate(`/movie/${id}`)}
              onWatchlistToggle={handleWatchlistToggle}
              watchlistIds={watchlist}
            />
          </div>
        )}
      </div>
    </PageWrapper>
  );
};
