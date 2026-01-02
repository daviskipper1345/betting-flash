import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import Footer from './components/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Casino from './pages/Casino';
import Betting from './pages/Betting';
import Wallet from './pages/Wallet';
import Account from './pages/Account';
import Admin from './pages/Admin';

function App() {
  const { token, loadUser } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, []);

  const isAuthenticated = !!token;

  return (
    <Router>
      <div className="app-layout">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          
          {!isAuthenticated ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/casino" element={<Casino />} />
              <Route path="/betting" element={<Betting />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/account" element={<Account />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>

        {isAuthenticated && <Footer />}
      </div>
    </Router>
  );
}

export default App;
