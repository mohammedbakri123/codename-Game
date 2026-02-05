/**
 * Applies a clue from the spymaster
 * @param {Object} game - Current game state
 * @param {Object} clue - Clue object with word and count
 * @param {string} team - Team giving the clue ('red' or 'blue')
 * @returns {Object} New game state with clue applied
 */
function applyClue(game, clue, team) {
  // Validate game phase
  if (game.phase !== 'CLUE') {
    throw new Error('Cannot apply clue: not in CLUE phase');
  }

  // Validate it's the team's turn
  if (game.turn !== team) {
    throw new Error(`Cannot apply clue: it is ${game.turn} team's turn`);
  }

  // Validate clue
  if (!clue || !clue.word || typeof clue.count !== 'number') {
    throw new Error('Invalid clue: word and count required');
  }

  if (clue.count < 0 || clue.count > 9) {
    throw new Error('Invalid clue count: must be between 0 and 9');
  }

  // Check if clue word is on the board
  const normalizedClue = clue.word.toUpperCase();
  const matchingCard = game.board.find(
    card => card.word === normalizedClue && !card.revealed
  );

  if (matchingCard) {
    throw new Error('Clue word cannot match an unrevealed card on the board');
  }

  const newGame = {
    ...game,
    phase: 'GUESS',
    clue: {
      word: clue.word.toUpperCase(),
      count: clue.count,
      by: team
    },
    guessesLeft: clue.count + 1
  };

  return newGame;
}

module.exports = { applyClue };
