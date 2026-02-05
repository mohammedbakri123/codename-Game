import '../../styles/components/ClueDisplay.css';

function ClueDisplay({ clue, guessesLeft, phase }) {
  if (phase === 'CLUE') {
    return (
      <div className="clue-display waiting">
        <p>في انتظار القائد لإعطاء تلميح...</p>
      </div>
    );
  }

  if (!clue) return null;

  return (
    <div className="clue-display">
      <div className="clue-box">
        <h3>التلميح الحالي</h3>
        <div className="clue-word">{clue.word}</div>
        <div className="clue-count">{clue.count}</div>
      </div>
      <div className="guesses-remaining">
        <span>التخمينات المتبقية: </span>
        <strong>{guessesLeft}</strong>
      </div>
    </div>
  );
}

export default ClueDisplay;
