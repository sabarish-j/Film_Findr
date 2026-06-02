const express = require('express');
const {
  getTrending,
  getPopular,
  getUpcoming,
  getByGenre,
  getGenres,
  searchMovies,
  getMovieDetails,
  getPersonalizedFeed,
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');
const { cacheMiddleware } = require('../middleware/cache');

const router = express.Router();

// Cache TTLs (ms)
const TEN_MIN = 10 * 60 * 1000;
const THIRTY_MIN = 30 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

router.get('/trending', cacheMiddleware(TEN_MIN), getTrending);
router.get('/popular', cacheMiddleware(TEN_MIN), getPopular);
router.get('/upcoming', cacheMiddleware(TEN_MIN), getUpcoming);
router.get('/by-genre', cacheMiddleware(TEN_MIN), getByGenre);
router.get('/genres', cacheMiddleware(ONE_DAY), getGenres);
router.get('/search', cacheMiddleware(THIRTY_MIN), searchMovies);
router.get('/feed', protect, getPersonalizedFeed);
router.get('/:id', cacheMiddleware(THIRTY_MIN), getMovieDetails);

module.exports = router;
