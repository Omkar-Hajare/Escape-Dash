const API_URL = 'http://localhost:5000/api';

export const gameStatsAPI = {
  // Get stats for difficulty
  getStats: async (difficulty) => {
    try {
      const response = await fetch(`${API_URL}/stats/${difficulty}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return null;
    }
  },

  // Update game stats
  updateStats: async (difficulty, score, coins) => {
    try {
      const response = await fetch(`${API_URL}/stats/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ difficulty, score, coins }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating stats:', error);
      return null;
    }
  },

  // Get all stats
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