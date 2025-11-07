import { DIFFICULTY_SETTINGS } from './gameConfig';

// ===== COLLISION DETECTION =====
export const checkCollision = (rect1, rect2) => {
  return rect1.x < rect2.x + rect2.width &&
         rect1.x + rect1.width > rect2.x &&
         rect1.y < rect2.y + rect2.height &&
         rect1.y + rect1.height > rect2.y;
};


export const checkCollisionWithTolerance = (rect1, rect2, tolerance = 5) => {
  return rect1.x + tolerance < rect2.x + rect2.width - tolerance &&
         rect1.x + rect1.width - tolerance > rect2.x + tolerance &&
         rect1.y + tolerance < rect2.y + rect2.height - tolerance &&
         rect1.y + rect1.height - tolerance > rect2.y + tolerance;
};

// ===== PLAYER MOVEMENT LOGIC =====
export const updatePlayerPosition = (player, targetX, smoothness = 0.25) => {
  const diff = targetX - player.x;
  if (Math.abs(diff) > 2) {
    player.x += diff * smoothness;
  } else {
    player.x = targetX;
  }
  return player;
};

export const handlePlayerInput = (player, keys, lanes) => {
  if (!player || !keys || !lanes) return player;

  // Move left
  if ((keys['ArrowLeft'] || keys['KeyA']) && player.lane > 0) {
    player.lane--;
    player.targetX = lanes[player.lane] - 25;
    keys['ArrowLeft'] = false;
    keys['KeyA'] = false;
  }

  // Move right
  if ((keys['ArrowRight'] || keys['KeyD']) && player.lane < lanes.length - 1) {
    player.lane++;
    player.targetX = lanes[player.lane] - 25;
    keys['ArrowRight'] = false;
    keys['KeyD'] = false;
  }

  return player;
};

// ===== OBSTACLE SPAWNING LOGIC =====
export const shouldSpawnObstacle = (
  difficulty, 
  score, 
  lastObstacleTime, 
  minObstacleGap
) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const currentTime = Date.now();
  
  // Check if enough time has passed since last obstacle
  if (currentTime - lastObstacleTime < minObstacleGap) {
    return { spawn: false };
  }
  
  // Random spawn based on difficulty
  const spawnChance = settings.obstacleSpawnRate + score * 0.00002;
  if (Math.random() < spawnChance) {
    const numObstacles = Math.random() < 0.7 ? 1 : 2;
    return {
      spawn: true,
      count: numObstacles,
      timestamp: currentTime
    };
  }
  
  return { spawn: false };
};

export const selectObstacleLanes = (count, lanes) => {
  const availableLanes = [...Array(lanes.length).keys()]; // [0, 1, 2]
  const selectedLanes = [];
  
  for (let i = 0; i < count; i++) {
    if (availableLanes.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * availableLanes.length);
    const selectedLane = availableLanes[randomIndex];
    selectedLanes.push(selectedLane);
    availableLanes.splice(randomIndex, 1);
  }
  
  return selectedLanes;
};

// ===== COIN SPAWNING LOGIC =====
export const shouldSpawnCoin = (difficulty, score) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  return Math.random() < settings.coinSpawnRate;
};

export const selectCoinLane = (lanes, occupiedLanes = []) => {
  const availableLanes = [...Array(lanes.length).keys()]
    .filter(lane => !occupiedLanes.includes(lane));
  
  if (availableLanes.length === 0) {
    return Math.floor(Math.random() * lanes.length);
  }
  
  return availableLanes[Math.floor(Math.random() * availableLanes.length)];
};

// ===== BACKGROUND ELEMENTS LOGIC =====
export const shouldSpawnBackgroundElement = (spawnRate = 0.01) => {
  return Math.random() < spawnRate;
};

export const selectBackgroundElementType = () => {
  const types = ['tree', 'building', 'car'];
  return types[Math.floor(Math.random() * types.length)];
};

export const selectBackgroundSide = () => {
  return Math.random() < 0.5 ? 'left' : 'right';
};

// ===== PARTICLE SYSTEM =====
export const createParticles = (x, y, count, colors) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 60,
      maxLife: 60,
      color,
      size: Math.random() * 6 + 2
    });
  }
  return particles;
};

