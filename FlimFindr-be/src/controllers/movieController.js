const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Map app genre names to TMDB genre IDs
const GENRE_ID_MAP = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Romance: 10749,
  'Sci-Fi': 878,
  Thriller: 53,
};

// Get trending movies (filtered by original language)
exports.getTrending = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
        sort_by: 'popularity.desc',
        'vote_count.gte': 50,
        page: 1,
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

// Get popular movies (filtered by original language)
exports.getPopular = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
        sort_by: 'vote_count.desc',
        'vote_count.gte': 100,
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

// Get upcoming movies (filtered by original language)
exports.getUpcoming = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const today = new Date().toISOString().split('T')[0];
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const futureDate = sixMonthsLater.toISOString().split('T')[0];

    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
        'primary_release_date.gte': today,
        'primary_release_date.lte': futureDate,
        sort_by: 'popularity.desc',
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

// Get TMDB genre list translated to the requested language
exports.getGenres = async (req, res) => {
  try {
    const language = req.query.language || 'en';
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
      params: {
        api_key: TMDB_API_KEY,
        language,
      },
    });

    res.status(200).json({
      success: true,
      data: response.data.genres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get movies by genre (accepts genre name OR TMDB genre id, filtered by original language)
exports.getByGenre = async (req, res) => {
  try {
    const { genre, genreId: genreIdParam } = req.query;
    const language = req.query.language || 'en';

    // Resolve to a TMDB genre id from either an id or a name
    let genreId = genreIdParam ? Number(genreIdParam) : null;
    if (!genreId && genre) {
      genreId = GENRE_ID_MAP[genre];
    }

    if (!genreId) {
      return res.status(400).json({
        success: false,
        message: 'Genre id or known genre name is required',
      });
    }

    // Try with a moderate vote threshold first, fall back to no threshold
    // so regional-language genres still surface results.
    let response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: language,
        with_genres: genreId,
        sort_by: 'popularity.desc',
        'vote_count.gte': 10,
        page: req.query.page || 1,
      },
    });

    // If too few results came back, retry without the vote threshold
    if (!response.data.results || response.data.results.length < 5) {
      response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_original_language: language,
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page: req.query.page || 1,
        },
      });
    }

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
