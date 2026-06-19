const API_BASE = 'https://gutendex.com/books';
const CACHE_KEY = 'randomReadsBooks';
const CACHE_TIME_KEY = 'randomReadsBooksCachedAt';
const CACHE_MAX_AGE = 1000 * 60 * 60 * 24;

async function fetchBooksFromGutendex() {
  const response = await fetch(`${API_BASE}/?topic=fiction`);

  if (!response.ok) {
    throw new Error('Could not load books');
  }

  const data = await response.json();
  return data.results || [];
}

export async function getCachedBooks() {
  const cachedBooks = localStorage.getItem(CACHE_KEY);
  const cachedAt = localStorage.getItem(CACHE_TIME_KEY);

  const cacheIsFresh =
    cachedBooks &&
    cachedAt &&
    Date.now() - Number(cachedAt) < CACHE_MAX_AGE;

  if (cacheIsFresh) {
    return JSON.parse(cachedBooks);
  }

  const books = await fetchBooksFromGutendex();

  localStorage.setItem(CACHE_KEY, JSON.stringify(books));
  localStorage.setItem(CACHE_TIME_KEY, String(Date.now()));

  return books;
}

export async function getRandomBook() {
  const books = await getCachedBooks();

  if (!books.length) {
    throw new Error('No books found');
  }

  return books[Math.floor(Math.random() * books.length)];
}

export async function searchBooks(query = '') {
  const url = query
    ? `${API_BASE}/?search=${encodeURIComponent(query)}`
    : API_BASE;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  return data.results || [];
}

export function getReadableTextUrl(book) {
  if (!book?.formats) return null;

  return (
    book.formats['text/html'] ||
    book.formats['text/plain; charset=utf-8'] ||
    book.formats['text/plain'] ||
    null
  );
}
