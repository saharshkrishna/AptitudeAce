import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();
  const active = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">⚡ AptitudeAce</Link>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${active('/')}`}>Home</Link>
        <Link to="/history" className={`nav-link ${active('/history')}`}>History</Link>
      </div>
    </nav>
  );
};

export default Navbar;
