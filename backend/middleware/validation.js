function validateEmail(email) {
  return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  return !phone || (typeof phone === 'string' && phone.length <= 30 && /^[0-9\-\+\s\(\)]+$/.test(phone));
}

function validateUrl(url) {
  if (!url) return true;
  if (typeof url !== 'string' || url.length > 500) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

function cleanText(value, maxLength) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, maxLength);
}

module.exports = { cleanText, validateEmail, validatePhone, validateUrl };
