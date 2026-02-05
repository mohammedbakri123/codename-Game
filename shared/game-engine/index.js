const { createGame } = require('./createGame');
const { createBoard } = require('./createBoard');
const { applyClue } = require('./applyClue');
const { selectWord } = require('./selectWord');
const { endTurn } = require('./endTurn');
const { checkWinCondition } = require('./checkWinCondition');

module.exports = {
  createGame,
  createBoard,
  applyClue,
  selectWord,
  endTurn,
  checkWinCondition
};
