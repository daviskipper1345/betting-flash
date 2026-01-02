import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  bonusPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 500
  },
  minSettledBetsRequired: {
    type: Number,
    default: 1
  },
  description: String,
  maxUses: Number,
  usesCount: {
    type: Number,
    default: 0
  },
  expiresAt: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('PromoCode', promoCodeSchema);
