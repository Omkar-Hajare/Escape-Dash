export const DIFFICULTY_SETTINGS = {
  simple: {
    name: 'SIMPLE',
    initialSpeed: 3.8,
    speedIncrement: 0.0012,
    obstacleSpawnRate: 0.022, // Reduced from 0.022
    coinSpawnRate: 0.020, // Increased from 0.020
    color: '#00ff00'
  },
  moderate: {
    name: 'MODERATE', 
    initialSpeed: 4.8,
    speedIncrement: 0.002,
    obstacleSpawnRate: 0.028, // Reduced from 0.035
    coinSpawnRate: 0.020, // Increased from 0.016
    color: '#ffaa00'
  },
  hard: {
    name: 'HARD',
    initialSpeed: 6.0,
    speedIncrement: 0.0035,
    obstacleSpawnRate: 0.035, // Reduced from 0.048
    coinSpawnRate: 0.018, // Increased from 0.013
    color: '#ff0000'
  }
};