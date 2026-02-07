import { createContext, useContext, useEffect, useReducer, useCallback } from 'react';
import { createSocket } from '../services/socketService';

const SocketContext = createContext(null);

const initialState = {
  socket: null,
  isConnected: false,
  connectionError: null,
  reconnectAttempt: 0
};

function socketReducer(state, action) {
  switch (action.type) {
    case 'SET_SOCKET':
      return {
        ...state,
        socket: action.payload
      };
    case 'CONNECTED':
      return {
        ...state,
        isConnected: true,
        connectionError: null,
        reconnectAttempt: 0
      };
    case 'DISCONNECTED':
      return {
        ...state,
        isConnected: false
      };
    case 'CONNECTION_ERROR':
      return {
        ...state,
        isConnected: false,
        connectionError: action.payload,
        reconnectAttempt: state.reconnectAttempt + 1
      };
    case 'RECONNECTED':
      return {
        ...state,
        isConnected: true,
        connectionError: null,
        reconnectAttempt: 0
      };
    default:
      return state;
  }
}

export function SocketProvider({ children }) {
  const [state, dispatch] = useReducer(socketReducer, initialState);
  const { socket, isConnected, connectionError, reconnectAttempt } = state;

  const initializeSocket = useCallback(() => {
    console.log('🎮 SocketContext: Initializing socket connection...');
    const newSocket = createSocket();
    dispatch({ type: 'SET_SOCKET', payload: newSocket });

    newSocket.on('connect', () => {
      console.log('✅ SocketContext: Connected to server');
      console.log('   Socket ID:', newSocket.id);
      dispatch({ type: 'CONNECTED' });
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ SocketContext: Disconnected from server');
      console.log('   Reason:', reason);
      dispatch({ type: 'DISCONNECTED' });

      if (reason === 'io server disconnect' || reason === 'transport close') {
        console.log('🔄 Attempting to reconnect...');
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ SocketContext: Connection error:', error.message);
      dispatch({ type: 'CONNECTION_ERROR', payload: error.message });
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 SocketContext: Reconnected after', attemptNumber, 'attempts');
      dispatch({ type: 'RECONNECTED' });
    });

    return newSocket;
  }, []);

  useEffect(() => {
    const newSocket = initializeSocket();

    return () => {
      console.log('🧹 SocketContext: Cleaning up socket connection');
      newSocket.removeAllListeners();
      newSocket.close();
    };
  }, [initializeSocket]);

  const reconnect = useCallback(() => {
    if (socket) {
      console.log('🔄 Manual reconnect triggered');
      socket.connect();
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      connectionError,
      reconnectAttempt,
      reconnect
    }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
