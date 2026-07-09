import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ReaderControls from '../components/ReaderControls.jsx';
import { getBookById, getStructuredBookText } from '../services/booksApi.js';
import {
  addJournalEntry,
  getReadingProgress,
  saveBook,
  saveReadingProgress
} from '../services/storage.js';
import { paginateParagraphs } from '../utils/paginateText.js';

export default function Reader() {
  const { id } = useParams();
  const location = useLocation();
  const readerRef = useRef(null);

  const [book, setBook] = useState(location.state?.book || null);
  const [paragraphs, setParagraphs] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [fontSize, setFontSize] = useState(18);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [readerSize, setReaderSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let active = true;

    async function loadBook() {
      setLoading(true);
      setParagraphs([]);
      setChapters([]);
      setPageIndex(0);
      setProgressLoaded(false);

      try {
        const loadedBook = book || await getBookById(id);
        if (!active) return;

        setBook(loadedBook);

        const structuredBook = await getStructuredBookText(loadedBook);
        if (!active) return;

        setParagraphs(structuredBook.paragraphs || []);
        setChapters(structuredBook.chapters || []);
      } catch (error) {
        if (active) {
          setParagraphs([`Could not load the reader text. ${error.message}`]);
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
  
useEffect(() => {
  if (!book?.id || !progressLoaded) return;

  saveReadingProgress(book.id, pageIndex);
}, [book?.id, pageIndex, progressLoaded]);
  useEffect(() => {
    function updateSize() {
      if (!readerRef.current) return;

      const rect = readerRef.current.getBoundingClientRect();

      setReaderSize({
        width: rect.width,
        height: rect.height
      });
    }

    updateSize();

    window.addEventListener('resize', updateSize);
    window.addEventListener('orientationchange', updateSize);

    return () => {
      window.removeEventListener('resize', updateSize);
      window.removeEventListener('orientationchange', updateSize);
    };
  }, []);

  const pages = useMemo(() => {
    return paginateParagraphs({
      paragraphs,
      containerWidth: readerSize.width,
      containerHeight: readerSize.height,
      fontSize
    });
  }, [paragraphs, readerSize, fontSize]);

  const totalPages = Math.max(pages.length, 1);
  useEffect(() => {
  if (!book?.id || !totalPages || progressLoaded) return;

  const saved = getReadingProgress(book.id);

  if (saved?.pageIndex >= 0) {
    setPageIndex(Math.min(saved.pageIndex, totalPages - 1));
  }

  setProgressLoaded(true);
}, [book?.id, totalPages, progressLoaded]);
  const currentPage = pages[pageIndex]?.blocks || [];
  const progress = totalPages > 1 ? Math.round(((pageIndex + 1) / totalPages) * 100) : 0;

  useEffect(() => {
  if (!book?.id || !pages.length || progressLoaded) return;

  const saved = getReadingProgress(book.id);

  if (saved?.paragraphIndex >= 0) {
    const restoredPageIndex = pages.findIndex((page, index) => {
      const nextPage = pages[index + 1];
      return (
        saved.paragraphIndex >= page.startIndex &&
        (!nextPage || saved.paragraphIndex < nextPage.startIndex)
      );
    });

    setPageIndex(restoredPageIndex >= 0 ? restoredPageIndex : 0);
  }

  setProgressLoaded(true);
}, [book?.id, pages, progressLoaded]);

useEffect(() => {
  if (!book?.id || !progressLoaded || !pages[pageIndex]) return;

  saveReadingProgress(book.id, pages[pageIndex].startIndex);
}, [book?.id, pageIndex, pages, progressLoaded]);

  function goToPage(newPageIndex) {
    const safePageIndex = Math.min(Math.max(newPageIndex, 0), totalPages - 1);
    setPageIndex(safePageIndex);
  }

  function goToChapter(paragraphIndex) {
  const targetPageIndex = pages.findIndex((page, index) => {
    const nextPage = pages[index + 1];

    return (
      paragraphIndex >= page.startIndex &&
      (!nextPage || paragraphIndex < nextPage.startIndex)
    );
  });

  setShowToc(false);
  goToPage(targetPageIndex >= 0 ? targetPageIndex : 0);
  }
    }
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
      </div>

      {status && <p className="status">{status}</p>}

      {showToc && (
        <aside className="journal-box">
          <h2>Table of contents</h2>

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
        </aside>
      )}

      <div className="reader-progress">
        <span>Page {pageIndex + 1} of {totalPages}</span>
        <span>{progress}%</span>
      </div>

      <article
        ref={readerRef}
        className="reader-window"
        style={{ fontSize: `${fontSize}px` }}
      >
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
