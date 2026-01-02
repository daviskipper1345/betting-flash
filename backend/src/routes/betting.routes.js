import express from 'express';
import Bet from '../models/Bet.js';
import Wallet from '../models/Wallet.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Place bet
router.post('/place', authMiddleware, async (req, res) => {
  try {
    const { stake, selections } = req.body;

    if (!stake || !selections || selections.length === 0 || selections.length > 60) {
      return res.status(400).json({ error: 'Invalid bet selections' });
    }

    // Calculate odds
    const odds = selections.reduce((acc, sel) => acc * sel.odds, 1);
    const potentialWinning = stake * odds;

    const bet = new Bet({
      userId: req.user.id,
      type: 'SPORTS',
      stake,
      selections,
      potentialWinning: potentialWinning > 200000000 ? 200000000 : potentialWinning,
      status: 'OPEN'
    });

    await bet.save();

    // Deduct stake from wallet
    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.mainBalance < stake) {
      await Bet.deleteOne({ _id: bet._id });
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    wallet.mainBalance -= stake;
    await wallet.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get open bets
router.get('/open', authMiddleware, async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.user.id, status: 'OPEN' }).sort({ createdAt: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get bet history
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const bets = await Bet.find({ userId: req.user.id, status: { $in: ['WON', 'LOST', 'VOID', 'POSTPONED'] } }).sort({ createdAt: -1 });
    res.json(bets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Settle bet
router.post('/:id/settle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, actualWinning } = req.body;

    if (!['WON', 'LOST', 'VOID', 'POSTPONED'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bet = await Bet.findById(req.params.id);

    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    bet.status = status;
    bet.settledAt = new Date();
    bet.settledBy = req.user.id;

    const wallet = await Wallet.findOne({ userId: bet.userId });

    if (status === 'WON') {
      const bonusAmount = (actualWinning || bet.potentialWinning) * (bet.bonusPercentage / 100);
      bet.actualWinning = Math.min(actualWinning || bet.potentialWinning, bet.maxPayout);
      
      wallet.mainBalance += bet.actualWinning;
      wallet.bonusBalance += bonusAmount;
      wallet.withdrawableBalance += bet.actualWinning;
      wallet.totalWins += 1;
    } else if (status === 'LOST') {
      wallet.totalLosses += 1;
    } else if (status === 'VOID') {
      wallet.mainBalance += bet.stake;
    }

    await bet.save();
    await wallet.save();

    res.json({
      message: `Bet settled as ${status}`,
      bet
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
