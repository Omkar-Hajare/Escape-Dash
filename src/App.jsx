import { useState } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import GameOverModal from './components/GameOverModal';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [difficulty, setDifficulty] = useState('simple');
  const [gameData, setGameData] = useState({
    score: 0,
    timePlayerd: 0,
    finalScore: 0
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [gameKey, setGameKey] = useState(0); // Key to force remount

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentPage('game');
    setShowGameOver(false);
    setGameData({ score: 0, timePlayerd: 0, finalScore: 0 });
    setGameKey(prev => prev + 1); // Force remount of GamePage
  };

  const goHome = () => {
    setCurrentPage('home');
    setShowGameOver(false);
    setGameKey(prev => prev + 1); // Reset game
  };

  const handleGameOver = (score, time) => {
    setGameData({
      score,
      timePlayerd: time,
      finalScore: score
    });
    setShowGameOver(true);
  };

  const playAgain = () => {
    setShowGameOver(false);
    setGameData({ score: 0, timePlayerd: 0, finalScore: 0 });
    setGameKey(prev => prev + 1); // Force remount with new key
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <HomePage onStartGame={startGame} />
      )}
      
      {currentPage === 'game' && (
        <GamePage 
          key={gameKey} // Force remount on key change
          difficulty={difficulty}
          onGameOver={handleGameOver}
          onGoHome={goHome}
        />
      )}

      {showGameOver && (
        <GameOverModal
          gameData={gameData}
          difficulty={difficulty}
          onPlayAgain={playAgain}
          onGoHome={goHome}
        />
      )}
    </div>
  );
}

export default App;