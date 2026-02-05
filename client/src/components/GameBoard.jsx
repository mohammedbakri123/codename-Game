import Card from './Card';
import { useGame } from '../contexts/GameContext';
import '../styles/GameBoard.css';

function GameBoard() {
  const { state } = useGame();
  const { board } = state;
  
  if (board.length === 0) return null;
  
  return (
    <div className="game-board-container">
      <div className="game-board">
        {board.map((card, index) => (
          <Card key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
