import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon } from 'lucide-react';
import { MovieContext } from '../context/MovieContext';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../hooks/useToast';
import { PageWrapper } from '../components/layout/PageWrapper';
import { HeroSection } from '../components/layout/HeroSection';
import { HorizontalMovieRow } from '../components/movie/HorizontalMovieRow';
import { MovieGrid } from '../components/movie/MovieGrid';
import { Spinner } from '../components/ui/Spinner';
import { LANGUAGE_MAP, GENRE_ID_MAP } from '../constants';
import './Home.css';

export const Home = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useContext(AuthContext);
  const {
    trending,
    popular,
    upcoming,
    movies, // search results live here
    watchlist,
    genreMovies,
    tmdbGenres,
    selectedLanguage,
    setSelectedLanguage,
    hasPersistedLanguage,
    searchQuery,
    getTrending,
    getPopular,
    getUpcoming,
    getGenres,
    getMoviesByGenre,
    searchMovies,
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist,
  } = useContext(MovieContext);

  // searchQuery now comes from MovieContext (driven by the navbar input)
  const [isSearching, setIsSearching] = useState(false);
  const isSearchActive = searchQuery.trim().length > 0;

  // First-time only: seed selectedLanguage from user's preferred languages.
  // After that, the persisted localStorage value wins.
  useEffect(() => {
    if (!hasPersistedLanguage && user?.preferredLanguages?.length > 0) {
      setSelectedLanguage(user.preferredLanguages[0]);
    }
    if (user && watchlist.length === 0) {
      getWatchlist();
    }
  }, [user]);

  // Always fetch English genres for fallback names
  useEffect(() => {
    getGenres('en');
  }, []);

  // Fetch all the home feed data when the language changes (cached in context)
  useEffect(() => {
    getTrending(selectedLanguage);
    getPopular(selectedLanguage);
    getUpcoming(selectedLanguage);

    (async () => {
      const genres = await getGenres(selectedLanguage);
      const idsToFetch =
        genres.length > 0
          ? genres.map((g) => g.id)
          : Object.values(GENRE_ID_MAP);
      idsToFetch.forEach((id) => getMoviesByGenre(id, selectedLanguage));
    })();
  }, [selectedLanguage]);

  // Debounced real-time search (350 ms after the last keystroke)
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      try {
        await searchMovies(trimmed);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Build genre rows (with localized fallbacks)
  const localizedGenres = tmdbGenres[selectedLanguage] || [];
  const englishGenres = tmdbGenres.en || [];
  const englishNameById = Object.fromEntries(englishGenres.map((g) => [g.id, g.name]));
  const fallbackNameById = Object.fromEntries(
    Object.entries(GENRE_ID_MAP).map(([name, id]) => [id, name])
  );
  const baseGenreList =
    localizedGenres.length > 0
      ? localizedGenres
      : Object.entries(GENRE_ID_MAP).map(([name, id]) => ({ id, name }));
  const genreSections = baseGenreList
    .map((g) => {
      const list = genreMovies[`${g.id}_${selectedLanguage}`];
      if (!list || list.length === 0) return null;
      const title =
        (g.name && g.name.trim()) ||
        englishNameById[g.id] ||
        fallbackNameById[g.id] ||
        `Genre ${g.id}`;
      return { id: g.id, title, movies: list };
    })
    .filter(Boolean);

  const handleWatchlistToggle = async (movieId) => {
    try {
      if (watchlist.includes(movieId)) {
        await removeFromWatchlist(movieId);
        addToast({ type: 'success', message: 'Removed from watchlist' });
      } else {
        await addToWatchlist(movieId);
        addToast({ type: 'success', message: 'Added to watchlist' });
      }
    } catch (error) {
      addToast({ type: 'error', message: 'Failed to update watchlist' });
    }
  };

  const handleMovieClick = (movieId) => navigate(`/movie/${movieId}`);

  return (
    <PageWrapper maxWidth="full" noPadding>
      {/* Hero — only when not searching */}
      {!isSearchActive && trending.length > 0 && (
        <HeroSection
          movie={trending[0]}
          onPlayClick={() => handleMovieClick(trending[0].id)}
          onDetailsClick={() => handleMovieClick(trending[0].id)}
          isLoading={false}
        />
      )}

      {/* Language filter bar — only visible when not actively searching */}
      {!isSearchActive && user?.preferredLanguages?.length > 0 && (
        <div className="home__filter-bar">
          <div className="home__container">
            <div className="home__language-buttons">
              {user.preferredLanguages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`home__language-btn ${
                    selectedLanguage === lang ? 'home__language-btn--active' : ''
                  }`}
                >
                  {LANGUAGE_MAP[lang]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Body: search results OR normal feed */}
      <div className="home__container">
        <AnimatePresence mode="wait">
          {isSearchActive ? (
            <motion.div
              key="search"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <h2 className="home__search-heading">
                Results for "<span>{searchQuery}</span>"
              </h2>

              {isSearching && movies.length === 0 ? (
                <div className="home__search-loading">
                  <Spinner size="lg" />
                  <p>Searching...</p>
                </div>
              ) : movies.length === 0 ? (
                <div className="home__search-empty">
                  <SearchIcon size={48} />
                  <h3>No movies found</h3>
                  <p>Try a different search term</p>
                </div>
              ) : (
                <MovieGrid
                  movies={movies}
                  isLoading={false}
                  onMovieClick={handleMovieClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  watchlistIds={watchlist}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="feed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {trending.length > 0 && (
                <HorizontalMovieRow
                  title="Trending Now"
                  movies={trending}
                  onMovieClick={handleMovieClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  watchlistIds={watchlist}
                />
              )}
              {popular.length > 0 && (
                <HorizontalMovieRow
                  title="Popular Movies"
                  movies={popular}
                  onMovieClick={handleMovieClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  watchlistIds={watchlist}
                />
              )}
              {upcoming.length > 0 && (
                <HorizontalMovieRow
                  title="Coming Soon"
                  movies={upcoming}
                  onMovieClick={handleMovieClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  watchlistIds={watchlist}
                />
              )}
              {genreSections.map(({ id, title, movies: list }) => (
                <HorizontalMovieRow
                  key={`${id}_${selectedLanguage}`}
                  title={title}
                  movies={list}
                  onMovieClick={handleMovieClick}
                  onWatchlistToggle={handleWatchlistToggle}
                  watchlistIds={watchlist}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageWrapper>
  );
};
