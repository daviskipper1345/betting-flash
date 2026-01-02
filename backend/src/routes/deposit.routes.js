import express from 'express';
import Deposit from '../models/Deposit.js';
import Wallet from '../models/Wallet.js';
import User from '../models/User.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Request deposit
router.post('/request', authMiddleware, async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const deposit = new Deposit({
      userId: req.user.id,
      amount,
      status: 'PENDING'
    });

    await deposit.save();

    res.status(201).json({
      message: 'Deposit request created',
      deposit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin bank details
router.get('/bank-details', (req, res) => {
  res.json({
    nigerian: {
      bankName: process.env.NIGERIA_BANK_NAME || 'OPay',
      accountNumber: process.env.NIGERIA_BANK_ACCOUNT || '9133758994',
      accountName: process.env.NIGERIA_ACCOUNT_NAME || 'CHAKIDA ADAMU JOSEPH'
    },
    foreign: {
      bankName: process.env.FOREIGN_BANK_NAME || 'PalmPay',
      accountNumber: process.env.FOREIGN_BANK_ACCOUNT || '7071198393',
      accountName: process.env.FOREIGN_ACCOUNT_NAME || 'Hope Adanchin'
    }
  });
});

// Get user deposits
router.get('/', authMiddleware, async (req, res) => {
  try {
    const deposits = await Deposit.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Approve deposit
router.post('/:id/approve', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { bonusPercentage } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    const bonus = bonusPercentage ? (deposit.amount * bonusPercentage) / 100 : 0;

    deposit.status = 'APPROVED';
    deposit.bonusApplied = bonus;
    deposit.approvedBy = req.user.id;
    deposit.approvedAt = new Date();

    await deposit.save();

    // Update wallet
    const wallet = await Wallet.findOne({ userId: deposit.userId });
    wallet.mainBalance += deposit.amount;
    wallet.bonusBalance += bonus;
    wallet.withdrawableBalance += deposit.amount;
    await wallet.save();

    res.json({
      message: 'Deposit approved',
      deposit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin: Reject deposit
router.post('/:id/reject', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' });
    }

    deposit.status = 'REJECTED';
    deposit.approvedBy = req.user.id;
    deposit.approvedAt = new Date();

    await deposit.save();

    res.json({
      message: 'Deposit rejected',
      deposit
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
