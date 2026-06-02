const axios = require('axios');
const { tmdbCache } = require('../cache/lruCache');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

function key(prefix, params) {
  return `${prefix}:${JSON.stringify(params)}`;
}

async function cached(prefix, params, fetcher) {
  const k = key(prefix, params);
  const hit = tmdbCache.get(k);
  if (hit) return hit;
  const data = await fetcher();
  tmdbCache.set(k, data);
  return data;
}

async function discover({ language, genreId, genreIds, year, limit = 20, sort = 'popularity.desc' } = {}) {
  const baseParams = {
    api_key: process.env.TMDB_API_KEY,
    sort_by: sort,
    page: 1,
  };
  if (language) baseParams.with_original_language = language;
  if (genreId) baseParams.with_genres = String(genreId);
  if (Array.isArray(genreIds) && genreIds.length) {
    baseParams.with_genres = genreIds.join('|');
  }
  if (year) {
    baseParams['primary_release_date.gte'] = `${year}-01-01`;
    baseParams['primary_release_date.lte'] = `${year}-12-31`;
  }

  return cached('discover', baseParams, async () => {
    const firstPass = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: { ...baseParams, 'vote_count.gte': 20 },
    });
    let results = firstPass.data.results || [];

    if (results.length < 5) {
      const secondPass = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: baseParams,
      });
      results = secondPass.data.results || results;
    }

    return results.slice(0, limit);
  });
}

async function getMovieDetails(id) {
  if (!id) return null;
  const params = { api_key: process.env.TMDB_API_KEY, append_to_response: 'credits' };
  return cached(`movie:${id}`, {}, async () => {
    try {
      const res = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, { params });
      return res.data;
    } catch {
      return null;
    }
  });
}

async function searchMovies(query, limit = 10) {
  if (!query) return [];
  const params = { api_key: process.env.TMDB_API_KEY, query, page: 1 };
  return cached('search', params, async () => {
    const res = await axios.get(`${TMDB_BASE_URL}/search/movie`, { params });
    return (res.data.results || []).slice(0, limit);
  });
}

module.exports = { discover, getMovieDetails, searchMovies };
