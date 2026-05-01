const { discover, getMovieDetails, searchMovies } = require('./tmdbService');
const { GENRE_NAME_TO_ID, LANGUAGE_NAME_TO_CODE } = require('./tmdbConstants');

function slim(m) {
  if (!m) return null;
  return {
    id: m.id,
    title: m.title || m.original_title,
    year: (m.release_date || '').slice(0, 4),
    genres: (m.genres || []).map((g) => g.name).slice(0, 3),
    overview: (m.overview || '').slice(0, 180),
    rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : null,
    language: m.original_language,
    poster_path: m.poster_path,
  };
}

function slimDiscover(m) {
  return {
    id: m.id,
    title: m.title || m.original_title,
    year: (m.release_date || '').slice(0, 4),
    overview: (m.overview || '').slice(0, 180),
    rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : null,
    language: m.original_language,
    poster_path: m.poster_path,
  };
}

function extractHints(message = '') {
  const lower = message.toLowerCase();

  const genreIds = [];
  const seen = new Set();
  for (const [name, id] of Object.entries(GENRE_NAME_TO_ID)) {
    if (new RegExp(`\\b${name.toLowerCase()}\\b`).test(lower) && !seen.has(id)) {
      genreIds.push(id);
      seen.add(id);
    }
  }

  let language = null;
  for (const [name, code] of Object.entries(LANGUAGE_NAME_TO_CODE)) {
    if (new RegExp(`\\b${name}\\b`).test(lower)) {
      language = code;
      break;
    }
  }

  const likeMatch = message.match(/\b(?:like|similar to|reminds me of)\s+([A-Z][\w': .-]{1,40})/i);
  const anchorTitle = likeMatch ? likeMatch[1].trim().replace(/[.!?,]+$/, '') : null;

  return { genreIds, language, anchorTitle };
}

function dedupeById(movies) {
  const map = new Map();
  for (const m of movies) {
    if (m && m.id && !map.has(m.id)) map.set(m.id, m);
  }
  return Array.from(map.values());
}

async function buildContext({ user, message = '' }) {
  const profile = {
    languages: user.preferredLanguages || ['en'],
    genres: user.favoriteGenres || [],
    watchlistCount: (user.watchlist || []).length,
    watchedCount: (user.watched || []).length,
  };

  const watchedIds = (user.watched || []).slice(-5);
  const watchlistIds = (user.watchlist || []).slice(-5);

  const profileGenreIds = profile.genres
    .map((name) => GENRE_NAME_TO_ID[name])
    .filter(Boolean);

  const hints = extractHints(message);
  const queryLanguage = hints.language || profile.languages[0] || 'en';

  const fetches = [
    Promise.all(watchedIds.map(getMovieDetails)),
    Promise.all(watchlistIds.map(getMovieDetails)),
    discover({
      language: queryLanguage,
      genreIds: profileGenreIds.length ? profileGenreIds : undefined,
      limit: 15,
    }),
  ];

  if (hints.genreIds.length) {
    fetches.push(
      discover({
        language: queryLanguage,
        genreIds: hints.genreIds,
        limit: 20,
      })
    );
  }

  if (hints.anchorTitle) {
    fetches.push(searchMovies(hints.anchorTitle, 5));
  }

  const [recentWatched, recentWatchlist, profilePool, queryPool, anchorPool] =
    await Promise.all(fetches);

  const candidatesRaw = dedupeById([
    ...(queryPool || []),
    ...(profilePool || []),
    ...(anchorPool || []),
  ]).slice(0, 30);

  return {
    profile,
    recentWatched: recentWatched.filter(Boolean).map(slim),
    recentWatchlist: recentWatchlist.filter(Boolean).map(slim),
    candidates: candidatesRaw.map(slimDiscover),
  };
}

module.exports = { buildContext };
