/**
 * Socket Connection Test Utility
 * Run this in browser console to test socket connectivity
 */

export function testSocketConnection(socket) {
  console.log('=== SOCKET CONNECTION TEST ===');
  
  if (!socket) {
    console.error('❌ Socket is null/undefined');
    return false;
  }
  
  console.log('Socket ID:', socket.id);
  console.log('Connected:', socket.connected);
  console.log('Disconnected:', socket.disconnected);
  
  // Test connection
  if (!socket.connected) {
    console.error('❌ Socket is not connected!');
    console.log('   Attempting to connect...');
    socket.connect();
    return false;
  }
  
  console.log('✅ Socket is connected');
  
  // Test event listeners
  const events = [
    'ROOM_UPDATE',
    'GAME_UPDATE',
    'GAME_STARTED',
    'PLAYER_JOINED',
    'PLAYER_LEFT',
    'CLUE_RECEIVED',
    'WORD_SELECTED',
    'TURN_ENDED',
    'GAME_ENDED',
    'ERROR'
  ];
  
  console.log('\n=== EVENT LISTENERS ===');
  events.forEach(event => {
    const listeners = socket.listeners(event);
    console.log(`${event}: ${listeners.length} listener(s)`);
  });
  
  return true;
}

export function testEmit(socket, event, data) {
  console.log(`\n=== TESTING EMIT: ${event} ===`);
  if (!socket || !socket.connected) {
    console.error('❌ Cannot emit - socket not connected');
    return false;
  }
  
  console.log('Emitting:', event);
  console.log('Data:', data);
  
  socket.emit(event, data);
  console.log('✅ Emitted successfully');
  return true;
}

export function debugGameState(game, room) {
  console.log('=== GAME STATE DEBUG ===');
  
  if (!game) {
    console.warn('⚠️ Game is null');
    return;
  }
  
  console.log('Phase:', game.phase);
  console.log('Turn:', game.turn);
  console.log('Clue:', game.clue);
  console.log('Guesses Left:', game.guessesLeft);
  console.log('Teams:', game.teams);
  console.log('Board cards:', game.board?.length || 0);
  console.log('Winner:', game.winner);
  
  if (room) {
    console.log('\n=== ROOM STATE ===');
    console.log('Room ID:', room.id);
    console.log('Players:', room.players?.length || 0);
    console.log('Status:', room.status);
  }
}

// Make available globally for console testing
if (typeof window !== 'undefined') {
  window.socketTests = {
    testSocketConnection,
    testEmit,
    debugGameState
  };
}
