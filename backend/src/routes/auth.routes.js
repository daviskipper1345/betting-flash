import express from 'express';
import User from '../models/User.js';
import Wallet from '../models/Wallet.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { fullName, phone, email, password, country, bankAccount, accountNameHolder, accountName, promoCode } = req.body;

    if (await User.findOne({ email }) || await User.findOne({ phone })) {
      return res.status(400).json({ error: 'Email or phone already exists' });
    }

    const user = new User({
      fullName,
      phone,
      email,
      password,
      country,
      bankAccount,
      accountNameHolder,
      accountName,
      promoCode
    });

    await user.save();

    // Create wallet
    const wallet = new Wallet({ userId: user._id });
    await wallet.save();

    const token = jwt.sign({ id: user._id, email: user.email, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    if (user.isFrozen) {
      return res.status(403).json({ error: 'Account is frozen' });
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.isAdmin ? 'admin' : 'user' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE || '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName, isAdmin: user.isAdmin }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

export default router;
