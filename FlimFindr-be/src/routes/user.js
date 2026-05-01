const express = require('express');
const {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist,
  markAsWatched,
  getWatched,
  updatePreferences,
  getProfile,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { uploadAvatar: uploadAvatarMiddleware } = require('../middleware/upload');

const router = express.Router();

// All user routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);

router.post('/avatar', uploadAvatarMiddleware.single('avatar'), uploadAvatar);
router.delete('/avatar', deleteAvatar);

router.post('/watchlist', addToWatchlist);
router.delete('/watchlist', removeFromWatchlist);
router.get('/watchlist', getWatchlist);

router.post('/watched', markAsWatched);
router.get('/watched', getWatched);

router.put('/preferences', updatePreferences);

module.exports = router;
