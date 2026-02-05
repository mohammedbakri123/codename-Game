const path = require('path');

// Use absolute path to shared module
const {
  createGame,
  createBoard,
  applyClue,
  selectWord,
  endTurn,
  checkWinCondition
} = require(path.join(__dirname, '../../../shared/game-engine'));

const CODENAMES_WORDS = [
  'AFRICA', 'AGENT', 'AIR', 'ALIEN', 'ALPS', 'AMAZON', 'AMBULANCE', 'AMERICA',
  'ANGEL', 'ANTARCTICA', 'APPLE', 'ARM', 'ATLANTIS', 'AUSTRALIA', 'AZTEC',
  'BACK', 'BALL', 'BAND', 'BANK', 'BAR', 'BARK', 'BAT', 'BATTERY', 'BEACH',
  'BEAR', 'BEAT', 'BED', 'BEIJING', 'BELL', 'BELT', 'BERLIN', 'BERMUDA',
  'BERRY', 'BILL', 'BLOCK', 'BOARD', 'BOLT', 'BOMB', 'BOND', 'BOOM', 'BOOT',
  'BOTTLE', 'BOW', 'BOX', 'BRIDGE', 'BRUSH', 'BUCK', 'BUFFALO', 'BUG', 'BUGLE',
  'BUTTON', 'CALF', 'CANADA', 'CAP', 'CAPITAL', 'CAR', 'CARD', 'CARROT',
  'CASINO', 'CAST', 'CAT', 'CELL', 'CENTAUR', 'CENTER', 'CHAIR', 'CHANGE',
  'CHARGE', 'CHECK', 'CHEST', 'CHICK', 'CHINA', 'CHOCOLATE', 'CHURCH',
  'CIRCLE', 'CLIFF', 'CLOAK', 'CLUB', 'CODE', 'COLD', 'COMIC', 'COMPOUND',
  'CONCERT', 'CONDUCTOR', 'CONTRACT', 'COOK', 'COPPER', 'COTTON', 'COURT',
  'COVER', 'CRANE', 'CRASH', 'CRICKET', 'CROSS', 'CROWN', 'CYCLE', 'CZECH',
  'DANCE', 'DATE', 'DAY', 'DEATH', 'DECK', 'DEGREE', 'DIAMOND', 'DICE',
  'DINOSAUR', 'DISEASE', 'DOCTOR', 'DOG', 'DRAFT', 'DRAGON', 'DRESS',
  'DRILL', 'DROP', 'DUCK', 'DWARF', 'EAGLE', 'EGYPT', 'ELEVATOR', 'ELF',
  'ENGINE', 'ENGLAND', 'EUROPE', 'EYE', 'FACE', 'FAIR', 'FALL', 'FAN',
  'FENCE', 'FIELD', 'FIGHTER', 'FIGURE', 'FILE', 'FILM', 'FIRE', 'FISH',
  'FLAT', 'FLOOD', 'FLOOR', 'FLUTE', 'FLY', 'FOOT', 'FORCE', 'FOREST',
  'FORK', 'FRANCE', 'GAME', 'GAS', 'GENIUS', 'GERMANY', 'GHOST', 'GIANT',
  'GLASS', 'GLOVE', 'GOLD', 'GRACE', 'GRASS', 'GREECE', 'GREEN', 'GROUND',
  'HAM', 'HAND', 'HAWK', 'HEAD', 'HEART', 'HELICOPTER', 'HIMALAYAS', 'HOLE',
  'HOLLYWOOD', 'HONEY', 'HOOD', 'HOOK', 'HORN', 'HORSE', 'HORSESHOE',
  'HOSPITAL', 'HOTEL', 'ICE', 'ICE CREAM', 'INDIA', 'IRON', 'IVORY', 'JACK',
  'JAM', 'JET', 'JUPITER', 'KANGAROO', 'KETCHUP', 'KEY', 'KID', 'KING',
  'KIWI', 'KNIFE', 'KNIGHT', 'LAB', 'LAP', 'LASER', 'LAWYER', 'LEAD',
  'LEMON', 'LEPRECHAUN', 'LIFE', 'LIGHT', 'LIMOUSINE', 'LINE', 'LINK',
  'LION', 'LITTER', 'LOCH NESS', 'LOCK', 'LOG', 'LONDON', 'LUCK', 'MAIL',
  'MAMMOTH', 'MAPLE', 'MARBLE', 'MARCH', 'MASS', 'MATCH', 'MERCURY', 'MEXICO',
  'MICROSCOPE', 'MILLIONAIRE', 'MINE', 'MINT', 'MISSILE', 'MODEL', 'MOLE',
  'MOON', 'MOSCOW', 'MOUNT', 'MOUSE', 'MOUTH', 'MUG', 'NAIL', 'NEEDLE',
  'NET', 'NEW YORK', 'NIGHT', 'NINJA', 'NOTE', 'NOVEL', 'NURSE', 'NUT',
  'OCTOPUS', 'OIL', 'OLIVE', 'OLYMPUS', 'ONION', 'OPERA', 'ORANGE', 'ORGAN',
  'PALM', 'PAN', 'PANTS', 'PAPER', 'PARACHUTE', 'PARK', 'PART', 'PASS',
  'PASTE', 'PENGUIN', 'PHOENIX', 'PIANO', 'PIE', 'PILOT', 'PIN', 'PIPE',
  'PIRATE', 'PISTOL', 'PIT', 'PITCH', 'PLANE', 'PLASTIC', 'PLATE', 'PLATYPUS',
  'PLAY', 'PLOT', 'POINT', 'POISON', 'POLE', 'POLICE', 'POOL', 'PORT',
  'POST', 'POUND', 'PRESS', 'PRINCESS', 'PUMPKIN', 'PUPIL', 'PYRAMID',
  'QUEEN', 'RABBIT', 'RACKET', 'RAY', 'REVOLUTION', 'RING', 'ROBIN', 'ROBOT',
  'ROCK', 'ROME', 'ROOT', 'ROSE', 'ROULETTE', 'ROUND', 'ROW', 'RULER',
  'SATELLITE', 'SATURN', 'SCALE', 'SCHOOL', 'SCIENTIST', 'SCORPION',
  'SCREEN', 'SCUBA DIVER', 'SEAL', 'SERVER', 'SHADOW', 'SHAKESPEARE',
  'SHARK', 'SHIP', 'SHOE', 'SHOP', 'SHOT', 'SINK', 'SKYSCRAPER', 'SLIP',
  'SLUG', 'SMUGGLER', 'SNOW', 'SNOWMAN', 'SOCK', 'SOLDIER', 'SOUL',
  'SOUND', 'SPACE', 'SPELL', 'SPIDER', 'SPIKE', 'SPINE', 'SPOT', 'SPRING',
  'SPY', 'SQUARE', 'STADIUM', 'STAFF', 'STAR', 'STATE', 'STICK', 'STOCK',
  'STRAW', 'STREAM', 'STRIKE', 'STRING', 'SUB', 'SUIT', 'SUPERHERO',
  'SWING', 'SWITCH', 'TABLE', 'TABLET', 'TAG', 'TAIL', 'TAP', 'TEACHER',
  'TELESCOPE', 'TEMPLE', 'THEATER', 'THIEF', 'THUMB', 'TICK', 'TIE',
  'TIME', 'TOKYO', 'TOOTH', 'TORCH', 'TOWER', 'TRACK', 'TRAIN', 'TRIANGLE',
  'TRIP', 'TRUNK', 'TUBE', 'TURKEY', 'UNDERTAKER', 'UNICORN', 'VACUUM',
  'VAN', 'VET', 'WAKE', 'WALL', 'WAR', 'WASHER', 'WASHINGTON', 'WATCH',
  'WATER', 'WAVE', 'WEB', 'WELL', 'WHALE', 'WHIP', 'WIND', 'WITCH',
  'WORM', 'YARD'
];

