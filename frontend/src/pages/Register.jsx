import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import './Auth.css';

function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    password: '',
    country: '',
    bankAccount: '',
    accountNameHolder: '',
    accountName: '',
    promoCode: ''
  });

  const [error, setError] = useState('');
  const [showPromoModal, setShowPromoModal] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (formData.promoCode) {
        setShowPromoModal(true);
      }

      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1 className="neon-glow">Betting Flash</h1>
        <h2>Create Your Account</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="input-field"
          />

          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="bankAccount"
            placeholder="Bank Account Number"
            value={formData.bankAccount}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="accountNameHolder"
            placeholder="Account Name Holder"
            value={formData.accountNameHolder}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="accountName"
            placeholder="Account Name"
            value={formData.accountName}
            onChange={handleChange}
            className="input-field"
          />

          <input
            type="text"
            name="promoCode"
            placeholder="Promo Code (Optional)"
            value={formData.promoCode}
            onChange={handleChange}
            className="input-field"
          />

          <button type="submit" className="btn btn-primary">Register</button>
        </form>

        <p>Already have an account? <a href="/login">Login</a></p>
      </div>

      {showPromoModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>🎉 Congratulations!</h3>
            <p>500% bonus on your first deposit.</p>
            <p>Deposit now and receive 500% more.</p>
            <button className="btn btn-primary" onClick={() => setShowPromoModal(false)}>Got it!</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
