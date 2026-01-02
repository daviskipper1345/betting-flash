import mongoose from 'mongoose';

const virtualGameSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  homeTeam: {
    type: String,
    required: true
  },
  awayTeam: {
    type: String,
    required: true
  },
  leagueName: String,
  status: {
    type: String,
    enum: ['SCHEDULED', 'LIVE', 'FINISHED', 'POSTPONED'],
    default: 'SCHEDULED'
  },
  startTime: Date,
  timeline: [{
    minute: Number,
    event: String,
    team: String,
    description: String
  }],
  finalScore: {
    home: Number,
    away: Number
  },
  odds: {
    homeWin: { type: Number, min: 1, max: 15 },
    draw: { type: Number, min: 1, max: 15 },
    awayWin: { type: Number, min: 1, max: 15 }
  },
  statistics: {
    corners: Number,
    cards: Number,
    fouls: Number
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

export default mongoose.model('VirtualGame', virtualGameSchema);
