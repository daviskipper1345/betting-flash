import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store';
import './Account.css';

function Account() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="account-page">
      <div className="container">
        <h1>My Account</h1>

        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Bet History
          </button>
          <button 
            className={`tab ${activeTab === 'promo' ? 'active' : ''}`}
            onClick={() => setActiveTab('promo')}
          >
            Promo Codes
          </button>
          <button 
            className={`tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="card">
              <h2>Profile Information</h2>
              <div className="profile-info">
                <div className="info-item">
                  <label>Full Name</label>
                  <p>{user?.fullName}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{user?.phone}</p>
                </div>
                <div className="info-item">
                  <label>Country</label>
                  <p>{user?.country || 'Not specified'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="card">
              <h2>Betting History</h2>
              <p className="empty-state">Loading bet history...</p>
            </div>
          )}

          {activeTab === 'promo' && (
            <div className="card">
              <h2>Promo Codes</h2>
              <p className="empty-state">No active promo codes</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h2>Settings</h2>
              <label className="setting-item">
                <input type="checkbox" defaultChecked /> Dark Mode
              </label>
              <label className="setting-item">
                <input type="checkbox" /> Notifications
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Account;
