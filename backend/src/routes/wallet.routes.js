import express from 'express';
import Wallet from '../models/Wallet.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get wallet
router.get('/', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get balance summary
router.get('/balance', authMiddleware, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    res.json({
      mainBalance: wallet.mainBalance,
      bonusBalance: wallet.bonusBalance,
      withdrawableBalance: wallet.withdrawableBalance,
      totalBalance: wallet.mainBalance + wallet.bonusBalance,
      totalWins: wallet.totalWins,
      totalLosses: wallet.totalLosses
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
