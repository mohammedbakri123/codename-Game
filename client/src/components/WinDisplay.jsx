import { useGame } from '../contexts/GameContext';
import { ARABIC_TEXT, TEAMS } from '../data/words';
import '../styles/WinDisplay.css';

function WinDisplay() {
  const { state } = useGame();
  const { gameStatus, winner } = state;
  
  if (gameStatus !== 'red_wins' && gameStatus !== 'blue_wins' && gameStatus !== 'assassin_revealed') {
    return null;
  }
  
  let message;
  let team;
  
  if (gameStatus === 'red_wins') {
    message = ARABIC_TEXT.RED_WINS;
    team = TEAMS.RED;
  } else if (gameStatus === 'blue_wins') {
    message = ARABIC_TEXT.BLUE_WINS;
    team = TEAMS.BLUE;
  } else {
    message = `انتهت اللعبة - ${winner === TEAMS.RED ? 'الفريق الأحمر' : 'الفريق الأزرق'} فاز!`;
    team = winner;
  }
  
  return (
    <div className={`win-display ${team}`}>
      <div className="win-message">
        {message}
      </div>
    </div>
  );
}

export default WinDisplay;
