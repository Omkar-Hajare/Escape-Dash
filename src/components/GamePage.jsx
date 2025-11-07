import { useState, useEffect } from 'react';
import GameCanvas from './GameCanvas';
import '../styles/GamePage.css';

const GamePage = ({ difficulty, onGameOver, onGoHome }) => {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [coins, setCoins] = useState(0);

  const difficultyNames = {
    simple: 'SIMPLE',
    moderate: 'MODERATE', 
    hard: 'HARD'
  };

  //  Receive 3 parameters from GameCanvas
  const handleGameOver = (finalScore, coinsCollected, finalTime) => {
    console.log('GamePage - Game Over:', { 
      finalScore, 
      coinsCollected, 
      finalTime 
    });
    
    // Pass all three parameters to App.jsx
    onGameOver(finalScore, coinsCollected, finalTime);
  };

  const handleCoinCollect = () => {
    setCoins(prev => prev + 1);
  };

  return (
    <div className="game-page">
      <div className="game-header">
        <div className="game-info">
          <div className="game-logo">Escape Dash</div>
          <div className="difficulty-info">Difficulty: {difficultyNames[difficulty]}</div>
        </div>
        <button className="return-btn" onClick={onGoHome}>
          Return to Menu
        </button>
      </div>

      <div className="game-main">
        <div className="game-stats">
          <div className="stat-item">
            <span className="stat-label">Score:</span>
            <span className="stat-value score-value">{score}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Coins:</span>
            <span className="stat-value coin-value">🪙 {coins}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Time:</span>
            <span className="stat-value time-value">{time}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Mode:</span>
            <span className="stat-value mode-value">{difficultyNames[difficulty]}</span>
          </div>
        </div>

        <div className="game-canvas-container">
          <GameCanvas 
            difficulty={difficulty}
            onScoreUpdate={setScore}
            onTimeUpdate={setTime}
            onCoinCollect={handleCoinCollect}
            onGameOver={handleGameOver}  
          />
        </div>
      </div>
    </div>
  );
};

export default GamePage;