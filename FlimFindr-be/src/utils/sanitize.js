exports.sanitizeUserInput = (s) => {
  if (typeof s !== 'string') return '';
  return s
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\bsystem\s*:/gi, '')
    .replace(/ignore (all|previous|above) instructions?/gi, '')
    .replace(/<\|.*?\|>/g, '')
    .replace(/[<>]/g, '')
    .trim();
};
