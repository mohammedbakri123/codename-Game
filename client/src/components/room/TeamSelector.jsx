import styles from '../../styles/components/TeamSelector.module.css';

function TeamSelector({ selectedTeam, onSelectTeam, redCount = 0, blueCount = 0 }) {
  const teamNames = {
    red: 'الفريق الأحمر',
    blue: 'الفريق الأزرق'
  };

  return (
    <div className={styles['team-selector']}>
      <h3>اختر فريقك</h3>
      <p className={styles['team-hint']}>اضغط على الفريق للانضمام</p>
      <div className={styles['team-buttons']}>
        <button
          type="button"
          className={`${styles['team-btn']} ${styles['team-red']} ${selectedTeam === 'red' ? styles.selected : ''}`}
          onClick={() => onSelectTeam('red')}
        >
          <span className={styles['team-name']}>{teamNames.red}</span>
          <span className={styles['team-count']}>({redCount})</span>
          {selectedTeam === 'red' && <span className={styles['check-mark']}> ✓</span>}
        </button>
        <button
          type="button"
          className={`${styles['team-btn']} ${styles['team-blue']} ${selectedTeam === 'blue' ? styles.selected : ''}`}
          onClick={() => onSelectTeam('blue')}
        >
          <span className={styles['team-name']}>{teamNames.blue}</span>
          <span className={styles['team-count']}>({blueCount})</span>
          {selectedTeam === 'blue' && <span className={styles['check-mark']}> ✓</span>}
        </button>
      </div>
      {selectedTeam ? (
        <p className={styles['success-message']}>✅ انضممت إلى {teamNames[selectedTeam]}</p>
      ) : (
        <p className={styles.warning}>⚠️ الرجاء اختيار فريق</p>
      )}
    </div>
  );
}

export default TeamSelector;
