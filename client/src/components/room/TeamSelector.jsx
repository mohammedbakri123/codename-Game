import '../../styles/components/TeamSelector.css';

function TeamSelector({ selectedTeam, onSelectTeam }) {
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
          {teamNames.red}
          {selectedTeam === 'red' && <span className="check-mark"> ✓</span>}
        </button>
        <button
          type="button"
          className={`team-btn team-blue ${selectedTeam === 'blue' ? 'selected' : ''}`}
          onClick={() => onSelectTeam('blue')}
        >
          {teamNames.blue}
          {selectedTeam === 'blue' && <span className="check-mark"> ✓</span>}
        </button>
      </div>
      {!selectedTeam && (
        <p className="warning">⚠️ الرجاء اختيار فريق</p>
      )}
    </div>
  );
}

export default TeamSelector;
