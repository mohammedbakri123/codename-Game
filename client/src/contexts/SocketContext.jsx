import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createSocket } from '../services/socketService';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const initializeSocket = useCallback(() => {
    console.log('🎮 SocketContext: Initializing socket connection...');
    const newSocket = createSocket();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ SocketContext: Connected to server');
      console.log('   Socket ID:', newSocket.id);
      setIsConnected(true);
      setConnectionError(null);
      setReconnectAttempt(0);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('❌ SocketContext: Disconnected from server');
      console.log('   Reason:', reason);
      setIsConnected(false);
      
      // Auto-reconnect for certain disconnect reasons
      if (reason === 'io server disconnect' || reason === 'transport close') {
        console.log('🔄 Attempting to reconnect...');
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ SocketContext: Connection error:', error.message);
      setIsConnected(false);
      setConnectionError(error.message);
      setReconnectAttempt(prev => prev + 1);
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('🔄 SocketContext: Reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
      setConnectionError(null);
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

  // Manual reconnect function
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
