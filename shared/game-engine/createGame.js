/**
 * Creates a new game state
 * @param {string} roomId - Room identifier
 * @returns {Object} Initial game state
 */
function createGame(roomId) {
  return {
    roomId,
    phase: 'CLUE',
    turn: 'red',
    clue: null,
    guessesLeft: 0,
    board: [],
    teams: {
      red: { remaining: 9 },
      blue: { remaining: 8 }
    },
    winner: null,
    history: []
  };
}

module.exports = { createGame };
