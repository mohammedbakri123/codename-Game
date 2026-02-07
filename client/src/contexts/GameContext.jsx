import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { useSocket } from './SocketContext';
import { SERVER_EVENTS } from '../services/constants';

const GameContext = createContext(null);

const initialState = {
  room: null,
  game: null,
  error: null,
  isLoading: false
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM':
      return {
        ...state,
        room: action.payload,
        isLoading: false
      };
    case 'SET_GAME':
      return {
        ...state,
        game: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const { socket, isConnected } = useSocket();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { room, game, error, isLoading } = state;

  const logGameState = useCallback(() => {
    console.log('=== GAME CONTEXT STATE ===');
    console.log('Socket connected:', isConnected);
    console.log('Room:', room ? { id: room.id, players: room.players?.length } : 'null');
    console.log('Game:', game ? { phase: game.phase, turn: game.turn, boardSize: game.board?.length } : 'null');
    if (error) console.log('Error:', error);
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

      dispatch({ type: 'SET_ROOM', payload: roomData });
    };

    const handleGameUpdate = (gameData) => {
      console.log('📥 [GAME_UPDATE] Received');
      console.log('   Phase:', gameData?.phase);
      console.log('   Turn:', gameData?.turn);

      if (!gameData) {
        console.error('❌ Invalid game data received');
        return;
      }

      dispatch({ type: 'SET_GAME', payload: gameData });
    };

    const handleGameStarted = (gameData) => {
      console.log('📥 [GAME_STARTED] Received');
      console.log('   Room ID:', gameData?.roomId);
      console.log('   Board:', gameData?.board?.length || 0, 'cards');

      if (!gameData) {
        console.error('❌ Invalid game start data received');
        return;
      }

      dispatch({ type: 'SET_GAME', payload: gameData });
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
      dispatch({ type: 'SET_ERROR', payload: errorData?.message || 'Unknown error' });
      setTimeout(() => dispatch({ type: 'CLEAR_ERROR' }), 5000);
    };

    const handleConnect = () => {
      console.log('🎮 [GameContext] Socket reconnected, listeners intact');
    };

    socket.on(SERVER_EVENTS.ROOM_UPDATE, handleRoomUpdate);
    socket.on(SERVER_EVENTS.GAME_UPDATE, handleGameUpdate);
    socket.on(SERVER_EVENTS.GAME_STARTED, handleGameStarted);
    socket.on(SERVER_EVENTS.PLAYER_JOINED, handlePlayerJoined);
    socket.on(SERVER_EVENTS.PLAYER_LEFT, handlePlayerLeft);
    socket.on(SERVER_EVENTS.ERROR, handleError);
    socket.on('connect', handleConnect);

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.gameContext = { logGameState, room, game, error, isConnected };
    }
  }, [logGameState, room, game, error, isConnected]);

  const setRoom = useCallback((roomData) => {
    dispatch({ type: 'SET_ROOM', payload: roomData });
  }, []);

  const setGame = useCallback((gameData) => {
    dispatch({ type: 'SET_GAME', payload: gameData });
  }, []);

  const setIsLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

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
