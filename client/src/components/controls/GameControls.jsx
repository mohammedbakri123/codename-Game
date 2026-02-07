import { useState } from 'react';
import styles from '../../styles/components/GameControls.module.css';

function GameControls({ phase, isSpymaster, isCurrentTeam, onSendClue, onEndTurn }) {
  const [clueWord, setClueWord] = useState('');
  const [clueCount, setClueCount] = useState(1);

  const handleSubmitClue = (e) => {
    e.preventDefault();
    if (!clueWord.trim()) return;
    
    onSendClue(clueWord.trim(), parseInt(clueCount));
    setClueWord('');
    setClueCount(1);
  };

  if (phase === 'CLUE' && isSpymaster && isCurrentTeam) {
    return (
      <div className={styles['game-controls']}>
        <h3>أعط تلميحاً</h3>
        <form onSubmit={handleSubmitClue} className={styles['clue-form']}>
          <input
            type="text"
            placeholder="أدخل تلميح من كلمة واحدة"
            value={clueWord}
            onChange={(e) => setClueWord(e.target.value)}
            className={styles['clue-input']}
            maxLength={20}
            dir="rtl"
          />
          <select
            value={clueCount}
            onChange={(e) => setClueCount(e.target.value)}
            className={styles['clue-count-select']}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <button type="submit" className={`${styles.btn} ${styles['btn-primary']}`}>
            إرسال التلميح
          </button>
        </form>
      </div>
    );
  }

  if (phase === 'GUESS' && !isSpymaster && isCurrentTeam) {
    return (
      <div className={styles['game-controls']}>
        <h3>دورك!</h3>
        <button
          onClick={onEndTurn}
          className={`${styles.btn} ${styles['btn-secondary']} ${styles['btn-end-turn']}`}
        >
          إنهاء الدور
        </button>
      </div>
    );
  }

  return (
    <div className={`${styles['game-controls']} ${styles.waiting}`}>
      <p>
        {phase === 'CLUE' 
          ? 'في انتظار القائد...' 
          : 'العملاء يخمنون...'}
      </p>
    </div>
  );
}

export default GameControls;
