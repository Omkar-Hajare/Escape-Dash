import mongoose from 'mongoose';

const GameStatsSchema = new mongoose.Schema({
  difficulty: {
    type: String,
    required: true,
    enum: ['simple', 'moderate', 'hard']
  },
  highScore: {
    type: Number,
    default: 0
  },
  totalCoins: {
    type: Number,
    default: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('GameStats', GameStatsSchema);