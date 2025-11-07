import { useState, useEffect } from 'react';
import { leaderboardAPI } from '../services/api';
import '../styles/LeaderboardPage';

const LeaderboardPage = ({ onGoHome }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState('simple');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // Get player name from localStorage
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
      setPlayerName(savedName);
    }

    // Load leaderboard
    loadLeaderboard();
  }, [selectedDifficulty]);

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const data = await leaderboardAPI.getLeaderboard(selectedDifficulty);
      setLeaderboardData(data);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const difficultyNames = {
    simple: 'SIMPLE',
    moderate: 'MODERATE',
    hard: 'HARD'
  };

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Header */}
        <div className="leaderboard-header">
          <button className="back-btn" onClick={onGoHome}>
            ← Back to Menu
          </button>
          <h1 className="leaderboard-page-title">🏆 GLOBAL LEADERBOARD 🏆</h1>
          <div className="header-spacer"></div>
        </div>

        {/* Difficulty Tabs */}
        <div className="difficulty-tabs">
          <button
            className={`tab-btn simple-tab ${selectedDifficulty === 'simple' ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty('simple')}
          >
            <span className="tab-icon">🟢</span>
            {difficultyNames.simple}
          </button>
          <button
            className={`tab-btn moderate-tab ${selectedDifficulty === 'moderate' ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty('moderate')}
          >
            <span className="tab-icon">🟡</span>
            {difficultyNames.moderate}
          </button>
          <button
            className={`tab-btn hard-tab ${selectedDifficulty === 'hard' ? 'active' : ''}`}
            onClick={() => setSelectedDifficulty('hard')}
          >
            <span className="tab-icon">🔴</span>
            {difficultyNames.hard}
          </button>
        </div>

        {/* Leaderboard Content */}
        <div className="leaderboard-content">
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading leaderboard...</p>
            </div>
          ) : leaderboardData.length > 0 ? (
            <>
              {/* Podium for Top 3 */}
              {leaderboardData.length >= 3 && (
                <div className="podium">
                  {/* 2nd Place */}
                  <div className="podium-place second-place">
                    <div className="medal">🥈</div>
                    <div className="player-info">
                      <div className="player-name">{leaderboardData[1].playerName}</div>
                      <div className="player-score">{leaderboardData[1].score}</div>
                    </div>
                  </div>

                  {/* 1st Place */}
                  <div className="podium-place first-place">
                    <div className="crown">👑</div>
                    <div className="medal">🥇</div>
                    <div className="player-info">
                      <div className="player-name">{leaderboardData[0].playerName}</div>
                      <div className="player-score">{leaderboardData[0].score}</div>
                    </div>
                  </div>

                  {/* 3rd Place */}
                  <div className="podium-place third-place">
                    <div className="medal">🥉</div>
                    <div className="player-info">
                      <div className="player-name">{leaderboardData[2].playerName}</div>
                      <div className="player-score">{leaderboardData[2].score}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Full Leaderboard Table */}
              <div className="leaderboard-table-container">
                <table className="leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Player</th>
                      <th>Score</th>
                      <th>Coins</th>
                      <th>Time</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <tr 
                        key={entry._id} 
                        className={`
                          ${entry.playerName === playerName ? 'player-row' : ''}
                          ${index < 3 ? 'top-three' : ''}
                        `}
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
                        <td className="score-cell">{entry.score.toLocaleString()}</td>
                        <td className="coins-cell">🪙 {entry.coins}</td>
                        <td className="time-cell">{formatTime(entry.timePlayed)}</td>
                        <td className="date-cell">{formatDate(entry.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎮</div>
              <h3>No scores yet!</h3>
              <p>Be the first to set a record in {difficultyNames[selectedDifficulty]} mode!</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="leaderboard-footer">
          <p className="footer-text">
            💡 Compete with players worldwide and climb to the top!
          </p>
          {playerName && (
            <p className="footer-text">
              Playing as: <span className="player-highlight">{playerName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;