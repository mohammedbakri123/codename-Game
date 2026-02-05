import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useSocket } from '../../contexts/SocketContext';
import { useGame } from '../../contexts/GameContext';
import { CLIENT_EVENTS } from '../../services/constants';
import PlayerList from '../../components/room/PlayerList';
import TeamSelector from '../../components/room/TeamSelector';
import RoleSelector from '../../components/room/RoleSelector';
import '../../styles/RoomPage.css';

function RoomPage() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const { room, game, error } = useGame();
  
  const [playerName] = useState(searchParams.get('name') || 'لاعب');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedRole, setSelectedRole] = useState('operative');
  const [hasJoined, setHasJoined] = useState(false);
  const [joinAttempts, setJoinAttempts] = useState(0);

  // Join room when connected
  useEffect(() => {
    if (!socket || !isConnected) {
      console.log('⏳ RoomPage: Waiting for socket connection...');
      return;
    }

    if (hasJoined) {
      console.log('✅ RoomPage: Already joined room');
      return;
    }

    console.log('🏠 RoomPage: Joining room:', roomId);
    console.log('   Socket ID:', socket.id);
    console.log('   Connected:', isConnected);
    console.log('   Socket transport:', socket?.io?.engine?.transport?.name);
    
    socket.emit(CLIENT_EVENTS.JOIN_ROOM, {
      roomId,
      playerName,
      team: null,
      role: 'operative'
    });
    
    setHasJoined(true);
    setJoinAttempts(prev => prev + 1);

    return () => {
      if (socket && isConnected) {
        console.log('👋 RoomPage: Leaving room');
        socket.emit(CLIENT_EVENTS.LEAVE_ROOM);
      }
    };
  }, [socket, isConnected, roomId, playerName, hasJoined]);

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
  const canStart = room && room.players?.length >= 4;
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
      <div className="room-page">
        <div className="connection-status" dir="rtl">
          <div className="status-box connecting">
            <h2>🔌 جاري الاتصال بالخادم...</h2>
            <div className="spinner"></div>
            <p>يرجى الانتظار</p>
            <div className="debug-info">
              <p>محاولة الاتصال بـ: {import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'}</p>
              <p>معلومات الاتصال:</p>
              <ul>
                <li>معرف Socket: {socket ? 'Available' : 'غير متوفر'}</li>
                <li>معرف الاتصال: {isConnected ? 'Yes' : 'No'}</li>
                <li>المحاولات: {joinAttempts}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="room-page">
      <div className="room-container" dir="rtl">
        <div className="connection-bar">
          <span className="connected-badge">
            ✓ متصل 
            {socket?.id && <span className="socket-id">ID: {socket.id.substring(0, 8)}</span>}
          </span>
          <span className="room-code">الغرفة: <strong>{roomId}</strong></span>
        </div>
        
        <div className="room-content">
          <div className="room-sidebar">
            <div className="player-section">
              <h2>⚙️ إعداداتك</h2>
              <p className="player-name">الاسم: <strong>{playerName}</strong></p>
              
              <div className="current-status">
                <p>فريقك: <strong className={selectedTeam === 'red' ? 'team-red-text' : selectedTeam === 'blue' ? 'team-blue-text' : ''}>
                  {selectedTeam === 'red' ? '🔴 الأحمر' : selectedTeam === 'blue' ? '🔵 الأزرق' : '⚪ لم تختر'}
                </strong></p>
                <p>دورك: <strong>{selectedRole === 'spymaster' ? '👑 قائد' : '🕵️ عميل'}</strong></p>
              </div>
              
              <TeamSelector 
                selectedTeam={selectedTeam}
                onSelectTeam={handleUpdateTeam}
              />
              
              <RoleSelector
                selectedRole={selectedRole}
                onSelectRole={handleUpdateRole}
              />
            </div>

            {isHost ? (
              <div className="host-section">
                <button
                  onClick={handleStartGame}
                  disabled={!canStart}
                  className="btn btn-primary btn-start"
                >
                  ▶️ بدء اللعبة
                </button>
                {!canStart && (
                  <p className="hint">👥 تحتاج إلى 4 لاعبين (موجود: {room?.players?.length || 0})</p>
                )}
              </div>
            ) : (
              <div className="waiting-section">
                <p className="hint">⏳ في انتظار بدء المضيف...</p>
                <p className="players-count">👥 اللاعبين: {room?.players?.length || 0}</p>
              </div>
            )}
          </div>

          <div className="room-main">
            {!room ? (
              <div className="loading-players">
                <div className="spinner"></div>
                <p>جاري تحميل بيانات الغرفة...</p>
                <p className="debug-hint">أنتظر وصول تحديث الغرفة...</p>
              </div>
            ) : (
              <PlayerList 
                players={room.players || []} 
                currentPlayerId={socket?.id}
              />
            )}
          </div>
        </div>

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default RoomPage;
