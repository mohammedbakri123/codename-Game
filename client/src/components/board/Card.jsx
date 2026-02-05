import '../../styles/components/Card.css';

function Card({ card, isSpymaster, currentTeam, phase, onSelect }) {
  const canSelect = !card.revealed && 
                    phase === 'GUESS' && 
                    !isSpymaster;

  const getCardClass = () => {
    const classes = ['card'];
    
    if (card.revealed) {
      classes.push(`revealed-${card.color}`);
    } else if (isSpymaster) {
      classes.push(`spymaster-${card.color}`);
    } else {
      classes.push('unrevealed');
    }
    
    if (canSelect) {
      classes.push('selectable');
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={getCardClass()}
      onClick={canSelect ? onSelect : undefined}
    >
      <span className="card-word">{card.word}</span>
    </div>
  );
}

export default Card;
