import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import { Icon } from './Icon';

export const MovieCard = ({ movie }) => {
  const { addToWatchlist, removeFromWatchlist, watchlist } = useContext(MovieContext);
  const [isInWatchlist, setIsInWatchlist] = useState(watchlist.includes(movie.id));

  const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  const handleAddToWatchlist = async (e) => {
    e.preventDefault();
    if (!isInWatchlist) {
      await addToWatchlist(movie.id);
      setIsInWatchlist(true);
    } else {
      await removeFromWatchlist(movie.id);
      setIsInWatchlist(false);
    }
  };

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <img
        src={movie.poster_path ? posterUrl : 'https://via.placeholder.com/200x300?text=No+Poster'}
        alt={movie.title}
        className="movie-poster"
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-rating" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Icon name="star" size={18} color="inherit" />
          {movie.vote_average?.toFixed(1) || 'N/A'}
        </p>
        <button
          className={isInWatchlist ? 'remove-btn' : 'add-btn'}
          onClick={handleAddToWatchlist}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
        >
          {isInWatchlist ? (
            <>
              <Icon name="check" size={16} color="inherit" />
              In Watchlist
            </>
          ) : (
            '+ Watchlist'
          )}
        </button>
      </div>
    </Link>
  );
};
