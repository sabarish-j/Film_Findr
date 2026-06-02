const STRUCTURED = [
  /^\s*(top|best|popular|trending|latest|new|show me)\b/i,
  /\b(top|best)\s+\d+\b/i,
];

const PROFILE = [
  /\bmy\s+(watchlist|watched|favorites?|preferences?|profile)\b/i,
  /\bwhat have i (watched|added)\b/i,
  /\bwhat'?s? in my watchlist\b/i,
];

function route(message) {
  const m = message || '';
  if (PROFILE.some((re) => re.test(m))) return 'profile';
  if (STRUCTURED.some((re) => re.test(m))) return 'structured';
  return 'conversational';
}

module.exports = { route };
