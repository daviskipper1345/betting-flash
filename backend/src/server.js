import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import walletRoutes from './routes/wallet.routes.js';
import depositRoutes from './routes/deposit.routes.js';
import withdrawalRoutes from './routes/withdrawal.routes.js';
import bettingRoutes from './routes/betting.routes.js';
import casinoRoutes from './routes/casino.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/deposits', depositRoutes);
app.use('/api/withdrawals', withdrawalRoutes);
app.use('/api/betting', bettingRoutes);
app.use('/api/casino', casinoRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Betting Flash Backend running on port ${PORT}`);
});
