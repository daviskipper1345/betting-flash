import express from 'express';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import Deposit from '../models/Deposit.js';
import Withdrawal from '../models/Withdrawal.js';
import VirtualGame from '../models/VirtualGame.js';
import PromoCode from '../models/PromoCode.js';
import AdminLog from '../models/AdminLog.js';
import CasinoGame from '../models/CasinoGame.js';
import Bet from '../models/Bet.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all users
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user details
router.get('/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const wallet = await Wallet.findOne({ userId: req.params.id });

    res.json({ user, wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Freeze user account
router.post('/users/:id/freeze', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isFrozen: true },
      { new: true }
    ).select('-password');

    await AdminLog.create({
      adminId: req.user.id,
      action: 'FREEZE_ACCOUNT',
      targetUserId: req.params.id
    });

    res.json({ message: 'User frozen', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Unfreeze user account
router.post('/users/:id/unfreeze', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isFrozen: false },
      { new: true }
    ).select('-password');

    await AdminLog.create({
      adminId: req.user.id,
      action: 'UNFREEZE_ACCOUNT',
      targetUserId: req.params.id
    });

    res.json({ message: 'User unfrozen', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit user balance
router.post('/users/:id/balance', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { mainBalance, bonusBalance, withdrawableBalance } = req.body;

    const wallet = await Wallet.findOneAndUpdate(
      { userId: req.params.id },
      {
        mainBalance: mainBalance ?? undefined,
        bonusBalance: bonusBalance ?? undefined,
        withdrawableBalance: withdrawableBalance ?? undefined
      },
      { new: true }
    );

    await AdminLog.create({
      adminId: req.user.id,
      action: 'EDIT_BALANCE',
      targetUserId: req.params.id,
      details: { mainBalance, bonusBalance, withdrawableBalance }
    });

    res.json({ message: 'Balance updated', wallet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Virtual games: Upload new games
router.post('/virtual-games/upload', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { games } = req.body;

    if (!Array.isArray(games) || games.length > 20) {
      return res.status(400).json({ error: 'Max 20 games per upload' });
    }

    const created = [];

    for (const game of games) {
      const virtualGame = new VirtualGame({
        ...game,
        createdBy: req.user.id
      });

      await virtualGame.save();
      created.push(virtualGame);
    }

    await AdminLog.create({
      adminId: req.user.id,
      action: 'UPLOAD_VIRTUAL_GAMES',
      details: { count: created.length }
    });

    res.status(201).json({
      message: `${created.length} games uploaded`,
      games: created
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Virtual games: Get all games
router.get('/virtual-games', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const games = await VirtualGame.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Virtual games: Update timeline and outcome
router.put('/virtual-games/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, timeline, finalScore } = req.body;

    const game = await VirtualGame.findByIdAndUpdate(
      req.params.id,
      {
        status: status ?? undefined,
        timeline: timeline ?? undefined,
        finalScore: finalScore ?? undefined
      },
      { new: true }
    );

    await AdminLog.create({
      adminId: req.user.id,
      action: 'UPDATE_VIRTUAL_GAME',
      details: { gameId: req.params.id }
    });

    res.json({ message: 'Game updated', game });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promo codes: Create
router.post('/promo-codes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { code, bonusPercentage, minSettledBetsRequired, description, maxUses, expiresAt } = req.body;

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      bonusPercentage,
      minSettledBetsRequired: minSettledBetsRequired || 1,
      description,
      maxUses,
      expiresAt,
      createdBy: req.user.id
    });

    await promoCode.save();

    await AdminLog.create({
      adminId: req.user.id,
      action: 'CREATE_PROMO_CODE',
      details: { code }
    });

    res.status(201).json({
      message: 'Promo code created',
      promoCode
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promo codes: Get all
router.get('/promo-codes', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const promoCodes = await PromoCode.find().sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get admin logs
router.get('/logs', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const logs = await AdminLog.find()
      .populate('adminId', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalDeposits = await Deposit.countDocuments({ status: 'APPROVED' });
    const pendingDeposits = await Deposit.countDocuments({ status: 'PENDING' });
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'PENDING' });
    const totalBets = await Bet.countDocuments();
    const settledBets = await Bet.countDocuments({ status: { $in: ['WON', 'LOST'] } });

    const totalDepositAmount = await Deposit.aggregate([
      { $match: { status: 'APPROVED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalWithdrawalAmount = await Withdrawal.aggregate([
      { $match: { status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalDeposits,
      pendingDeposits,
      pendingWithdrawals,
      totalBets,
      settledBets,
      totalDepositAmount: totalDepositAmount[0]?.total || 0,
      totalWithdrawalAmount: totalWithdrawalAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
