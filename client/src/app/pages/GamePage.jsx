import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useGame } from '../../contexts/GameContext';
import { CLIENT_EVENTS } from '../../services/constants';
import GameBoard from '../../components/board/GameBoard';
import ClueDisplay from '../../components/clue/ClueDisplay';
import GameControls from '../../components/controls/GameControls';
import TeamScore from '../../components/board/TeamScore';
import styles from '../../styles/GamePage.module.css';

function GamePage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { game, room } = useGame();

  useEffect(() => {
    if (!game) {
      navigate(`/room/${roomId}`);
    }
  }, [game, roomId, navigate]);

  const handleSelectWord = (cardId) => {
    if (!socket || !game) return;
    
    const currentPlayer = room?.players?.find(p => p.id === socket.id);
    if (!currentPlayer?.team) return;

    socket.emit(CLIENT_EVENTS.SELECT_WORD, {
      cardId,
      team: currentPlayer.team
    });
  };

  const handleSendClue = (word, count) => {
    if (!socket || !game) return;
    
    const currentPlayer = room?.players?.find(p => p.id === socket.id);
    if (!currentPlayer?.team) return;

    socket.emit(CLIENT_EVENTS.SEND_CLUE, {
      word,
      count,
      team: currentPlayer.team
    });
  };

  const handleEndTurn = () => {
    if (!socket || !game) return;
    
    const currentPlayer = room?.players?.find(p => p.id === socket.id);
    if (!currentPlayer?.team) return;

    socket.emit(CLIENT_EVENTS.END_TURN, {
      team: currentPlayer.team
    });
  };

  if (!game) {
    return <div className={styles.loading}>جاري تحميل اللعبة...</div>;
  }

  const currentPlayer = room?.players?.find(p => p.id === socket?.id);
  const isSpymaster = currentPlayer?.role === 'spymaster';
  const isCurrentTeam = currentPlayer?.team === game.turn;

  const teamNames = {
    red: 'الأحمر',
    blue: 'الأزرق'
  };

  return (
    <div className={styles['game-page']}>
      <div className={styles['game-container']} dir="rtl">
        <header className={styles['game-header']}>
          <h1>كود نيمز</h1>
          <div className={styles['turn-indicator']}>
            الدور الحالي: <span className={styles[`team-${game.turn}`]}>{teamNames[game.turn]}</span>
          </div>
        </header>

        <div className={styles['game-layout']}>
          <aside className={styles['game-sidebar']}>
            <TeamScore 
              redRemaining={game.teams.red.remaining}
              blueRemaining={game.teams.blue.remaining}
              currentTurn={game.turn}
            />
            
            <ClueDisplay 
              clue={game.clue}
              guessesLeft={game.guessesLeft}
              phase={game.phase}
            />

            <GameControls
              phase={game.phase}
              isSpymaster={isSpymaster}
              isCurrentTeam={isCurrentTeam}
              onSendClue={handleSendClue}
              onEndTurn={handleEndTurn}
            />
          </aside>

          <main className={styles['game-main']}>
            <GameBoard
              board={game.board}
              isSpymaster={isSpymaster}
              currentTeam={currentPlayer?.team}
              phase={game.phase}
              onSelectWord={handleSelectWord}
            />
          </main>
        </div>

        {game.winner && (
          <div className={styles['winner-overlay']}>
            <div className={styles['winner-modal']}>
              <h2 className={`${styles['winner-text']} ${styles[`team-${game.winner}`]}`}>
                فاز فريق {teamNames[game.winner]}!
              </h2>
              <button 
                onClick={() => navigate('/')}
                className={`${styles.btn} ${styles['btn-primary']}`}
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GamePage;
