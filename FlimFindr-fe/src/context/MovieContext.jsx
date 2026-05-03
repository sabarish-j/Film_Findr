import React, { createContext, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const MovieContext = createContext();

const SELECTED_LANGUAGE_STORAGE_KEY = 'flimfindr.selectedLanguage';

// Dedupe and append helper for paginated lists
const mergeUnique = (existing, incoming) => {
  const seen = new Set(existing.map((m) => m.id));
  const dedupedNew = incoming.filter((m) => m && m.id != null && !seen.has(m.id));
  return [...existing, ...dedupedNew];
};

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [watchlistFetched, setWatchlistFetched] = useState(false);

  // Persisted selected language — survives navigation AND browser refresh
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    try {
      return localStorage.getItem(SELECTED_LANGUAGE_STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const setSelectedLanguage = (lang) => {
    setSelectedLanguageState(lang);
    try {
      localStorage.setItem(SELECTED_LANGUAGE_STORAGE_KEY, lang);
    } catch {
      /* ignore storage errors (private mode, quota, etc.) */
    }
  };

  const hasPersistedLanguage = (() => {
    try {
      return Boolean(localStorage.getItem(SELECTED_LANGUAGE_STORAGE_KEY));
    } catch {
      return false;
    }
  })();

  // Global search query — lives in context so the navbar and home can share it
  const [searchQuery, setSearchQuery] = useState('');

  // Track which language each list was last fetched for, to skip redundant requests
  const [trendingLang, setTrendingLang] = useState(null);
  const [popularLang, setPopularLang] = useState(null);
  const [upcomingLang, setUpcomingLang] = useState(null);

  // ── PAGINATION STATE ─────────────────────────────────────────────
  // page = next page to fetch; totalPages from TMDB; hasMore = page <= totalPages
  const [popularPage, setPopularPage] = useState(1);
  const [popularTotalPages, setPopularTotalPages] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [upcomingTotalPages, setUpcomingTotalPages] = useState(1);

  // Per-genre pagination keyed by `${genreId}_${language}`
  const [genrePagination, setGenrePagination] = useState({});

  // In-flight tracking — prevents duplicate concurrent loads when scroll
  // observers fire multiple times before a request resolves.
  const inFlight = useRef(new Set());

  // Genre-based movies, keyed by `${genreId}_${language}`
  const [genreMovies, setGenreMovies] = useState({});

  // TMDB genre list translated by language: { en: [{id, name}], ta: [...] }
  const [tmdbGenres, setTmdbGenres] = useState({});

  const getTrending = async (language = 'en', { force = false } = {}) => {
    if (!force && trendingLang === language && trending.length > 0) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/trending`, {
        params: { language },
      });
      setTrending(Array.isArray(response.data.data) ? response.data.data : []);
      setTrendingLang(language);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  // ── PAGINATED LIST FETCHERS ──────────────────────────────────────

  const getPopular = async (language = 'en', page = 1, { force = false } = {}) => {
    if (!force && popularLang === language && popular.length > 0 && page === 1) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { language, page },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      setPopular(results);
      setPopularLang(language);
      setPopularPage(2);
      setPopularTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPopular([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMorePopular = useCallback(async (language) => {
    const key = `popular:${language}`;
    if (inFlight.current.has(key)) return;
    if (popularLang !== language) return;
    if (popularPage > popularTotalPages) return;

    inFlight.current.add(key);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { language, page: popularPage },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      if (results.length > 0) {
        setPopular((prev) => mergeUnique(prev, results));
        setPopularPage((p) => p + 1);
        setPopularTotalPages(response.data.totalPages || popularTotalPages);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      inFlight.current.delete(key);
    }
  }, [popularPage, popularTotalPages, popularLang]);

  const getUpcoming = async (language = 'en', page = 1, { force = false } = {}) => {
    if (!force && upcomingLang === language && upcoming.length > 0 && page === 1) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/upcoming`, {
        params: { language, page },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      setUpcoming(results);
      setUpcomingLang(language);
      setUpcomingPage(2);
      setUpcomingTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUpcoming = useCallback(async (language) => {
    const key = `upcoming:${language}`;
    if (inFlight.current.has(key)) return;
    if (upcomingLang !== language) return;
    if (upcomingPage > upcomingTotalPages) return;

    inFlight.current.add(key);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/upcoming`, {
        params: { language, page: upcomingPage },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      if (results.length > 0) {
        setUpcoming((prev) => mergeUnique(prev, results));
        setUpcomingPage((p) => p + 1);
        setUpcomingTotalPages(response.data.totalPages || upcomingTotalPages);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      inFlight.current.delete(key);
    }
  }, [upcomingPage, upcomingTotalPages, upcomingLang]);

  // Fetch the localized TMDB genre list for a language (cached)
  const getGenres = async (language = 'en', { force = false } = {}) => {
    if (!force && tmdbGenres[language]) return tmdbGenres[language];
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/genres`, {
        params: { language },
      });
      const list = Array.isArray(response.data.data) ? response.data.data : [];
      setTmdbGenres((prev) => ({ ...prev, [language]: list }));
      return list;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };

  const getMoviesByGenre = async (genreId, language = 'en', { force = false } = {}) => {
    const key = `${genreId}_${language}`;
    if (!force && genreMovies[key] !== undefined) return genreMovies[key];

    try {
      const response = await axios.get(`${API_BASE_URL}/movies/by-genre`, {
        params: { genreId, language, page: 1 },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      setGenreMovies((prev) => ({ ...prev, [key]: results }));
      setGenrePagination((prev) => ({
        ...prev,
        [key]: { page: 2, totalPages: response.data.totalPages || 1 },
      }));
      return results;
    } catch (err) {
      setError(err.message);
      setGenreMovies((prev) => ({ ...prev, [key]: [] }));
      return [];
    }
  };

  const loadMoreByGenre = useCallback(async (genreId, language) => {
    const key = `${genreId}_${language}`;
    const flightKey = `genre:${key}`;
    if (inFlight.current.has(flightKey)) return;

    const pagination = genrePagination[key];
    if (!pagination) return;
    if (pagination.page > pagination.totalPages) return;

    inFlight.current.add(flightKey);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/by-genre`, {
        params: { genreId, language, page: pagination.page },
      });
      const results = Array.isArray(response.data.data) ? response.data.data : [];
      if (results.length > 0) {
        setGenreMovies((prev) => ({
          ...prev,
          [key]: mergeUnique(prev[key] || [], results),
        }));
        setGenrePagination((prev) => ({
          ...prev,
          [key]: {
            page: pagination.page + 1,
            totalPages: response.data.totalPages || pagination.totalPages,
          },
        }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      inFlight.current.delete(flightKey);
    }
  }, [genrePagination]);

  const searchMovies = async (query, page = 1, { signal } = {}) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { query, page },
        signal,
      });
      setMovies(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
      return response.data;
    } catch (err) {
      if (axios.isCancel?.(err) || err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
        return;
      }
      setError(err.message);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (id, language = 'en') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/${id}`, {
        params: { language },
      });
      setError(null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getPersonalizedFeed = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/feed`);
      setTrending(Array.isArray(response.data.data?.trending) ? response.data.data.trending : []);
      setPopular(Array.isArray(response.data.data?.popular) ? response.data.data.popular : []);
      setUpcoming(Array.isArray(response.data.data?.upcoming) ? response.data.data.upcoming : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTrending([]);
      setPopular([]);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  };

  const addToWatchlist = async (movieId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/watchlist`, {
        movieId,
      });
      setWatchlist(Array.isArray(response.data.watchlist) ? response.data.watchlist : []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/user/watchlist`, {
        data: { movieId },
      });
      setWatchlist(Array.isArray(response.data.watchlist) ? response.data.watchlist : []);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getWatchlist = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/watchlist`);
      setWatchlist(Array.isArray(response.data.watchlist) ? response.data.watchlist : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWatchlist([]);
    }
  };

  const markAsWatched = async (movieId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/watched`, {
        movieId,
      });
      setWatched(Array.isArray(response.data.watched) ? response.data.watched : []);
      setWatchlist(watchlist.filter((id) => id !== movieId));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const getWatched = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/watched`);
      setWatched(Array.isArray(response.data.watched) ? response.data.watched : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setWatched([]);
    }
  };

  // Resolve full movie details for the current watchlist (cached in context)
  const fetchWatchlistMovies = async () => {
    if (watchlist.length === 0) {
      setWatchlistMovies([]);
      setWatchlistFetched(true);
      return;
    }

    const cachedIds = new Set(watchlistMovies.map((m) => m.id));
    const allCached = watchlist.every((id) => cachedIds.has(id));
    if (allCached && watchlistFetched) {
      setWatchlistMovies((prev) => prev.filter((m) => watchlist.includes(m.id)));
      return;
    }

    try {
      const movies = await Promise.all(
        watchlist.map((movieId) => getMovieDetails(movieId).catch(() => null))
      );
      setWatchlistMovies(movies.filter((movie) => movie !== null));
      setWatchlistFetched(true);
    } catch (err) {
      setError(err.message);
    }
  };

  // hasMore helpers exposed to consumers
  const hasMorePopular = popularPage <= popularTotalPages;
  const hasMoreUpcoming = upcomingPage <= upcomingTotalPages;
  const hasMoreByGenre = (genreId, language) => {
    const p = genrePagination[`${genreId}_${language}`];
    return Boolean(p && p.page <= p.totalPages);
  };

  return (
    <MovieContext.Provider
      value={{
        movies,
        trending,
        popular,
        upcoming,
        loading,
        error,
        watchlist,
        watched,
        watchlistMovies,
        watchlistFetched,
        genreMovies,
        tmdbGenres,
        selectedLanguage,
        setSelectedLanguage,
        hasPersistedLanguage,
        searchQuery,
        setSearchQuery,
        getTrending,
        getPopular,
        getUpcoming,
        getGenres,
        getMoviesByGenre,
        searchMovies,
        getMovieDetails,
        getPersonalizedFeed,
        addToWatchlist,
        removeFromWatchlist,
        getWatchlist,
        fetchWatchlistMovies,
        markAsWatched,
        getWatched,
        // Pagination
        loadMorePopular,
        loadMoreUpcoming,
        loadMoreByGenre,
        hasMorePopular,
        hasMoreUpcoming,
        hasMoreByGenre,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
