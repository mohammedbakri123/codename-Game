import styles from '../../styles/components/TeamScore.module.css';

function TeamScore({ redRemaining, blueRemaining, currentTurn }) {
  const teamNames = {
    red: 'الأحمر',
    blue: 'الأزرق'
  };

  return (
    <div className={styles['team-score']}>
      <div className={`${styles['score-card']} ${styles['team-red']} ${currentTurn === 'red' ? styles.active : ''}`}>
        <h3>{teamNames.red}</h3>
        <span className={styles.score}>{redRemaining}</span>
        {currentTurn === 'red' && <span className={styles['turn-indicator']}>دورك</span>}
      </div>
      
      <div className={styles.vs}>ضد</div>
      
      <div className={`${styles['score-card']} ${styles['team-blue']} ${currentTurn === 'blue' ? styles.active : ''}`}>
        <h3>{teamNames.blue}</h3>
        <span className={styles.score}>{blueRemaining}</span>
        {currentTurn === 'blue' && <span className={styles['turn-indicator']}>دورك</span>}
      </div>
    </div>
  );
}

export default TeamScore;
