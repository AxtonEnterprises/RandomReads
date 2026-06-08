import { Shuffle } from 'lucide-react';
import { useState } from 'react';
import BookCard from '../components/BookCard.jsx';
import { getRandomBook } from '../services/booksApi.js';
import { saveBook } from '../services/storage.js';

export default function Home() {
  const [book, setBook] = useState(null);
  const [status, setStatus] = useState('');

  async function handleRandomBook() {
    setStatus('Finding a book...');
    const nextBook = await getRandomBook();
    setBook(nextBook);
    setStatus('');
  }

  function handleSave(selectedBook) {
    saveBook(selectedBook);
    setStatus('Saved to your journal.');
  }

  return (
    <section className="stack-lg">
      <div className="hero-card">
        <p className="eyebrow">Classic literature discovery</p>
        <h1>Find your next public domain read.</h1>
        <p>
          Random Reads helps you discover classic books, save interesting titles, and start building a reading journal.
        </p>
        <div className="button-row">
          <button className="button primary large" onClick={handleRandomBook}>
            <Shuffle size={18} /> Random Book
          </button>
          <a className="button secondary large" href="/search">Search Library</a>
        </div>
      </div>

      {status && <p className="status">{status}</p>}
      {book && <BookCard book={book} onSave={handleSave} />}

      <div className="feature-grid">
        <div className="feature-card"><strong>Discover</strong><span>Use Gutendex/Project Gutenberg data to explore free classics.</span></div>
        <div className="feature-card"><strong>Save</strong><span>Keep books in local storage before adding full accounts.</span></div>
        <div className="feature-card"><strong>Install</strong><span>Add to home screen as a PWA on supported mobile browsers.</span></div>
      </div>
    </section>
  );
}
