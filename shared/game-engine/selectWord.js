/**
 * Selects a word on the board
 * @param {Object} game - Current game state
 * @param {number} cardId - ID of the card to select
 * @param {string} team - Team making the selection
 * @returns {Object} New game state after selection
 */
function selectWord(game, cardId, team) {
  // Validate game phase
  if (game.phase !== 'GUESS') {
    throw new Error('Cannot select word: not in GUESS phase');
  }

  // Validate it's the team's turn
  if (game.turn !== team) {
    throw new Error(`Cannot select word: it is ${game.turn} team's turn`);
  }

  // Find the card
  const cardIndex = game.board.findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    throw new Error('Card not found');
  }

  const card = game.board[cardIndex];

  // Check if already revealed
  if (card.revealed) {
    throw new Error('Card already revealed');
  }

  // Create new board with card revealed
  const newBoard = game.board.map((c, index) =>
    index === cardIndex ? { ...c, revealed: true } : c
  );

  // Update teams remaining count
  const newTeams = { ...game.teams };
  if (card.color === 'red' || card.color === 'blue') {
    newTeams[card.color] = {
      ...newTeams[card.color],
      remaining: newTeams[card.color].remaining - 1
    };
  }

  // Determine next state
  let newPhase = game.phase;
  let newTurn = game.turn;
  let newGuessesLeft = game.guessesLeft - 1;
  let winner = game.winner;

  // Check for assassin (instant loss)
  if (card.color === 'assassin') {
    winner = team === 'red' ? 'blue' : 'red';
    newPhase = 'END';
  }
  // Check if selected wrong team's color
  else if (card.color !== team && card.color !== 'neutral') {
    newTurn = team === 'red' ? 'blue' : 'red';
    newPhase = 'CLUE';
    newGuessesLeft = 0;
  }
  // Check if out of guesses
  else if (newGuessesLeft <= 0) {
    newTurn = team === 'red' ? 'blue' : 'red';
    newPhase = 'CLUE';
    newGuessesLeft = 0;
  }
  // Selected neutral card
  else if (card.color === 'neutral') {
    newTurn = team === 'red' ? 'blue' : 'red';
    newPhase = 'CLUE';
    newGuessesLeft = 0;
  }

  // Check win condition
  const winCheck = checkWinCondition(newTeams);
  if (winCheck.winner) {
    winner = winCheck.winner;
    newPhase = 'END';
  }

  return {
    ...game,
    phase: newPhase,
    turn: newTurn,
    guessesLeft: newGuessesLeft,
    board: newBoard,
    teams: newTeams,
    winner,
    history: [
      ...game.history,
      {
        type: 'SELECT',
        team,
        card: { ...card, revealed: true },
        timestamp: Date.now()
      }
    ]
  };
}

function checkWinCondition(teams) {
  if (teams.red.remaining === 0) {
    return { winner: 'red' };
  }
  if (teams.blue.remaining === 0) {
    return { winner: 'blue' };
  }
  return { winner: null };
}

module.exports = { selectWord };
