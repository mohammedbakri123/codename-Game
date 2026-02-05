import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

console.log('🔌 Socket Service Initializing...');
console.log('   URL:', SOCKET_URL);

export function createSocket() {
  console.log('🔌 Creating socket connection to:', SOCKET_URL);
  
  const socket = io(SOCKET_URL, {
    transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    withCredentials: false,
    forceNew: true,
    autoConnect: true
  });

  // Debug logging
  socket.on('connect', () => {
    console.log('✅ Socket CONNECTED:', socket.id);
    console.log('   Transport:', socket.io.engine.transport.name);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Socket DISCONNECTED:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket CONNECTION ERROR:', error.message);
    console.error('   Type:', error.type);
    console.error('   URL tried:', SOCKET_URL);
    
    if (error.message.includes('xhr poll error')) {
      console.error('   💡 Cannot reach server. Check if server is running on:', SOCKET_URL);
    }
    if (error.message.includes('timeout')) {
      console.error('   💡 Connection timed out. Server may be down or wrong IP.');
    }
  });

  socket.on('reconnect', (attemptNumber) => {
    console.log('🔄 Socket RECONNECTED after', attemptNumber, 'attempts');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Reconnection attempt', attemptNumber);
  });

  socket.on('reconnect_error', (error) => {
    console.error('❌ Reconnection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  // Log when transport upgrades
  socket.io.engine.on('upgrade', (transport) => {
    console.log('📡 Transport upgraded to:', transport.name);
  });

  return socket;
}
