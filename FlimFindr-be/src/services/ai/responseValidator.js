function validateMovieMentions(text, allowedTitles) {
  if (!text) return text;
  const allowedLower = new Set(allowedTitles.map((t) => (t || '').toLowerCase()));
  return text.replace(/\*\*([^*]+?)\s*\((\d{4})\)\*\*/g, (full, title) => {
    return allowedLower.has(title.trim().toLowerCase()) ? full : `*${title.trim()}*`;
  });
}

function findReferencedMovies(text, candidates) {
  if (!text) return [];
  const lower = text.toLowerCase();
  return candidates
    .filter((c) => c.title && lower.includes(c.title.toLowerCase()))
    .slice(0, 6);
}

module.exports = { validateMovieMentions, findReferencedMovies };
