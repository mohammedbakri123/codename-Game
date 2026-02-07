import { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useGame } from '../../contexts/GameContext';
import { CLIENT_EVENTS, SERVER_EVENTS } from '../../services/constants';
import PlayerList from '../../components/room/PlayerList';
import TeamSelector from '../../components/room/TeamSelector';
import RoleSelector from '../../components/room/RoleSelector';
import TeamSummary from '../../components/room/TeamSummary';
import styles from '../../styles/RoomPage.module.css';

function RoomPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socket, isConnected, reconnect } = useSocket();
  const { room, game, error, setRoom } = useGame();
  
  const [playerName] = useState(searchParams.get('name') || 'لاعب');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRole, setSelectedRole] = useState('operative');
  const [hasJoined, setHasJoined] = useState(false);
  const [joinAttempts, setJoinAttempts] = useState(0);
  const [joinError, setJoinError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);

  // Reset join state when disconnected
  useEffect(() => {
    if (!isConnected && hasJoined) {
      console.log('⚠️ RoomPage: Disconnected, resetting join state');
      setHasJoined(false);
      setRoom(null);
    }
  }, [isConnected, hasJoined, setRoom]);

  // Join room when connected
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⏳ RoomPage: Waiting for socket connection...');
      return;
    }

    if (hasJoined || isJoining) {
      console.log('✅ RoomPage: Already joined or joining room');
      return;
    }

    console.log('🏠 RoomPage: Joining room:', roomId);
    console.log('   Socket ID:', socket.id);
    console.log('   Connected:', isConnected);
    console.log('   Socket transport:', socket?.io?.engine?.transport?.name);
    
    setIsJoining(true);
    setJoinError(null);
    
    socket.emit(CLIENT_EVENTS.JOIN_ROOM, {
      roomId,
      playerName,
      team: null,
      role: 'operative'
    });
    
    setHasJoined(true);
    setJoinAttempts(prev => prev + 1);

    // Set timeout to check if we received room update
    const timeout = setTimeout(() => {
      if (!room && hasJoined) {
        console.warn('⚠️ RoomPage: No room update received after 5 seconds');
        setJoinError('لم يتم استلام تحديث الغرفة. جاري إعادة المحاولة...');
        setHasJoined(false);
        setIsJoining(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      // Don't send LEAVE_ROOM here - the server will handle disconnect naturally
      // when the socket disconnects. Sending it here causes issues with React
      // StrictMode and component re-renders.
    };
  }, [socket, isConnected, roomId, playerName, hasJoined, isJoining, room]);

  // Listen for join errors
  useEffect(() => {
    if (!socket) return;

    const handleError = (errorData) => {
      if (errorData?.message?.includes('room') || errorData?.message?.includes('join')) {
        console.error('❌ RoomPage: Join error:', errorData.message);
        setJoinError(errorData.message);
        setHasJoined(false);
        setIsJoining(false);
      }
    };

    socket.on(SERVER_EVENTS.ERROR, handleError);
    return () => socket.off(SERVER_EVENTS.ERROR, handleError);
  }, [socket]);

  // Navigate to game when started
  useEffect(() => {
    if (game) {
      console.log('🎮 RoomPage: Game started, navigating...');
      navigate(`/game/${roomId}`);
    }
  }, [game, roomId, navigate]);

  const handleUpdateTeam = (team) => {
    console.log('🎯 RoomPage: Selecting team:', team);
    setSelectedTeam(team);
    if (socket && isConnected) {
      socket.emit(CLIENT_EVENTS.UPDATE_PLAYER, { team });
    }
  };

  const handleUpdateRole = (role) => {
    console.log('🎭 RoomPage: Selecting role:', role);
    setSelectedRole(role);
    if (socket && isConnected) {
      socket.emit(CLIENT_EVENTS.UPDATE_PLAYER, { role });
    }
  };

  const handleStartGame = () => {
    if (socket && isConnected) {
      socket.emit(CLIENT_EVENTS.START_GAME);
    }
  };

  const isHost = room?.hostId === socket?.id;
  const canStart = room && room.players?.length >= 2;
  const currentPlayer = room?.players?.find(p => p.id === socket?.id);
  
  // Sync local state with server
  useEffect(() => {
    if (currentPlayer) {
      if (currentPlayer.team && currentPlayer.team !== selectedTeam) {
        console.log('🔄 RoomPage: Syncing team from server:', currentPlayer.team);
        setSelectedTeam(currentPlayer.team);
      }
      if (currentPlayer.role && currentPlayer.role !== selectedRole) {
        console.log('🔄 RoomPage: Syncing role from server:', currentPlayer.role);
        setSelectedRole(currentPlayer.role);
      }
    }
  }, [currentPlayer, selectedTeam, selectedRole]);

  // Show connection status
  if (!isConnected) {
    return (
      <div className={styles['room-page']}>
        <div className={styles['connection-status']} dir="rtl">
          <div className={`${styles['status-box']} ${styles.connecting}`}>
            <h2>🔌 جاري الاتصال بالخادم...</h2>
            <div className={styles.spinner}></div>
            <p>يرجى الانتظار</p>
            {joinAttempts > 0 && (
              <p className={styles['attempts-info']}>محاولة {joinAttempts}</p>
            )}
            <div className={styles['debug-info']}>
              <p>محاولة الاتصال بـ: {import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}</p>
              <p>معلومات الاتصال:</p>
              <ul>
                <li>معرف Socket: {socket ? 'Available' : 'غير متوفر'}</li>
                <li>معرف الاتصال: {isConnected ? 'Yes' : 'No'}</li>
                <li>المحاولات: {joinAttempts}</li>
              </ul>
            </div>
            {joinAttempts > 2 && (
              <button onClick={reconnect} className={`${styles.btn} ${styles['btn-secondary']}`}>
                إعادة الاتصال
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles['room-page']}>
      <div className={styles['room-container']} dir="rtl">
        <div className={styles['connection-bar']}>
          <span className={styles['connected-badge']}>
            ✓ متصل 
            {socket?.id && <span className={styles['socket-id']}>ID: {socket.id.substring(0, 8)}</span>}
          </span>
          <span className={styles['room-code']}>الغرفة: <strong>{roomId}</strong></span>
        </div>
        
        <div className={styles['room-content']}>
          <div className={styles['room-sidebar']}>
            <div className={styles['player-section']}>
              <h2>⚙️ إعداداتك</h2>
              <p className={styles['player-name']}>الاسم: <strong>{playerName}</strong></p>
              
              <div className={styles['current-status']}>
                <p>فريقك: <strong className={selectedTeam === 'red' ? styles['team-red-text'] : selectedTeam === 'blue' ? styles['team-blue-text'] : ''}>
                  {selectedTeam === 'red' ? '🔴 الأحمر' : selectedTeam === 'blue' ? '🔵 الأزرق' : '⚪ لم تختر'}
                </strong></p>
                <p>دورك: <strong>{selectedRole === 'spymaster' ? '👑 قائد' : '🕵️ عميل'}</strong></p>
              </div>
              
              <TeamSelector 
                selectedTeam={selectedTeam}
                onSelectTeam={handleUpdateTeam}
                redCount={room?.players?.filter(p => p.team === 'red' && p.connected).length || 0}
                blueCount={room?.players?.filter(p => p.team === 'blue' && p.connected).length || 0}
              />
              
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={handleUpdateRole}
              />
            </div>

            {isHost ? (
              <div className={styles['host-section']}>
                <button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className={`${styles.btn} ${styles['btn-primary']} ${styles['btn-start']}`}
                >
                  ▶️ بدء اللعبة
                </button>
                {!canStart && (
                  <p className={styles.hint}>👥 تحتاج إلى لاعبين على الأقل (موجود: {room?.players?.length || 0})</p>
                )}
              </div>
            ) : (
              <div className={styles['waiting-section']}>
                <p className={styles.hint}>⏳ في انتظار بدء المضيف...</p>
                <p className={styles['players-count']}>👥 اللاعبين: {room?.players?.length || 0}</p>
              </div>
            )}
          </div>

          <div className={styles['room-main']}>
            {!room ? (
              <div className={styles['loading-players']}>
                <div className={styles.spinner}></div>
                <p>جاري تحميل بيانات الغرفة...</p>
                <p className={styles['debug-hint']}>أنتظر وصول تحديث الغرفة...</p>
              </div>
            ) : (
              <>
                <TeamSummary 
                  players={room.players || []} 
                  currentPlayerId={socket?.id}
                />
                <PlayerList 
                  players={room.players || []} 
                  currentPlayerId={socket?.id}
                />
              </>
            )}
          </div>
        </div>

        {(error || joinError) && (
          <div className={styles['error-banner']}>
            ⚠️ {error || joinError}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPage;
