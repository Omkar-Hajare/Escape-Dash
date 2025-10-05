import { useState, useEffect, useRef, useCallback } from 'react';
import { DIFFICULTY_SETTINGS } from '../utils/gameConfig';
import {
  checkCollision,
  handlePlayerInput,
  shouldSpawnObstacle,
  selectObstacleLanes,
  shouldSpawnCoin,
  createParticles,
  updateGameSpeed,
  formatTime,
  saveToLeaderboard,
  generateGameStats
} from '../utils/gameLogic';

/**
 * Custom hook for managing game state and logic
 * @param {string} difficulty - Game difficulty level
 * @param {function} onGameOver - Callback when game ends
 * @returns {object} Game state and methods
 */
const useGame = (difficulty = 'simple', onGameOver) => {
  // Game State
  const [gameState, setGameState] = useState({
    isRunning: false,
    isPaused: false,
    score: 0,
    time: 0,
    level: 1,
    lives: 3,
    combo: 0,
    maxCombo: 0
  });

  const [stats, setStats] = useState({
    coinsCollected: 0,
    coinsSpawned: 0,
    obstaclesAvoided: 0,
    obstaclesSpawned: 0,
    distanceTraveled: 0
  });

  // Refs for game loop and objects
  const gameLoopRef = useRef(null);
  const startTimeRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const gameSpeedRef = useRef(DIFFICULTY_SETTINGS[difficulty].initialSpeed);
  const lastObstacleTimeRef = useRef(0);

  // Initialize game
  const initializeGame = useCallback(() => {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    
    setGameState({
      isRunning: true,
      isPaused: false,
      score: 0,
      time: 0,
      level: 1,
      lives: 3,
      combo: 0,
      maxCombo: 0
    });

    setStats({
      coinsCollected: 0,
      coinsSpawned: 0,
      obstaclesAvoided: 0,
      obstaclesSpawned: 0,
      distanceTraveled: 0
    });

    gameSpeedRef.current = settings.initialSpeed;
    startTimeRef.current = Date.now();
    lastUpdateRef.current = Date.now();
    lastObstacleTimeRef.current = 0;
  }, [difficulty]);

  // Start game
  const startGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: true, isRunning: false }));
  }, []);

  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isPaused: false, isRunning: true }));
    lastUpdateRef.current = Date.now();
  }, []);

  // End game
  const endGame = useCallback(() => {
    setGameState(prev => ({ ...prev, isRunning: false }));
    
    const finalStats = generateGameStats({
      score: gameState.score,
      coinsCollected: stats.coinsCollected,
      coinsSpawned: stats.coinsSpawned,
      obstaclesAvoided: stats.obstaclesAvoided,
      timePlayed: gameState.time,
      maxCombo: gameState.maxCombo
    });

    // Save to leaderboard
    saveToLeaderboard('Player', gameState.score, difficulty, gameState.time);

    // Call onGameOver callback
    if (onGameOver) {
      onGameOver(gameState.score, gameState.time, finalStats);
    }
  }, [gameState, stats, difficulty, onGameOver]);

  // Update score
  const updateScore = useCallback((points) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + points
    }));
  }, []);

  // Update combo
  const updateCombo = useCallback((increase = true) => {
    setGameState(prev => {
      const newCombo = increase ? prev.combo + 1 : 0;
      const newMaxCombo = Math.max(prev.maxCombo, newCombo);
      return {
        ...prev,
        combo: newCombo,
        maxCombo: newMaxCombo
      };
    });
  }, []);

  // Collect coin
  const collectCoin = useCallback(() => {
    const coinValue = 10;
    const comboMultiplier = Math.floor(gameState.combo / 3) + 1;
    const points = coinValue * comboMultiplier;
    
    updateScore(points);
    updateCombo(true);
    
    setStats(prev => ({
      ...prev,
      coinsCollected: prev.coinsCollected + 1
    }));
  }, [gameState.combo, updateScore, updateCombo]);

  // Hit obstacle
  const hitObstacle = useCallback(() => {
    setGameState(prev => {
      const newLives = prev.lives - 1;
      if (newLives <= 0) {
        endGame();
      }
      return {
        ...prev,
        lives: newLives,
        combo: 0
      };
    });
  }, [endGame]);

  // Avoid obstacle
  const avoidObstacle = useCallback(() => {
    setStats(prev => ({
      ...prev,
      obstaclesAvoided: prev.obstaclesAvoided + 1
    }));
    updateScore(1); // Small bonus for avoiding
  }, [updateScore]);

  // Update game time
  const updateTime = useCallback(() => {
    if (!startTimeRef.current || !gameState.isRunning) return;
    
    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setGameState(prev => ({ ...prev, time: elapsed }));
  }, [gameState.isRunning]);

  // Update level based on score
  const updateLevel = useCallback(() => {
    const newLevel = Math.floor(gameState.score / 100) + 1;
    if (newLevel !== gameState.level) {
      setGameState(prev => ({ ...prev, level: newLevel }));
    }
  }, [gameState.score, gameState.level]);

  // Main game loop
  useEffect(() => {
    if (!gameState.isRunning || gameState.isPaused) {
      return;
    }

    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      // Update game speed
      gameSpeedRef.current = updateGameSpeed(
        gameSpeedRef.current,
        difficulty,
        gameState.score
      );

      // Update time
      updateTime();

      // Update level
      updateLevel();

      // Update distance
      setStats(prev => ({
        ...prev,
        distanceTraveled: prev.distanceTraveled + gameSpeedRef.current * deltaTime
      }));

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState.isRunning, gameState.isPaused, gameState.score, difficulty, updateTime, updateLevel]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!gameState.isRunning) return;

      switch (e.code) {
        case 'Escape':
          if (gameState.isPaused) {
            resumeGame();
          } else {
            pauseGame();
          }
          break;
        case 'Space':
          if (gameState.isPaused) {
            resumeGame();
          }
          e.preventDefault();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.isRunning, gameState.isPaused, pauseGame, resumeGame]);

  // Get current game speed
  const getCurrentSpeed = useCallback(() => {
    return gameSpeedRef.current;
  }, []);

  // Get formatted time
  const getFormattedTime = useCallback(() => {
    return formatTime(gameState.time);
  }, [gameState.time]);

  // Get difficulty settings
  const getDifficultySettings = useCallback(() => {
    return DIFFICULTY_SETTINGS[difficulty];
  }, [difficulty]);

  // Check if should spawn obstacle
  const checkSpawnObstacle = useCallback(() => {
    const minGap = difficulty === 'simple' ? 150 : 
                   difficulty === 'moderate' ? 120 : 100;
    
    const spawnData = shouldSpawnObstacle(
      difficulty,
      gameState.score,
      lastObstacleTimeRef.current,
      minGap
    );

    if (spawnData.spawn) {
      lastObstacleTimeRef.current = spawnData.timestamp;
      setStats(prev => ({
        ...prev,
        obstaclesSpawned: prev.obstaclesSpawned + spawnData.count
      }));
    }

    return spawnData;
  }, [difficulty, gameState.score]);

  // Check if should spawn coin
  const checkSpawnCoin = useCallback(() => {
    const shouldSpawn = shouldSpawnCoin(difficulty, gameState.score);
    
    if (shouldSpawn) {
      setStats(prev => ({
        ...prev,
        coinsSpawned: prev.coinsSpawned + 1
      }));
    }

    return shouldSpawn;
  }, [difficulty, gameState.score]);

  // Get combo multiplier
  const getComboMultiplier = useCallback(() => {
    if (gameState.combo < 3) return 1;
    if (gameState.combo < 5) return 1.5;
    if (gameState.combo < 10) return 2;
    return 2.5;
  }, [gameState.combo]);

  // Get accuracy
  const getAccuracy = useCallback(() => {
    if (stats.coinsSpawned === 0) return 0;
    return Math.floor((stats.coinsCollected / stats.coinsSpawned) * 100);
  }, [stats.coinsCollected, stats.coinsSpawned]);

  // Reset game
  const resetGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  return {
    // Game state
    gameState,
    stats,
    
    // Game controls
    startGame,
    pauseGame,
    resumeGame,
    endGame,
    resetGame,
    
    // Game actions
    updateScore,
    updateCombo,
    collectCoin,
    hitObstacle,
    avoidObstacle,
    
    // Utilities
    getCurrentSpeed,
    getFormattedTime,
    getDifficultySettings,
    checkSpawnObstacle,
    checkSpawnCoin,
    getComboMultiplier,
    getAccuracy,
    
    // Refs
    gameSpeedRef,
    lastObstacleTimeRef
  };
};

export default useGame;