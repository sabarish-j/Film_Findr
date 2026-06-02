// API Configuration
export const SERVER_BASE_URL = 'http://localhost:5000';
export const API_BASE_URL = `${SERVER_BASE_URL}/api`;

// Helper to resolve a server-relative avatar path to a full URL
export const resolveAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http')) return avatar;
  return `${SERVER_BASE_URL}${avatar.startsWith('/') ? '' : '/'}${avatar}`;
};

// TMDB Image CDN
export const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
export const TMDB_POSTER_SM = `${TMDB_IMAGE_BASE}/w342`;
export const TMDB_POSTER_MD = `${TMDB_IMAGE_BASE}/w500`;
export const TMDB_POSTER_LG = `${TMDB_IMAGE_BASE}/w780`;
export const TMDB_BACKDROP = `${TMDB_IMAGE_BASE}/w1280`;
export const TMDB_PROFILE = `${TMDB_IMAGE_BASE}/w185`;

// Preferences
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'kn', name: 'Kannada' },
];

export const LANGUAGE_MAP = Object.fromEntries(
  LANGUAGES.map(({ code, name }) => [code, name])
);

export const GENRES = [
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Animation',
  'Adventure',
  'Fantasy',
];

// Map app genre names → TMDB genre IDs
// (used to fetch movies by id and to find the localized name from TMDB's genre list)
export const GENRE_ID_MAP = {
  Action: 28,
  Adventure: 12,
  Animation: 16,
  Comedy: 35,
  Crime: 80,
  Drama: 18,
  Fantasy: 14,
  Horror: 27,
  Romance: 10749,
  'Sci-Fi': 878,
  Thriller: 53,
};

// Validation
export const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
export const MIN_LANGUAGES = 3;
export const MIN_NAME_LENGTH = 2;
export const MIN_PASSWORD_LENGTH = 6;

// Navigation
export const NAV_LINKS = [
  { path: '/', label: 'Home', icon: 'Home' },
  { path: '/search', label: 'Search', icon: 'Search' },
  { path: '/watchlist', label: 'Watchlist', icon: 'Bookmark' },
  { path: '/profile', label: 'Profile', icon: 'User' },
];
