import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };
  const active = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">⚡ AptitudeAce</Link>
      {user && (
        <div className="nav-links">
          <Link to="/" className={`nav-link ${active('/')}`}>Home</Link>
          <Link to="/history" className={`nav-link ${active('/history')}`}>History</Link>
          <span className="text-muted" style={{ fontSize: '0.85rem' }}>Hi, {user.name.split(' ')[0]}</span>
          <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
