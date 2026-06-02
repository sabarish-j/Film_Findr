const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');
const { dailyCounter } = require('../services/cache/lruCache');

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: Number(process.env.AI_RATE_LIMIT_PER_MIN || 10),
  keyGenerator: (req, res) =>
    req.user?._id?.toString() || ipKeyGenerator(req, res),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "You're sending messages too fast. Try again in a minute.",
  },
});

function aiDailyLimiter(req, res, next) {
  const max = Number(process.env.AI_DAILY_LIMIT || 100);
  const id = req.user?._id?.toString() || req.ip;
  const today = new Date().toISOString().slice(0, 10);
  const key = `${id}:${today}`;
  const count = dailyCounter.get(key) || 0;
  if (count >= max) {
    return res.status(429).json({
      success: false,
      message: "Daily AI limit reached. It'll reset tomorrow.",
    });
  }
  dailyCounter.set(key, count + 1);
  next();
}

module.exports = { aiLimiter, aiDailyLimiter };
