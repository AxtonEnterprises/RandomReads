const SAVED_BOOKS_KEY = 'randomReads.savedBooks';
const JOURNAL_KEY = 'randomReads.journal';

function readKey(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getSavedBooks() {
  return readKey(SAVED_BOOKS_KEY, []);
}

export function saveBook(book) {
  const books = getSavedBooks();
  if (books.some((item) => item.id === book.id)) return books;
  const next = [book, ...books];
  writeKey(SAVED_BOOKS_KEY, next);
  return next;
}

export function removeSavedBook(bookId) {
  const next = getSavedBooks().filter((book) => String(book.id) !== String(bookId));
  writeKey(SAVED_BOOKS_KEY, next);
  return next;
}

export function isBookSaved(bookId) {
  return getSavedBooks().some((book) => String(book.id) === String(bookId));
}

export function getJournal() {
  return readKey(JOURNAL_KEY, []);
}

export function addJournalEntry(entry) {
  const entries = getJournal();
  const next = [{ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...entry }, ...entries];
  writeKey(JOURNAL_KEY, next);
  return next;
}
export function saveReadingProgress(bookId, paragraphIndex) {
  if (!bookId && bookId !== 0) return;

  const key = `readingProgress:${bookId}`;

  localStorage.setItem(
    key,
    JSON.stringify({
      paragraphIndex,
      updatedAt: Date.now()
    })
  );
}

export function getReadingProgress(bookId) {
  if (!bookId && bookId !== 0) return null;

  const key = `readingProgress:${bookId}`;
  const saved = localStorage.getItem(key);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}
