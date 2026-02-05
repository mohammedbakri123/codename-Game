import { useGame } from '../contexts/GameContext';
import { TEAMS } from '../data/words';
import '../styles/Card.css';

function Card({ card, index }) {
  const { state, dispatch } = useGame();
  const { viewMode, gameStatus, currentTeam } = state;
  
  const handleClick = () => {
    if (gameStatus !== 'playing' || card.revealed || viewMode === 'spymaster') return;
    dispatch({ type: 'REVEAL_CARD', payload: index });
  };
  
  const getCardClass = () => {
    let className = 'game-card';
    
    if (card.revealed) {
      className += ` revealed ${card.type}`;
    } else {
      className += ' hidden';
      if (viewMode === 'spymaster') {
        className += ` spymaster ${card.type}`;
      }
    }
    
    return className;
  };
  
  const getCardIcon = () => {
    if (!card.revealed) return null;
    
    switch (card.type) {
      case 'red':
        return '🔴';
      case 'blue':
        return '🔵';
      case 'neutral':
        return '⚪';
      case 'assassin':
        return '☠️';
      default:
        return null;
    }
  };
  
  return (
    <div className={getCardClass()} onClick={handleClick}>
      <div className="card-inner">
        <div className="card-content">
          <span className="card-word">{card.word}</span>
        </div>
        {card.revealed && (
          <div className="card-overlay">
            <span className="card-icon">{getCardIcon()}</span>
          </div>
        )}
        {viewMode === 'spymaster' && !card.revealed && (
          <div className="spymaster-indicator">
            <div className={`indicator ${card.type}`}></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Card;
