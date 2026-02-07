import styles from '../../styles/components/TeamSummary.module.css';

function TeamSummary({ players, currentPlayerId }) {
  const roleNames = {
    spymaster: '👑 قائد',
    operative: '🕵️ عميل'
  };

  const redTeam = players.filter(p => p.team === 'red' && p.connected);
  const blueTeam = players.filter(p => p.team === 'blue' && p.connected);
  const unassigned = players.filter(p => !p.team && p.connected);

  const redSpymaster = redTeam.find(p => p.role === 'spymaster');
  const blueSpymaster = blueTeam.find(p => p.role === 'spymaster');
  const redOperatives = redTeam.filter(p => p.role !== 'spymaster');
  const blueOperatives = blueTeam.filter(p => p.role !== 'spymaster');

  return (
    <div className={styles['team-summary']} dir="rtl">
      <h2>📊 توزيع الفرق</h2>
      
      <div className={styles['teams-grid']}>
        <div className={`${styles['team-column']} ${styles['team-red-box']}`}>
          <h3>🔴 الفريق الأحمر ({redTeam.length})</h3>
          
          <div className={styles['role-section']}>
            <h4>القائد:</h4>
            {redSpymaster ? (
              <div className={`${styles['player-tag']} ${redSpymaster.id === currentPlayerId ? styles.current : ''}`}>
                {redSpymaster.name}
                {redSpymaster.id === currentPlayerId && <span className={styles['you-badge']}> (أنت)</span>}
              </div>
            ) : (
              <p className={styles['empty-role']}>لم يتم التعيين</p>
            )}
          </div>

          <div className={styles['role-section']}>
            <h4>العملاء ({redOperatives.length}):</h4>
            {redOperatives.length > 0 ? (
              <div className={styles['players-list']}>
                {redOperatives.map(player => (
                  <div 
                    key={player.id} 
                    className={`${styles['player-tag']} ${player.id === currentPlayerId ? styles.current : ''}`}
                  >
                    {player.name}
                    {player.id === currentPlayerId && <span className={styles['you-badge']}> (أنت)</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles['empty-role']}>لا يوجد عملاء</p>
            )}
          </div>
        </div>

        <div className={`${styles['team-column']} ${styles['team-blue-box']}`}>
          <h3>🔵 الفريق الأزرق ({blueTeam.length})</h3>
          
          <div className={styles['role-section']}>
            <h4>القائد:</h4>
            {blueSpymaster ? (
              <div className={`${styles['player-tag']} ${blueSpymaster.id === currentPlayerId ? styles.current : ''}`}>
                {blueSpymaster.name}
                {blueSpymaster.id === currentPlayerId && <span className={styles['you-badge']}> (أنت)</span>}
              </div>
            ) : (
              <p className={styles['empty-role']}>لم يتم التعيين</p>
            )}
          </div>

          <div className={styles['role-section']}>
            <h4>العملاء ({blueOperatives.length}):</h4>
            {blueOperatives.length > 0 ? (
              <div className={styles['players-list']}>
                {blueOperatives.map(player => (
                  <div 
                    key={player.id} 
                    className={`${styles['player-tag']} ${player.id === currentPlayerId ? styles.current : ''}`}
                  >
                    {player.name}
                    {player.id === currentPlayerId && <span className={styles['you-badge']}> (أنت)</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles['empty-role']}>لا يوجد عملاء</p>
            )}
          </div>
        </div>
      </div>

      {unassigned.length > 0 && (
        <div className={styles['unassigned-section']}>
          <h4>⚪ غير مسندين ({unassigned.length}):</h4>
          <div className={styles['players-list']}>
            {unassigned.map(player => (
              <div 
                key={player.id} 
                className={`${styles['player-tag']} ${styles['unassigned-tag']} ${player.id === currentPlayerId ? styles.current : ''}`}
              >
                {player.name}
                {player.id === currentPlayerId && <span className={styles['you-badge']}> (أنت)</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles['team-stats']}>
        <p>📊 الإجمالي: {players.filter(p => p.connected).length} لاعب | 🔴 {redTeam.length} | 🔵 {blueTeam.length} | ⚪ {unassigned.length}</p>
      </div>
    </div>
  );
}

export default TeamSummary;
