/**
 * Creates a shuffled board with codenames cards
 * @param {string[]} words - Array of words to use
 * @returns {Object[]} Board with cards assigned colors
 */
function createBoard(words) {
  if (!words || words.length < 25) {
    throw new Error('At least 25 words required');
  }

  // Card distribution: 9 red, 8 blue, 7 neutral, 1 assassin
  const cardTypes = [
    ...Array(9).fill('red'),
    ...Array(8).fill('blue'),
    ...Array(7).fill('neutral'),
    'assassin'
  ];

  // Shuffle card types
  const shuffledTypes = shuffleArray([...cardTypes]);

  // Create board
  return words.slice(0, 25).map((word, index) => ({
    id: index,
    word: word.trim().toUpperCase(),
    color: shuffledTypes[index],
    revealed: false
  }));
}

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

module.exports = { createBoard };
