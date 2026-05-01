const crypto = require('crypto');
const { classify } = require('../services/ai/domainGuard');
const { route } = require('../services/ai/intentRouter');
const { answerStructured } = require('../services/ai/ruleEngine');
const { buildContext } = require('../services/ai/contextBuilder');
const { streamChat } = require('../services/ai/geminiClient');
const {
  buildSystemPrompt,
  buildUserPrompt,
  REFUSAL,
} = require('../services/ai/promptTemplates');
const {
  validateMovieMentions,
  findReferencedMovies,
} = require('../services/ai/responseValidator');
const { sanitizeUserInput } = require('../utils/sanitize');
const { aiCache } = require('../services/cache/lruCache');
const { LANGUAGE_CODE_TO_NAME } = require('../services/ai/tmdbConstants');

function sse(res, event, data) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function cacheKey(userId, message, profile) {
  const h = crypto.createHash('sha256');
  h.update(String(userId));
  h.update('|');
  h.update(message.toLowerCase());
  h.update('|');
  h.update((profile.languages || []).join(','));
  h.update('|');
  h.update((profile.genres || []).join(','));
  return h.digest('hex');
}

function profileText(u) {
  return [
    `**Your preferences**`,
    `- Languages: ${(u.preferredLanguages || []).join(', ') || 'none'}`,
    `- Favorite genres: ${(u.favoriteGenres || []).join(', ') || 'none yet'}`,
    `- Watchlist: ${(u.watchlist || []).length} movies`,
    `- Watched: ${(u.watched || []).length} movies`,
  ].join('\n');
}

exports.chat = async (req, res) => {
  const raw = (req.body?.message || '').toString();
  const message = sanitizeUserInput(raw).slice(0, 500);
  const history = Array.isArray(req.body?.history) ? req.body.history.slice(-6) : [];
  const user = req.user;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders?.();

  try {
    if (!message) {
      sse(res, 'chunk', { text: 'Please type a question about movies.' });
      sse(res, 'done', { source: 'guard' });
      return res.end();
    }

    const klass = classify(message);
    if (klass === 'blocked' || klass === 'invalid') {
      sse(res, 'chunk', { text: REFUSAL });
      sse(res, 'done', { source: 'guard' });
      return res.end();
    }

    const intent = route(message);

    if (intent === 'profile') {
      sse(res, 'chunk', { text: profileText(user) });
      sse(res, 'done', { source: 'profile' });
      return res.end();
    }

    if (intent === 'structured') {
      const fallbackLang = (user.preferredLanguages || ['en'])[0];
      const result = await answerStructured(message, fallbackLang);
      sse(res, 'chunk', { text: result.text });
      if (result.movies?.length) sse(res, 'movies', { movies: result.movies });
      sse(res, 'done', { source: 'rule' });
      return res.end();
    }

    const ctx = await buildContext({ user, message });

    const ck = cacheKey(user._id, message, ctx.profile);
    const cached = aiCache.get(ck);
    if (cached) {
      sse(res, 'chunk', { text: cached.text });
      if (cached.movies?.length) sse(res, 'movies', { movies: cached.movies });
      sse(res, 'done', { source: 'cache' });
      return res.end();
    }

    const systemPrompt = buildSystemPrompt(ctx.profile);
    const userPrompt = buildUserPrompt({ context: ctx, message });
    const allowedTitles = [
      ...ctx.candidates.map((c) => c.title),
      ...ctx.recentWatched.map((c) => c.title),
      ...ctx.recentWatchlist.map((c) => c.title),
    ];

    let buffer = '';
    for await (const piece of streamChat({ systemPrompt, userPrompt, history })) {
      buffer += piece;
      sse(res, 'chunk', { text: piece });
    }

    const safe = validateMovieMentions(buffer, allowedTitles);
    if (safe !== buffer) sse(res, 'replace', { text: safe });

    const referenced = findReferencedMovies(safe, ctx.candidates);
    if (referenced.length) sse(res, 'movies', { movies: referenced });

    aiCache.set(ck, { text: safe, movies: referenced });

    sse(res, 'done', { source: 'llm' });
    res.end();
  } catch (err) {
    console.error('[ai/chat]', err.message);
    sse(res, 'error', { message: 'Something went wrong. Please try again.' });
    res.end();
  }
};

exports.suggestions = async (req, res) => {
  const u = req.user;
  const lang = (u.preferredLanguages || ['en'])[0];
  const langName = LANGUAGE_CODE_TO_NAME[lang] || 'English';
  const genre = (u.favoriteGenres || ['Drama'])[0];
  const data = [
    `Suggest emotional ${genre.toLowerCase()} movies like Interstellar`,
    `Top ${langName} thrillers`,
    `What should I watch from my watchlist tonight?`,
    `Movies similar to my last watched film`,
  ];
  res.json({ success: true, data });
};

exports.history = async (req, res) => res.json({ success: true, data: [] });
exports.clearHistory = async (req, res) => res.json({ success: true });
