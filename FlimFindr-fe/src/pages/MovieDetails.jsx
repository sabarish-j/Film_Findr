import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Bookmark, BookmarkX, Check, Clock, Calendar, Globe } from 'lucide-react';
import { MovieContext } from '../context/MovieContext';
import { useToast } from '../hooks/useToast';
import { PageWrapper } from '../components/layout/PageWrapper';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { RatingBadge } from '../components/movie/RatingBadge';
import { CastCard } from '../components/movie/CastCard';
import { Spinner } from '../components/ui/Spinner';
import { TMDB_BACKDROP, TMDB_POSTER_MD } from '../constants';
import './MovieDetails.css';

export const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    loading,
    error,
    getMovieDetails,
    addToWatchlist,
    removeFromWatchlist,
    markAsWatched,
    watchlist,
    watched,
  } = useContext(MovieContext);

  const [movie, setMovie] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const data = await getMovieDetails(id);
        setMovie(data);
        setIsInWatchlist(watchlist.includes(parseInt(id)));
        setIsWatched(watched.includes(parseInt(id)));
      } catch (err) {
        addToast({
          type: 'error',
          message: 'Failed to load movie details',
        });
      }
    };

    fetchMovieDetails();
  }, [id, watchlist, watched]);

  const handleWatchlistToggle = async () => {
    try {
      if (isInWatchlist) {
        await removeFromWatchlist(parseInt(id));
        setIsInWatchlist(false);
        addToast({
          type: 'success',
          message: 'Removed from watchlist',
        });
      } else {
        await addToWatchlist(parseInt(id));
        setIsInWatchlist(true);
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

  const handleMarkAsWatched = async () => {
    try {
      await markAsWatched(parseInt(id));
      setIsWatched(true);
      addToast({
        type: 'success',
        message: 'Marked as watched',
      });
    } catch (error) {
      addToast({
        type: 'error',
        message: 'Failed to mark as watched',
      });
    }
  };

  if (loading || !movie) {
    return (
      <PageWrapper>
        <div className="movie-details__loading">
          <Spinner size="lg" />
          <p>{loading ? 'Loading movie details...' : 'Movie not found'}</p>
        </div>
      </PageWrapper>
    );
  }

  const backdropUrl = `${TMDB_BACKDROP}${movie.backdrop_path}`;
  const posterUrl = `${TMDB_POSTER_MD}${movie.poster_path}`;
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : 'N/A';
  const runtime = movie.runtime ? `${movie.runtime} min` : 'N/A';
  const cast = movie.credits?.cast?.slice(0, 8) || [];

  return (
    <>
      {/* Hero Section with Backdrop */}
      <motion.div
        className="movie-details__hero"
        style={{
          backgroundImage: `url(${backdropUrl})`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="movie-details__hero-overlay" />

        {/* Back Button */}
        <button
          className="movie-details__back-btn"
          onClick={() => navigate(-1)}
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
      </motion.div>

      {/* Content */}
      <PageWrapper maxWidth="content">
        <motion.div
          className="movie-details__content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header Section */}
          <div className="movie-details__header">
            <div className="movie-details__poster-wrapper">
              <img
                src={posterUrl}
                alt={movie.title}
                className="movie-details__poster"
              />
            </div>

            <div className="movie-details__info">
              <div>
                <h1 className="movie-details__title">{movie.title || movie.name}</h1>
                <p className="movie-details__meta">
                  {releaseYear} • {runtime}
                </p>
              </div>

              {/* Rating */}
              <div className="movie-details__rating">
                <RatingBadge rating={movie.vote_average} size="md" />
                <span className="movie-details__vote-count">
                  ({movie.vote_count?.toLocaleString()} votes)
                </span>
              </div>

              {/* Genres */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="movie-details__genres">
                  {movie.genres.slice(0, 4).map((genre) => (
                    <Badge key={genre.id} variant="outline" size="sm">
                      {genre.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Details */}
              <div className="movie-details__details-list">
                {movie.release_date && (
                  <div className="movie-details__detail-item">
                    <Calendar size={18} />
                    <span>{movie.release_date}</span>
                  </div>
                )}
                {movie.runtime && (
                  <div className="movie-details__detail-item">
                    <Clock size={18} />
                    <span>{runtime}</span>
                  </div>
                )}
                {movie.original_language && (
                  <div className="movie-details__detail-item">
                    <Globe size={18} />
                    <span>{movie.original_language.toUpperCase()}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="movie-details__actions">
                <Button
                  variant={isInWatchlist ? 'secondary' : 'primary'}
                  size="lg"
                  icon={isInWatchlist ? <BookmarkX size={20} /> : <Bookmark size={20} />}
                  onClick={handleWatchlistToggle}
                  fullWidth
                >
                  {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>

                {!isWatched ? (
                  <Button
                    variant="success"
                    size="lg"
                    icon={<Check size={20} />}
                    onClick={handleMarkAsWatched}
                    fullWidth
                  >
                    Mark as Watched
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="lg"
                    icon={<Check size={20} />}
                    disabled
                    fullWidth
                  >
                    Watched
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Overview Section */}
          {movie.overview && (
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Overview</h2>
              <p className="movie-details__overview">{movie.overview}</p>
            </section>
          )}

          {/* Cast Section */}
          {cast.length > 0 && (
            <section className="movie-details__section">
              <h2 className="movie-details__section-title">Cast</h2>
              <div className="movie-details__cast-grid">
                {cast.map((actor) => (
                  <CastCard key={actor.id} actor={actor} />
                ))}
              </div>
            </section>
          )}
        </motion.div>
      </PageWrapper>
    </>
  );
};
