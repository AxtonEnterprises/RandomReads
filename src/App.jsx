import { Route, Routes } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Reader from './pages/Reader.jsx';
import Journal from './pages/Journal.jsx';
import About from './pages/About.jsx';

export default function App() {
  return (
    <>
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/reader/:id" element={<Reader />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  );
}
