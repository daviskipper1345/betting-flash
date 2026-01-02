import mongoose from 'mongoose';

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  mainBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  bonusBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  withdrawableBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  totalWins: {
    type: Number,
    default: 0
  },
  totalLosses: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Wallet', walletSchema);
