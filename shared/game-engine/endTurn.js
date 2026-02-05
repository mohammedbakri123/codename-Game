/**
 * Ends the current turn
 * @param {Object} game - Current game state
 * @param {string} team - Team ending the turn
 * @returns {Object} New game state with turn ended
 */
function endTurn(game, team) {
  // Validate game phase
  if (game.phase !== 'GUESS') {
    throw new Error('Cannot end turn: not in GUESS phase');
  }

  // Validate it's the team's turn
  if (game.turn !== team) {
    throw new Error(`Cannot end turn: it is ${game.turn} team's turn`);
  }

  const newTurn = team === 'red' ? 'blue' : 'red';

  return {
    ...game,
    phase: 'CLUE',
    turn: newTurn,
    clue: null,
    guessesLeft: 0,
    history: [
      ...game.history,
      {
        type: 'END_TURN',
        team,
        timestamp: Date.now()
      }
    ]
  };
}

module.exports = { endTurn };
