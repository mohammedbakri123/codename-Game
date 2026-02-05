import { createContext, useContext, useEffect, useState } from 'react';
import { useSocket } from './SocketContext';
import { SERVER_EVENTS } from '../services/constants';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { socket } = useSocket();
  const [room, setRoom] = useState(null);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!socket) {
      console.log('GameContext: No socket yet');
      return;
    }

    console.log('🎮 GameContext: Setting up event listeners');
    console.log('   Socket ID:', socket.id);
    console.log('   Socket connected:', socket.connected);

    socket.on(SERVER_EVENTS.ROOM_UPDATE, (roomData) => {
      console.log('📥 [ROOM_UPDATE] Received:', roomData);
      console.log('   Room ID:', roomData.id);
      console.log('   Players:', roomData.players?.length || 0);
      console.log('   Player details:', roomData.players);
      setRoom(roomData);
    });

    socket.on(SERVER_EVENTS.GAME_UPDATE, (gameData) => {
      console.log('📥 [GAME_UPDATE] Received');
      console.log('   Phase:', gameData.phase);
      console.log('   Turn:', gameData.turn);
      setGame(gameData);
    });

    socket.on(SERVER_EVENTS.GAME_STARTED, (gameData) => {
      console.log('📥 [GAME_STARTED] Received');
      console.log('   Room ID:', gameData.roomId);
      console.log('   Board:', gameData.board?.length || 0, 'cards');
      setGame(gameData);
    });

    socket.on(SERVER_EVENTS.PLAYER_JOINED, (data) => {
      console.log('📥 [PLAYER_JOINED] Received');
      console.log('   Player:', data.player?.name);
      console.log('   Team:', data.player?.team);
    });

    socket.on(SERVER_EVENTS.PLAYER_LEFT, (data) => {
      console.log('📥 [PLAYER_LEFT] Received');
      console.log('   Player ID:', data.playerId);
    });

    socket.on(SERVER_EVENTS.ERROR, (errorData) => {
      console.error('📥 [ERROR] Received:', errorData.message);
      setError(errorData.message);
      setTimeout(() => setError(null), 5000);
    });

    socket.on('connect', () => {
      console.log('🎮 [GameContext] Socket reconnected, listeners intact');
    });

    return () => {
      console.log('🧹 [GameContext] Cleaning up event listeners');
      socket.off(SERVER_EVENTS.ROOM_UPDATE);
      socket.off(SERVER_EVENTS.GAME_UPDATE);
      socket.off(SERVER_EVENTS.GAME_STARTED);
      socket.off(SERVER_EVENTS.PLAYER_JOINED);
      socket.off(SERVER_EVENTS.PLAYER_LEFT);
      socket.off(SERVER_EVENTS.ERROR);
      socket.off('connect');
    };
  }, [socket]);

  return (
    <GameContext.Provider value={{ room, setRoom, game, setGame, error }}>
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
