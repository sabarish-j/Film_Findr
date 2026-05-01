const {
  LANGUAGE_NAME_TO_CODE,
  GENRE_NAME_TO_ID,
  LANGUAGE_CODE_TO_NAME,
} = require('./tmdbConstants');
const { discover } = require('./tmdbService');

function extractEntities(msg) {
  const lower = (msg || '').toLowerCase();

  let language = null;
  for (const [name, code] of Object.entries(LANGUAGE_NAME_TO_CODE)) {
    if (new RegExp(`\\b${name}s?\\b`).test(lower)) {
      language = code;
      break;
    }
  }

  let genreId = null;
  let genreName = null;
  for (const [name, id] of Object.entries(GENRE_NAME_TO_ID)) {
    if (new RegExp(`\\b${name.toLowerCase()}s?\\b`).test(lower)) {
      genreId = id;
      genreName = name;
      break;
    }
  }

  const yearMatch = lower.match(/\b(19|20)\d{2}\b/);
  const countMatch = lower.match(/\btop\s+(\d+)\b/);

  return {
    language,
    genreId,
    genreName,
    year: yearMatch ? Number(yearMatch[0]) : null,
    count: countMatch ? Math.min(Number(countMatch[1]), 20) : 10,
  };
}

async function answerStructured(message, fallbackLanguage = 'en') {
  const e = extractEntities(message);
  const language = e.language || fallbackLanguage;

  const movies = await discover({
    language,
    genreId: e.genreId,
    year: e.year,
    limit: e.count,
  });

  const langName = LANGUAGE_CODE_TO_NAME[language] || language;
  const labelParts = [];
  if (e.year) labelParts.push(String(e.year));
  if (langName) labelParts.push(langName);
  if (e.genreName) labelParts.push(e.genreName);
  labelParts.push(movies.length === 1 ? 'movie' : 'movies');

  const text = movies.length
    ? `Here are the top ${movies.length} ${labelParts.join(' ')} I found:`
    : `I couldn't find any ${labelParts.join(' ')} matching that. Try a different genre or language?`;

  return { text, movies, source: 'rule' };
}

module.exports = { answerStructured, extractEntities };
