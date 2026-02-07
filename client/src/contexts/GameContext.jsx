import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { SERVER_EVENTS } from '../services/constants';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { socket, isConnected } = useSocket();
  const [room, setRoom] = useState(null);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging helper
  const logGameState = useCallback(() => {
    console.log('=== GAME CONTEXT STATE ===');
    console.log('Socket connected:', isConnected);
    console.log('Room:', room ? { id: room.id, players: room.players?.length } : 'null');
    console.log('Game:', game ? { phase: game.phase, turn: game.turn, boardSize: game.board?.length } : 'null');
    console.log('Error:', error);
    console.log('=========================');
  }, [isConnected, room, game, error]);

  useEffect(() => {
    if (!socket) {
      console.log('GameContext: Waiting for socket...');
      return;
    }

    console.log('🎮 GameContext: Setting up event listeners');
    console.log('   Socket ID:', socket.id);
    console.log('   Socket connected:', socket.connected);

    const handleRoomUpdate = (roomData) => {
      console.log('📥 [ROOM_UPDATE] Received:', roomData);
      console.log('   Room ID:', roomData?.id);
      console.log('   Players:', roomData?.players?.length || 0);
      
      if (!roomData || !roomData.id) {
        console.error('❌ Invalid room data received');
        return;
      }
      
      setRoom(roomData);
      setIsLoading(false);
    };

    const handleGameUpdate = (gameData) => {
      console.log('📥 [GAME_UPDATE] Received');
      console.log('   Phase:', gameData?.phase);
      console.log('   Turn:', gameData?.turn);
      
      if (!gameData) {
        console.error('❌ Invalid game data received');
        return;
      }
      
      setGame(gameData);
    };

    const handleGameStarted = (gameData) => {
      console.log('📥 [GAME_STARTED] Received');
      console.log('   Room ID:', gameData?.roomId);
      console.log('   Board:', gameData?.board?.length || 0, 'cards');
      
      if (!gameData) {
        console.error('❌ Invalid game start data received');
        return;
      }
      
      setGame(gameData);
    };

    const handlePlayerJoined = (data) => {
      console.log('📥 [PLAYER_JOINED] Received');
      console.log('   Player:', data?.player?.name);
      console.log('   Team:', data?.player?.team);
    };

    const handlePlayerLeft = (data) => {
      console.log('📥 [PLAYER_LEFT] Received');
      console.log('   Player ID:', data?.playerId);
    };

    const handleError = (errorData) => {
      console.error('📥 [ERROR] Received:', errorData?.message);
      setError(errorData?.message || 'Unknown error');
      setIsLoading(false);
      setTimeout(() => setError(null), 5000);
    };

    const handleConnect = () => {
      console.log('🎮 [GameContext] Socket reconnected, listeners intact');
    };

    // Register listeners
    socket.on(SERVER_EVENTS.ROOM_UPDATE, handleRoomUpdate);
    socket.on(SERVER_EVENTS.GAME_UPDATE, handleGameUpdate);
    socket.on(SERVER_EVENTS.GAME_STARTED, handleGameStarted);
    socket.on(SERVER_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SERVER_EVENTS.PLAYER_LEFT, handlePlayerLeft);
    socket.on(SERVER_EVENTS.ERROR, handleError);
    socket.on('connect', handleConnect);

    // Debug: Log all incoming events
    const originalOn = socket.on.bind(socket);
    socket.on = function(event, handler) {
      return originalOn(event, function(...args) {
        if (!['ROOM_UPDATE', 'GAME_UPDATE', 'connect'].includes(event)) {
          console.log(`📡 [${event}] Event received`);
        }
        handler(...args);
      });
    };

    return () => {
      console.log('🧹 [GameContext] Cleaning up event listeners');
      socket.off(SERVER_EVENTS.ROOM_UPDATE, handleRoomUpdate);
      socket.off(SERVER_EVENTS.GAME_UPDATE, handleGameUpdate);
      socket.off(SERVER_EVENTS.GAME_STARTED, handleGameStarted);
      socket.off(SERVER_EVENTS.PLAYER_JOINED, handlePlayerJoined);
      socket.off(SERVER_EVENTS.PLAYER_LEFT, handlePlayerLeft);
      socket.off(SERVER_EVENTS.ERROR, handleError);
      socket.off('connect', handleConnect);
    };
  }, [socket]);

  // Make logGameState available globally for debugging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gameContext = { logGameState, room, game, error, isConnected };
    }
  }, [logGameState, room, game, error, isConnected]);

  return (
    <GameContext.Provider value={{ 
      room, 
      setRoom, 
      game, 
      setGame, 
      error,
      isLoading,
      setIsLoading,
      logGameState 
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
