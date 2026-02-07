const { CLIENT_EVENTS, SERVER_EVENTS } = require('../events');

function createGameHandlers(io, socket, roomManager, gameService) {
  return {
    [CLIENT_EVENTS.START_GAME]: () => {
      try {
        const roomId = socket.roomId;
        if (!roomId) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Not in a room'
          });
          return;
        }

        const room = roomManager.getRoom(roomId);
        if (!room) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Room not found'
          });
          return;
        }

        // Only host can start game
        if (room.hostId !== socket.id) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Only host can start the game'
          });
          return;
        }

        // Start the game using game service
        const game = gameService.startGame(roomId);
        room.setGame(game);

        // Broadcast to all players in room (including sender)
        io.in(roomId).emit(SERVER_EVENTS.GAME_STARTED, game);
        io.in(roomId).emit(SERVER_EVENTS.GAME_UPDATE, game);

      } catch (error) {
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    },

    [CLIENT_EVENTS.SEND_CLUE]: (data) => {
      try {
        const roomId = socket.roomId;
        if (!roomId) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Not in a room'
          });
          return;
        }

        const { word, count, team } = data;
        
        // Apply clue using game service (calls shared engine)
        const game = gameService.applyClue(roomId, { word, count }, team);

        // Broadcast update to all (including sender)
        io.in(roomId).emit(SERVER_EVENTS.CLUE_RECEIVED, {
          clue: game.clue,
          team
        });
        io.in(roomId).emit(SERVER_EVENTS.GAME_UPDATE, game);

      } catch (error) {
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    },

    [CLIENT_EVENTS.SELECT_WORD]: (data) => {
      try {
        const roomId = socket.roomId;
        if (!roomId) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Not in a room'
          });
          return;
        }

        const { cardId, team } = data;
        
        // Select word using game service (calls shared engine)
        const game = gameService.selectWord(roomId, cardId, team);

        // Broadcast update to all (including sender)
        io.in(roomId).emit(SERVER_EVENTS.WORD_SELECTED, {
          cardId,
          team
        });
        io.in(roomId).emit(SERVER_EVENTS.GAME_UPDATE, game);

        // Check if game ended
        if (game.phase === 'END') {
          io.in(roomId).emit(SERVER_EVENTS.GAME_ENDED, {
            winner: game.winner,
            reason: game.winner ? 'all_cards_revealed' : 'assassin_hit'
          });
        }

      } catch (error) {
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    },

    [CLIENT_EVENTS.END_TURN]: (data) => {
      try {
        const roomId = socket.roomId;
        if (!roomId) {
          socket.emit(SERVER_EVENTS.ERROR, {
            message: 'Not in a room'
          });
          return;
        }

        const { team } = data;
        
        // End turn using game service (calls shared engine)
        const game = gameService.endTurn(roomId, team);

        // Broadcast update to all (including sender)
        io.in(roomId).emit(SERVER_EVENTS.TURN_ENDED, {
          previousTeam: team,
          nextTeam: game.turn
        });
        io.in(roomId).emit(SERVER_EVENTS.GAME_UPDATE, game);

      } catch (error) {
        socket.emit(SERVER_EVENTS.ERROR, {
          message: error.message
        });
      }
    }
  };
}

module.exports = createGameHandlers;
