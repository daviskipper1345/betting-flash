import express from 'express';
import Withdrawal from '../models/Withdrawal.js';
import Wallet from '../models/Wallet.js';
import Bet from '../models/Bet.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Request withdrawal
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const wallet = await Wallet.findOne({ userId: req.user.id });
    if (!wallet || wallet.withdrawableBalance < amount) {
      return res.status(400).json({ error: 'Insufficient withdrawable balance' });
    }

    const user = await User.findById(req.user.id);
    
    // Check promo code requirement
    const minSettledBets = user.promoCode ? 1 : 2;
    const settledBets = await Bet.countDocuments({
      userId: req.user.id,
      status: { $in: ['WON', 'LOST'] }
    });

    if (settledBets < minSettledBets) {
      return res.status(400).json({
        error: `You need at least ${minSettledBets} settled bet(s) before withdrawal`
      });
    }

    const withdrawal = new Withdrawal({
      userId: req.user.id,
      amount,
      status: 'PENDING',
      settledBetsRequired: minSettledBets,
      settledBetsCount: settledBets,
      bankDetails: {
        accountNumber: user.bankAccount,
        accountHolder: user.accountName,
        bankName: 'User Bank'
      }
    });

    await withdrawal.save();

    res.status(201).json({
      message: 'Withdrawal request created',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user withdrawals
router.get('/', authMiddleware, async (req, res) => {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve withdrawal
router.post('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'APPROVED';
    withdrawal.approvedBy = req.user.id;
    withdrawal.approvedAt = new Date();

    await withdrawal.save();

    res.json({
      message: 'Withdrawal approved',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Complete withdrawal (after payment)
router.post('/:id/complete', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'COMPLETED';
    withdrawal.completedAt = new Date();

    await withdrawal.save();

    // Deduct from wallet
    const wallet = await Wallet.findOne({ userId: withdrawal.userId });
    wallet.withdrawableBalance -= withdrawal.amount;
    await wallet.save();

    res.json({
      message: 'Withdrawal completed',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Reject withdrawal
router.post('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id);

    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' });
    }

    withdrawal.status = 'REJECTED';
    withdrawal.approvedBy = req.user.id;
    withdrawal.approvedAt = new Date();

    await withdrawal.save();

    res.json({
      message: 'Withdrawal rejected',
      withdrawal
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
