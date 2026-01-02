import React, { useState } from 'react';
import { casinoAPI } from '../api';
import './Casino.css';

function Casino() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [stake, setStake] = useState('');
  const [loading, setLoading] = useState(false);

  const games = [
    { id: 'LOCKED_MONEY', name: 'Locked Money', icon: '💰' },
    { id: 'TURN_YOUR_LIFE_AROUND', name: 'Turn Your Life Around', icon: '🎡' },
    { id: 'CRAZY_SLOTS', name: 'Crazy Slots', icon: '🎰' },
    { id: 'BETTING_FLASH_4', name: 'Betting Flash 4 (Crash)', icon: '📈' },
    { id: 'ROLL_DICE', name: 'Roll Dice', icon: '🎲' }
  ];

  const handlePlayGame = async () => {
    if (!selectedGame || !stake) {
      alert('Select game and enter stake');
      return;
    }

    try {
      setLoading(true);
      await casinoAPI.playGame(selectedGame, parseFloat(stake));
      alert('Game started! Waiting for admin to set outcome.');
      setSelectedGame(null);
      setStake('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="casino-page">
      <div className="container">
        <h1>Casino Games</h1>

        <div className="games-grid">
          {games.map(game => (
            <div 
              key={game.id}
              className={`game-card card ${selectedGame === game.id ? 'selected' : ''}`}
              onClick={() => setSelectedGame(game.id)}
            >
              <span className="game-icon">{game.icon}</span>
              <h3>{game.name}</h3>
            </div>
          ))}
        </div>

        {selectedGame && (
          <div className="play-section card">
            <h2>Play {games.find(g => g.id === selectedGame)?.name}</h2>
            
            <div className="form-group">
              <label>Stake Amount ($)</label>
              <input
                type="number"
                placeholder="Enter stake"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                className="input-field"
              />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handlePlayGame}
              disabled={loading}
            >
              {loading ? 'Playing...' : 'Play Game'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Casino;
