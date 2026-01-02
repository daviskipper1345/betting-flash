import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import './Footer.css';

function Footer() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <footer className="footer">
      <nav className="footer-nav">
        <Link to="/" className="footer-link">
          <span className="icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/casino" className="footer-link">
          <span className="icon">🎰</span>
          <span>Casino</span>
        </Link>
        <Link to="/betting" className="footer-link">
          <span className="icon">⚽</span>
          <span>Betting</span>
        </Link>
        <Link to="/wallet" className="footer-link">
          <span className="icon">💰</span>
          <span>Wallet</span>
        </Link>
        <Link to="/account" className="footer-link">
          <span className="icon">👤</span>
          <span>Account</span>
        </Link>
      </nav>

      <div className="footer-menu">
        {user?.isAdmin && (
          <Link to="/admin" className="menu-item">Admin Dashboard</Link>
        )}
        <button className="menu-item logout" onClick={handleLogout}>Logout</button>
      </div>
    </footer>
  );
}

export default Footer;
