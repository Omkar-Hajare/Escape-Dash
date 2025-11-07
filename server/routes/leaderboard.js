// server/routes/leaderboard.js
import express from 'express';
import Leaderboard from '../models/Leaderboard.js';

const router = express.Router();

// Get top 10 leaderboard for specific difficulty
router.get('/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    
    const leaderboard = await Leaderboard
      .find({ difficulty })
      .sort({ score: -1 })
      .limit(10)
      .select('playerName score coins timePlayed date');
    
    // Add rank to each entry
    const rankedLeaderboard = leaderboard.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1
    }));
    
    res.json(rankedLeaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all leaderboards (all difficulties)
router.get('/', async (req, res) => {
  try {
    const difficulties = ['simple', 'moderate', 'hard'];
    const allLeaderboards = {};
    
    for (const difficulty of difficulties) {
      const leaderboard = await Leaderboard
        .find({ difficulty })
        .sort({ score: -1 })
        .limit(10)
        .select('playerName score coins timePlayed date');
      
      allLeaderboards[difficulty] = leaderboard.map((entry, index) => ({
        ...entry.toObject(),
        rank: index + 1
      }));
    }
    
    res.json(allLeaderboards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new leaderboard entry
router.post('/add', async (req, res) => {
  try {
    const { playerName, difficulty, score, coins, timePlayed } = req.body;
    
    // Validation
    if (!playerName || playerName.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Player name must be at least 2 characters' 
      });
    }
    
    if (playerName.length > 20) {
      return res.status(400).json({ 
        message: 'Player name must be 20 characters or less' 
      });
    }
    
    // Create new entry
    const newEntry = new Leaderboard({
      playerName: playerName.trim(),
      difficulty,
      score,
      coins,
      timePlayed
    });
    
    await newEntry.save();
    
    // Get player's rank
    const rank = await Leaderboard.countDocuments({
      difficulty,
      score: { $gt: score }
    }) + 1;
    
    // Check if player made top 10
    const isTopTen = rank <= 10;
    
    res.json({
      entry: newEntry,
      rank,
      isTopTen,
      message: isTopTen ? 'Congratulations! You made the top 10!' : 'Score saved!'
    });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get player's best score for a difficulty
router.get('/player/:playerName/:difficulty', async (req, res) => {
  try {
    const { playerName, difficulty } = req.params;
    
    const bestScore = await Leaderboard
      .findOne({ 
        playerName: new RegExp(`^${playerName}$`, 'i'), // Case insensitive
        difficulty 
      })
      .sort({ score: -1 })
      .select('score coins date');
    
    res.json(bestScore);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete old entries (keep top 100 per difficulty)
router.delete('/cleanup', async (req, res) => {
  try {
    const difficulties = ['simple', 'moderate', 'hard'];
    let deletedCount = 0;
    
    for (const difficulty of difficulties) {
      const topEntries = await Leaderboard
        .find({ difficulty })
        .sort({ score: -1 })
        .limit(100)
        .select('_id');
      
      const topIds = topEntries.map(entry => entry._id);
      
      const result = await Leaderboard.deleteMany({
        difficulty,
        _id: { $nin: topIds }
      });
      
      deletedCount += result.deletedCount;
    }
    
    res.json({ 
      message: 'Cleanup completed', 
      deletedCount 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;