import React, { createContext, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);

  const getTrending = async (language = 'en') => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/trending`, {
        params: { language },
      });
      setTrending(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setTrending([]);
    } finally {
      setLoading(false);
    }
  };

  const getPopular = async (language = 'en', page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/popular`, {
        params: { language, page },
      });
      setPopular(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setPopular([]);
    } finally {
      setLoading(false);
    }
  };

  const getUpcoming = async (language = 'en', page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/upcoming`, {
        params: { language, page },
      });
      setUpcoming(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
    } catch (err) {
      setError(err.message);
      setUpcoming([]);
    } finally {
      setLoading(false);
    }
  };

  const searchMovies = async (query, page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/movies/search`, {
        params: { query, page },
      });
      setMovies(Array.isArray(response.data.data) ? response.data.data : []);
      setError(null);
      return response.data;
    } catch (err) {
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
        getTrending,
        getPopular,
        getUpcoming,
        searchMovies,
        getMovieDetails,
        getPersonalizedFeed,
        addToWatchlist,
        removeFromWatchlist,
        getWatchlist,
        markAsWatched,
        getWatched,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};
