import Card from './Card';
import '../../styles/components/GameBoard.css';

function GameBoard({ board, isSpymaster, currentTeam, phase, onSelectWord }) {
  return (
    <div className="game-board">
      <div className="cards-grid">
        {board.map((card) => (
          <Card
            key={card.id}
            card={card}
            isSpymaster={isSpymaster}
            currentTeam={currentTeam}
            phase={phase}
            onSelect={() => onSelectWord(card.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
