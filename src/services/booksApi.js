const API_BASE = 'https://gutendex.com/books';

export async function searchBooks(query = '') {
  const url = query
    ? `${API_BASE}/?search=${encodeURIComponent(query)}`
    : API_BASE;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  const data = await response.json();
  return data.results || [];
}

export async function getRandomBook() {
  const page = Math.floor(Math.random() * 50) + 1;
  const response = await fetch(`${API_BASE}/?page=${page}`);

  if (!response.ok) {
    throw new Error('Failed to fetch random books');
  }

  const data = await response.json();
  const books = data.results || [];

  if (!books.length) {
    throw new Error('No books found');
  }

  return books[Math.floor(Math.random() * books.length)];
}

export function getReadableTextUrl(book) {
  if (!book?.formats) return null;

  return (
    book.formats['text/html'] ||
    book.formats['text/plain; charset=utf-8'] ||
    book.formats['text/plain'] ||
    null
  );
}  const author = book.authors?.map((item) => item.name).join(', ') || 'Unknown author';
  const cover = book.formats?.['image/jpeg'] || '';
  const html = Object.entries(book.formats || {}).find(([key]) => key.includes('text/html'))?.[1] || '';
  const text = Object.entries(book.formats || {}).find(([key]) => key.includes('text/plain'))?.[1] || '';

  return {
    id: book.id,
    title: book.title,
    author,
    cover,
    subjects: book.subjects?.slice(0, 4) || [],
    htmlUrl: html,
    textUrl: text,
    raw: book
  };
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Book request failed.');
  return response.json();
}

export async function searchBooks(query) {
  if (!query.trim()) return [];
  const data = await fetchJson(`${API_BASE}?search=${encodeURIComponent(query)}`);
  return data.results.map(normalizeBook);
}

export async function getRandomBook() {
  try {
    const page = Math.floor(Math.random() * 50) + 1;
    const data = await fetchJson(`${API_BASE}?page=${page}`);
    const results = data.results.length ? data.results : fallbackBooks;
    const book = results[Math.floor(Math.random() * results.length)];
    return normalizeBook(book);
  } catch {
    const book = fallbackBooks[Math.floor(Math.random() * fallbackBooks.length)];
    return normalizeBook(book);
  }
}

export async function getBookById(bookId) {
  try {
    const data = await fetchJson(`${API_BASE}/${bookId}`);
    return normalizeBook(data);
  } catch {
    const fallback = fallbackBooks.find((book) => String(book.id) === String(bookId)) || fallbackBooks[0];
    return normalizeBook(fallback);
  }
}

export async function getReadableText(book) {
  if (!book?.textUrl) {
    return 'This book does not have a plain-text reader link available yet. Use the external reading link instead.';
  }

  const response = await fetch(book.textUrl);
  if (!response.ok) throw new Error('Could not load book text.');
  const text = await response.text();
  return text
    .replace(/\r/g, '')
    .replace(/\*\*\* START OF.+?\*\*\*/is, '')
    .replace(/\*\*\* END OF.+/is, '')
    .trim();
}
