import { useState } from 'react';
import '../styles/HomePage.css';

const HomePage = ({ onStartGame }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('simple');

  const handleDifficultySelect = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    onStartGame(selectedDifficulty);
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="game-title">ESCAPE DASH</h1>
        <p className="game-subtitle">
          Navigate through obstacles, collect points, and race against time in this thrilling 2D platformer!
        </p>
        
        <div className="start-game-section">
          <h2 className="start-title">Start New Game</h2>
          <p className="start-subtitle">Select difficulty</p>
          
          <div className="difficulty-options">
            <button 
              className={`difficulty-btn simple-mode ${selectedDifficulty === 'simple' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('simple')}
            >
              <div className="difficulty-name">Simple Mode</div>
              <div className="difficulty-desc">Fewer obstacles, slower pace</div>
            </button>
            
            <button 
              className={`difficulty-btn moderate-mode ${selectedDifficulty === 'moderate' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('moderate')}
            >
              <div className="difficulty-name">Moderate Mode</div>
              <div className="difficulty-desc">Balanced challenge, medium pace</div>
            </button>
            
            <button 
              className={`difficulty-btn hard-mode ${selectedDifficulty === 'hard' ? 'selected' : ''}`}
              onClick={() => handleDifficultySelect('hard')}
            >
              <div className="difficulty-name">Hard Mode</div>
              <div className="difficulty-desc">Many obstacles, fast pace</div>
            </button>
          </div>
          
          <button className="start-game-btn" onClick={handleStartGame}>
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;