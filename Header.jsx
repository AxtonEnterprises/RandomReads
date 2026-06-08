import { BookOpen, Home, Info, Library, Search } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/journal', label: 'Journal', icon: Library },
  { to: '/about', label: 'About', icon: Info }
];

export default function Header() {
  return (
    <header className="site-header">
      <NavLink to="/" className="brand" aria-label="Random Reads home">
        <span className="brand-mark"><BookOpen size={24} /></span>
        <span>
          <strong>Random Reads</strong>
          <small>The Literature Foundation</small>
        </span>
      </NavLink>
      <nav className="top-nav" aria-label="Main navigation">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
