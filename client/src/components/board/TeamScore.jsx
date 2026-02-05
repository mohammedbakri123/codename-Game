import '../../styles/components/TeamScore.css';

function TeamScore({ redRemaining, blueRemaining, currentTurn }) {
  const teamNames = {
    red: 'الأحمر',
    blue: 'الأزرق'
  };

  return (
    <div className="team-score">
      <div className={`score-card team-red ${currentTurn === 'red' ? 'active' : ''}`}>
        <h3>{teamNames.red}</h3>
        <span className="score">{redRemaining}</span>
        {currentTurn === 'red' && <span className="turn-indicator">دورك</span>}
      </div>
      
      <div className="vs">ضد</div>
      
      <div className={`score-card team-blue ${currentTurn === 'blue' ? 'active' : ''}`}>
        <h3>{teamNames.blue}</h3>
        <span className="score">{blueRemaining}</span>
        {currentTurn === 'blue' && <span className="turn-indicator">دورك</span>}
      </div>
    </div>
  );
}

export default TeamScore;
