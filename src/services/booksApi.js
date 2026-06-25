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
    book.formats['text/plain; charset=utf-8'] ||
    book.formats['text/plain; charset=us-ascii'] ||
    book.formats['text/plain'] ||
    Object.entries(book.formats).find(([type]) =>
      type.startsWith('text/plain')
    )?.[1] ||
    null
  );
}

  export async function getBookById(bookId) {
  const response = await fetch(`${API_BASE}/${bookId}`);

  if (!response.ok) {
    throw new Error('Could not load book');
  }

  return response.json();
}

export async function getReadableText(book) {
  const textUrl = getReadableTextUrl(book);

  if (!textUrl) {
    return 'This book does not have a readable text format available.';
  }

  const proxyUrl = `/api/book-text?url=${encodeURIComponent(textUrl)}`;
const response = await fetch(proxyUrl);

  if (!response.ok) {
    throw new Error('Could not load book text.');
  }

  return response.text();
}

