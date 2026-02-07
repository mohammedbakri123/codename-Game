const { v4: uuidv4 } = require('uuid');

class Room {
  constructor(roomId, hostId) {
    this.id = roomId;
    this.hostId = hostId;
    this.players = new Map();
    this.game = null;
    this.createdAt = Date.now();
    this.status = 'waiting'; // waiting, playing, ended
  }

  addPlayer(socketId, playerData) {
    // Clean up old disconnected players first
    this.cleanupDisconnectedPlayers();
    
    // Remove any existing player with the same name (whether connected or not)
    // This handles page refreshes where socket ID changes
    for (const [id, player] of this.players) {
      if (player.name === playerData.name) {
        console.log(`   Removing old player entry: ${player.name} (was ${player.connected ? 'connected' : 'disconnected'})`);
        this.players.delete(id);
      }
    }
    
    this.players.set(socketId, {
      id: socketId,
      ...playerData,
      connected: true,
      joinedAt: Date.now()
    });
  }

  removePlayer(socketId) {
    const player = this.players.get(socketId);
    if (player) {
      player.connected = false;
      player.disconnectedAt = Date.now();
    }
  }

  cleanupDisconnectedPlayers() {
    // Remove all disconnected players immediately
    // This handles page refreshes and reconnection scenarios
    for (const [id, player] of this.players) {
      if (!player.connected) {
        console.log(`   Cleaning up disconnected player: ${player.name}`);
        this.players.delete(id);
      }
    }
  }

  getPlayer(socketId) {
    return this.players.get(socketId);
  }

  getAllPlayers() {
    return Array.from(this.players.values());
  }

  getConnectedPlayers() {
    return Array.from(this.players.values()).filter(p => p.connected);
  }

  setGame(game) {
    this.game = game;
    this.status = 'playing';
  }

  toJSON() {
    // Clean up disconnected players before returning data
    this.cleanupDisconnectedPlayers();
    
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.getAllPlayers(),
      status: this.status,
      playerCount: this.players.size,
      connectedPlayerCount: this.getConnectedPlayers().length,
      createdAt: this.createdAt
    };
  }
}

module.exports = Room;
