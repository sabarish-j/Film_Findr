import React from 'react';
import { TMDB_PROFILE } from '../../constants';
import './CastCard.css';

export const CastCard = ({ actor }) => {
  const profileUrl = actor.profile_path
    ? `${TMDB_PROFILE}${actor.profile_path}`
    : null;

  return (
    <div className="cast-card">
      {profileUrl ? (
        <img src={profileUrl} alt={actor.name} className="cast-card__image" />
      ) : (
        <div className="cast-card__placeholder" />
      )}

      <h4 className="cast-card__name">{actor.name}</h4>
      <p className="cast-card__character">{actor.character}</p>
    </div>
  );
};
