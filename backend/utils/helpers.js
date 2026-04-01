exports.formatTimestamp = (date = new Date()) => {
  return date.toISOString();
};

exports.generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

exports.truncateString = (str, length = 100) => {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
};

exports.sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.replace(/[<>]/g, '');
};

exports.calculateConfidenceLevel = (score) => {
  if (score >= 0.8) return 'high';
  if (score >= 0.5) return 'medium';
  return 'low';
};