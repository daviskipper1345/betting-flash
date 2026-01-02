import mongoose from 'mongoose';

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  targetUserId: mongoose.Schema.Types.ObjectId,
  details: mongoose.Schema.Types.Mixed,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('AdminLog', adminLogSchema);
