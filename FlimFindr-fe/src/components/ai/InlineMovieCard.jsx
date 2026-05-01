import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { TMDB_POSTER_SM } from '../../constants';

export function InlineMovieCard({ movie, onClick }) {
  const year = movie.year || (movie.release_date || '').slice(0, 4);
  const poster = movie.poster_path ? `${TMDB_POSTER_SM}${movie.poster_path}` : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="inline-card"
      onClick={onClick}
      title={movie.title}
    >
      <div className="inline-card-poster">
        {poster ? (
          <img src={poster} alt={movie.title} loading="lazy" />
        ) : (
          <div className="inline-card-placeholder">{movie.title?.charAt(0) || '?'}</div>
        )}
      </div>
      <div className="inline-card-info">
        <strong>{movie.title}</strong>
        <span>
          {year}
          {typeof movie.rating === 'number' || typeof movie.vote_average === 'number' ? (
            <>
              {' · '}
              <Star size={11} fill="currentColor" stroke="none" />
              {(movie.rating ?? movie.vote_average).toFixed(1)}
            </>
          ) : null}
        </span>
      </div>
    </Link>
  );
}
