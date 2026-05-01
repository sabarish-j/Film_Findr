const { LRUCache } = require('lru-cache');

const tmdbCache = new LRUCache({ max: 500, ttl: 1000 * 60 * 30 });
const aiCache = new LRUCache({ max: 200, ttl: 1000 * 60 * 60 * 6 });
const dailyCounter = new LRUCache({ max: 5000, ttl: 1000 * 60 * 60 * 24 });

module.exports = { tmdbCache, aiCache, dailyCounter };
