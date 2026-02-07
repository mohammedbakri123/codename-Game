import styles from '../../styles/components/ClueDisplay.module.css';

function ClueDisplay({ clue, guessesLeft, phase }) {
  if (phase === 'CLUE') {
    return (
      <div className={`${styles['clue-display']} ${styles.waiting}`}>
        <p>في انتظار القائد لإعطاء تلميح...</p>
      </div>
    );
  }

  if (!clue) return null;

  return (
    <div className={styles['clue-display']}>
      <div className={styles['clue-box']}>
        <h3>التلميح الحالي</h3>
        <div className={styles['clue-word']}>{clue.word}</div>
        <div className={styles['clue-count']}>{clue.count}</div>
      </div>
      <div className={styles['guesses-remaining']}>
        <span>التخمينات المتبقية: </span>
        <strong>{guessesLeft}</strong>
      </div>
    </div>
  );
}

export default ClueDisplay;
