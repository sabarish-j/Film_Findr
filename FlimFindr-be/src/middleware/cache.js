const { LRUCache } = require('lru-cache');

const movieCache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 10,
});

const cacheMiddleware = (ttlMs) => (req, res, next) => {
  const key = `${req.method}:${req.originalUrl}`;
  const cached = movieCache.get(key);

  if (cached) {
    res.set('X-Cache', 'HIT');
    res.set('Cache-Control', `public, max-age=${Math.floor((ttlMs || 600000) / 1000)}, stale-while-revalidate=600`);
    return res.status(200).json(cached);
  }

  res.set('X-Cache', 'MISS');
  res.set('Cache-Control', `public, max-age=${Math.floor((ttlMs || 600000) / 1000)}, stale-while-revalidate=600`);

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300 && body && body.success !== false) {
      movieCache.set(key, body, { ttl: ttlMs || undefined });
    }
    return originalJson(body);
  };

  next();
};

const clearCache = () => movieCache.clear();

module.exports = { cacheMiddleware, clearCache, movieCache };
