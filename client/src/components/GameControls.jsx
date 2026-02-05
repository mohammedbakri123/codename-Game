import { useGame } from '../contexts/GameContext';
import { ARABIC_TEXT, TEAMS } from '../data/words';
import '../styles/GameControls.css';

function GameControls() {
  const { state, dispatch } = useGame();
  const { viewMode, gameStatus, currentClue, currentUser, currentTeam } = state;
  
  const handleNewGame = () => {
    dispatch({ type: 'INIT_GAME' });
  };
  
  const handleToggleView = () => {
    dispatch({ type: 'TOGGLE_VIEW_MODE' });
  };
  
  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
  };
  
  const handlePlayNext = () => {
    dispatch({ type: 'INIT_GAME' });
  };
  
  const isGameOver = gameStatus === 'red_wins' || gameStatus === 'blue_wins' || gameStatus === 'assassin_revealed';
  const isUserTurn = currentUser.team === currentTeam;
  
  if (isGameOver) {
    return (
      <div className="game-controls victory-controls">
        <button className="btn-play-next" onClick={handlePlayNext}>
          اللعب مرة أخرى
        </button>
        <div className="user-info">
          {currentUser.name} - {currentUser.team === TEAMS.RED ? 'الفريق الأحمر' : 'الفريق الأزرق'} 
          ({currentUser.role === 'spymaster' ? 'قائد' : 'مشغل'})
        </div>
      </div>
    );
  }
  
  if (gameStatus === 'setup') {
    return (
      <div className="game-controls">
        <button className="btn-primary" onClick={handleNewGame}>
          {ARABIC_TEXT.START_GAME}
        </button>
      </div>
    );
  }
  
  return (
    <div className="game-controls">
      <div className="controls-row">
        <button className="btn-secondary" onClick={handleToggleView}>
          {viewMode === 'player' ? 'وضع القائد' : 'وضع اللاعب'}
        </button>
        
        {currentClue && isUserTurn && (
          <button className="btn-warning" onClick={handleEndTurn}>
            {ARABIC_TEXT.END_TURN}
          </button>
        )}
      </div>
      
      <div className="user-info">
        {currentUser.name} - {currentUser.team === TEAMS.RED ? 'الفريق الأحمر' : 'الفريق الأزرق'} 
        ({currentUser.role === 'spymaster' ? 'قائد' : 'مشغل'})
      </div>
    </div>
  );
}

export default GameControls;
