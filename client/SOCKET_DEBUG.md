# Socket Debugging Guide

## Overview
The socket implementation has been verified and is working correctly. Here's how to debug and test it.

## Quick Test

Open browser console and run:

```javascript
// Check socket connection
window.gameContext?.logGameState();

// Check socket tests
window.socketTests?.testSocketConnection(socket);

// Debug current state
window.socketTests?.debugGameState(window.gameContext?.game, window.gameContext?.room);
```

## Common Issues & Solutions

### 1. "Waiting for socket connection..."
**Cause**: Server not running or wrong URL
**Solution**:
```bash
# In the server directory
npm run dev
# or
node src/index.js
```

### 2. "No room update received after 5 seconds"
**Cause**: Server not responding to JOIN_ROOM event
**Check**:
1. Open browser console
2. Look for "📥 [ROOM_UPDATE] Received" message
3. If missing, server might have an error

### 3. Game not starting
**Cause**: Not enough players (need 4) or not all have teams
**Check**: Room page shows player count and team assignments

## Server-Client Data Flow

```
1. Client connects
   ↓
2. JOIN_ROOM event sent
   ↓
3. Server creates/adds to room
   ↓
4. Server emits ROOM_UPDATE to all
   ↓
5. All clients receive player list
   ↓
6. Host clicks "Start Game"
   ↓
7. Server emits GAME_STARTED + GAME_UPDATE
   ↓
8. Clients navigate to game page
```

## Event Names (Verified Working)

**Client → Server:**
- `JOIN_ROOM` - Join a room
- `LEAVE_ROOM` - Leave current room
- `START_GAME` - Start game (host only)
- `SEND_CLUE` - Spymaster sends clue
- `SELECT_WORD` - Player selects card
- `END_TURN` - End current turn
- `UPDATE_PLAYER` - Update team/role

**Server → Client:**
- `ROOM_UPDATE` - Room state update
- `GAME_UPDATE` - Game state update
- `GAME_STARTED` - Game has started
- `PLAYER_JOINED` - New player joined
- `PLAYER_LEFT` - Player left
- `CLUE_RECEIVED` - Clue was given
- `WORD_SELECTED` - Card was selected
- `TURN_ENDED` - Turn ended
- `GAME_ENDED` - Game over
- `ERROR` - Error message

## Data Structures

### Card Object
```javascript
{
  id: number,           // 0-24
  word: string,         // Uppercase word
  color: 'red' | 'blue' | 'neutral' | 'assassin',
  revealed: boolean
}
```

### Game State
```javascript
{
  roomId: string,
  phase: 'CLUE' | 'GUESS' | 'END',
  turn: 'red' | 'blue',
  clue: { word: string, count: number, by: 'red' | 'blue' } | null,
  guessesLeft: number,
  board: Card[],        // 25 cards
  teams: {
    red: { remaining: number },
    blue: { remaining: number }
  },
  winner: 'red' | 'blue' | null
}
```

### Room State
```javascript
{
  id: string,
  hostId: string,
  players: [{
    id: string,
    name: string,
    team: 'red' | 'blue' | null,
    role: 'spymaster' | 'operative',
    connected: boolean
  }],
  status: 'waiting' | 'playing' | 'ended'
}
```

## Testing Checklist

- [ ] Server is running on port 3001
- [ ] Client connects (check console for "✅ SocketContext: Connected")
- [ ] Can create room (check URL changes to /room/XXXXXX)
- [ ] Can join room from second browser
- [ ] Room shows both players
- [ ] Can select team and role
- [ ] Host can start game with 4+ players
- [ ] Game board displays 25 cards
- [ ] Spymaster sees card colors
- [ ] Players can select cards
- [ ] Turn switches correctly
- [ ] Game ends when all cards found

## Console Commands

```javascript
// Check if socket is connected
console.log('Connected:', window.gameContext?.isConnected);

// See current room
console.log('Room:', window.gameContext?.room);

// See current game
console.log('Game:', window.gameContext?.game);

// Force reconnect
window.socketTests?.testEmit(socket, 'JOIN_ROOM', {
  roomId: 'YOUR_ROOM_ID',
  playerName: 'Test Player',
  team: null,
  role: 'operative'
});
```

## Network Tab Debugging

1. Open DevTools → Network tab
2. Filter by "WS" (WebSocket)
3. Look for socket.io connection
4. Check Frames tab for messages
5. Verify events are being sent/received

## Server Logs

Check server console for these messages:
- `✅ Client connected: [socket-id]`
- `🏠 [JOIN_ROOM] Processing request`
- `📢 Broadcasting ROOM_UPDATE to all`
- `🎮 [START_GAME] Starting game`

If these don't appear, the server has an issue.
