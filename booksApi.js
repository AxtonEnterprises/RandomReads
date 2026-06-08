const API_BASE = 'https://gutendex.com/books';

const fallbackBooks = [
  {
    id: 1342,
    title: 'Pride and Prejudice',
    authors: [{ name: 'Jane Austen' }],
    subjects: ['Fiction', 'Romance', 'England'],
    formats: {
      'text/html': 'https://www.gutenberg.org/files/1342/1342-h/1342-h.htm',
      'text/plain; charset=us-ascii': 'https://www.gutenberg.org/files/1342/1342-0.txt'
    }
  },
  {
    id: 84,
    title: 'Frankenstein; Or, The Modern Prometheus',
    authors: [{ name: 'Mary Wollstonecraft Shelley' }],
    subjects: ['Science fiction', 'Horror tales'],
    formats: {
      'text/html': 'https://www.gutenberg.org/files/84/84-h/84-h.htm',
      'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/84/84-0.txt'
    }
  },
  {
    id: 2701,
    title: 'Moby-Dick; Or, The Whale',
    authors: [{ name: 'Herman Melville' }],
    subjects: ['Adventure stories', 'Whaling'],
    formats: {
      'text/html': 'https://www.gutenberg.org/files/2701/2701-h/2701-h.htm',
      'text/plain; charset=utf-8': 'https://www.gutenberg.org/files/2701/2701-0.txt'
    }
  }
];

export function normalizeBook(book) {
  const author = book.authors?.map((item) => item.name).join(', ') || 'Unknown author';
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
