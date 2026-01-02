import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store';
import './Home.css';

function Home() {
  const { user, token } = useAuthStore();

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1 className="neon-glow">BETTING FLASH</h1>
        <p>The Ultimate Sports Betting & Casino Platform</p>

        {!token ? (
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        ) : (
          <div className="welcome-section">
            <h2>Welcome, {user?.fullName}!</h2>
            <div className="quick-links">
              <Link to="/betting" className="card quick-link">
                <span className="icon">⚽</span>
                <span>Sports Betting</span>
              </Link>
              <Link to="/casino" className="card quick-link">
                <span className="icon">🎰</span>
                <span>Casino Games</span>
              </Link>
              <Link to="/wallet" className="card quick-link">
                <span className="icon">💰</span>
                <span>Wallet</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="features-section">
        <h2>Why Choose Betting Flash?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <h3>🏆 Real Sports</h3>
            <p>Bet on real matches with live odds</p>
          </div>
          <div className="feature-card card">
            <h3>🎮 Casino Games</h3>
            <p>Exciting admin-controlled games</p>
          </div>
          <div className="feature-card card">
            <h3>💎 Virtual Games</h3>
            <p>Custom tournaments and matches</p>
          </div>
          <div className="feature-card card">
            <h3>🔒 Secure</h3>
            <p>100% admin control and transparency</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
