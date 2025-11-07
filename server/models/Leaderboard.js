// server/models/Leaderboard.js
import mongoose from 'mongoose';

const LeaderboardSchema = new mongoose.Schema({
  playerName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 20,
    minLength: 2
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['simple', 'moderate', 'hard']
  },
  score: {
    type: Number,
    required: true,
    min: 0
  },
  coins: {
    type: Number,
    default: 0,
    min: 0
  },
  timePlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now
  },
  rank: {
    type: Number
  }
});

// Compound index for faster queries
LeaderboardSchema.index({ difficulty: 1, score: -1 });
LeaderboardSchema.index({ playerName: 1 });

export default mongoose.model('Leaderboard', LeaderboardSchema);