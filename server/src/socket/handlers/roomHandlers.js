const { CLIENT_EVENTS, SERVER_EVENTS } = require('../events');

function createRoomHandlers(io, socket, roomManager, gameService) {
  return {
    [CLIENT_EVENTS.JOIN_ROOM]: (data) => {
      try {
        const { roomId, playerName, role, team } = data;

        console.log('🏠 [JOIN_ROOM] Processing request');
        console.log('   Room ID:', roomId);
        console.log('   Player Name:', playerName);
        console.log('   Team:', team);
        console.log('   Role:', role);
        console.log('   Socket ID:', socket.id);

        if (!roomId || !playerName) {
          console.log('❌ Validation failed: Missing room ID or player name');
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Room ID and player name are required'
          });
          return;
        }

        // Create room if it doesn't exist
        if (!roomManager.roomExists(roomId)) {
          console.log('📝 Creating new room:', roomId);
          roomManager.createRoom(roomId, socket.id);
        }

        const room = roomManager.getRoom(roomId);
        console.log('🏠 Room after get:', room.id);
        console.log('   Current players:', room.getAllPlayers().length);
        
        // Join socket room
        socket.join(roomId);
        socket.roomId = roomId;

        // Add player to room
        const playerData = {
          name: playerName,
          role: role || 'operative',
          team: team || null
        };
        console.log('➕ Adding player to room:', playerData);
        room.addPlayer(socket.id, playerData);

        console.log('   Room players after add:', room.getAllPlayers().length);

        // Get updated room state
        const roomUpdate = room.toJSON();
        const playerAdded = room.getPlayer(socket.id);
        
        // Broadcast full room update to ALL players in the room (including sender)
        console.log('📢 Broadcasting ROOM_UPDATE to all:', roomUpdate);
        io.in(roomId).emit(SERVER_EVENTS.ROOM_UPDATE, roomUpdate);
        
        // Also notify others that a new player joined (for toast notifications, etc.)
        console.log('📢 Broadcasting PLAYER_JOINED to others:', playerAdded);
        socket.to(roomId).emit(SERVER_EVENTS.PLAYER_JOINED, {
          player: playerAdded
        });

        // Send current game state if game exists
        const game = gameService.getGame(roomId);
        if (game) {
          console.log('🎮 Sending GAME_UPDATE:', game.phase);
          socket.emit(SERVER_EVENTS.GAME_UPDATE, game);
        }

      } catch (error) {
        console.error('❌ [JOIN_ROOM] Error:', error);
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    },

    [CLIENT_EVENTS.LEAVE_ROOM]: () => {
      try {
        const roomId = socket.roomId;
        if (!roomId) return;

        console.log('🚪 [LEAVE_ROOM] Player leaving:', socket.id);

        const room = roomManager.getRoom(roomId);
        if (room) {
          console.log('   Removing from room:', room.id);
          room.removePlayer(socket.id);
          console.log('   Players after removal:', room.getAllPlayers().length);
          
          socket.to(roomId).emit(SERVER_EVENTS.PLAYER_LEFT, {
            playerId: socket.id
          });

          io.in(roomId).emit(SERVER_EVENTS.ROOM_UPDATE, room.toJSON());
        }

        socket.leave(roomId);
        delete socket.roomId;

      } catch (error) {
        console.error('❌ [LEAVE_ROOM] Error:', error);
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    },

    [CLIENT_EVENTS.UPDATE_PLAYER]: (data) => {
      try {
        const roomId = socket.roomId;
        if (!roomId) {
          console.log('❌ [UPDATE_PLAYER] No roomId assigned');
          return;
        }

        const room = roomManager.getRoom(roomId);
        if (!room) {
          console.log('❌ [UPDATE_PLAYER] Room not found');
          return;
        }

        const player = room.getPlayer(socket.id);
        if (!player) {
          console.log('❌ [UPDATE_PLAYER] Player not found in room');
          return;
        }

        console.log('✏️ [UPDATE_PLAYER] Updating player:', socket.id);
        console.log('   Old data:', { name: player.name, team: player.team, role: player.role });
        console.log('   New data:', data);
        
        Object.assign(player, data);
        console.log('   Updated player:', { name: player.name, team: player.team, role: player.role });

        const roomUpdate = room.toJSON();
        console.log('📢 Broadcasting ROOM_UPDATE to all:', roomUpdate.players.length, 'players');
        io.in(roomId).emit(SERVER_EVENTS.ROOM_UPDATE, roomUpdate);

      } catch (error) {
        console.error('❌ [UPDATE_PLAYER] Error:', error);
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    }
  };
}

module.exports = createRoomHandlers;
