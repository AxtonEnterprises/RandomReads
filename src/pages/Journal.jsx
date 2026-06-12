import { useEffect, useState } from 'react';
import BookCard from '../components/BookCard.jsx';
import { getJournal, getSavedBooks, removeSavedBook } from '../services/storage.js';

export default function Journal() {
  const [books, setBooks] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    setBooks(getSavedBooks());
    setEntries(getJournal());
  }, []);

  function handleRemove(bookId) {
    setBooks(removeSavedBook(bookId));
  }

  return (
    <section className="stack-lg">
      <div className="section-heading">
        <p className="eyebrow">Local journal</p>
        <h1>Your saved reading</h1>
      </div>

      <div className="panel">
        <h2>Saved books</h2>
        {books.length === 0 ? <p className="muted">No saved books yet.</p> : books.map((book) => <BookCard key={book.id} book={book} onRemove={handleRemove} compact />)}
      </div>

      <div className="panel">
        <h2>Notes</h2>
        {entries.length === 0 ? <p className="muted">No notes yet.</p> : entries.map((entry) => (
          <article className="note-card" key={entry.id}>
            <strong>{entry.title}</strong>
            <small>{entry.author} · {new Date(entry.createdAt).toLocaleDateString()}</small>
            <p>{entry.note}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
