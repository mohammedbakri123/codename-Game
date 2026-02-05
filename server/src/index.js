const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const RoomManager = require('./rooms/RoomManager');
const GameService = require('./game/gameService');
const initializeSocketIO = require('./socket');

const app = express();
const server = http.createServer(app);

// Middleware - Allow all origins in development
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? (process.env.CLIENT_URL || 'http://localhost:5173')
    : true, // Allow all origins in development
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    clients: io.engine.clientsCount || 0
  });
});

// Initialize services
const roomManager = new RoomManager();
const gameService = new GameService();

// Initialize Socket.IO
const io = initializeSocketIO(server, roomManager, gameService);

// Cleanup empty rooms periodically
setInterval(() => {
  roomManager.cleanupEmptyRooms();
}, 60000);

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Listen on all interfaces

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on http://${HOST}:${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Accepting connections from any device on the network`);
});

module.exports = { app, io };
