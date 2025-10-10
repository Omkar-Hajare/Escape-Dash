import express from 'express';
import GameStats from '../models/GameStats.js';

const router = express.Router();

// Get stats for a specific difficulty
router.get('/:difficulty', async (req, res) => {
  try {
    const { difficulty } = req.params;
    let stats = await GameStats.findOne({ difficulty });
    
    if (!stats) {
      stats = new GameStats({ difficulty });
      await stats.save();
    }
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update game stats
router.post('/update', async (req, res) => {
  try {
    const { difficulty, score, coins } = req.body;
    
    let stats = await GameStats.findOne({ difficulty });
    
    if (!stats) {
      stats = new GameStats({ difficulty });
    }
    
    let isNewHighScore = false;
    
    // Update high score if beaten
    if (score > stats.highScore) {
      stats.highScore = score;
      isNewHighScore = true;
    }
    
    // Add coins to total
    stats.totalCoins += coins;
    stats.lastUpdated = Date.now();
    
    await stats.save();
    
    res.json({ 
      stats, 
      isNewHighScore 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all stats
router.get('/', async (req, res) => {
  try {
    const allStats = await GameStats.find();
    res.json(allStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;