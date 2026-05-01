const express = require('express');
const { protect } = require('../middleware/auth');
const { aiLimiter, aiDailyLimiter } = require('../middleware/rateLimit');
const {
  chat,
  suggestions,
  history,
  clearHistory,
} = require('../controllers/aiController');

const router = express.Router();

router.post('/chat', protect, aiLimiter, aiDailyLimiter, chat);
router.get('/suggestions', protect, suggestions);
router.get('/history', protect, history);
router.delete('/history', protect, clearHistory);

module.exports = router;
