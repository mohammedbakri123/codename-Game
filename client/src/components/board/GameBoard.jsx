import Card from './Card';
import styles from '../../styles/components/GameBoard.module.css';

function GameBoard({ board, isSpymaster, currentTeam, phase, onSelectWord }) {
  return (
    <div className={styles['game-board']}>
      <div className={styles['cards-grid']}>
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
