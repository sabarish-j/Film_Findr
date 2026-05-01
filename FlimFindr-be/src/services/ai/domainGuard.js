const BLOCKED_PATTERNS = [
  /\b(code|coding|javascript|typescript|python|java|c\+\+|react|nodejs|sql|programming|debug|api key|regex)\b/i,
  /\b(politics|election|president|war crime|government policy|geopolitic)\b/i,
  /\b(medical|disease|symptom|diagnosis|prescription|dosage)\b/i,
  /\b(stock|invest(ing|ment)|crypto|bitcoin|loan|mortgage|tax advice)\b/i,
  /\b(homework|essay|write me a|generate a poem|recipe|how to cook)\b/i,
  /\b(weather|news today|current event)\b/i,
];

const ALLOW_PATTERNS = [
  /\b(movie|movies|film|films|cinema|director|actor|actress|cast|trailer|imdb|tmdb)\b/i,
  /\b(watchlist|watched|recommend|recommendation|suggest|suggestion|similar|like|genre)\b/i,
  /\b(thriller|sci-?fi|drama|comedy|horror|romance|action|fantasy|animation|documentary|mystery|crime|adventure)\b/i,
  /\b(tamil|hindi|telugu|kannada|english|spanish|korean|japanese|french|german|malayalam)\b/i,
  /\b(oscar|imax|cinematography|plot|storyline|sequel|franchise|character|scene|ending|review)\b/i,
  /\b(flimfindr|filmfindr|my profile|preferences?)\b/i,
];

function classify(message) {
  const text = (message || '').trim();
  if (text.length < 2) return 'invalid';
  if (BLOCKED_PATTERNS.some((re) => re.test(text))) return 'blocked';
  if (ALLOW_PATTERNS.some((re) => re.test(text))) return 'movie';
  return 'ambiguous';
}

module.exports = { classify };
