import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import './App.css';

export default function App() {
  const { pathname } = useLocation();

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar__brand">
          <span className="navbar__logo">📈</span>
          <span className="navbar__title">StockFlow</span>
        </div>
        <nav className="navbar__links">
          <Link className={`nav-link ${pathname === '/'       ? 'nav-link--active' : ''}`} to="/">Home</Link>
          <Link className={`nav-link ${pathname === '/about'  ? 'nav-link--active' : ''}`} to="/about">About</Link>
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/"      element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>StockFlow &copy; {new Date().getFullYear()} — Express · SQLite · Drizzle · React</p>
      </footer>
    </div>
  );
}
