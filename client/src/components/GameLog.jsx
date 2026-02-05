import { useGame } from '../contexts/GameContext';
import { TEAMS, ARABIC_TEXT } from '../data/words';
import '../styles/GameLog.css';

function GameLog() {
  const { state } = useGame();
  const { gameLog } = state;
  
  const getLogMessage = (entry) => {
    switch (entry.type) {
      case 'clue':
        return (
          <>
            <span className={`log-team ${entry.team}`}>{entry.player}</span>
            {' يعطي تلميح '}
            <strong>{entry.word}</strong>
            {' '}{entry.number}
          </>
        );
      case 'reveal':
        return (
          <>
            <span className={`log-team ${entry.team}`}>{entry.player}</span>
            {' يختار '}
            <strong>{entry.card.word}</strong>
          </>
        );
      case 'end_turn':
        return (
          <>
            <span className={`log-team ${entry.team}`}>{entry.player}</span>
            {' ينهي الدور'}
          </>
        );
      case 'win':
        if (entry.message === 'assassin_revealed') {
          return (
            <span className="log-win">
              انتهت اللعبة - تم الكشف عن القاتل!
            </span>
          );
        }
        return (
          <span className={`log-win ${entry.team}`}>
            {entry.team === TEAMS.RED ? ARABIC_TEXT.RED_WINS : ARABIC_TEXT.BLUE_WINS}
          </span>
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="game-log">
      <h3 className="log-title">سجل اللعبة</h3>
      <div className="log-entries">
        {gameLog.length === 0 ? (
          <div className="empty-log">لا توجد حركات بعد</div>
        ) : (
          gameLog.map((entry, index) => (
            <div key={index} className={`log-entry ${entry.type}`}>
              {getLogMessage(entry)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default GameLog;
