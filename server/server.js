// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import gameStatsRoutes from './routes/gameStats.js';
import leaderboardRoutes from './routes/leaderboard.js'; 

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stats', gameStatsRoutes);
app.use('/api/leaderboard', leaderboardRoutes); 

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});