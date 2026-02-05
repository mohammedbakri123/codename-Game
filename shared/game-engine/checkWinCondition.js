/**
 * Checks if the game has a winner
 * @param {Object} game - Current game state
 * @returns {Object} Win condition result
 */
function checkWinCondition(game) {
  // If already ended, return current winner
  if (game.phase === 'END') {
    return { winner: game.winner, reason: 'game_ended' };
  }

  // Check if all cards for a team are revealed
  if (game.teams.red.remaining === 0) {
    return { winner: 'red', reason: 'all_cards_revealed' };
  }

  if (game.teams.blue.remaining === 0) {
    return { winner: 'blue', reason: 'all_cards_revealed' };
  }

  // Check for assassin hit (winner would already be set)
  if (game.winner) {
    return { winner: game.winner, reason: 'assassin_hit' };
  }

  return { winner: null };
}

module.exports = { checkWinCondition };
