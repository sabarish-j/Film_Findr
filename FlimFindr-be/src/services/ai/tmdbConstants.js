const GENRE_NAME_TO_ID = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Documentary: 99,
  Drama: 18,
  Family: 10751,
  Fantasy: 14,
  History: 36,
  Horror: 27,
  Music: 10402,
  Mystery: 9648,
  Romance: 10749,
  'Sci-Fi': 878,
  'Science Fiction': 878,
  Thriller: 53,
  War: 10752,
  Western: 37,
};

const LANGUAGE_NAME_TO_CODE = {
  english: 'en',
  spanish: 'es',
  french: 'fr',
  german: 'de',
  italian: 'it',
  portuguese: 'pt',
  hindi: 'hi',
  tamil: 'ta',
  telugu: 'te',
  kannada: 'kn',
  korean: 'ko',
  japanese: 'ja',
  malayalam: 'ml',
  marathi: 'mr',
};

const LANGUAGE_CODE_TO_NAME = Object.fromEntries(
  Object.entries(LANGUAGE_NAME_TO_CODE).map(([n, c]) => [c, n.charAt(0).toUpperCase() + n.slice(1)])
);

module.exports = { GENRE_NAME_TO_ID, LANGUAGE_NAME_TO_CODE, LANGUAGE_CODE_TO_NAME };
