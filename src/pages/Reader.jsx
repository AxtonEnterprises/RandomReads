import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReaderControls from '../components/ReaderControls.jsx';
import { getBookById, getReadableText } from '../services/booksApi.js';
import { addJournalEntry, saveBook } from '../services/storage.js';

export default function Reader() {
  const { bookId } = useParams();
  const location = useLocation();
  const [book, setBook] = useState(location.state?.book || null);
  const [text, setText] = useState('Loading reader...');
  const [fontSize, setFontSize] = useState(18);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const readableUrl =
  book.formats["text/html"] ||
  book.formats["text/plain; charset=utf-8"] ||
  book.formats["text/plain; charset=us-ascii"] ||
  book.formats["text/plain"];

  useEffect(() => {
    let active = true;

    async function loadBook() {
      try {
        const loadedBook = book || await getBookById(bookId);
        if (!active) return;
        setBook(loadedBook);
        const loadedText = await getReadableText(loadedBook);
        if (!active) return;
        setText(loadedText.slice(0, 35000));
      } catch {
        if (active) setText('Could not load the reader text. Try opening the external source link.');
      }
    }

    loadBook();
    return () => { active = false; };
  }, [bookId]);

  function handleSave() {
    if (!book) return;
    saveBook(book);
    setStatus('Book saved.');
  }

  function handleJournal() {
    if (!book || !note.trim()) return;
    addJournalEntry({ bookId: book.id, title: book.title, author: book.author, note: note.trim() });
    setNote('');
    setStatus('Journal note saved.');
  }

  return (
    <section className="reader-page">
      <div className="reader-topbar">
        <div>
          <Link to="/search" className="back-link">← Back to search</Link>
          <h1>{book?.title || 'Reader'}</h1>
          {book?.author && <p className="muted">{book.author}</p>}
        </div>
        <ReaderControls fontSize={fontSize} setFontSize={setFontSize} />
      </div>

      <div className="button-row">
        <button className="button secondary" onClick={handleSave}>Save book</button>
        {book?.htmlUrl && <a className="button secondary" href={book.htmlUrl} target="_blank" rel="noreferrer">Open full source</a>}
      </div>
      {status && <p className="status">{status}</p>}

      <article className="reader-text" style={{ fontSize: `${fontSize}px` }}>
        {text.split('\n').filter(Boolean).slice(0, 90).map((paragraph, index) => (
          <p key={`${paragraph.slice(0, 20)}-${index}`}>{paragraph}</p>
        ))}
      </article>

      <aside className="journal-box">
        <h2>Reading note</h2>
        <textarea value={note} onChange={(event) => setNote(event.target.value)} placeholder="Write a quick thought, summary, or favorite line..." />
        <button className="button primary" onClick={handleJournal}>Save Note</button>
      </aside>
    </section>
  );
}
