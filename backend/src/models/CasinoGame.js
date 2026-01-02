import mongoose from 'mongoose';

const casinoGameSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  gameType: {
    type: String,
    enum: ['LOCKED_MONEY', 'TURN_YOUR_LIFE_AROUND', 'CRAZY_SLOTS', 'BETTING_FLASH_4', 'ROLL_DICE'],
    required: true
  },
  stake: {
    type: Number,
    required: true,
    min: 0
  },
  odds: Number,
  payout: Number,
  outcome: {
    type: String,
    enum: ['WIN', 'LOSS'],
    default: null
  },
  adminControlled: {
    type: Boolean,
    default: true
  },
  timeBasedOutcome: Date,
  settledAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('CasinoGame', casinoGameSchema);
