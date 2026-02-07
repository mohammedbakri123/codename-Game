const { Server } = require('socket.io');
const { SERVER_EVENTS } = require('./events');
const createRoomHandlers = require('./handlers/roomHandlers');
const createGameHandlers = require('./handlers/gameHandlers');

function initializeSocketIO(httpServer, roomManager, gameService) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NODE_ENV === 'production'
        ? (process.env.CLIENT_URL || 'http://localhost:5173')
        : true, // Allow all origins in development
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling'], // Support both
    pingTimeout: 60000,
    pingInterval: 25000
  });

  io.on('connection', (socket) => {
    console.log(`✅ Client connected: ${socket.id} from ${socket.handshake.address}`);
    console.log(`📊 Total connected clients: ${io.engine.clientsCount}`);

    // Create handlers
    const roomHandlers = createRoomHandlers(io, socket, roomManager, gameService);
    const gameHandlers = createGameHandlers(io, socket, roomManager, gameService);

    // Register all handlers
    Object.entries(roomHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    Object.entries(gameHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`❌ Client disconnected: ${socket.id} - Reason: ${reason}`);
      console.log(`📊 Total connected clients: ${io.engine.clientsCount}`);
      
      const roomId = socket.roomId;
      if (roomId) {
        const room = roomManager.getRoom(roomId);
        if (room) {
          room.removePlayer(socket.id);
          io.in(roomId).emit(SERVER_EVENTS.PLAYER_LEFT, {
            playerId: socket.id
          });
          io.in(roomId).emit(SERVER_EVENTS.ROOM_UPDATE, room.toJSON());
        }
      }
    });
  });

  return io;
}

module.exports = initializeSocketIO;
