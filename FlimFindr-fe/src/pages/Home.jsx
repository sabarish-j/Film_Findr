import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MovieContext } from '../context/MovieContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { PageWrapper } from '../components/layout/PageWrapper';
import { HeroSection } from '../components/layout/HeroSection';
import { HorizontalMovieRow } from '../components/movie/HorizontalMovieRow';
import { Badge } from '../components/ui/Badge';
import { Spinner } from '../components/ui/Spinner';
import { LANGUAGE_MAP } from '../constants';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const {
    trending,
    popular,
    upcoming,
    loading,
    watchlist,
    getTrending,
    getPopular,
    getUpcoming,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
  } = useContext(MovieContext);

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Initialize language and watchlist
  useEffect(() => {
    if (user?.preferredLanguages && user.preferredLanguages.length > 0) {
      setSelectedLanguage(user.preferredLanguages[0]);
    }
    if (user) {
      getWatchlist();
    }
  }, [user]);

  // Fetch movies in selected language
  useEffect(() => {
    getTrending(selectedLanguage);
    getPopular(selectedLanguage);
    getUpcoming(selectedLanguage);
  }, [selectedLanguage]);

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

  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  if (loading && trending.length === 0) {
    return (
      <div style={{ padding: '40px', color: 'white', textAlign: 'center' }}>
        <p>Loading movies...</p>
      </div>
    );
  }

  return (
    <PageWrapper maxWidth="full" noPadding>
      {/* Hero Section */}
      {trending.length > 0 && (
        <HeroSection
          movie={trending[0]}
          onPlayClick={() => handleMovieClick(trending[0].id)}
          onDetailsClick={() => handleMovieClick(trending[0].id)}
          isLoading={false}
        />
      )}

      {/* Language Selector */}
      {user?.preferredLanguages && user.preferredLanguages.length > 0 && (
        <div className="home__language-bar">
          <div className="home__container">
            <label className="home__language-label">View in:</label>
            <div className="home__language-buttons">
              {user.preferredLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`home__language-btn ${selectedLanguage === lang ? 'home__language-btn--active' : ''}`}
                >
                  {LANGUAGE_MAP[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Movie Sections */}
      <div className="home__container">
        {/* Trending Section */}
        {trending.length > 0 && (
          <HorizontalMovieRow
            title="Trending Now"
            movies={trending}
            onMovieClick={handleMovieClick}
            onWatchlistToggle={handleWatchlistToggle}
            watchlistIds={watchlist}
          />
        )}

        {/* Popular Section */}
        {popular.length > 0 && (
          <HorizontalMovieRow
            title="Popular Movies"
            movies={popular}
            onMovieClick={handleMovieClick}
            onWatchlistToggle={handleWatchlistToggle}
            watchlistIds={watchlist}
          />
        )}

        {/* Upcoming Section */}
        {upcoming.length > 0 && (
          <HorizontalMovieRow
            title="Coming Soon"
            movies={upcoming}
            onMovieClick={handleMovieClick}
            onWatchlistToggle={handleWatchlistToggle}
            watchlistIds={watchlist}
          />
        )}
      </div>
    </PageWrapper>
  );
};
