// src/services/api.js - UPDATE

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const gameStatsAPI = {
  
  getStats: async (difficulty) => {
    try {
      const response = await fetch(`${API_URL}/stats/${difficulty}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },

  updateStats: async (difficulty, score, coins) => {
    try {
      const response = await fetch(`${API_URL}/stats/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, score, coins }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating stats:', error);
      return null;
    }
  },

  getAllStats: async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching all stats:', error);
      return [];
    }
  }
};

//Leaderboard API
export const leaderboardAPI = {
  // Get top 10 for specific difficulty
  getLeaderboard: async (difficulty) => {
    try {
      const response = await fetch(`${API_URL}/leaderboard/${difficulty}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  },

  // Get all leaderboards
  getAllLeaderboards: async () => {
    try {
      const response = await fetch(`${API_URL}/leaderboard`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching all leaderboards:', error);
      return {};
    }
  },

  // Add new entry
  addEntry: async (playerName, difficulty, score, coins, timePlayed) => {
    try {
      const response = await fetch(`${API_URL}/leaderboard/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ playerName, difficulty, score, coins, timePlayed }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      return null;
    }
  },

  // Get player's best score
  getPlayerBest: async (playerName, difficulty) => {
    try {
      const response = await fetch(
        `${API_URL}/leaderboard/player/${playerName}/${difficulty}`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching player best:', error);
      return null;
    }
  }
};