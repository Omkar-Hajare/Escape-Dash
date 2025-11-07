import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import GamePage from './components/GamePage';
import GameOverModal from './components/GameOverModal';
import NewHighScoreModal from './components/NewHighScoreModal';
import { gameStatsAPI, leaderboardAPI } from './services/api';
import './styles/index.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [difficulty, setDifficulty] = useState('simple');
  const [gameData, setGameData] = useState({
    score: 0,
    coins: 0,
    timePlayed: 0,
    finalScore: 0
  });
  const [showGameOver, setShowGameOver] = useState(false);
  const [showNewHighScore, setShowNewHighScore] = useState(false);
  const [newHighScoreValue, setNewHighScoreValue] = useState(0);
  const [gameKey, setGameKey] = useState(0);
  const [currentStats, setCurrentStats] = useState(null);

  // Load stats when difficulty changes
  useEffect(() => {
    if (difficulty) {
      loadStats();
    }
  }, [difficulty]);

  const loadStats = async () => {
    const stats = await gameStatsAPI.getStats(difficulty);
    setCurrentStats(stats);
  };

  const startGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setCurrentPage('game');
    setShowGameOver(false);
    setGameData({ score: 0, coins: 0, timePlayed: 0, finalScore: 0 });
    setGameKey(prev => prev + 1);
  };

  const goHome = () => {
    setCurrentPage('home');
    setShowGameOver(false);
    setShowNewHighScore(false);
    setGameKey(prev => prev + 1);
  };

  // src/App.jsx - UPDATE handleGameOver

  const handleGameOver = async (score, coins, time) => {
    console.log('App - Game Over received:', { score, coins, time });

    setGameData({
      score,
      coins,
      timePlayed: time,
      finalScore: score
    });

    // Update general stats
    const result = await gameStatsAPI.updateStats(difficulty, score, coins);

    //  Refresh stats before showing modal
    await loadStats();

    // Add to leaderboard
    const playerName = localStorage.getItem('playerName') || 'Anonymous';
    const leaderboardResult = await leaderboardAPI.addEntry(
      playerName,
      difficulty,
      score,
      coins,
      time
    );

    if (result && result.isNewHighScore) {
      setNewHighScoreValue(score);
      setShowNewHighScore(true);
    } else {
      setShowGameOver(true);
    }
  };

  const handleCloseNewHighScore = () => {
    setShowNewHighScore(false);
    setShowGameOver(true);
  };

  const playAgain = () => {
    setShowGameOver(false);
    setShowNewHighScore(false);
    setGameData({ score: 0, coins: 0, timePlayed: 0, finalScore: 0 });
    setGameKey(prev => prev + 1);
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <HomePage onStartGame={startGame} currentStats={currentStats} />
      )}

      {currentPage === 'game' && (
        <GamePage
          key={gameKey}
          difficulty={difficulty}
          onGameOver={handleGameOver}
          onGoHome={goHome}
          currentStats={currentStats}
        />
      )}

      {showNewHighScore && (
        <NewHighScoreModal
          score={newHighScoreValue}
          onClose={handleCloseNewHighScore}
        />
      )}

      {showGameOver && (
        <GameOverModal
          gameData={gameData}
          difficulty={difficulty}
          onPlayAgain={playAgain}
          onGoHome={goHome}
          currentStats={currentStats}
        />
      )}
    </div>
  );
}

export default App;