import { useState, useEffect } from 'react'; // ✅ Only import once
import { leaderboardAPI } from '../services/api';
import '../styles/HomePage.css';
import audioManager from '../utils/audioManager'; 

const HomePage = ({ onStartGame }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('simple');
  const [playerName, setPlayerName] = useState('');
  const [showLeaderboard, setShowLeaderboard] = useState(true); // Changed to true by default
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [error, setError] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
  const newMuteState = audioManager.toggleMute();
  setIsMuted(newMuteState);
};

useEffect(() => {
  audioManager.init();
}, []);

  // Load player name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  // Load leaderboard when difficulty changes
  useEffect(() => {
    loadLeaderboard();
  }, [selectedDifficulty]);

  const loadLeaderboard = async () => {
    const data = await leaderboardAPI.getLeaderboard(selectedDifficulty);
    setLeaderboardData(data || []);
  };

  const handleDifficultySelect = (difficulty) => {
     audioManager.playClickSound();
    setSelectedDifficulty(difficulty);
  };

  const handleStartGame = () => {
    audioManager.playClickSound();
    // Validate player name
    if (!playerName || playerName.trim().length < 2) {
      setError('Please enter your name (at least 2 characters)');
      return;
    }

    if (playerName.length > 20) {
      setError('Name must be 20 characters or less');
      return;
    }

    // Save player name
    localStorage.setItem('playerName', playerName.trim());
    
    // Start game
    audioManager.playGameStartSound();
    onStartGame(selectedDifficulty, playerName.trim());
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard(!showLeaderboard);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const difficultyNames = {
    simple: 'SIMPLE',
    moderate: 'MODERATE',
    hard: 'HARD'
  };

  return (
    <div className="home-container">
      <button 
      className="mute-toggle-btn" 
      onClick={handleMuteToggle}
      aria-label={isMuted ? 'Unmute' : 'Mute'}
      title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
    >
      {isMuted ? '' : ' '}
    </button>
      <div className="home-content">
        <h1 className="game-title">ESCAPE DASH</h1>
        <p className="game-subtitle">
          Navigate through obstacles, collect points, and race against time!
        </p>
        
        {/* Main Content - Side by Side Layout */}
        <div className="main-layout">
          {/* LEFT SIDE - Game Start Section */}
          <div className="start-game-section">
            <h2 className="start-title">Start New Game</h2>
            
            {/* Player Name Input */}
            <div className="player-name-section">
              <label htmlFor="playerName" className="player-name-label">
                Enter Your Name
              </label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  id="playerName"
                  className="player-name-input"
                  placeholder="Your Name"
                  value={playerName}
                  onChange={(e) => {
                    setPlayerName(e.target.value);
                    setError('');
                  }}
                  maxLength={20}
                  autoComplete="off"
                />
              </div>
              {error && <p className="error-message">⚠️ {error}</p>}
            </div>

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
              🎮 Start Game
            </button>

            {/* Toggle Button for Mobile */}
            <button className="leaderboard-toggle-btn mobile-only" onClick={toggleLeaderboard}>
              {showLeaderboard ? '🎮 Hide Leaderboard' : '🏆 Show Leaderboard'}
            </button>
          </div>

          {/* RIGHT SIDE - Leaderboard Section */}
          <div className={`leaderboard-section ${showLeaderboard ? 'visible' : 'hidden'}`}>
            <div className="leaderboard-header">
              <h3 className="leaderboard-title">
                🏆 TOP 10 - {difficultyNames[selectedDifficulty]} MODE
              </h3>
            </div>

            <div className="leaderboard-content">
              {leaderboardData.length > 0 ? (
                <div className="leaderboard-scroll">
                  <table className="leaderboard-table">
                    <thead>
                      <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Score</th>
                        <th>Coins</th>
                        <th>Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaderboardData.map((entry, index) => (
                        <tr 
                          key={entry._id} 
                          className={entry.playerName === playerName ? 'player-row' : ''}
                        >
                          <td className="rank-cell">
                            {index === 0 && '🥇'}
                            {index === 1 && '🥈'}
                            {index === 2 && '🥉'}
                            {index >= 3 && `#${entry.rank}`}
                          </td>
                          <td className="player-cell">
                            {entry.playerName}
                            {entry.playerName === playerName && (
                              <span className="you-badge">YOU</span>
                            )}
                          </td>
                          <td className="score-cell">{entry.score}</td>
                          <td className="coins-cell">🪙 {entry.coins}</td>
                          <td className="time-cell">{formatTime(entry.timePlayed)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-leaderboard">
                  <div className="empty-icon">🎮</div>
                  <p className="empty-text">No scores yet!</p>
                  <p className="empty-subtext">Be the first to set a record!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;