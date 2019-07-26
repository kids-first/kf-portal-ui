export default function sanitizeURL(url) {
  let clean = '';
  let escaped = false;

  for (let i = 0; i < url.length; i++) {
    const char = url.charAt(i);

    if (char === '"') escaped = !escaped;
    else if (!escaped && (char === ' ' || char === '\n')) continue;

    clean += char;
  }

  return clean;
}