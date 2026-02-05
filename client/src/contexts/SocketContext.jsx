import { createContext, useContext, useEffect, useState } from 'react';
import { createSocket } from '../services/socketService';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    console.log('🎮 Initializing socket connection...');
    const newSocket = createSocket();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ SocketContext: Connected to server');
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('❌ SocketContext: Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ SocketContext: Connection error:', error.message);
      setIsConnected(false);
      setConnectionError(error.message);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, connectionError }}>
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
