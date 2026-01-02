import mongoose from 'mongoose';

const withdrawalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'],
    default: 'PENDING'
  },
  settledBetsRequired: Number,
  settledBetsCount: Number,
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  completedAt: Date,
  bankDetails: {
    accountNumber: String,
    accountHolder: String,
    bankName: String
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

export default mongoose.model('Withdrawal', withdrawalSchema);