export const updateParticle = (particle) => {
  particle.x += particle.vx;
  particle.y += particle.vy;
  particle.vx *= 0.95;
  particle.vy *= 0.95;
  particle.life--;
  return particle;
};

// ===== SCORE CALCULATION =====
export const calculateScore = (baseScore, multiplier = 1) => {
  return Math.floor(baseScore * multiplier);
};

export const calculateCoinValue = (difficulty) => {
  const baseValue = 10;
  const multipliers = {
    simple: 1,
    moderate: 1.5,
    hard: 2
  };
  return Math.floor(baseValue * (multipliers[difficulty] || 1));
};

export const calculateDistanceBonus = (score) => {
  return Math.floor(score * 0.1);
};

// ===== GAME SPEED MANAGEMENT =====
export const updateGameSpeed = (currentSpeed, difficulty, score) => {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const maxSpeed = settings.initialSpeed * 3; // Cap at 3x initial speed
  
  let newSpeed = currentSpeed + settings.speedIncrement;
  
  // Apply speed cap
  if (newSpeed > maxSpeed) {
    newSpeed = maxSpeed;
  }
  
  return newSpeed;
};

export const getSpeedMultiplier = (difficulty) => {
  const multipliers = {
    simple: 1.0,
    moderate: 1.3,
    hard: 1.6
  };
  return multipliers[difficulty] || 1.0;
};

// ===== TIME MANAGEMENT =====
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const getTimeLimit = (difficulty) => {
  const timeLimits = {
    simple: 90,
    moderate: 60,
    hard: 45
  };
  return timeLimits[difficulty] || 60;
};

export const getRemainingTime = (startTime, timeLimit) => {
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const remaining = timeLimit - elapsed;
  return Math.max(0, remaining);
};

export const isTimeUp = (startTime, timeLimit) => {
  return getRemainingTime(startTime, timeLimit) <= 0;
};

// ===== LEVEL PROGRESSION =====
export const calculateLevel = (score) => {
  return Math.floor(score / 100) + 1;
};

export const getLevelThreshold = (level) => {
  return level * 100;
};

export const isLevelUp = (previousScore, currentScore) => {
  return calculateLevel(currentScore) > calculateLevel(previousScore);
};

// ===== GAME STATE VALIDATION =====
export const validateGameState = (gameState) => {
  if (!gameState) return false;
  
  const required = ['player', 'obstacles', 'coins', 'score', 'gameSpeed'];
  return required.every(key => gameState.hasOwnProperty(key));
};

export const cleanupGameObjects = (objects, canvasHeight) => {
  return objects.filter(obj => obj.y <= canvasHeight + 100);
};

// ===== DIFFICULTY SCALING =====
export const getDifficultyMultiplier = (difficulty) => {
  const multipliers = {
    simple: 1.0,
    moderate: 1.5,
    hard: 2.0
  };
  return multipliers[difficulty] || 1.0;
};

export const adjustSpawnRateByScore = (baseRate, score) => {
  const scoreMultiplier = 1 + (score * 0.00002);
  return Math.min(baseRate * scoreMultiplier, baseRate * 2); // Cap at 2x base rate
};

// ===== POWER-UP LOGIC (for future features) =====
export const shouldSpawnPowerUp = (score) => {
  // Spawn power-up every 500 points
  return score > 0 && score % 500 === 0;
};

export const selectPowerUpType = () => {
  const types = ['shield', 'speedboost', 'doublepoints', 'magnet'];
  return types[Math.floor(Math.random() * types.length)];
};

export const applyPowerUp = (gameState, powerUpType) => {
  const effects = {
    shield: () => ({ ...gameState, hasShield: true, shieldTime: 5000 }),
    speedboost: () => ({ ...gameState, speedBoost: 1.5, boostTime: 3000 }),
    doublepoints: () => ({ ...gameState, scoreMultiplier: 2, multiplierTime: 10000 }),
    magnet: () => ({ ...gameState, magnetActive: true, magnetTime: 7000 })
  };
  
  return effects[powerUpType] ? effects[powerUpType]() : gameState;
};

// ===== COMBO SYSTEM =====
export const calculateCombo = (consecutiveCoins) => {
  if (consecutiveCoins < 3) return 1;
  if (consecutiveCoins < 5) return 1.5;
  if (consecutiveCoins < 10) return 2;
  return 2.5;
};

