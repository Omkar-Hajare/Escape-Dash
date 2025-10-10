import '../styles/NewHighScoreModal.css';

const NewHighScoreModal = ({ score, onClose }) => {
  return (
    <div className="new-highscore-overlay">
      <div className="new-highscore-modal">
        <div className="trophy-icon">🏆</div>
        <h2 className="new-highscore-title">NEW HIGH SCORE!</h2>
        <div className="new-score-value">{score}</div>
        <p className="congratulations-text">Congratulations! You've set a new record!</p>
        <button className="btn close-btn" onClick={onClose}>
          Awesome!
        </button>
      </div>
    </div>
  );
};

export default NewHighScoreModal;