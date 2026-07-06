import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReaderControls from '../components/ReaderControls.jsx';
import { getBookById, getStructuredBookText } from '../services/booksApi.js';
import { addJournalEntry, saveBook } from '../services/storage.js';

export default function Reader() {
  const { id } = useParams();
  const location = useLocation();

  const [book, setBook] = useState(location.state?.book || null);
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(18);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setText('');

      try {
        const loadedBook = book || await getBookById(id);

        if (!active) return;

        setBook(loadedBook);

        const structuredBook = await getStructuredBookText(loadedBook);
const loadedText = structuredBook.paragraphs.join('\n\n');

        if (!active) return;

        if (!loadedText || loadedText.trim().length < 100) {
          setText('Reader text was found, but it appears to be empty or unavailable for this book.');
        } else {
          setText(loadedText.slice(0, 35000));
        }
      } catch (error) {
        console.error('Reader load error:', error);

        if (active) {
          setText(`Could not load the reader text. ${error.message}`);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBook();

    return () => {
      active = false;
    };
  }, [id]);

  function handleSave() {
    if (!book) return;

    saveBook(book);
    setStatus('Book saved.');
  }

  function handleJournal() {
    if (!book || !note.trim()) return;

    addJournalEntry({
      id: book.id,
      title: book.title,
      author: book.author,
      note: note.trim()
    });

    setNote('');
    setStatus('Journal note saved.');
  }

  const paragraphs = text
    .split(/\n{2,}|\r\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .slice(0, 90);

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
        <button className="button secondary" onClick={handleSave}>
          Save book
        </button>

        {book?.htmlUrl && (
          <a
            className="button secondary"
            href={book.htmlUrl}
            target="_blank"
            rel="noreferrer"
          >
            Open full source
          </a>
        )}
      </div>

      {status && <p className="status">{status}</p>}

      <article className="reader-text" style={{ fontSize: `${fontSize}px` }}>
        {loading ? (
          <p>Loading reader...</p>
        ) : (
          paragraphs.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 20)}-${index}`}>
              {paragraph}
            </p>
          ))
        )}
      </article>

      <aside className="journal-box">
        <h2>Reading note</h2>

        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Write a quick thought, summary, or favorite line..."
        />

        <button className="button primary" onClick={handleJournal}>
          Save Note
        </button>
      </aside>
    </section>
  );
}
