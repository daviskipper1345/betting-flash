import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import { adminAPI } from '../api';
import './Admin.css';

function Admin() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers()
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user?.isAdmin) {
    return <div className="admin-page"><p>Access denied</p></div>;
  }

  if (loading) return <div className="loading">Loading admin dashboard...</div>;

  return (
    <div className="admin-page">
      <div className="container">
        <h1>⚙️ Admin Dashboard</h1>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`tab ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`tab ${activeTab === 'games' ? 'active' : ''}`}
            onClick={() => setActiveTab('games')}
          >
            Virtual Games
          </button>
          <button 
            className={`tab ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            Promo Codes
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'dashboard' && (
            <div className="stats-grid">
              <div className="stat-card card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats?.totalUsers}</p>
              </div>
              <div className="stat-card card">
                <h3>Pending Deposits</h3>
                <p className="stat-value">{stats?.pendingDeposits}</p>
              </div>
              <div className="stat-card card">
                <h3>Pending Withdrawals</h3>
                <p className="stat-value">{stats?.pendingWithdrawals}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Bets</h3>
                <p className="stat-value">{stats?.totalBets}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Deposits</h3>
                <p className="stat-value">${stats?.totalDepositAmount}</p>
              </div>
              <div className="stat-card card">
                <h3>Total Withdrawals</h3>
                <p className="stat-value">${stats?.totalWithdrawalAmount}</p>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="users-section">
              <h2>Manage Users</h2>
              <div className="users-table">
                {users.map(user => (
                  <div key={user._id} className="user-row card">
                    <div>
                      <p className="user-name">{user.fullName}</p>
                      <p className="user-email">{user.email}</p>
                    </div>
                    <button className="btn btn-secondary">Manage</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="games-section card">
              <h2>Virtual Games</h2>
              <p>Upload and manage virtual games here</p>
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="promo-section card">
              <h2>Promo Codes</h2>
              <p>Create and manage promo codes</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;
