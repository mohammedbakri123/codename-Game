import styles from '../../styles/components/Card.module.css';

function Card({ card, isSpymaster, currentTeam, phase, onSelect }) {
  const canSelect = !card.revealed && 
                    phase === 'GUESS' && 
                    !isSpymaster;

  const getCardClass = () => {
    const classes = [styles.card];
    
    if (card.revealed) {
      classes.push(styles[`revealed-${card.color}`]);
    } else if (isSpymaster) {
      classes.push(styles[`spymaster-${card.color}`]);
    } else {
      classes.push(styles.unrevealed);
    }
    
    if (canSelect) {
      classes.push(styles.selectable);
    }
    
    return classes.join(' ');
  };

  return (
    <div
      className={getCardClass()}
      onClick={canSelect ? onSelect : undefined}
    >
      <span className={styles['card-word']}>{card.word}</span>
    </div>
  );
}

export default Card;
