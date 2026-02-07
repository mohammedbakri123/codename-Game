import '../../styles/components/PlayerList.css';

function PlayerList({ players, currentPlayerId }) {
  console.log('PlayerList rendering');
  console.log('   Players prop:', players);
  console.log('   Current player ID:', currentPlayerId);

  // Filter to show all players in room
  const allPlayers = players || [];
  const connectedPlayers = allPlayers.filter(p => p.connected !== false);
  const disconnectedPlayers = allPlayers.filter(p => p.connected === false);
  
  console.log('   Connected players:', connectedPlayers.length);
  console.log('   Disconnected players:', disconnectedPlayers.length);
  console.log('   All players data:', allPlayers.map(p => ({ id: p.id, name: p.name, connected: p.connected })));
  
  const redTeam = connectedPlayers.filter(p => p.team === 'red');
  const blueTeam = connectedPlayers.filter(p => p.team === 'blue');
  const unassigned = connectedPlayers.filter(p => !p.team || p.team === null);

  console.log('   Red team:', redTeam.length, 'players');
  console.log('   Blue team:', blueTeam.length, 'players');
  console.log('   Unassigned:', unassigned.length, 'players');

  const roleNames = {
    spymaster: 'قائد',
    operative: 'عميل'
  };

  const teamNames = {
    red: 'الفريق الأحمر',
    blue: 'الفريق الأزرق',
    unassigned: 'غير مسند لفريق'
  };

  const renderPlayer = (player) => {
    const isCurrentPlayer = player.id === currentPlayerId;
    console.log('   Rendering player:', player.name, 'Team:', player.team, 'Is Current:', isCurrentPlayer, 'Connected:', player.connected);
    
    return (
      <div key={player.id} className={`player-item ${isCurrentPlayer ? 'current-player' : ''} ${!player.connected ? 'disconnected-player' : ''}`}>
        <span className="player-name">
          {player.name}
          {isCurrentPlayer && <span className="you-badge"> (أنت) </span>}
        </span>
        <span className={`player-role role-${player.role}`}>
          {roleNames[player.role] || 'عميل'}
        </span>
        {!player.connected && <span className="disconnected">(غير متصل)</span>}
      </div>
    );
  };

  console.log('PlayerList render complete');
  console.log('   Total to render:', allPlayers.length);

  return (
    <div className="player-list" dir="rtl">
      <h2>👥 اللاعبين في الغرفة ({allPlayers.length})</h2>
      <p className="connected-count">
        متصل الآن: {connectedPlayers.length} | غير متصل: {disconnectedPlayers.length}
      </p>
      
      <div className="team-section team-red">
        <h3>{teamNames.red} ({redTeam.length})</h3>
        {redTeam.length > 0 ? (
          redTeam.map(renderPlayer)
        ) : (
          <p className="no-players">لا يوجد لاعبين</p>
        )}
      </div>

      <div className="team-section team-blue">
        <h3>{teamNames.blue} ({blueTeam.length})</h3>
        {blueTeam.length > 0 ? (
          blueTeam.map(renderPlayer)
        ) : (
          <p className="no-players">لا يوجد لاعبين</p>
        )}
      </div>

      <div className="team-section unassigned">
        <h3>{teamNames.unassigned} ({unassigned.length})</h3>
        {unassigned.length > 0 ? (
          unassigned.map(renderPlayer)
        ) : (
          <p className="no-players">جميع اللاعبين انضموا لفريق</p>
        )}
      </div>

      {disconnectedPlayers.length > 0 && (
        <div className="team-section disconnected-section">
          <h3>غير متصلين ({disconnectedPlayers.length})</h3>
          <p className="disconnected-hint">هؤلاء اللاعبين انفصلوا عن اللعبة</p>
          {disconnectedPlayers.map(renderPlayer)}
        </div>
      )}
    </div>
  );
}

export default PlayerList;
