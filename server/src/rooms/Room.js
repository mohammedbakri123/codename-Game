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
    return {
      id: this.id,
      hostId: this.hostId,
      players: this.getAllPlayers(),
      status: this.status,
      playerCount: this.players.size,
      createdAt: this.createdAt
    };
  }
}

module.exports = Room;
