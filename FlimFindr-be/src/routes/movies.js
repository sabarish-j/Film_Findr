const express = require('express');
const {
  getTrending,
  getPopular,
  searchMovies,
  getMovieDetails,
  getPersonalizedFeed,
} = require('../controllers/movieController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/trending', getTrending);
router.get('/popular', getPopular);
router.get('/search', searchMovies);
router.get('/feed', protect, getPersonalizedFeed);
router.get('/:id', getMovieDetails);

module.exports = router;
