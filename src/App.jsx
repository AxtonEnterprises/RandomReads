import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Search from "./pages/Search";
import Reader from "./pages/Reader";
import Journal from "./pages/Journal";
import About from "./pages/About";
import Login from "./pages/Login.jsx";

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
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}
