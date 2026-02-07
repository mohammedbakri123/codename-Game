import '../../styles/components/TeamSelector.css';

function TeamSelector({ selectedTeam, onSelectTeam, redCount = 0, blueCount = 0 }) {
  const teamNames = {
    red: 'الفريق الأحمر',
    blue: 'الفريق الأزرق'
  };

  return (
    <div className="team-selector">
      <h3>اختر فريقك</h3>
      <p className="team-hint">اضغط على الفريق للانضمام</p>
      <div className="team-buttons">
        <button
          type="button"
          className={`team-btn team-red ${selectedTeam === 'red' ? 'selected' : ''}`}
          onClick={() => onSelectTeam('red')}
        >
          <span className="team-name">{teamNames.red}</span>
          <span className="team-count">({redCount})</span>
          {selectedTeam === 'red' && <span className="check-mark"> ✓</span>}
        </button>
        <button
          type="button"
          className={`team-btn team-blue ${selectedTeam === 'blue' ? 'selected' : ''}`}
          onClick={() => onSelectTeam('blue')}
        >
          <span className="team-name">{teamNames.blue}</span>
          <span className="team-count">({blueCount})</span>
          {selectedTeam === 'blue' && <span className="check-mark"> ✓</span>}
        </button>
      </div>
      {selectedTeam ? (
        <p className="success-message">✅ انضممت إلى {teamNames[selectedTeam]}</p>
      ) : (
        <p className="warning">⚠️ الرجاء اختيار فريق</p>
      )}
    </div>
  );
}

export default TeamSelector;
