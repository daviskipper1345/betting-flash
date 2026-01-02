import express from 'express';
import CasinoGame from '../models/CasinoGame.js';
import Wallet from '../models/Wallet.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Play casino game
router.post('/play', authMiddleware, async (req, res) => {
  try {
    const { gameType, stake } = req.body;

    const validGames = ['LOCKED_MONEY', 'TURN_YOUR_LIFE_AROUND', 'CRAZY_SLOTS', 'BETTING_FLASH_4', 'ROLL_DICE'];
    
    if (!validGames.includes(gameType) || !stake || stake <= 0) {
      return res.status(400).json({ error: 'Invalid game or stake' });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.mainBalance < stake) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const game = new CasinoGame({
      userId: req.user.id,
      gameType,
      stake,
      adminControlled: true
    });

    await game.save();

    // Deduct stake
    wallet.mainBalance -= stake;
    await wallet.save();

    res.status(201).json({
      message: 'Game started',
      game,
      balanceAfter: wallet.mainBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Set game outcome
router.post('/:id/outcome', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { outcome, odds } = req.body;

    if (!['WIN', 'LOSS'].includes(outcome)) {
      return res.status(400).json({ error: 'Invalid outcome' });
    }

    const game = await CasinoGame.findById(req.params.id);

    if (!game) {
      return res.status(404).json({ error: 'Game not found' });
    }

    game.outcome = outcome;
    game.odds = odds;
    game.payout = outcome === 'WIN' ? game.stake * odds : 0;
    game.settledAt = new Date();

    await game.save();

    const wallet = await Wallet.findOne({ userId: game.userId });

    if (outcome === 'WIN') {
      wallet.mainBalance += game.payout;
      wallet.withdrawableBalance += game.payout;
      wallet.totalWins += 1;
    } else {
      wallet.totalLosses += 1;
    }

    await wallet.save();

    res.json({
      message: 'Game outcome set',
      game,
      balanceAfter: wallet.mainBalance
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user games
router.get('/', authMiddleware, async (req, res) => {
  try {
    const games = await CasinoGame.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
