import '../styles/GameOverModal.css';

const GameOverModal = ({ gameData, difficulty, onPlayAgain, onGoHome, currentStats }) => {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) {
      return '0:00';
    }
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyNames = {
    simple: 'SIMPLE MODE',
    moderate: 'MODERATE MODE', 
    hard: 'HARD MODE'
  };

  //  debug logging
  console.log('GameOverModal - gameData:', gameData);

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="final-results-title">Final Results</h2>
        
        <div className="results-content">
          {/* Difficulty */}
          <div className="result-section full-width">
            <span className="result-label">Difficulty</span>
            <span className="result-value difficulty-name">
              {difficultyNames[difficulty]}
            </span>
          </div>

          {/* Score Row - Final Score and High Score side by side */}
          <div className="result-row">
            <div className="result-section half-width">
              <span className="result-label">Final Score</span>
              <span className="result-value final-score">
                {gameData.finalScore || 0}
              </span>
            </div>

            <div className="result-section half-width highlight">
              <span className="result-label">🏆 High Score</span>
              <span className="result-value highscore-display">
                {currentStats ? currentStats.highScore : 0}
              </span>
            </div>
          </div>

          {/* Coins Row - Coins Collected and Total Coins side by side */}
          <div className="result-row">
            <div className="result-section half-width">
              <span className="result-label">Coins Collected</span>
              <span className="result-value coins-collected">
                🪙 {gameData.coins || 0}
              </span>
            </div>

            <div className="result-section half-width highlight">
              <span className="result-label">💰 Total Coins</span>
              <span className="result-value totalcoins-display">
                {currentStats ? currentStats.totalCoins : 0}
              </span>
            </div>
          </div>

          {/* Time Played - ✅ FIXED TYPO */}
          <div className="result-section full-width">
            <span className="result-label">Time Played</span>
            <span className="result-value time-played">
              {formatTime(gameData.timePlayed)}
            </span>
          </div>

          <div className="motivational-text">KEEP TRYING!</div>
        </div>
        
        <div className="modal-buttons">
          <button className="btn play-again-btn" onClick={onPlayAgain}>
            Play Again
          </button>
          <button className="btn main-menu-btn" onClick={onGoHome}>
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;