import mongoose from 'mongoose';

const betSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['SPORTS', 'CASINO', 'VIRTUAL'],
    required: true
  },
  stake: {
    type: Number,
    required: true,
    min: 0
  },
  potentialWinning: Number,
  actualWinning: Number,
  status: {
    type: String,
    enum: ['OPEN', 'WON', 'LOST', 'VOID', 'POSTPONED'],
    default: 'OPEN'
  },
  selections: [{
    id: String,
    matchId: String,
    matchName: String,
    market: String,
    selection: String,
    odds: Number
  }],
  bonusPercentage: {
    type: Number,
    default: 3
  },
  maxPayout: {
    type: Number,
    default: 200000000
  },
  settledAt: Date,
  settledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

export default mongoose.model('Bet', betSchema);
