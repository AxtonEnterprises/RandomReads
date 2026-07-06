import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReaderControls from '../components/ReaderControls.jsx';
import { getBookById, getStructuredBookText } from '../services/booksApi.js';
import { addJournalEntry, saveBook } from '../services/storage.js';

const PARAGRAPHS_PER_PAGE = 12;

export default function Reader() {
  const { id } = useParams();
  const location = useLocation();

  const [book, setBook] = useState(location.state?.book || null);
  const [paragraphs, setParagraphs] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [fontSize, setFontSize] = useState(18);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [pageIndex, setPageIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setParagraphs([]);
      setChapters([]);
      setPageIndex(0);

      try {
        const loadedBook = book || await getBookById(id);

        if (!active) return;

        setBook(loadedBook);

        const structuredBook = await getStructuredBookText(loadedBook);

        if (!active) return;

        setParagraphs(structuredBook.paragraphs || []);
        setChapters(structuredBook.chapters || []);
      } catch (error) {
        console.error('Reader load error:', error);

        if (active) {
          setParagraphs([
            `Could not load the reader text. ${error.message}`
          ]);
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

  const pages = useMemo(() => {
    const result = [];

    for (let i = 0; i < paragraphs.length; i += PARAGRAPHS_PER_PAGE) {
      result.push(paragraphs.slice(i, i + PARAGRAPHS_PER_PAGE));
    }

    return result;
  }, [paragraphs]);

  const totalPages = Math.max(pages.length, 1);
  const currentPage = pages[pageIndex] || [];

  const progress =
    totalPages > 1
      ? Math.round(((pageIndex + 1) / totalPages) * 100)
      : 0;

  function goToPage(newPageIndex) {
    const safePageIndex = Math.min(
      Math.max(newPageIndex, 0),
      totalPages - 1
    );

    setPageIndex(safePageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToChapter(paragraphIndex) {
    const targetPage = Math.floor(paragraphIndex / PARAGRAPHS_PER_PAGE);
    setShowToc(false);
    goToPage(targetPage);
  }

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

        <button
          className="button secondary"
          onClick={() => setShowToc((value) => !value)}
          disabled={!chapters.length}
        >
          {showToc ? 'Hide contents' : 'Table of contents'}
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

      {showToc && (
        <aside className="journal-box">
          <h2>Table of contents</h2>

          {chapters.length ? (
            <div className="toc-list">
              {chapters.map((chapter, index) => (
                <button
                  key={`${chapter.title}-${chapter.paragraphIndex}-${index}`}
                  className="toc-link"
                  onClick={() => goToChapter(chapter.paragraphIndex)}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          ) : (
            <p>No chapters detected for this book.</p>
          )}
        </aside>
      )}

      <div className="reader-progress">
        <span>
          Page {pageIndex + 1} of {totalPages}
        </span>
        <span>{progress}%</span>
      </div>

      <article className="reader-text" style={{ fontSize: `${fontSize}px` }}>
        {loading ? (
          <p>Loading reader...</p>
        ) : (
          currentPage.map((paragraph, index) => (
            <p key={`${paragraph.slice(0, 20)}-${index}`}>
              {paragraph}
            </p>
          ))
        )}
      </article>

      <div className="reader-nav">
        <button
          className="button secondary"
          onClick={() => goToPage(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          ← Previous
        </button>

        <input
          className="page-input"
          type="number"
          min="1"
          max={totalPages}
          value={pageIndex + 1}
          onChange={(event) => {
            const value = Number(event.target.value);
            if (value) goToPage(value - 1);
          }}
        />

        <button
          className="button secondary"
          onClick={() => goToPage(pageIndex + 1)}
          disabled={pageIndex >= totalPages - 1}
        >
          Next →
        </button>
      </div>

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
