import { Link } from "react-router-dom";
import { Home, Search, BookOpen, Info, LogIn } from "lucide-react";

export default function Header() {
  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        Random Reads
      </Link>

      <nav className="site-nav">
        <Link to="/">
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link to="/search">
          <Search size={20} />
          <span>Search</span>
        </Link>

        <Link to="/journal">
          <BookOpen size={20} />
          <span>Journal</span>
        </Link>

        <Link to="/about">
          <Info size={20} />
          <span>About</span>
        </Link>

        <Link to="/login">
          <LogIn size={20} />
          <span>Log In</span>
        </Link>
      </nav>
    </header>
  );
}
