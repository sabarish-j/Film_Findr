const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get trending movies
exports.getTrending = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: req.query.language || 'en',
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get popular movies
exports.getPopular = async (req, res) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: req.query.language || 'en',
        page: req.query.page || 1,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search movies
exports.searchMovies = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        with_original_language: 'en',
        page: req.query.page || 1,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.results,
      totalPages: response.data.total_pages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get movie details
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(`${TMDB_BASE_URL}/movie/${id}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: req.query.language || 'en',
        append_to_response: 'credits,recommendations',
      },
    });

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get personalized feed
exports.getPersonalizedFeed = async (req, res) => {
  try {
    const user = req.user;
    const language = user.preferredLanguages[0] || 'en';

    // Fetch trending movies
    const trendingResponse = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
      },
    });

    // Fetch popular movies
    const popularResponse = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
      },
    });

    // Fetch upcoming movies
    const upcomingResponse = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
      },
    });

    res.status(200).json({
      success: true,
      data: {
        trending: trendingResponse.data.results,
        popular: popularResponse.data.results,
        upcoming: upcomingResponse.data.results,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