export const resetCombo = () => {
  return {
    consecutiveCoins: 0,
    comboMultiplier: 1,
    comboTime: 0
  };
};

// ===== LANE MANAGEMENT =====
export const getLanePosition = (lanes, laneIndex) => {
  if (laneIndex < 0 || laneIndex >= lanes.length) {
    return lanes[Math.floor(lanes.length / 2)]; // Return middle lane as default
  }
  return lanes[laneIndex];
};

export const getPlayerLaneIndex = (playerX, lanes) => {
  let closestLane = 0;
  let minDistance = Math.abs(playerX - lanes[0]);
  
  for (let i = 1; i < lanes.length; i++) {
    const distance = Math.abs(playerX - lanes[i]);
    if (distance < minDistance) {
      minDistance = distance;
      closestLane = i;
    }
  }
  
  return closestLane;
};

// ===== ANALYTICS & STATISTICS =====
export const calculateAccuracy = (coinsCollected, coinsSpawned) => {
  if (coinsSpawned === 0) return 0;
  return Math.floor((coinsCollected / coinsSpawned) * 100);
};

export const calculateAverageSpeed = (totalDistance, totalTime) => {
  if (totalTime === 0) return 0;
  return Math.floor(totalDistance / totalTime);
};

export const generateGameStats = (gameData) => {
  return {
    score: gameData.score,
    coinsCollected: gameData.coinsCollected || 0,
    obstaclesAvoided: gameData.obstaclesAvoided || 0,
    timePlayed: gameData.timePlayed || 0,
    accuracy: calculateAccuracy(gameData.coinsCollected, gameData.coinsSpawned),
    maxCombo: gameData.maxCombo || 0,
    level: calculateLevel(gameData.score)
  };
};

// ===== LEADERBOARD LOGIC =====
export const saveToLeaderboard = (playerName, score, difficulty, time) => {
  try {
    const leaderboardKey = `leaderboard_${difficulty}`;
    const leaderboard = JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
    
    const entry = {
      name: playerName,
      score,
      difficulty,
      time,
      date: new Date().toISOString()
    };
    
    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep top 10
    const top10 = leaderboard.slice(0, 10);
    localStorage.setItem(leaderboardKey, JSON.stringify(top10));
    
    return {
      success: true,
      rank: top10.findIndex(e => e === entry) + 1,
      isNewRecord: top10[0] === entry
    };
  } catch (error) {
    console.error('Failed to save to leaderboard:', error);
    return { success: false, error };
  }
};

export const getLeaderboard = (difficulty) => {
  try {
    const leaderboardKey = `leaderboard_${difficulty}`;
    return JSON.parse(localStorage.getItem(leaderboardKey) || '[]');
  } catch (error) {
    console.error('Failed to load leaderboard:', error);
    return [];
  }
};

export const getAllLeaderboards = () => {
  return {
    simple: getLeaderboard('simple'),
    moderate: getLeaderboard('moderate'),
    hard: getLeaderboard('hard')
  };
};

// ===== SOUND HELPERS (for future audio implementation) =====
export const shouldPlaySound = (soundType, lastPlayTime, cooldown = 100) => {
  const currentTime = Date.now();
  return currentTime - lastPlayTime > cooldown;
};

export const getSoundVolume = (distance) => {
  // Calculate volume based on distance (for 3D audio effects)
  const maxDistance = 500;
  const volume = Math.max(0, 1 - (distance / maxDistance));
  return volume;
};

// ===== UTILITY FUNCTIONS =====
export const randomInRange = (min, max) => {
  return Math.random() * (max - min) + min;
};

export const randomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

// ===== EXPORT ALL =====
export default {
  checkCollision,
  checkCollisionWithTolerance,
  updatePlayerPosition,
  handlePlayerInput,
  shouldSpawnObstacle,
  selectObstacleLanes,
  shouldSpawnCoin,
  selectCoinLane,
  createParticles,
  updateParticle,
  calculateScore,
  calculateCoinValue,
  updateGameSpeed,
  formatTime,
  getTimeLimit,
  getRemainingTime,
  isTimeUp,
  calculateLevel,
  validateGameState,
  cleanupGameObjects,
  getDifficultyMultiplier,
  saveToLeaderboard,
  getLeaderboard,
  getAllLeaderboards,
  generateGameStats,
  randomInRange,
  randomIntInRange,
  clamp,
  lerp
};