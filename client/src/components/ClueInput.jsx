import { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { ARABIC_TEXT } from '../data/words';
import '../styles/ClueInput.css';

function ClueInput() {
  const { state, dispatch } = useGame();
  const { currentTeam, currentClue, gameStatus, viewMode } = state;
  const [clueWord, setClueWord] = useState('');
  const [clueNumber, setClueNumber] = useState(1);
  
  if (gameStatus !== 'playing') return null;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (clueWord.trim()) {
      dispatch({
        type: 'SET_CLUE',
        payload: { word: clueWord.trim(), number: clueNumber }
      });
      setClueWord('');
      setClueNumber(1);
    }
  };
  
  // Show current clue if exists
  if (currentClue) {
    return (
      <div className="current-clue-display">
        <div className="clue-box">
          <span className="clue-word">{currentClue}</span>
          <span className="clue-number">{state.guessesRemaining}</span>
        </div>
      </div>
    );
  }
  
  // Only show input for spymasters
  if (viewMode !== 'spymaster') {
    return (
      <div className="waiting-clue">
        <span>في انتظار تلميح القائد...</span>
      </div>
    );
  }
  
  return (
    <div className="clue-input-container">
      <form onSubmit={handleSubmit} className="clue-form">
        <input
          type="text"
          value={clueWord}
          onChange={(e) => setClueWord(e.target.value)}
          placeholder="كلمة التلميح"
          maxLength={20}
          dir="rtl"
          className="clue-input-field"
        />
        <select 
          value={clueNumber} 
          onChange={(e) => setClueNumber(parseInt(e.target.value))}
          className="clue-number-select"
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{i + 1}</option>
          ))}
        </select>
        <button type="submit" className="clue-submit-btn">
          {ARABIC_TEXT.GIVE_CLUE}
        </button>
      </form>
    </div>
  );
}

export default ClueInput;
