import { useGame } from '../contexts/GameContext';
import { TEAMS, ARABIC_TEXT } from '../data/words';
import '../styles/TeamPanel.css';

function TeamPanel({ team }) {
  const { state } = useGame();
  const { redScore, blueScore, redTotal, blueTotal, players, currentUser } = state;
  
  const isRed = team === TEAMS.RED;
  const score = isRed ? redScore : blueScore;
  const total = isRed ? redTotal : blueTotal;
  const remaining = total - score;
  const teamPlayers = players[team];
  const teamName = isRed ? ARABIC_TEXT.RED_TEAM : ARABIC_TEXT.BLUE_TEAM;
  const isUserTeam = currentUser.team === team;
  
  return (
    <div className={`team-panel ${team}`}>
      <div className="team-score-display">
        <div className="score-circle">{remaining}</div>
      </div>
      
      <div className="team-info">
        <h3 className="team-title">{teamName}</h3>
        
        <div className="players-section">
          <div className="role-section">
            <span className="role-label">المشغلون:</span>
            <div className="players-list">
              {teamPlayers.operatives.length > 0 ? (
                teamPlayers.operatives.map((player, idx) => (
                  <span key={idx} className="player-name">
                    {player}{idx < teamPlayers.operatives.length - 1 ? '، ' : ''}
                  </span>
                ))
              ) : (
                <span className="no-players">-</span>
              )}
            </div>
          </div>
          
          <div className="role-section">
            <span className="role-label">القائد:</span>
            <span className="player-name spymaster">
              {teamPlayers.spymaster || '-'}
            </span>
          </div>
        </div>
        
        {isUserTeam && (
          <div className="user-indicator">
            أنت: {currentUser.name} ({currentUser.role === 'spymaster' ? 'قائد' : 'مشغل'})
          </div>
        )}
      </div>
    </div>
  );
}

export default TeamPanel;
