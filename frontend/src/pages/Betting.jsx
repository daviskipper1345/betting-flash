import React, { useState, useEffect } from 'react';
import { bettingAPI, walletAPI } from '../api';
import './Betting.css';

function Betting() {
  const [betSlip, setBetSlip] = useState({
    selections: [],
    stake: '',
    potentialWinning: 0
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [walletBalance, setWalletBalance] = useState(null);

  const [dummyMatches] = useState([
    { id: 1, home: 'Manchester United', away: 'Liverpool', league: 'Premier League', odds: { home: 1.8, draw: 3.5, away: 2.1 } },
    { id: 2, home: 'Barcelona', away: 'Real Madrid', league: 'La Liga', odds: { home: 1.9, draw: 3.2, away: 2.0 } },
    { id: 3, home: 'Paris Saint Germain', away: 'Marseille', league: 'Ligue 1', odds: { home: 1.5, draw: 4.0, away: 2.8 } }
  ]);

  const handleAddSelection = (match, market, selection, odds) => {
    const newSelection = {
      id: `${match.id}-${market}-${selection}`,
      matchId: match.id,
      matchName: `${match.home} vs ${match.away}`,
      market,
      selection,
      odds
    };

    const updated = [...betSlip.selections, newSelection];
    const potentialWinning = updated.reduce((acc, sel) => acc * sel.odds, betSlip.stake ? parseFloat(betSlip.stake) : 1);

    setBetSlip({
      ...betSlip,
      selections: updated,
      potentialWinning: Math.round(potentialWinning * 100) / 100
    });
  };

  const handleRemoveSelection = (id) => {
    const updated = betSlip.selections.filter(sel => sel.id !== id);
    const potentialWinning = updated.reduce((acc, sel) => acc * sel.odds, betSlip.stake ? parseFloat(betSlip.stake) : 1);

    setBetSlip({
      ...betSlip,
      selections: updated,
      potentialWinning: Math.round(potentialWinning * 100) / 100
    });
  };

  const handleStakeChange = (e) => {
    const stake = e.target.value;
    const potentialWinning = betSlip.selections.reduce((acc, sel) => acc * sel.odds, stake ? parseFloat(stake) : 1);

    setBetSlip({
      ...betSlip,
      stake,
      potentialWinning: Math.round(potentialWinning * 100) / 100
    });
  };

  const handlePlaceBet = async () => {
    if (!betSlip.stake || betSlip.selections.length === 0) {
      setMessage({ type: 'error', text: 'Add selections and enter stake' });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      await bettingAPI.placeBet(parseFloat(betSlip.stake), betSlip.selections);
      setMessage({ type: 'success', text: 'Bet placed successfully!' });
      setBetSlip({ selections: [], stake: '', potentialWinning: 0 });

      // refresh wallet balance if endpoint available
      try {
        const res = await walletAPI.getBalance();
        if (res && res.data && typeof res.data.balance !== 'undefined') {
          setWalletBalance(res.data.balance);
        }
      } catch (e) {
        // ignore balance refresh errors
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to place bet' });
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await walletAPI.getBalance();
        if (!mounted) return;
        if (res && res.data && typeof res.data.balance !== 'undefined') {
          setWalletBalance(res.data.balance);
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="betting-page">
      <div className="container">
        <h1>Sports Betting</h1>

        <div className="betting-layout">
          <div className="matches-section">
            <h2>Available Matches</h2>
            {dummyMatches.map(match => (
              <div key={match.id} className="match-card card">
                <h3>{match.home} vs {match.away}</h3>
                <p className="text-secondary">{match.league}</p>

                <div className="odds-grid">
                  <button 
                    className="odds-btn"
                    onClick={() => handleAddSelection(match, '1X2', match.home, match.odds.home)}
                  >
                    <span>{match.home}</span>
                    <span className="odds-value">{match.odds.home}</span>
                  </button>
                  <button 
                    className="odds-btn"
                    onClick={() => handleAddSelection(match, '1X2', 'Draw', match.odds.draw)}
                  >
                    <span>Draw</span>
                    <span className="odds-value">{match.odds.draw}</span>
                  </button>
                  <button 
                    className="odds-btn"
                    onClick={() => handleAddSelection(match, '1X2', match.away, match.odds.away)}
                  >
                    <span>{match.away}</span>
                    <span className="odds-value">{match.odds.away}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="betslip-section">
            <div className="betslip card">
              <h2>Bet Slip</h2>

              <div className="selections-list">
                {betSlip.selections.length === 0 ? (
                  <p className="empty-state">Add selections to start betting</p>
                ) : (
                  betSlip.selections.map(sel => (
                    <div key={sel.id} className="selection-item">
                      <div>
                        <p className="selection-match">{sel.matchName}</p>
                        <p className="selection-detail">{sel.selection} @ {sel.odds}</p>
                      </div>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveSelection(sel.id)}
                      >×</button>
                    </div>
                  ))
                )}
              </div>

              <input
                type="number"
                placeholder="Stake ($)"
                value={betSlip.stake}
                onChange={handleStakeChange}
                className="input-field"
              />

              <div className="summary">
                {walletBalance !== null && (
                  <div className="summary-row">
                    <span>Balance:</span>
                    <span>${walletBalance}</span>
                  </div>
                )}
                <div className="summary-row">
                  <span>Odds:</span>
                  <span>{betSlip.selections.reduce((acc, sel) => acc * sel.odds, 1).toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Potential Win:</span>
                  <span className="text-win">${betSlip.potentialWinning}</span>
                </div>
                <div className="summary-row">
                  <span>Bonus (3%):</span>
                  <span>${(betSlip.potentialWinning * 0.03).toFixed(2)}</span>
                </div>
              </div>

              {message && (
                <div className={"message " + (message.type === 'error' ? 'msg-error' : 'msg-success')} style={{marginBottom: '0.75rem'}}>
                  {message.text}
                </div>
              )}

              <button 
                className="btn btn-primary" 
                onClick={handlePlaceBet}
                disabled={betSlip.selections.length === 0 || loading}
              >
                {loading ? 'Placing...' : 'Place Bet'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Betting;
