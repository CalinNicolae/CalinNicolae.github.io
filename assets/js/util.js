export function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split('/');
  if (parts.length !== 3) return new Date(dateStr);
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  return new Date(year, month, day);
}

export function sortByDate(posts) {
  return [...posts].sort((a, b) => parseDate(b.date) - parseDate(a.date));
}
