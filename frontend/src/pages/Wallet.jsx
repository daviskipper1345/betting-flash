import React, { useState, useEffect } from 'react';
import { walletAPI, depositAPI } from '../api';
import './Wallet.css';

function Wallet() {
  const [wallet, setWallet] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [bankDetails, setBankDetails] = useState(null);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [walletRes, depositsRes, bankRes] = await Promise.all([
        walletAPI.getWallet(),
        depositAPI.getDeposits(),
        depositAPI.getBankDetails()
      ]);

      setWallet(walletRes.data);
      setDeposits(depositsRes.data);
      setBankDetails(bankRes.data);
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Enter valid amount');
      return;
    }

    try {
      await depositAPI.requestDeposit(parseFloat(depositAmount));
      setDepositAmount('');
      setShowDepositModal(false);
      alert('Deposit request created. Transfer funds to the admin account and confirm.');
      fetchWalletData();
    } catch (error) {
      alert(error.response?.data?.error || 'Deposit failed');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="wallet-page">
      <div className="container">
        <h1>My Money</h1>

        <div className="balance-cards">
          <div className="balance-card card">
            <h3>Main Balance</h3>
            <p className="balance-amount">${wallet?.mainBalance || 0}</p>
          </div>
          <div className="balance-card card">
            <h3>Bonus Balance</h3>
            <p className="balance-amount text-win">${wallet?.bonusBalance || 0}</p>
          </div>
          <div className="balance-card card">
            <h3>Withdrawable</h3>
            <p className="balance-amount">${wallet?.withdrawableBalance || 0}</p>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn btn-primary" onClick={() => setShowDepositModal(true)}>Deposit</button>
          <button className="btn btn-secondary">Withdraw</button>
        </div>

        <div className="transactions-section">
          <h2>Recent Deposits</h2>
          {deposits.length === 0 ? (
            <p className="empty-state">No deposits yet</p>
          ) : (
            <div className="transactions-list">
              {deposits.map(deposit => (
                <div key={deposit._id} className="transaction-item card">
                  <div>
                    <h4>${deposit.amount}</h4>
                    <p className="text-secondary">{new Date(deposit.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status status-${deposit.status.toLowerCase()}`}>
                    {deposit.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showDepositModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Deposit Money</h2>
            <div className="bank-info">
              <h3>🇳🇬 Nigerian Account (OPay):</h3>
              <div className="info-box">
                <p><strong>Bank:</strong> {bankDetails?.nigerian?.bankName}</p>
                <p><strong>Account Number:</strong> {bankDetails?.nigerian?.accountNumber}</p>
                <p><strong>Account Name:</strong> {bankDetails?.nigerian?.accountName}</p>
              </div>

              <h3>🌍 International Account (PalmPay):</h3>
              <div className="info-box">
                <p><strong>Bank:</strong> {bankDetails?.foreign?.bankName}</p>
                <p><strong>Account Number:</strong> {bankDetails?.foreign?.accountNumber}</p>
                <p><strong>Account Name:</strong> {bankDetails?.foreign?.accountName}</p>
              </div>
            </div>

            <input
              type="number"
              placeholder="Amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="input-field"
            />

            <p className="info-text">Send funds to the account above, then confirm here.</p>

            <div className="modal-buttons">
              <button className="btn btn-primary" onClick={handleRequestDeposit}>Confirm Deposit</button>
              <button className="btn btn-secondary" onClick={() => setShowDepositModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Wallet;
