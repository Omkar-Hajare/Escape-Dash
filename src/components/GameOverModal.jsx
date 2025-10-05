import '../styles/GameOverModal.css';

const GameOverModal = ({ gameData, difficulty, onPlayAgain, onGoHome }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyNames = {
    simple: 'SIMPLE MODE',
    moderate: 'MODERATE MODE', 
    hard: 'HARD MODE'
  };

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        <h2 className="final-results-title">Final Results</h2>
        
        <div className="results-content">
          <div className="result-section">
            <span className="result-label">Player</span>
            <span className="result-value player-name">Player</span>
          </div>
          
          <div className="result-section">
            <span className="result-label">Difficulty</span>
            <span className="result-value difficulty-name">
              {difficultyNames[difficulty]}
            </span>
          </div>
          
          <div className="result-section">
            <span className="result-label">Final Score</span>
            <span className="result-value final-score">
              {gameData.finalScore}
            </span>
          </div>
          
          <div className="motivational-text">KEEP TRYING!</div>
          
          <div className="result-section">
            <span className="result-label">Time Played</span>
            <span className="result-value time-played">
              {formatTime(gameData.timePlayerd)}
            </span>
          </div>
          
          
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