class GameService {
  constructor() {
    this.games = new Map();
  }

  startGame(roomId) {
    // Create new game state using shared engine
    let game = createGame(roomId);
    
    // Create board with shuffled words
    const shuffledWords = this.shuffleArray([...CODENAMES_WORDS]);
    const board = createBoard(shuffledWords);
    
    game = {
      ...game,
      board
    };

    this.games.set(roomId, game);
    return game;
  }

  getGame(roomId) {
    return this.games.get(roomId);
  }

  applyClue(roomId, clue, team) {
    const game = this.games.get(roomId);
    if (!game) {
      throw new Error('Game not found');
    }

    const newGame = applyClue(game, clue, team);
    this.games.set(roomId, newGame);
    return newGame;
  }

  selectWord(roomId, cardId, team) {
    const game = this.games.get(roomId);
    if (!game) {
      throw new Error('Game not found');
    }

    const newGame = selectWord(game, cardId, team);
    this.games.set(roomId, newGame);
    return newGame;
  }

  endTurn(roomId, team) {
    const game = this.games.get(roomId);
    if (!game) {
      throw new Error('Game not found');
    }

    const newGame = endTurn(game, team);
    this.games.set(roomId, newGame);
    return newGame;
  }

  checkWinCondition(roomId) {
    const game = this.games.get(roomId);
    if (!game) {
      throw new Error('Game not found');
    }

    return checkWinCondition(game);
  }

  endGame(roomId) {
    const game = this.games.get(roomId);
    if (game) {
      game.phase = 'END';
      this.games.set(roomId, game);
    }
    return game;
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  removeGame(roomId) {
    this.games.delete(roomId);
  }
}

module.exports = GameService;
