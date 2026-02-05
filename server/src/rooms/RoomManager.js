const Room = require('./Room');

class RoomManager {
  constructor() {
    this.rooms = new Map();
  }

  createRoom(roomId, hostId) {
    if (this.rooms.has(roomId)) {
      throw new Error('Room already exists');
    }

    const room = new Room(roomId, hostId);
    this.rooms.set(roomId, room);
    return room;
  }

  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  deleteRoom(roomId) {
    this.rooms.delete(roomId);
  }

  roomExists(roomId) {
    return this.rooms.has(roomId);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  cleanupEmptyRooms(maxAgeMs = 3600000) { // 1 hour default
    const now = Date.now();
    for (const [roomId, room] of this.rooms) {
      const connectedPlayers = room.getConnectedPlayers();
      if (connectedPlayers.length === 0) {
        // Check if all players disconnected long ago
        const allDisconnected = Array.from(room.players.values()).every(
          p => !p.connected && (now - p.disconnectedAt > maxAgeMs)
        );
        if (allDisconnected || room.players.size === 0) {
          this.deleteRoom(roomId);
        }
      }
    }
  }
}

module.exports = RoomManager;
